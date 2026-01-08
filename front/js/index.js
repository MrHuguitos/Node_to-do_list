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
    if (sobreDialog) {
        sobreDialog.addEventListener('click', (e) => {
            if (e.target == sobreDialog) sobreDialog.close();
        });
    };

    // Lógica GET
    function carregarTarefas() {
        fetch("/api/tarefas")
            .then(response => {
                if (!response.ok) throw new Error("Falha ao carregar palavras do servidor");
                return response.json();
            })
            .then(tarefas => {
                const feitas = document.getElementById("feitas");
                const fazendo = document.getElementById("fazendo");
                const nao_feitas = document.getElementById("nao-feitas");

                feitas.innerHTML = '<summary>Concluídas</summary>';
                fazendo.innerHTML = '<summary>Em processo</summary>';
                nao_feitas.innerHTML = '<summary>Não Iniciado</summary>';

                tarefas.forEach(tarefa => {
                    const p = document.createElement("p");
                    const div = document.createElement("div");
                    const btn = document.createElement("button");

                    p.textContent = tarefa.descricao;
                    div.className = "item";
                    btn.id = tarefa._id;

                    if (tarefa.status == "Concluída") {
                        btn.className = "deletar";
                        btn.textContent = "Deletar";
                        feitas.appendChild(div);
                    } else if (tarefa.status == "Em processo") {
                        btn.className = "atualizar";
                        btn.textContent = "Finalizar";
                        fazendo.appendChild(div);
                    } else {
                        btn.className = "atualizar";
                        btn.textContent = "Iniciar";
                        nao_feitas.appendChild(div);

                    };

                    div.appendChild(p);
                    div.appendChild(btn);
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
                alert("A descrição da tarefa não pode estar vazia.");
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
                    alert("Tarefa adicionada com sucesso!");
                    inputTarefa.value = "";
                    modal.close();
                    carregarTarefas();
                })
                .catch((error) => {
                    console.error("Erro ao enviar tarefa: ", error);
                    alert("Falha ao adicionar tarefa...")
                });
        };
    };

    // Lógica PUT e DELETE
    document.body.addEventListener("click", (event) => {
        const targetButton = event.target.closest('button');

        if (!targetButton) return;

        const id_tarefa = targetButton.id;

        // Lógica PUT
        if (targetButton.classList.contains("atualizar")) {
            const acao = targetButton.textContent;
            let novoStatus = (acao === "Finalizar") ? "Concluída" : "Em processo";

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
                    alert("Tarefa atualizada com sucesso!");
                    carregarTarefas();
                })
                .catch(error => {
                    console.error("Erro ao atualizar tarefa: ", error);
                    alert("Falha ao atualizar tarefa...");
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
                    alert("Tarefa deletada com sucesso!");
                    carregarTarefas();
                })
                .catch(error => {
                    console.error("Erro ao deletar tarefa: ", error);
                    alert("Falha ao deletar tarefa...");
                });
        };
    });
});