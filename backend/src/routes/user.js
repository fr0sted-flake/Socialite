import { Router } from "express";
import { auth, imageUpload } from "../middlewares/index.js";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  sendVerificationCode,
  changePassword,
  editUser,
  getUser,
  deleteUser,
  registeredEvents,
  createdEvents,
  searchEvents,
  toggleFriend,
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


router.post("/verify-email", verifyEmail);
router.post("/forgot-password", auth, forgotPassword);
router.post("/send-verification-code", sendVerificationCode);

// EDIT
router.post("/change-password", auth, changePassword);
router.put("/", auth, imageUpload, editUser);

// Friends routes
router.post("/toggle-friend/:friendId", auth, toggleFriend);


export default router;
