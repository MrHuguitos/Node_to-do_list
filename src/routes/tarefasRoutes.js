import express from "express";
import multer from "multer";
import cors from "cors";
import { UsarHTML, listarTarefas, criarTarefas, atualizarTarefa } from "../controllers/tarefasControllers.js";

const routes = (app) => {
    app.use(express.json());

    app.get("/", UsarHTML); // Retorna a página HTML
    app.get("/tarefas", listarTarefas); // Retorna uma lista de tarefas
    app.post("/novatarefa", criarTarefas); // Cria uma nova tarefa
    app.put("/atualizar/:id", atualizarTarefa);
};

export default routes;