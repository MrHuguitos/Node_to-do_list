document.addEventListener("DOMContentLoaded", () => {
    // Constantes dialog
    const button = document.querySelector("#botfixo");
    const modal = document.querySelector("dialog");
    const buttonClose = document.getElementById("fechar");
    const buttonPost = document.querySelector(".confirmar");

    // Abrir e fechar o dialog
    if (button) button.addEventListener('click', () => modal.showModal());
    if (buttonClose) buttonClose.addEventListener('click', () => modal.close());

    // Fechar o dialog ao clicar fora dele
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target == modal) modal.close();
        });
    };

    // Lógica GET
    function carregarTarefas() {
        // Ícones SVG
        const iconCheck = `<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" ><path d="M13.29 7.29 7 13.58l-2.29-2.29L3.3 12.7l3 3c.2.2.45.29.71.29s.51-.1.71-.29l7-7-1.41-1.41Zm-.29 6.3-.79-.79-1.41 1.41 1.5 1.5c.2.2.45.29.71.29s.51-.1.71-.29l7-7-1.41-1.41-6.29 6.29Z"></path></svg>`;
        const iconPlay = `<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" ><path d="M6.51 18.87a1 1 0 0 0 1-.01l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87ZM8 7.77 15.06 12 8 16.23z"></path></svg>`;
        const iconTrash = `<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" ><path d="M17 6V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v2h2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h2V6zM9 4h6v2H9zM6 20V8h12v12z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>`;

        fetch("/api/tarefas")
            .then(response => {
                if (!response.ok) throw new Error("Falha ao carregar palavras do servidor");
                return response.json();
            })
            .then(tarefas => {
                const nao_feitas = document.getElementById("nao-feitas");
                const fazendo = document.getElementById("fazendo");
                const feitas = document.getElementById("feitas");

                nao_feitas.innerHTML = '<summary>Não Iniciadas</summary>';
                fazendo.innerHTML = '<summary>Em processo</summary>';
                feitas.innerHTML = '<summary>Concluídas</summary>';
                

                tarefas.forEach(tarefa => {
                    const span = document.createElement("span");
                    const div = document.createElement("div");
                    const btn = document.createElement("button");

                    span.textContent = tarefa.descricao;
                    span.className = "task-text";
                    div.className = "item";
                    btn.id = tarefa._id;

                    if (tarefa.status == "Concluída") {
                        btn.className = "deletar";
                        btn.innerHTML = iconTrash;
                        btn.title = "Deletar tarefa";
                        feitas.appendChild(div);
                    } else if (tarefa.status == "Em processo") {
                        btn.className = "finalizar";
                        btn.innerHTML = iconCheck;
                        btn.title = "Finalizar tarefa";
                        fazendo.appendChild(div);
                    } else {
                        btn.className = "iniciar";
                        btn.innerHTML = iconPlay;
                        btn.title = "Iniciar tarefa";
                        nao_feitas.appendChild(div);
                    };

                    div.appendChild(btn);
                    div.appendChild(span);
                });
            })
            .catch(error => console.error("Erro ao carregar tarefas: ", error));
    };

    // Carregar tarefas
    carregarTarefas();

    // Lógica POST
    if (buttonPost) {
        buttonPost.onclick = function() {
            const inputTarefa = document.querySelector("#tarefa");
            const descricaoTarefa = inputTarefa.value;

            if (!descricaoTarefa) {
                mostrarSnackbar("A descrição não pode estar vazia!", "aviso");
                return;
            };

            const novaTarefa = {
                descricao: descricaoTarefa,
                status: "Não iniciada",
            };

            fetch("/api/novatarefa", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(novaTarefa),
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                    return response.json();
                })
                .then(() => {
                    mostrarSnackbar("Tarefa adicionada.", "sucesso");
                    inputTarefa.value = "";
                    modal.close();
                    carregarTarefas();
                })
                .catch((error) => {
                    console.error("Erro ao enviar tarefa: ", error);
                    mostrarSnackbar("Falha ao criar tarefa...", "erro");
                });
        };
    };

    // Lógica PUT e DELETE
    document.body.addEventListener("click", (event) => {
        const targetButton = event.target.closest('button');

        if (!targetButton) return;

        const id_tarefa = targetButton.id;

        // Lógica PUT
        if (targetButton.classList.contains("finalizar") || targetButton.classList.contains("iniciar")) {
            const acao = targetButton.classList.contains("finalizar") ? "finalizar" : "iniciar";
            let novoStatus = (acao === "finalizar") ? "Concluída" : "Em processo";

            fetch(`/api/atualizar/${id_tarefa}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ status: novoStatus }),
            })
                .then((response) => {
                    if (!response.ok) throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                    return response.json();
                })
                .then(() => {
                    mostrarSnackbar("Status atualizado!", "sucesso");
                    carregarTarefas();
                })
                .catch(error => {
                    console.error("Erro ao atualizar tarefa: ", error);
                    mostrarSnackbar("Falha ao atualizar status...", "erro");
                });

        // Lógica DELETE
        } else if (targetButton.classList.contains("deletar")) {
            if (!confirm("Deseja realmente excluir esta tarefa?")) return;

            fetch(`/api/deletar/${id_tarefa}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                    return response.json();
                })
                .then(() => {
                    mostrarSnackbar("Tarefa removida.", "sucesso");
                    carregarTarefas();
                })
                .catch(error => {
                    console.error("Erro ao deletar tarefa: ", error);
                    mostrarSnackbar("Falha ao remover tarefa...", "erro");
                });
        };
    });

    // Função reutilizável para mostrar o Snackbar
    function mostrarSnackbar(mensagem, tipo = 'sucesso') {
        const snackbar = document.getElementById("snackbar");
        
        snackbar.textContent = mensagem;
        snackbar.className = ""; 
        snackbar.classList.add("show", tipo);

        setTimeout(function() {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    };
});