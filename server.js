import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnection from "./src/config/dbconfig.js";
import authRoutes from "./src/routes/authRoutes.js";
import tasksRoutes from "./src/routes/tasksRoutes.js";

dotenv.config();

dbConnection();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", tasksRoutes);

export default app;