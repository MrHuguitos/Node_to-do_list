import mongoose from "mongoose";

const tarefaSchema = new mongoose.Schema({
    description: { type: String, required: true },
    status: { type: String, default: "Pending" },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, { collection: 'tarefas' });

export default mongoose.model("Tarefa", tarefaSchema);