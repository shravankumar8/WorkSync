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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Schema for request validation (optional, using Zod)
app.post("/hooks/catch/:userId/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const validZapId = yield client.zap.findFirst({
            where: {
                id: zapId,
            },
        });
        if (validZapId) {
            const result = yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                run = yield tx.zapRun.create({
                    data: {
                        zapId: zapId,
                        metadata: body,
                    },
                });
                outBox = yield tx.zapRunOutBox.create({
                    data: {
                        zapRunId: run.id,
                    },
                });
                return { run, outBox };
            }));
        }
        else {
            res.json({
                message: "the zap trigger not found please check the id",
            });
        }
        res.status(200).json({
            message: "Webhook received",
            zapRun: run,
            zapRunOutBox: outBox,
        });
    }
    catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Use the port from the environment variable or default to 3002
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
