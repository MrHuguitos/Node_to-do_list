document.addEventListener("DOMContentLoaded", () => {
    // Animação de troca de telas (login, signup)
    const wrapper = document.querySelector('.wrapper');
    const registerLink = document.querySelector('.register-link');
    const loginLink = document.querySelector('.login-link');

    // Mudar login para signup
    if (registerLink) {
        registerLink.onclick = (e) => {
            e.preventDefault();
            wrapper.classList.add('active');
        }; 
    };

    // Mudar signup para login
    if (loginLink) {
        loginLink.onclick = (e) => {
            e.preventDefault();
            wrapper.classList.remove('active');
        }; 
    };

    // Função Snackbar
    function mostrarSnackbar(mensagem, tipo = 'sucesso') {
        const snackbar = document.getElementById("snackbar");
        
        snackbar.textContent = mensagem;
        snackbar.className = ""; 
        snackbar.classList.add("show", tipo);

        setTimeout(function() {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    };

    // Botoes de Login e Sign Up
    const butSignup = document.getElementById("butSignup");
    const butLogin = document.getElementById("butLogin");

    // Sign Up
    if (butSignup) {
        butSignup.onclick = function(event) {
            event.preventDefault();

            const inputName = document.getElementById("signName");
            const inputMail = document.getElementById("signMail");
            const inputPassword = document.getElementById("signPassword");

            if (!inputName.value || !inputMail.value || !inputPassword.value) return mostrarSnackbar("Preencha todos os campos!", "aviso");

            const newUser = {
                name: inputName.value,
                email: inputMail.value,
                password: inputPassword.value
            };

            const butText = butSignup.innerHTML;
            butSignup.innerHTML = "Criando...";
            butSignup.disabled = true;

            fetch("/auth/registrar", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newUser),
            })
                .then(response => {
                    return response.json().then(data => {
                        if (!response.ok) throw new Error(data.error || "Erro desconhecido");
                        return data;
                    });                
                })
                .then(() => {
                    mostrarSnackbar("Conta criada com sucesso! Faça login.", "sucesso");

                    inputName.value = "";
                    inputMail.value = "";
                    inputPassword.value = "";

                    wrapper.classList.remove('active');
                })
                .catch((error) => {
                    console.error("Erro ao cadastrar usuário: ", error);
                    mostrarSnackbar("Ocorreu um erro. Tente novamente", "erro");
                })
                .finally(() => {
                    butSignup.innerHTML = butText;
                    butSignup.disabled = false;
                });
        };
    };

    //Login
    if (butLogin) {
        butLogin.onclick = function(event) {
            event.preventDefault();

            const inputMail = document.getElementById("loginMail");
            const inputPassword = document.getElementById("loginPassword");

            if (!inputMail.value || !inputPassword.value) return mostrarSnackbar("Preencha todos os campos!", "aviso");

            const loginUser = {
                email: inputMail.value,
                password: inputPassword.value
            };

            const butText = butLogin.innerHTML;
            butLogin.innerHTML = "Entrando...";
            butLogin.disabled = true;

            fetch("/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(loginUser),
            })
                .then(response => {
                    return response.json().then(data => {
                        if (!response.ok) throw new Error(data.error || "Erro desconhecido");
                        return data;
                    });
                })
                .then(() => {
                    localStorage.setItem("token", data.token); // Salva o token
                    window.location.href = "/";
                })
                .catch((error) => {
                    console.error("Erro ao fazer login: ", error);
                    mostrarSnackbar("Ocorreu um erro. Tente novamente", "erro");
                })
                .finally(() => {
                    butLogin.innerHTML = butText;
                    butLogin.disabled = false;
                });
        };
    };
});