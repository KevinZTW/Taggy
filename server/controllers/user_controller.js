import { Sync } from "../models/firestore_sync.js";

async function syncUser(req, res) {
  Sync.User();
  res.status(200).json({ msg: "sync user with firestore" });
}

export const User = {
  sync: syncUser,
};
