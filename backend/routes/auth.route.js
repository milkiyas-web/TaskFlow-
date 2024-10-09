import express from "express";
import { login, logout, signup, refreshToken, getProfile } from "../controllers/auth.controllers.js"

const router = express.Router();

router.post("/signup", signup);

export default router;