# 📝 Secure To-Do List (Full-Stack Node.js)

![Capa 1 do Projeto To-Do List](https://github.com/user-attachments/assets/427bfa62-0bc0-4a25-86c6-5fe37ace460d)
![Capa 2 do Projeto To-Do List](https://github.com/user-attachments/assets/27268b87-fd1d-4843-b25c-bcee03a0b792)

> Aplicação web full-stack robusta para gerenciamento de tarefas, com sistema completo de autenticação e segurança.

[![Ver Deploy](https://img.shields.io/badge/Ver%20Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://node-to-do-list-three.vercel.app/)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## 🚀 Sobre o Projeto

Este projeto vai além de um simples gerenciador de tarefas. Desenvolvido para consolidar conhecimentos em **Node.js** e **Segurança Web**, ele implementa um fluxo completo de autenticação e autorização. O objetivo foi criar uma API RESTful segura, onde cada usuário tem acesso privado e exclusivo aos seus próprios dados, persistidos no MongoDB Atlas.

---

## ✨ Funcionalidades Principais

### 🔐 Segurança & Autenticação
* **Cadastro e Login:** Sistema de registro de usuários com validação.
* **Autenticação JWT:** Uso de *JSON Web Tokens* para sessões seguras e *stateless*.
* **Criptografia:** Senhas armazenadas com hash seguro utilizando `bcrypt`.
* **Rotas Protegidas:** Middleware de autenticação que impede acesso não autorizado às tarefas.

### 📋 Gerenciamento de Tarefas (CRUD)
* **Criar:** Adição de novas tarefas vinculadas ao ID do usuário logado.
* **Ler:** Visualização apenas das tarefas pertencentes ao usuário.
* **Atualizar:** Alteração de status (Pendente ➝ Em Processo ➝ Concluída).
* **Deletar:** Remoção segura de tarefas.

### 🎨 Front-end Interativo
* **Interface Responsiva:** HTML5 e CSS3 moderno.
* **Feedback Visual:** Sistema de "Snackbar" (notificações) para sucesso ou erro.
* **Fetch API:** Comunicação assíncrona com o Backend enviando o Token no cabeçalho.

---
## 🛠️ Tecnologias e Ferramentas

**Backend:**
* **Node.js & Express:** Arquitetura do servidor e rotas.
* **JWT (JsonWebToken):** Geração e validação de tokens de acesso.
* **Bcrypt.js:** Hashing de senhas.
* **Cors & Dotenv:** Segurança e configuração de ambiente.

**Database:**
* **MongoDB Atlas:** Banco de dados NoSQL na nuvem.
* **Mongoose:** ODM para modelagem de dados e esquemas.

**Frontend:**
* **JavaScript (Vanilla):** Lógica de consumo de API e manipulação do DOM.
* **HTML5 & CSS3:** Estrutura e estilização.
