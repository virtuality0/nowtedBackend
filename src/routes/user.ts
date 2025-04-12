import { Router } from "express";
import { signin, signOut, signUp } from "../controllers/user";
import { Validate } from "../middlewares/validate";
import { userSchema } from "../zodSchemas/user";

export const userRouter = Router();

userRouter.post("/signup", Validate(userSchema), signUp);
userRouter.post("/signin", signin);
userRouter.post("/signout", signOut);
