document.getElementById("formCadastro").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    
    // Mapeia o que foi digitado para as siglas que seu banco espera (ADM, DOC, etc.)
    const cargoDigitado = document.getElementById("cargo").value.toUpperCase(); 
    let roleDoUsuario = "SECRETARIA"; // Valor padrão caso não seja nenhum dos abaixo
    
    if (cargoDigitado === "ADM" || cargoDigitado === "ADMINISTRADOR") {
        roleDoUsuario = "ADM";
    } else if (cargoDigitado === "PROFISSIONAL" || cargoDigitado === "MEDICO" || cargoDigitado === "DOC") {
        roleDoUsuario = "DOC";
    } else if (cargoDigitado === "SECRETARIO" || cargoDigitado === "SECRETARIA" || cargoDigitado === "SEC") {
        roleDoUsuario = "SECRETARIA"; 
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
            // Enviando as propriedades com as chaves exatas que o seu req.body espera
            body: JSON.stringify({ 
                nome, 
                cpf, 
                email, 
                senha, 
                role: roleDoUsuario // Aqui entra como 'dados.role' no seu Service!
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Erro ao cadastrar usuário.");
        }

        // Se o seu controller respondeu res.status(201).json({ id }), pegamos ele aqui
        alert(`Usuário cadastrado com sucesso! ID gerado: ${dados.id}`);
        document.getElementById("formCadastro").reset();

    } catch (erro) {
        alert(erro.message);
    }
});