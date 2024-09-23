import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "provenworks";
export function authMiddleware(req:Request,res:Response,next:NextFunction){
    console.log("middle ware for user auth")
    const token = req.headers.authorization as string;
    
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      // @ts-ignore
      req.id = payload.id;
      next();
    } catch (error) {
         return res.status(403).json({
           message: "You are not logged in",
         });
    }
}