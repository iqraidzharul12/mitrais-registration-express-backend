import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

//Create a new user
router.post("/", UserController.newUser);

export default router;
