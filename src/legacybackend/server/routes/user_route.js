import express from "express";
import { User } from "../controllers/user_controller.js";
const user_router = express.Router();

user_router.route("/user/syncuser").get(User.syncUser);
user_router
  .route("/user/syncuserrsssubscription")
  .get(User.syncUserRSSSubscription);
export { user_router };
