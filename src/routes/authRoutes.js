import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

router.post("/registrar", AuthController.registrar);
router.post("/login", AuthController.login);

export default router;