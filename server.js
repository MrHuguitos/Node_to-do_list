import express from "express";
import path from "path";
import routes from "./src/routes/tarefasRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.resolve("front")));

// Inicia o servidor na porta 3000 e exibe uma mensagem no console quando estiver ativo
app.listen(PORT, () => {
    console.log(`server escutando na porta ${PORT}...`);
});

routes(app);