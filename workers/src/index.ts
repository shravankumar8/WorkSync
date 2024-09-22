import { PrismaClient } from "@prisma/client";
import { Kafka, logLevel } from "kafkajs";

const TOPIC_NAME = process.env.TOPIC_NAME || "zap-events";
const client = new PrismaClient();

const kafkaServer = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "outbox-processor",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  logLevel: logLevel.WARN,
});

const consumer = kafkaServer.consumer({ groupId: "main-worker" });

async function connectKafkaProducer() {
  try {
    await consumer.connect();
    console.log("\x1b[32m%s\x1b[0m", "Kafka consumer connected.");
  } catch (error: any) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "Error connecting Kafka producer",
      error
    );
  }
}
consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
async function outBoxRunner() {
  try {

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        });
        await new Promise((r) => setTimeout(r, 1000));
      },
    });
  } catch (error) {
  console.error("Error in outBoxRunner", error);
}

}
async function startProcessor() {
  try {
    await connectKafkaProducer();

    console.log("Starting outbox processor");


      await outBoxRunner();

      await new Promise<void>((resolve) => setTimeout(resolve, 3000)); // Sleep for 3 seconds
      console.log("outbox processor has started");

  } catch (error) {
    console.error("Error in main processor", error);
  }
}
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await consumer.disconnect();
  await client.$disconnect();
  process.exit();
});

startProcessor()