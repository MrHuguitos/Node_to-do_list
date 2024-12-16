// Configuração de exibição das tarefas
fetch("http://127.0.0.1:3000/tarefas")                              // Acessa a URL, obtém as tarefas via API e insere no HTML
    .then(response => response.json())                                  // Converte a resposta para JSON
    .then(tarefas => {                                                  // Usa os dados obtidos
        const feitas = document.getElementById("feitas");               // Armazena o elemento que possui ID = feitas
        const fazendo = document.getElementById("fazendo");             // Armazena o elemento que possui ID = fazendo
        const nao_feitas = document.getElementById("nao-feitas");       // Armazena o elemento que possui ID = nao-feitas

        tarefas.forEach(tarefa => {                     // Percorre cada elemento da lista "tarefas", sendo cada elemento chamado de "tarefa"
            if (tarefa.status == "Concluída") {              // Se a tarefa estiver concluída
                const p = document.createElement("p");       // Cria um elemento "p" para cada tarefa concluída
                p.textContent = tarefa.descricao;            // O elemento recebe o descrição da tarefa como conteúdo
                feitas.appendChild(p);                       // Adiciona o elemento p como filho do elemento que possui ID = feitas
            } else if (tarefa.status == "Em processo") {                  // Se a tarefa estiver em processo
                const p = document.createElement("p");                    // Cria um elemento "p" para cada tarefa em progresso
                const div = document.createElement("div");                // Cria uma div para armazenar o elemento "p"
                const button = document.createElement("button");          // Cria um botão que também ficará na div
                p.textContent = tarefa.descricao;                         // O elemento "p" recebe a descrição da tarefa como texto
                div.className = "item";                                   // A div recebe como classe o nome "item"
                button.id = tarefa._id;                                   // Adiciona ao botão um ID igual ao da tarefa
                button.className = "atualizar";                         // O botão recebe a classe "atualizar"
                button.textContent = "Finalizar";                       // Adiciona ao botão o texto "Finalizar"
                fazendo.appendChild(div);                               // Adiciona a div ao elemento com ID = fazendo
                div.appendChild(p);                                     // Adiciona o p à div
                div.appendChild(button);                                // Adiciona o botão também à div
            } else {                                                // Caso a tarefa não tenho sido iniciada
                const p = document.createElement("p");              // Cria um elemento "p" para cada tarefa não iniciada
                const div = document.createElement("div");          // Cria uma div para armazenar o p
                const button = document.createElement("button");    // Cria um botão que também ficará na div
                p.textContent = tarefa.descricao;                   // O elemento p recebe o descrição da tarefa como conteúdo                                
                div.className = "item";                             // A div recebe como classe o nome "item"
                button.textContent = "Iniciar";                     // Adiciona aobotão o texto "Iniciar"
                button.id = tarefa._id;                             // Adiciona ao botão um ID igual ao da tarefa
                button.className = "atualizar"                      // O botão recebe a classe "atualizar"
                nao_feitas.appendChild(div);                        // Adiciona div ao elemento com ID = não-feitas
                div.appendChild(p);                                 // Adiciona o p à div
                div.appendChild(button);                            // Adiciona o botão também à div
            };
        });
    })
    .catch(error => console.error("Erro ao carregar tarefas:", error));    // Retorna um erro caso não consiga carregar as tarefas

// Configuração de abertura/fechamento do modal
const button = document.querySelector("#botfixo");
const modal = document.querySelector("dialog");
const buttonClose = document.querySelector(".fechar");

button.onclick = function () {
    modal.showModal();
};
buttonClose.onclick = function () {
    modal.close();
};

// Configuração de envio de tarefas ao servidor
const button2 = document.querySelector(".confirmar");

button2.onclick = function () {
    const descricaoTarefa = document.querySelector("#tarefa").value;
    const novaTarefa = {                                                   // Objeto que será enviado ao servidor
        descricao: descricaoTarefa,
        status: "Não iniciado",
    };

    fetch("http://127.0.0.1:3000/novatarefa", {                           // Enviar a nova tarefa ao servidor
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(novaTarefa),                                 // Converter objeto para JSON
    })
        .then((response) => {
            if (!response.ok) {                                           // Caso a execução seja mal sucedida, interrompe e vai para o catch
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`)
            }
        })
        .then((data) => {
            alert("Tarefa adicionada com sucesso!");
            document.querySelector("#tarefa").value = "";
            modal.close();
            window.location.reload(true);
        })
        .catch((error) => {
            console.error("Erro ao enviar tarefa:", error);
            alert("Falha ao adicionar tarefa...");
        })
};

// Configuração de atualização de tarefas via servidor
document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("atualizar")) {
        const button = event.target;
        const id_tarefa = button.id;
        const acao = button.textContent;
        let novaTarefa = {};

        if (acao === "Finalizar") {
            novaTarefa = { status: "Concluída" };
        } else {
            novaTarefa = { status: "Em processo" };
        }

        fetch(`http://127.0.0.1:3000/atualizar/${id_tarefa}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novaTarefa),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                alert("Tarefa atualizada com sucesso!");
                window.location.reload(true);
            })
            .catch(error => {
                console.error("Erro ao atualizar tarefa:", error);
                alert("Falha ao atualizar tarefa...");
            });
    }
});