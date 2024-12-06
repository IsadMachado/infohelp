import { Router } from "express";
import { loginUsuario } from "../controllers/loginController";

export const router = Router();

router.post("/login", loginUsuario);
