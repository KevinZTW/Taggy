import express from "express";
import { User } from "../controllers/user_controller.js";
const user_router = express.Router();

user_router.route("/user/sync").get(User.sync);

export { user_router };
