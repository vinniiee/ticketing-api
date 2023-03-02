"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cookie_session_1 = __importDefault(require("cookie-session"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const authRouter_1 = require("./auth/authRouter");
const errorHandler_1 = require("./middlewares/errorHandler");
const not_found_error_1 = require("./errors/not-found-error");
const app = (0, express_1.default)();
app.set("trust proxy", true);
app.use((0, cookie_session_1.default)({
    // name: 'session',
    signed: false,
    secure: false, //whether to require https explicitly
    // keys: ['key1', 'key2']
}));
app.use((0, cors_1.default)({
    origin: 'https://ticketing-client-wheat.vercel.app',
    credentials: true,
}));
app.use((0, body_parser_1.json)());
// app.use(function(req:Request, res:Response, next:NextFunction) {
//   // res.header("Access-Control-Allow-Origin", "*");
//   const allowedOrigins = ["http://localhost:3001","https://glittery-melba-88ab24.netlify.app/","https://ticketing-client-wheat.vercel.app/","https://ticketing-client"];
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin!)){
//        res.setHeader('Access-Control-Allow-Origin', origin!);
//   }
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header("Access-Control-Allow-credentials", 'true');
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
//   next();
// });
// app.use(cors({
//   origin:["http://localhost:3001","https://glittery-melba-88ab24.netlify.app/","https://ticketing-client-wheat.vercel.app/","https://ticketing-client"],
//   allowedHeaders: [ "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "x-xsrf-token","Set-Cookie" ],
//   credentials:true,
//   methods:['GET','POST','DELETE','UPDATE','PUT','PATCH']}
// ));
// app.use((req:Request,res:Response,next:NextFunction)=>{
//     res.header("Access-Control-Allow-Origin","https://glittery-melba-88ab24.netlify.app");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.all("/auth/*", authRouter_1.authRouter);
// app.all("*",(req,res)=>{
//     res.send("Hello!")
// })
app.all("*", () => {
    throw new not_found_error_1.NotFoundError();
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
