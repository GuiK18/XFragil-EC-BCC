async function entrar() {
    let email = document.getElementById("loginEmail").value;
    let senha = document.getElementById("loginSenha").value;

    if (email === "" || senha === "") {
        alert("Preencha o email e a senha.");
        return;
    }

    try {

        const resposta = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });
        
        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro ao fazer login.");
        }

        localStorage.setItem("token", dados.token);

        localStorage.setItem("userId", dados.usuario.id);
        localStorage.setItem("userNome", dados.usuario.nome);
        localStorage.setItem("userEmail", dados.usuario.email);
        localStorage.setItem("userRole", dados.usuario.role);

        
        if (dados.usuario.role === "DOC") {
            alert(`Bem-vindo, Dr(a). ${dados.usuario.nome}!`);
            window.location.href = "../../views/html/cadastro_paciente.html"; 
        } else if (dados.usuario.role === "ADM") {
            alert(`Bem-vindo, ADM. ${dados.usuario.nome}!`);
            window.location.href = "../../views/html/adm.html";
        } else if (dados.usuario.role === "SECRETARIA") {
            alert(`Bem-vindo, Sec. ${dados.usuario.nome}!`);
            window.location.href = "../../views/html/dashboard_secretária.html";
        } else if (dados.usuario.role === "INATIVO") {
            alert(`Sentimos muito, você não tem permissão de acesso!`);
        }

        


    } catch (erro) {
        alert(erro.message);
    }
}
