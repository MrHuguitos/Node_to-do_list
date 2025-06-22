import express from "express";
import { listarTarefas, criarTarefas, atualizarTarefa, deletarTarefa } from "../controllers/tarefasControllers.js";

const router = express.Router();

router.get("/tarefas", listarTarefas); // Retorna uma lista de tarefas
router.post("/novatarefa", criarTarefas); // Cria uma nova tarefa
router.put("/atualizar/:id", atualizarTarefa); // Atualizar uma tarefa existente
router.delete("/deletar/:id", deletarTarefa); // Deletar uma tarefa existente

export default router;