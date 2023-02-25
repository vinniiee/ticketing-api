import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";
import cors from "cors";
import { authRouter } from "./auth/authRouter";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(
  cookieSession({
    // name: 'session',
    signed: false,
    secure: false, //whether to require https explicitly
    // keys: ['key1', 'key2']
  })
);


app.use(json());
// app.use(cors({
//   origin:["https://glittery-melba-88ab24.netlify.app/","https://ticketing-client-wheat.vercel.app/","https://ticketing-client*"],
//   allowedHeaders: [ "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "x-xsrf-token","Set-Cookie" ],
//   credentials:true,
//   methods:['GET','POST','DELETE','UPDATE','PUT','PATCH']
// }));

app.use((req:Request,res:Response,next:NextFunction)=>{
    res.header("Access-Control-Allow-Origin","https://glittery-melba-88ab24.netlify.app/events");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.all("/auth/*", authRouter);
// app.all("*",(req,res)=>{
//     res.send("Hello!")
// })
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);
export default app;