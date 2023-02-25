import 'express-async-errors';
import mongoose from 'mongoose';
import app from './app';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();
const start = async ()=>{
    try{
        if(!process.env.JWT_KEY){
            console.log("JWT key must be set");
            throw new Error("JWT key must be set");
        }
        if(!process.env.MONGO_URI){
            console.log("Mongo Uri must be set!");
            throw new Error("Mongo Uri must be set!");
        }
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to databse!");
    }
    catch{
        throw new Error("Could not establish connection with database!");
    }


    app.listen(3000, () => {
        console.log("Listening on port 3000...");
      });

}
start();