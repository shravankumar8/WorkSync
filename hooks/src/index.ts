import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { z } from "zod"; // for validation, optional

dotenv.config();

const client = new PrismaClient();
const app = express();
app.use(express.json());

// Schema for request validation (optional, using Zod)

app.post("/hooks/catch/:userId/:zapId", async (req: Request, res: Response) => {
  const { userId, zapId } = req.params;
  const body = req.body;

  // Validate request params (you can add more specific validation rules if needed)
  if (!userId || !zapId) {
    return res.status(400).json({ message: "Missing userId or zapId" });
  }

  // Optionally validate request body using Zod schema (you can skip this if not needed)
 

  try {
    // Store in db using a transaction
    let run;
    let outBox;
    const validZapId = await client.zap.findFirst({
      where: {
        id: zapId,
      },
    });
    if (validZapId) {
      const result = await client.$transaction(async (tx) => {
        run = await tx.zapRun.create({
          data: {
            zapId: zapId,
            metadata: body,
          },
        });

        outBox = await tx.zapRunOutbox.create({
          data: {
            zapRunId: run.id,
          },
        });

        return { run, outBox };
      });
    } else {
      res.json({
        message: "the zap trigger not found please check the id",
      });
    }

    res.status(200).json({
      message: "Webhook received",
      zapRun: run,
      zapRunOutBox: outBox,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Use the port from the environment variable or default to 3002
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
