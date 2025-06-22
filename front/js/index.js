// Configuração de exibição das tarefas
function carregarTarefas() {
    fetch("/api/tarefas")
        .then(response => response.json())
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
                const button = document.createElement("button");
                p.textContent = tarefa.descricao;
                div.className = "item";
                button.id = tarefa._id;

                if (tarefa.status == "Concluída") {
                    button.className = "deletar";
                    button.textContent = "Deletar";
                    feitas.appendChild(div);
                } else if (tarefa.status == "Em processo") {
                    button.className = "atualizar";
                    button.textContent = "Finalizar";
                    fazendo.appendChild(div);
                } else {
                    button.className = "atualizar";
                    button.textContent = "Iniciar";
                    nao_feitas.appendChild(div);
                }
                div.appendChild(p);
                div.appendChild(button);
            });
        })
        .catch(error => console.error("Erro ao carregar tarefas: ", error));
}

// Carregar tarefas quando a página for aberta
document.addEventListener("DOMContentLoaded", carregarTarefas);

// Configuração de abertura/fechamento do modal
const button = document.querySelector("#botfixo");
const modal = document.querySelector("dialog");
const buttonClose = document.querySelector(".fechar");

button.onclick = function() {
    modal.showModal();
};
buttonClose.onclick = function() {
    modal.close();
};

// Configuração de envio de tarefas ao servidor
const button2 = document.querySelector(".confirmar");
button2.onclick = function() {
    const descricaoTarefa = document.querySelector("#tarefa").value;
    if (!descricaoTarefa) {
        alert("A descrição da tarefa não pode estar vazia.");
        return;
    }
    const novaTarefa = {
        descricao: descricaoTarefa,
        status: "Não iniciado",
    };

    fetch("/api/novatarefa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(novaTarefa),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            alert("Tarefa adicionada com sucesso!");
            document.querySelector("#tarefa").value = "";
            modal.close();
            carregarTarefas();
        })
        .catch((error) => {
            console.error("Erro ao enviar tarefa: ", error);
            alert("Falha ao adicionar tarefa...");
        });
};

// Configuração de atualização/deleção de tarefas via servidor
document.body.addEventListener("click", (event) => {
    const targetButton = event.target;
    const id_tarefa = targetButton.id;

    if (targetButton.classList.contains("atualizar")) {
        const acao = targetButton.textContent;
        let novaTarefa = {};
        if (acao == "Finalizar") {
            novaTarefa = { status: "Concluída" };
        } else {
            novaTarefa = { status: "Em processo" };
        }

        fetch(`/api/atualizar/${id_tarefa}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novaTarefa),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                }
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
    } else if (targetButton.classList.contains("deletar")) {
        fetch(`/api/deletar/${id_tarefa}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                }
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
    }
});