import Tarefa from "../models/tasksModel.js";

export async function listarTarefas(req, res) {
    try {
        const tarefas = await Tarefa.find({ userId: req.usuarioId });
        res.status(200).json(tarefas); // Retorna a lista no formato json
    } catch (error) {
        console.error("Erro ao listar tarefas: ", error.message);
        res.status(500).json({ "Erro": "Falha ao buscar tarefas no servidor." });
    };
};

export async function criarTarefas(req, res) {
    try {
        const novaTarefa = {
            ...req.body,
            userId: req.usuarioId
        };
        const tarefaCriada = await Tarefa.create(novaTarefa);
        res.status(201).json(tarefaCriada);
    } catch (erro) {
        console.error("Erro ao criar tarefa: ", erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    };
};

export async function atualizarTarefa(req, res) {
    const id = req.params.id;
    const dados_atualizados = req.body;

    try {
        const tarefa_atualizada = await Tarefa.findOneAndUpdate(
            { _id: id, userId: req.usuarioId },
            { $set: dados_atualizados },
            { new: true }
        );

        if (!tarefa_atualizada) {
            return res.status(404).json({ message: "Tarefa não encontrada ou acesso negado" });
        }

        res.status(200).json(tarefa_atualizada);
    } catch (erro) {
        console.error("Erro ao atualizar tarefa: ", erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    };
};

export async function deletarTarefa(req, res) {
    const id = req.params.id;

    try {
        const resultado = await Tarefa.deleteOne({ _id: id, userId: req.usuarioId });
        
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        };
        
        res.status(200).json({ message: "Tarefa deletada" });
    } catch (erro) {
        console.error("Erro ao deletar tarefa: ", erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    };
};