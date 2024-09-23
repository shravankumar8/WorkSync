import { Router } from "express";
import { authMiddleware } from "../middlewares/userAuth";
import { ZapCreateSchema } from "../../types/types";
import { prismaClient } from "../userRoutes/user";
const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  console.log("create a zap");
  // @ts-ignore
  const id: string = req.id;
  const body = req.body;
  const parsedData = ZapCreateSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(404).json({
      message: "inncorrect inputs bruh",
    });
  }

  const zapId = await prismaClient.$transaction(async (tx) => {
    const zap = await prismaClient.zap.create({
      data: {
        userId: parseInt(id),
        triggerId: "",
        actions: {
          create: parsedData.data.actions.map((x, index) => ({
            actionId: x.availableActionId,
            sortingOrder: index,
            metadata: x.actionMetadata,
          })),
        },
      },
    });
    const trigger=await tx.trigger.create({
        data:{
            triggerId:parsedData.data.availableTriggerId,
            zapId:zap.id
        }
    })


  });

  res.json({ body });
});
router.get("/", authMiddleware, (req, res) => {
  console.log("get a zap");
});
router.get("/:zapId", authMiddleware, (req, res) => {
  console.log("get a zap");
});

export const zapRouter = router;
