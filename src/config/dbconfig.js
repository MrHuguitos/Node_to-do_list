import mongoose from "mongoose";

async function dbConnection() {
    try {
        await mongoose.connect(process.env.STRING_CONEXAO);
        console.log("Conectado ao MongoDB com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB: ", error);
        process.exit(1);
    };
};

export default dbConnection;