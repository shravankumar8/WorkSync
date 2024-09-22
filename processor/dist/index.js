"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const TOPIC_NAME = process.env.TOPIC_NAME || "zap-events";
const client = new client_1.PrismaClient();
const kafkaServer = new kafkajs_1.Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "outbox-processor",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    logLevel: kafkajs_1.logLevel.WARN,
});
const producer = kafkaServer.producer();
function connectKafkaProducer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield producer.connect();
            console.log("\x1b[32m%s\x1b[0m", "Kafka Producer connected."); // Green
        }
        catch (error) {
            console.error("\x1b[31m%s\x1b[0m", "Error connecting Kafka producer", error);
        }
    });
}
function processOutBox() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pendingRows = yield client.zapRunOutBox.findMany({
                where: {},
                take: 10,
            });
            if (pendingRows.length > 0) {
                const kafkaMessages = pendingRows.map((r) => ({
                    value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0 }),
                }));
                yield client.$transaction((transactionClient) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        // Attempt to send Kafka messages
                        yield producer.send({
                            topic: TOPIC_NAME,
                            messages: kafkaMessages,
                        });
                        // If successful, delete processed rows
                        yield transactionClient.zapRunOutBox.deleteMany({
                            where: {
                                id: {
                                    in: pendingRows.map((e) => e.id),
                                },
                            },
                        });
                        console.log(`Processed ${pendingRows.length} records`);
                    }
                    catch (sendError) {
                        // Log errors that occur while sending messages
                        console.error("Error sending Kafka messages", sendError);
                        // Optionally handle rollback or retry logic here
                    }
                }));
            }
            else {
                // Log when no pending rows are found for clarity
                // console.log("No pending rows found");
            }
        }
        catch (error) {
            console.error("Error while processing outbox", error);
        }
    });
}
function startProcessor() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectKafkaProducer();
            console.log("Starting outbox processor");
            while (true) {
                yield processOutBox();
                yield new Promise((resolve) => setTimeout(resolve, 3000)); // Sleep for 3 seconds
            }
        }
        catch (error) {
            console.error("Error in main processor", error);
        }
    });
}
// Start processor after 3 seconds (for initial Kafka connection time)
setTimeout(startProcessor, 3000);
// Graceful shutdown handling
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Shutting down...");
    yield producer.disconnect();
    yield client.$disconnect();
    process.exit();
}));
