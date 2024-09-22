import { PrismaClient } from "@prisma/client";
import { Kafka, logLevel } from "kafkajs";

const TOPIC_NAME = process.env.TOPIC_NAME || "zap-events";
const client = new PrismaClient();

const kafkaServer = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "outbox-processor",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  logLevel: logLevel.WARN,
});

const producer = kafkaServer.producer();

async function connectKafkaProducer() {
  try {
    await producer.connect();
    console.log("\x1b[32m%s\x1b[0m", "Kafka Producer connected."); // Green
  } catch (error) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "Error connecting Kafka producer",
      error
    );
  }
}

async function processOutBox() {
  try {
    const pendingRows = await client.zapRunOutBox.findMany({
      where: {},
      take: 10,
    });

    if (pendingRows.length > 0) {
      const kafkaMessages = pendingRows.map((r) => ({
        value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0 }),
      }));

      await client.$transaction(async (transactionClient) => {
        try {
          // Attempt to send Kafka messages
          await producer.send({
            topic: TOPIC_NAME,
            messages: kafkaMessages,
          });

          // If successful, delete processed rows
          await transactionClient.zapRunOutBox.deleteMany({
            where: {
              id: {
                in: pendingRows.map((e) => e.id),
              },
            },
          });

          console.log(`Processed ${pendingRows.length} records`);
        } catch (sendError) {
          // Log errors that occur while sending messages
          console.error("Error sending Kafka messages", sendError);
          // Optionally handle rollback or retry logic here
        }
      });
    } else {
      // Log when no pending rows are found for clarity
      // console.log("No pending rows found");
    }
  } catch (error) {
    console.error("Error while processing outbox", error);
  }
}

async function startProcessor() {
  try {
    await connectKafkaProducer();
    console.log("Starting outbox processor");

    while (true) {
      await processOutBox();
      await new Promise<void>((resolve) => setTimeout(resolve, 3000)); // Sleep for 3 seconds
    }
  } catch (error) {
    console.error("Error in main processor", error);
  }
}

// Start processor after 3 seconds (for initial Kafka connection time)
setTimeout(startProcessor, 3000);

// Graceful shutdown handling
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await producer.disconnect();
  await client.$disconnect();
  process.exit();
});
