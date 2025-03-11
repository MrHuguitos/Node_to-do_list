import "dotenv/config";
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbconfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO); // Faz a conexão com o banco de dados

export async function getTarefas() {
    const db = conexao.db("Lista_Tarefas"); // Acessa o banco de dados
    const colecao = db.collection("tarefas"); // Acessa a coleção do banco de dados

    return colecao.find().toArray(); // Retorna a coleção no formato de lista
};

export async function NewTarefa(newtarefa) {
    const db = conexao.db("Lista_Tarefas"); 
    const colecao = db.collection("tarefas");

    return colecao.insertOne(newtarefa);
};

export async function mudarTarefa(id, tarefa_atualizada) {
    const db = conexao.db("Lista_Tarefas");
    const colecao = db.collection("tarefas");
    const objID = ObjectId.createFromHexString(id);

    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:tarefa_atualizada});
};

export async function apagarTarefa(id) {
    const db = conexao.db("Lista_Tarefas");
    const colecao = db.collection("tarefas");
    const objID = ObjectId.createFromHexString(id);

    return colecao.deleteOne({_id: new ObjectId(objID) });
};