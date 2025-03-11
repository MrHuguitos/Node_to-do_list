// Configuração de exibição das tarefas
fetch("http://127.0.0.1:3000/tarefas")                              // Acessa a URL, obtém as tarefas via API e insere no HTML
    .then(response => response.json())                                  // Converte a resposta para JSON
    .then(tarefas => {                                                  // Usa os dados obtidos
        const feitas = document.getElementById("feitas");               // Armazena o elemento que possui ID = feitas
        const fazendo = document.getElementById("fazendo");             // Armazena o elemento que possui ID = fazendo
        const nao_feitas = document.getElementById("nao-feitas");       // Armazena o elemento que possui ID = nao-feitas

        tarefas.forEach(tarefa => {    
            if (tarefa.status == "Concluída") {              
                const p = document.createElement("p");       
                const div = document.createElement("div");
                const button = document.createElement("button");
                p.textContent = tarefa.descricao;          
                div.className = "item";
                button.id = tarefa._id;
                button.className = "deletar";
                button.textContent = "Deletar";
                feitas.appendChild(div);
                div.appendChild(p);                       
                div.appendChild(button);
            } else if (tarefa.status == "Em processo") {                  
                const p = document.createElement("p");                    
                const div = document.createElement("div");                
                const button = document.createElement("button");         
                p.textContent = tarefa.descricao;                         
                div.className = "item";                                   
                button.id = tarefa._id;                                   
                button.className = "atualizar";                         
                button.textContent = "Finalizar";                       
                fazendo.appendChild(div);                               
                div.appendChild(p);                                     
                div.appendChild(button);                                
            } else {                                               
                const p = document.createElement("p");              
                const div = document.createElement("div");          
                const button = document.createElement("button");    
                p.textContent = tarefa.descricao;                                                   
                div.className = "item";                             
                button.textContent = "Iniciar";                     
                button.id = tarefa._id;                             
                button.className = "atualizar"                      
                nao_feitas.appendChild(div);                        
                div.appendChild(p);                                 
                div.appendChild(button);                            
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

// Configuração de atualização/deleção de tarefas via servidor
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
    else if (event.target.classList.contains("deletar")) {
        const button = event.target;
        const id_tarefa = button.id;

        fetch(`http://127.0.0.1:3000/deletar/${id_tarefa}`, {
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
                window.location.reload(true);
            })
            .catch(error => {
                console.error("Erro ao deletar tarefa:", error);
                alert("Falha ao deletar tarefa...");
            });
    }
});