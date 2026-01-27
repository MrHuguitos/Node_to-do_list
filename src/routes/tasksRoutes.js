import express from "express";
import { listarTarefas, criarTarefas, atualizarTarefa, deletarTarefa } from "../controllers/tasksController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listarTarefas); // Retorna uma lista de tarefas
router.post("/", criarTarefas); // Cria uma nova tarefa
router.put("/:id", atualizarTarefa); // Atualizar uma tarefa existente
router.delete("/:id", deletarTarefa); // Deletar uma tarefa existente

export default router;