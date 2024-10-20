import { Router } from "express";
import { auth } from "../middlewares/index.js";
import {
  register,
  login,
  getUser,
  deleteUser,
  registeredEvents,
  createdEvents,
  searchEvents,
  toggleFriend,
  getFriends,
  searchFriends
} from "../controllers/user/index.js";


const router = Router();

// AUTH
router.post("/register", register);
router.post("/login", login);
router.get("/get-user/:id", auth, getUser);
router.delete("/delete-user", auth, deleteUser);
router.get("/registered-events", auth, registeredEvents);
router.get("/created-events",auth, createdEvents);
router.get("/search/:searchQuery", auth, searchEvents)

// Friends routes
router.post("/toggle-friend/:friendId", auth, toggleFriend);
router.get("/get-friends", auth, getFriends);
router.get("/:query", auth, searchFriends);


export default router;
