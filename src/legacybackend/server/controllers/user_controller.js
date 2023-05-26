import { Sync } from "../models/firestore_sync.js";

async function syncUser(req, res) {
  Sync.User();
  res.status(200).json({ msg: "sync user with firestore" });
}

async function syncUserRSSSubscription(req, res) {
  Sync.UserRSSSubscription();
  res.status(200).json({ msg: "sync user subscription with firestore" });
}

export const User = {
  syncUser: syncUser,
  syncUserRSSSubscription: syncUserRSSSubscription,
};
