import { loginAgent } from "../controllers/agent/login";
import { LogoutAgent } from "../controllers/agent/logout";
import { registerAgent } from "../controllers/agent/register";
import { authMiddleware } from "./../helpers/validation/auth-middleware";
import express from "express";



const router = express.Router();

router.post("/register", registerAgent);
router.post("/login", loginAgent);

router.post("/:id/logout", authMiddleware, LogoutAgent);

export default router;
