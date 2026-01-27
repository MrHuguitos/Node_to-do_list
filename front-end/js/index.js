document.addEventListener("DOMContentLoaded", () => {
    // -------- Verificação de token ----------------
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login";
        return;
    };

    document.body.style.display = "block";

    // -------- Funções Auxiliares -----------------
    function getHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };
    };

    function mostrarSnackbar(mensagem, tipo = 'sucesso') {
        const snackbar = document.getElementById("snackbar");
        
        snackbar.textContent = mensagem;
        snackbar.className = ""; 
        snackbar.classList.add("show", tipo);

        setTimeout(function() {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    };

    // -------- Função de Logout -------------------
    const btnLogout = document.getElementById("btnLogout");
    
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "/login";
        });
    };

    // -------- Funções Principais -----------------
    // -------- 1. Lógica GET
    function carregarTarefas() {
        fetch("/tasks", { headers: getHeaders() })
            .then(res => {
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                };
                return res.json().then(data => {
                    if (!res.ok) throw new Error(data.error || "Erro desconhecido");
                    return data;
                });
            })
            .then(tarefas => {
                ["nao-feitas", "fazendo", "feitas"].forEach(id => {
                    const element = document.getElementById(id);
                    const summary = element.querySelector("summary");

                    element.innerHTML = "";
                    element.appendChild(summary);
                });

                const maps = {
                    "Pending": document.getElementById("nao-feitas"),
                    "Ongoing": document.getElementById("fazendo"),
                    "Completed": document.getElementById("feitas")
                };
                const iconCheck = `<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" ><path d="M13.29 7.29 7 13.58l-2.29-2.29L3.3 12.7l3 3c.2.2.45.29.71.29s.51-.1.71-.29l7-7-1.41-1.41Zm-.29 6.3-.79-.79-1.41 1.41 1.5 1.5c.2.2.45.29.71.29s.51-.1.71-.29l7-7-1.41-1.41-6.29 6.29Z"></path></svg>`;
                const iconPlay = `<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" ><path d="M6.51 18.87a1 1 0 0 0 1-.01l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87ZM8 7.77 15.06 12 8 16.23z"></path></svg>`;
                const iconTrash = `<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" ><path d="M17 6V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v2h2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h2V6zM9 4h6v2H9zM6 20V8h12v12z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>`;

                tarefas.forEach(tarefa => {
                    const destino = maps[tarefa.status] || maps["Pending"];
                    const div = document.createElement("div");

                    div.className = "item";

                    let btnHTML = "";
                    let classBtn = "";

                    if (tarefa.status === "Completed") {
                        classBtn = "deletar";
                        btnHTML = iconTrash;
                    } else if (tarefa.status === "Ongoing") {
                        classBtn = "finalizar";
                        btnHTML = iconCheck;
                    } else {
                        classBtn = "iniciar";
                        btnHTML = iconPlay;
                    };

                    div.innerHTML = `<button id="${tarefa._id}" class="${classBtn}">${btnHTML}</button><span class="task-text">${tarefa.description}</span>`;
                    destino.appendChild(div);
                });
            })
            .catch(error => console.error("Erro ao carregar tarefas: ", error));
    };

    carregarTarefas();

    // -------- 2. Lógica POST
    const buttonPost = document.querySelector(".confirmar");
    const modal = document.querySelector("dialog");

    if (buttonPost) {
        buttonPost.onclick = function() {
            const input = document.querySelector("#tarefa");

            if (!input.value) return mostrarSnackbar("A descrição não pode estar vazia!", "aviso");

            const novaTarefa = {
                description: input.value,
                status: "Pending",
            };
            
            fetch("/tasks", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(novaTarefa),
            })
                .then(res => {
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    };
                    return res.json().then(data => {
                        if (!res.ok) throw new Error(data.error || "Erro desconhecido");
                        return data;
                    });
                })
                .then(() => {
                    mostrarSnackbar("Tarefa adicionada.", "sucesso");
                    input.value = "";
                    modal.close();
                    carregarTarefas();
                })
                .catch((error) => {
                    console.error("Erro ao enviar tarefa: ", error);
                    mostrarSnackbar("Falha ao criar tarefa...", "erro");
                });
        };
    };

    // -------- Lógica PUT e DELETE
    document.body.addEventListener("click", (event) => {
        const targetButton = event.target.closest('button');

        if (!targetButton) return;

        const id_tarefa = targetButton.id;

    // -------- 3. Lógica PUT
        if (targetButton.classList.contains("finalizar") || targetButton.classList.contains("iniciar")) {
            const acao = targetButton.classList.contains("finalizar") ? "finalizar" : "iniciar";
            let novoStatus = (acao === "finalizar") ? "Completed" : "Ongoing";

            fetch(`/tasks/${id_tarefa}`, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify({ status: novoStatus }),
            })
                .then(res => {
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    };
                    return res.json().then(data => {
                        if (!res.ok) throw new Error(data.error || "Erro desconhecido");
                        return data;
                    });
                })
                .then(() => {
                    mostrarSnackbar("Status atualizado!", "sucesso");
                    carregarTarefas();
                })
                .catch(error => {
                    console.error("Erro ao atualizar tarefa: ", error);
                    mostrarSnackbar("Falha ao atualizar status...", "erro");
                });

    // -------- 4. Lógica DELETE
        } else if (targetButton.classList.contains("deletar")) {
            if (!confirm("Deseja realmente excluir esta tarefa?")) return;

            fetch(`/tasks/${id_tarefa}`, {
                method: "DELETE",
                headers: getHeaders(),
            })
                .then(res => {
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    };
                    return res.json().then(data => {
                        if (!res.ok) throw new Error(data.error || "Erro desconhecido");
                        return data;
                    });
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

    // -------- Funções Modal -----------------
    const buttonOpen = document.getElementById("botfixo");
    const buttonClose = document.getElementById("fechar");

    if (buttonOpen) buttonOpen.addEventListener('click', () => modal.showModal());
    if (buttonClose) buttonClose.addEventListener('click', () => modal.close());
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target == modal) modal.close();
        });
    };
});