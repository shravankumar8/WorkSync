import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client';
//http://hooks.zapier.com/hooks/catch/12345/76543/
const client=new PrismaClient()
const app = express();
app.post("/hooks/catch/:userId/:zapId",async (req:Request,res:Response)=>{

const userId=req.params.userId
const zapId=req.params.zapId
await client.$transaction(async tx=>{})

client.trigger.create


})

