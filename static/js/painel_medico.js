let pacientes = [];

function dataHoje() {
    return new Date().toLocaleDateString("pt-BR");
}

async function carregarMeusPacientes() {
    const lista  = document.getElementById("listaPacientes");
    const token  = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/pacientes/meus", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error("Erro na resposta do servidor:", response.status);
            lista.innerHTML = `<div class="patient-card"><span>Erro ao carregar pacientes.</span></div>`;
            return;
        }

        const dadosPacientes = await response.json();

        pacientes = dadosPacientes.map(p => {
            const dataDataInput  = p.Nascimento ? p.Nascimento.split("T")[0] : "";
            const scoreDecimal   = p.Score      ? (p.Score / 100).toFixed(2)  : 0;

            return {
                id:   p.IDPaciente,
                nome: p.NomePaciente,
                dados: {
                    nome:       p.NomePaciente,
                    data:       dataDataInput,
                    cpf:        p.CPF,
                    sexo:       p.Sexo,
                    responsavel: p.Responsavel || ""
                },
                observacoes: p.Observacoes
                    ? [{ titulo: "Histórico Clínico", data: dataHoje(), texto: p.Observacoes, aberta: false }]
                    : [],
                sintomas: {},
                historico: p.Score
                    ? [{
                        data:          dataHoje(),
                        pontuacao:     parseFloat(scoreDecimal),
                        limiarAmarelo: p.Sexo === "M" ? 0.56 : 0.55,
                        limiarVermelho: p.Sexo === "M" ? 0.73 : 0.76,
                        sexo:          p.Sexo
                    }]
                    : []
            };
        });

        lista.innerHTML = "";

        if (pacientes.length === 0) {
            lista.innerHTML = `<div class="patient-card"><span>Nenhum paciente vinculado.</span></div>`;
            return;
        }

        pacientes.forEach(pac => {
            const card = document.createElement("div");
            card.className    = "patient-card";
            card.dataset.pacId = pac.id;

            const scoreExibicao = pac.historico.length > 0
                ? `Último Score: ${pac.historico[0].pontuacao}`
                : "Sem triagem";

            card.innerHTML = `<span><b>${pac.nome}</b> | ID: ${pac.id}</span><i>${scoreExibicao}</i>`;
            card.addEventListener("click", () => abrirFicha(pac.id));
            lista.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro crítico ao listar pacientes:", erro);
        lista.innerHTML = `<div class="patient-card"><span>Falha na conexão com o servidor.</span></div>`;
    }
}

function abrirFicha(pacienteId) {
    const pac = pacientes.find(p => p.id === pacienteId);
    if (!pac) return;

    sessionStorage.setItem("pacienteAtivo", JSON.stringify(pac));
    window.location.href = "cadastro_paciente.html";
}

document.getElementById("campoBusca").addEventListener("input", function () {
    const termo = this.value.toLowerCase();
    document.querySelectorAll(".patient-card").forEach(card => {
        const nomePaciente = card.querySelector("b")?.textContent.toLowerCase() || "";
        card.style.display = nomePaciente.includes(termo) ? "" : "none";
    });
});

document.getElementById("btnAdicionarPaciente").addEventListener("click", () => {
    sessionStorage.removeItem("pacienteAtivo");
    window.location.href = "cadastro_paciente.html";
});



window.addEventListener("load", () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) { window.location.href = "login.html"; return; }

    carregarMeusPacientes();

    const nome  = localStorage.getItem("userNome");
    const cargo = localStorage.getItem("userRole");
    const id    = localStorage.getItem("userId");

    if (nome) {
        document.querySelector(".profile h1").textContent = nome;
        document.getElementById("tabNome").textContent    = nome;
    }
    if (cargo) {
        document.querySelector(".profile p:nth-of-type(1)").textContent = `Cargo na empresa: ${cargo}`;
    }
    if (id) {
        document.querySelector(".profile p:nth-of-type(2)").textContent = `ID de Conta: ${id}`;
    }
});