function entrar() {
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    if (email === "" || senha === "") {
        alert("Preencha o email e a senha.");
        return;
    }

    alert("Login realizado!");
}

function criarConta() {
    alert("Abrir tela de cadastro.");
}

function esqueciSenha() {
    alert("Abrir recuperação de senha.");
}