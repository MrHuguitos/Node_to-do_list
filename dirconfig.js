import { dirname } from "path";
import { fileURLToPath } from "url";

export default function Configurar() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    return __dirname;
};

// Exporta uma função que retorna o diretório atual