import { getTarefas, NewTarefa, mudarTarefa, apagarTarefa } from "../models/tarefasModels.js";

export async function listarTarefas(req, res) {
    try {
        const tarefas = await getTarefas(); // Pega a lista retornada pela função "listarTarefas"
        res.status(200).json(tarefas); // Retorna a lista no formato json
    } catch (error) {
        console.error("Erro ao listar tarefas: ", error.message);
        res.status(500).json({ "Erro": "Falha ao buscar tarefas no servidor." });
    };
};

export async function criarTarefas(req, res) {
    const novatarefa = req.body;
    try {
        const tarefaCriada = await NewTarefa(novatarefa);
        res.status(201).json(tarefaCriada);
    } catch (erro) {
        console.error("Erro ao criar tarefa: ", erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    };
};

export async function atualizarTarefa(req, res) {
    const id = req.params.id;
    const tarefa_atualizada = req.body;
    try {
        const atualizacao = await mudarTarefa(id, tarefa_atualizada);
        res.status(200).json(atualizacao);
    } catch (erro) {
        console.error("Erro ao atualizar tarefa: ", erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    };
};

export async function deletarTarefa(req, res) {
    const id = req.params.id;
    try {
        const delecao = await apagarTarefa(id);
        res.status(200).json(delecao);
    } catch (erro) {
        console.error("Erro ao deletar tarefa: ", erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    };
};