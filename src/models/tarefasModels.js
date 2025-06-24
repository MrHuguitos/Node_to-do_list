import { ObjectId } from "mongodb";
import clientPromise from "../config/dbconfig.js";

let db;

async function init() {
    if (db) return;
    try {
        const client = await clientPromise;
        db = client.db("Lista_Tarefas");
    } catch (error) {
        console.error("Falha ao conectar ao banco de dados: ", error);
        throw new Error("Não foi possível conectar ao banco de dados.");
    };
};

export async function getTarefas() {
    await init();
    const colecao = db.collection("tarefas"); // Acessa a coleção do banco de dados
    return colecao.find().toArray(); // Retorna a coleção no formato de lista
};

export async function NewTarefa(newtarefa) { 
    await init();
    const colecao = db.collection("tarefas");
    return colecao.insertOne(newtarefa);
};

export async function mudarTarefa(id, tarefa_atualizada) {
    await init();
    const colecao = db.collection("tarefas");
    return colecao.updateOne({ _id: new ObjectId(id)}, { $set: tarefa_atualizada });
};

export async function apagarTarefa(id) {
    await init();
    const colecao = db.collection("tarefas");
    return colecao.deleteOne({ _id: new ObjectId(id) });
};