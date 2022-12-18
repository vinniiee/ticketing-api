import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/requestValidationError";
import { User } from "../models/user";
import { Password } from "../utils/password";

import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/not-authorized-error";

const router = express.Router();

router.post(
  "/auth/signup",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 8, max: 50 })
      .withMessage("Password length must be between 8 and 50"),
  ],
  async (req: Request, res: Response) => {
    console.log("handling create user request...");
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // console.log(errors.array());
      throw new RequestValidationError(errors.array());
      // console.log("%%%%%%%%%%%%%%%%%\n",err.serializeErrors());
    }
    const { name,email, password } = req.body;

    const hashedPassword = await Password.toHash(password);

    const newUser = new User({ name,email, password:hashedPassword });
    console.log("Saving new user...");
    try {
      const savedUser = await newUser.save();
      console.log("Saved User: ", savedUser);

      const token = jwt.sign({
        id: savedUser!._id,
        email: savedUser!.email,
        name: savedUser!.name
      },
      process.env.JWT_KEY!);
      console.log("Setting up jwt token...");
      req.session = {jwt:token};

      res.status(201).send({ user: {name: savedUser.name, email: savedUser.email} });
    } catch {
      // console.log(savedUser);
      throw new Error("Could not save user!");
    }

    // console.log(newUser);

    // res.status(200).send();
  }
);

router.post("/auth/info",
[
   body("email").isEmail().withMessage("Enter a valid email")
], 
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors.array());
        throw new RequestValidationError(errors.array());
        // console.log("%%%%%%%%%%%%%%%%%\n",err.serializeErrors());
      }


  const {email } = req.body;
  const user = await User.findOne({ email });
  return res.send( user  ?    { user:{ name:user!.name, email: user!.email} }: {user:null});
  // if(existingUser){
  //     return res.send({userExist: true});
  // }
  // else{
  //     return res.send({userExist: false});

  // }
});


interface UserPayload{
  email:string;
  id:string;
  name:string;
}
router.get("/auth/currentUser", async (req:Request,res:Response)=>{
  console.log("VAlidating current user...")
  if(req.session){
    try{
      const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
      return res.send({user:{
        email: payload.email,
        name: payload.name}});
    }
    catch(err){
      return res.send({user:null});
    }
  }
  else{
    return res.send({user:null});
  }
  

})


router.post("/auth/signin",
[
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").trim().isLength({min:8, max:50})
],
async (req:Request,res:Response)=>{

  console.log("Handling signin request...");
  const {email,password} = req.body;
  const user = await User.findOne({email});

  const validCredentials = await Password.compare(user!.password,password);
  console.log("Validating credentials...");
  if(!validCredentials){
    console.log("Invalid Credentials");
    throw new NotAuthorizedError();
  }
  else{
    const token = jwt.sign({
      id: user!._id,
      email: user!.email,
      name: user!.name
    },
    process.env.JWT_KEY!);
    console.log("Setting up jwt token...");
    req.session = {jwt:token};
  
    res.status(200).send({user: { name:user!.name,email}});
  }
  // console.log({user: { name:name,email:email }});

}
)


router.get("/auth/signout", (req:Request,res:Response)=>{
  console.log("Handling singout request")
  req.session=null;
  res.send({user:null});
})

export { router as authRouter };
