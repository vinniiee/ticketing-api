import 'express-async-errors';
import mongoose from 'mongoose';
import app from './app';
import * as dotenv from 'dotenv';
dotenv.config();
const start = async ()=>{
    try{
        if(!process.env.JWT_KEY){
            throw new Error("JWT key must be set");
        }
        if(!process.env.MONGO_URI){
            throw new Error("Mongo Uri must be set!");
        }
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to databse!");
        // console.log(mongoose.connection.host);
        // console.log(mongoose.connection.port);        // console.log(mongoose);
    }
    catch{
        throw new Error("Could not establish connection with database!");
    }


    app.listen(3000, () => {
        console.log("Listening on port 3000...");
      });

}
start();