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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const requestValidationError_1 = require("../errors/requestValidationError");
const user_1 = require("../models/user");
const password_1 = require("../utils/password");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const not_authorized_error_1 = require("../errors/not-authorized-error");
const router = express_1.default.Router();
exports.authRouter = router;
router.post("/auth/signup", [
    (0, express_validator_1.body)("name").trim().notEmpty(),
    (0, express_validator_1.body)("email").isEmail().withMessage("Enter a valid email"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 8, max: 50 })
        .withMessage("Password length must be between 8 and 50"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("handling create user request...");
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // console.log(errors.array());
        throw new requestValidationError_1.RequestValidationError(errors.array());
        // console.log("%%%%%%%%%%%%%%%%%\n",err.serializeErrors());
    }
    const { name, email, password } = req.body;
    const hashedPassword = yield password_1.Password.toHash(password);
    const newUser = new user_1.User({ name, email, password: hashedPassword });
    console.log("Saving new user...");
    try {
        const savedUser = yield newUser.save();
        console.log("Saved User: ", savedUser);
        const token = jsonwebtoken_1.default.sign({
            id: savedUser._id,
            email: savedUser.email,
            name: savedUser.name
        }, process.env.JWT_KEY);
        console.log("Setting up jwt token...");
        req.session = { jwt: token };
        res.status(201).send({ user: { name: savedUser.name, email: savedUser.email } });
    }
    catch (_a) {
        // console.log(savedUser);
        throw new Error("Could not save user!");
    }
    // console.log(newUser);
    // res.status(200).send();
}));
router.post("/auth/info", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Enter a valid email")
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // console.log(errors.array());
        throw new requestValidationError_1.RequestValidationError(errors.array());
        // console.log("%%%%%%%%%%%%%%%%%\n",err.serializeErrors());
    }
    const { email } = req.body;
    const user = yield user_1.User.findOne({ email });
    return res.send(user ? { user: { name: user.name, email: user.email } } : { user: null });
    // if(existingUser){
    //     return res.send({userExist: true});
    // }
    // else{
    //     return res.send({userExist: false});
    // }
}));
router.get("/auth/currentUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Validating current user...");
    if (req.session) {
        try {
            const payload = jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY);
            return res.send(JSON.stringify({ user: {
                    email: payload.email,
                    name: payload.name
                } }));
        }
        catch (err) {
            return res.send(JSON.stringify({ user: null }));
        }
    }
    else {
        return res.send(JSON.stringify({ user: null }));
    }
}));
router.post("/auth/signin", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Enter a valid email"),
    (0, express_validator_1.body)("password").trim().isLength({ min: 8, max: 50 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Handling signin request...");
    const { email, password } = req.body;
    const user = yield user_1.User.findOne({ email });
    const validCredentials = yield password_1.Password.compare(user.password, password);
    console.log("Validating credentials...");
    if (!validCredentials) {
        console.log("Invalid Credentials");
        throw new not_authorized_error_1.NotAuthorizedError();
    }
    else {
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            name: user.name
        }, process.env.JWT_KEY);
        console.log("Setting up jwt token...");
        req.session = { jwt: token };
        res.status(200).send(JSON.stringify({ user: { name: user.name, email } }));
    }
    // console.log({user: { name:name,email:email }});
}));
router.get("/auth/signout", (req, res) => {
    console.log("Handling singout request");
    req.session = null;
    res.send(JSON.stringify({ user: null }));
});
