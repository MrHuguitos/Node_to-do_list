import express from "express";
import path from "path";
import routes from "./src/routes/tarefasRoutes.js";

const app = express();
app.use(express.static(path.resolve("front")));

// Inicia o servidor na porta 3000 e exibe uma mensagem no console quando estiver ativo
app.listen(3000, () => {
    console.log("server escutando...");
});

routes(app);