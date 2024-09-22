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
const consumer = kafkaServer.consumer({ groupId: "main-worker" });
function connectKafkaProducer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield consumer.connect();
            console.log("\x1b[32m%s\x1b[0m", "Kafka consumer connected.");
        }
        catch (error) {
            console.error("\x1b[31m%s\x1b[0m", "Error connecting Kafka producer", error);
        }
    });
}
consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
function outBoxRunner() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield consumer.run({
                eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                    var _b;
                    console.log({
                        partition,
                        offset: message.offset,
                        value: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString(),
                    });
                    yield new Promise((r) => setTimeout(r, 1000));
                }),
            });
        }
        catch (error) {
            console.error("Error in outBoxRunner", error);
        }
    });
}
function startProcessor() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectKafkaProducer();
            console.log("Starting outbox processor");
            yield outBoxRunner();
            yield new Promise((resolve) => setTimeout(resolve, 3000)); // Sleep for 3 seconds
            console.log("outbox processor has started");
        }
        catch (error) {
            console.error("Error in main processor", error);
        }
    });
}
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Shutting down...");
    yield consumer.disconnect();
    yield client.$disconnect();
    process.exit();
}));
startProcessor();
