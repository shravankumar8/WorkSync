import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();

//http://hooks.zapier.com/hooks/catch/12345/76543/
const client=new PrismaClient()
const app = express();
app.use(express.json())
app.post("/hooks/catch/:userId/:zapId",async (req:Request,res:Response)=>{

const userId=req.params.userId
const zapId=req.params.zapId
const body=req.body
await client.$transaction(async tx=>{
const run = await client.zapRun.create({
  data: {
    zapId: zapId,
    metadata :body
  },
});
await client.zapRunOutBox.create({
    data:{
        zapRunId:run.id
    }
})
})


res.json({message:"doone bro sanka naku"})



})
app.listen(3000,()=>console.log("listening in port 3000"))

