document.getElementById("formCadastro").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    
    const cargoDigitado = document.getElementById("cargo").value.toUpperCase(); 
    let roleDoUsuario = "SECRETARIA";
    
    if (cargoDigitado === "ADM" || cargoDigitado === "ADMINISTRADOR" || cargoDigitado === "administrador" || cargoDigitado === "Administrador" || cargoDigitado === "adm") {
        roleDoUsuario = "ADM";
    } else if (cargoDigitado === "PROFISSIONAL" || cargoDigitado === "MEDICO" || cargoDigitado === "DOC" || cargoDigitado === "doutor" || cargoDigitado === "profissional" || cargoDigitado === "Profissional") {
        roleDoUsuario = "DOC";
    } else if (cargoDigitado === '') {
        roleDoUsuario = "INATIVO"; 
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3000/contas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ 
                nome, 
                cpf, 
                email, 
                senha, 
                role: roleDoUsuario 
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro ao cadastrar usuário.");
        }

        alert(`Usuário cadastrado com sucesso! ID gerado: ${dados.id}`);
        document.getElementById("formCadastro").reset();

    } catch (erro) {
        alert(erro.message);
    }
});