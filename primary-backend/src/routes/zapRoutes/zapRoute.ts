import { Router } from "express";
import { authMiddleware } from "../middlewares/userAuth";
import { ZapCreateSchema } from "../../types/types";

import { PrismaClient } from "@prisma/client";
const prismaclient= new PrismaClient();
const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  console.log("creating a zap");
  // @ts-ignore
  const id: string = req.id;
  const { success, data } = ZapCreateSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Incorrect inputs",
    });
  }

  try {
    const zapId = await prismaclient.$transaction(async (tx: any) => {
      const zap = await tx.zap.create({
        data: {
          userId: parseInt(id),
          triggerId: "",
          actions: {
            create: data.actions.map((x, index) => ({
              actionId: x.availableActionId,
              sortingOrder: index,
              metadata: x.actionMetadata,
            })),
          },
        },
      });

      const trigger = await tx.trigger.create({
        data: {
          triggerId: data.availableTriggerId,
          zapId: zap.id,
        },
      });

      await tx.zap.update({
        where: { id: zap.id },
        data: {
          triggerId: trigger.triggerId,
        },
      });

      return zap.id; // Return the zap ID instead of the entire response
    });

    res.json({ zapId });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Transaction failed", error });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  console.log("get a zap");
  // @ts-ignore
  const id = req.id;
  try {
    const zaps = await prismaclient.zap.findMany({
      where: {
        userId: id,
      },
      include: {
        actions: {
          include: {
            type: true,
          },
        },
        trigger: {
          include: {
            type: true,
          },
        },
      },
    });

    return res.json({ zaps });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Failed to retrieve zaps", error });
  }
});

router.get("/:zapId", authMiddleware, async (req, res) => {
  // @ts-ignore
  const id = req.id;
  const zapId = req.params.zapId;
  console.log(id,zapId)

  try {
    const zap = await prismaclient.zap.findFirst({
      where: {
        id: zapId,
        userId: id,
      },
      include: {
        actions: {
          include: {
            type: true,
          },
        },
        trigger: {
          include: {
            type: true,
          },
        },
      },
    });

    if (!zap) {
      return res.status(404).json({ message: "Zap not found" });
    }

    return res.json({ zap });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Failed to retrieve zap", error });
  }
});

export const zapRouter = router;
