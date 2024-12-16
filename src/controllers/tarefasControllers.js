import fs from "fs";
import path from "path";
import { getTarefas, NewTarefa, mudarTarefa } from "../models/tarefasModels.js";
import Configurar from "../../dirconfig.js";

export async function listarTarefas(req, res) {
    const tarefas = await getTarefas(); // Pega a lista retornada pela função "listarTarefas"

    res.status(200).json(tarefas); // Retorna a lista no formato json
};

export async function criarTarefas(req, res) {
    const novatarefa = req.body;

    try {
        const tarefaCriada = await NewTarefa(novatarefa);

        res.status(200).json(tarefaCriada);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    };
};

export async function atualizarTarefa(req, res) {
    const id = req.params.id;
    const tarefa_atualizada = req.body;

    try {
        const atualizacao = await mudarTarefa(id, tarefa_atualizada);

        res.status(200).json(atualizacao);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    };
};

export async function UsarHTML(req, res) {
    res.status(200).sendFile(path.resolve(Configurar() + "/front/html/index.html")); // Retorna o HTML
};