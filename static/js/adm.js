let pacientes             = [];
let profissionais         = [];
let profissionalSelecionado = null;

function dataHoje() {
    return new Date().toLocaleDateString("pt-BR");
}

async function carregarPacientes() {
    const lista = document.getElementById("listaPacientes");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) { window.location.href = "login.html"; return; }

    try {
        const response = await fetch("http://localhost:3000/pacientes/todos", { // ← era /meus
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            lista.innerHTML = `<div class="patient-card"><span>Erro ao carregar pacientes.</span></div>`;
            return;
        }

        const dados = await response.json();

        pacientes = dados.map(p => ({
            id:   p.IDPaciente,
            nome: p.NomePaciente,
            cpf:  String(p.CPF || ""),
            dados: {
                nome:        p.NomePaciente,
                data:        p.Nascimento ? p.Nascimento.split("T")[0] : "",
                cpf:         String(p.CPF || ""),
                sexo:        p.Sexo,
                responsavel: p.Responsavel || ""
            },
            observacoes: p.Observacoes
                ? [{ titulo: "Histórico Clínico", data: dataHoje(), texto: p.Observacoes, aberta: false }]
                : [],
            sintomas: {},
            historico: p.Score ? [{
                data:          dataHoje(),
                pontuacao:     parseFloat((p.Score / 100).toFixed(2)),
                limiarAmarelo:  p.Sexo === "M" ? 0.56 : 0.55,
                limiarVermelho: p.Sexo === "M" ? 0.73 : 0.76,
                sexo:           p.Sexo
            }] : []
        }));

        lista.innerHTML = "";
        if (pacientes.length === 0) {
            lista.innerHTML = `<div class="patient-card"><span>Nenhum paciente cadastrado.</span></div>`;
            return;
        }

        pacientes.forEach(pac => {
            const card = document.createElement("div");
            card.className    = "patient-card";
            card.dataset.nome = pac.nome.toLowerCase();
            card.dataset.cpf  = pac.cpf.replace(/[^0-9]/g, "");
            card.style.cursor = "pointer";

            const score = pac.historico.length > 0
                ? `Score: ${pac.historico[0].pontuacao}`
                : "Sem triagem";

            card.innerHTML = `<span><b>${pac.nome}</b> | ID: ${pac.id}</span><i>${score}</i>`;
            card.addEventListener("click", () => abrirFicha(pac.id));
            lista.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao listar todos os pacientes:", erro);
        lista.innerHTML = `<div class="patient-card"><span>Falha na conexão.</span></div>`;
    }
}

function abrirFicha(pacienteId) {
    const pac = pacientes.find(p => p.id === pacienteId);
    if (!pac) return;
    sessionStorage.setItem("pacienteAtivo", JSON.stringify(pac));
    window.location.href = "cadastro_paciente.html";
}

async function carregarProfissionais() {
    const lista = document.getElementById("listaProfissionais");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:3000/contas/profissionais", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            lista.innerHTML = `<div class="item-lista"><span>Erro ao carregar profissionais.</span></div>`;
            return;
        }

        profissionais = await response.json();
        lista.innerHTML = "";

        if (profissionais.length === 0) {
            lista.innerHTML = `<div class="item-lista"><span>Nenhum profissional cadastrado.</span></div>`;
            return;
        }

        profissionais.forEach(prof => {
            const item = document.createElement("div");
            item.className    = "item-lista";
            item.dataset.nome  = (prof.NomeConta || "").toLowerCase();
            item.dataset.cpf   = String(prof.CPF  || "").replace(/[^0-9]/g, "");
            item.dataset.email = (prof.Email || "").toLowerCase();
            item.dataset.id    = String(prof.IDConta || "");

            const inativo = prof.role === "INATIVO";
            item.innerHTML = `
                <span>
                    <b>${prof.NomeConta}</b>
                    ${inativo ? '<span style="color:#c0392b;font-size:13px;"> (INATIVO)</span>' : ""}
                    | #${prof.IDConta}
                </span>
                <i>${prof.Email}</i>
            `;
            item.addEventListener("click", () => abrirModalProfissional(prof));
            lista.appendChild(item);
        });

    } catch (erro) {
        console.error("Erro ao listar profissionais:", erro);
        lista.innerHTML = `<div class="item-lista"><span>Falha na conexão.</span></div>`;
    }
}

document.getElementById("btnAdicionarProfissional").addEventListener("click", () => {
    window.location.href = "../../views/html/sigin.html";
});

async function adicionarProfissional() {
    
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:3000/contas", {
            method:  "POST",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ nome, cpf, email, senha, role })
        });

        const resultado = await response.json();
        if (!response.ok) throw new Error(resultado.mensagem || "Erro ao criar conta.");

        alert(`✅ Profissional "${nome}" cadastrado com sucesso! ID: ${resultado.id}`);
        carregarProfissionais();

    } catch (erro) {
        alert("Erro ao cadastrar profissional: " + erro.message);
    }
}

function abrirModalProfissional(prof) {
    profissionalSelecionado = prof;

    document.getElementById("modalNome").textContent  = prof.NomeConta || "—";
    document.getElementById("modalId").textContent    = "ID: #" + prof.IDConta;
    document.getElementById("modalCargo").textContent = "Cargo: " + (prof.role || "—");
    document.getElementById("modalCpf").textContent   = "CPF: " + (prof.CPF   || "—");

    const btn = document.querySelector(".btn-inativar");
    const jaInativo = prof.role === "INATIVO";
    btn.disabled    = jaInativo;
    btn.textContent = jaInativo ? "JÁ INATIVO" : "INATIVAR";
    btn.style.opacity = jaInativo ? "0.5" : "1";

    document.getElementById("modalProfissional").classList.add("ativo");
}

function fecharModal() {
    document.getElementById("modalProfissional").classList.remove("ativo");
    profissionalSelecionado = null;
}

async function inativarProfissional() {
    if (!profissionalSelecionado) return;
    if (profissionalSelecionado.role === "INATIVO") {
        alert("Esta conta já está inativa.");
        return;
    }

    const confirma = confirm(
        `⚠️ Deseja inativar a conta de "${profissionalSelecionado.NomeConta}"?\n` +
        `O acesso ao sistema será bloqueado imediatamente.`
    );
    if (!confirma) return;

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
        const response = await fetch(
            `http://localhost:3000/contas/${profissionalSelecionado.IDConta}/inativar`,
            {
                method:  "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            }
        );

        const resultado = await response.json();
        if (!response.ok) throw new Error(resultado.erro || "Erro ao inativar.");

        alert(`✅ Conta de "${profissionalSelecionado.NomeConta}" inativada.`);
        fecharModal();
        carregarProfissionais();

    } catch (erro) {
        alert("Erro ao inativar: " + erro.message);
    }
}

document.getElementById("btnAdicionarPaciente").addEventListener("click", () => {
    sessionStorage.removeItem("pacienteAtivo");
    window.location.href = "cadastro_paciente.html";
});

document.getElementById("campoBusca").addEventListener("input", function () {
    const termo = this.value.replace(/[^a-z0-9]/gi, "").toLowerCase();
    document.querySelectorAll("#listaPacientes .patient-card").forEach(card => {
        if (!termo) { card.style.display = ""; return; }
        const nome = card.dataset.nome || "";
        const cpf  = card.dataset.cpf  || "";
        card.style.display = (nome.includes(termo) || cpf.includes(termo)) ? "" : "none";
    });
});

document.getElementById("buscarProfissional").addEventListener("input", function () {
    const termo    = this.value.trim().toLowerCase();
    const termoCpf = termo.replace(/[^0-9]/g, "");
    document.querySelectorAll("#listaProfissionais .item-lista").forEach(item => {
        if (!termo) { item.style.display = ""; return; }
        const nome  = item.dataset.nome  || "";
        const email = item.dataset.email || "";
        const cpf   = item.dataset.cpf   || "";
        const id    = item.dataset.id    || "";
        const bate  = nome.includes(termo) || email.includes(termo) || id.includes(termo)
                   || (termoCpf && cpf.includes(termoCpf));
        item.style.display = bate ? "" : "none";
    });
});

document.getElementById("modalProfissional").addEventListener("click", function (e) {
    if (e.target === this) fecharModal();
});

window.addEventListener("load", () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) { window.location.href = "login.html"; return; }

    const nome  = localStorage.getItem("userNome");
    const cargo = localStorage.getItem("userRole");
    const id    = localStorage.getItem("userId");

    if (nome) {
        document.getElementById("nomeUsuario").textContent = nome;
        document.getElementById("tabNome").textContent     = nome;
    }
    if (cargo) document.getElementById("cargoUsuario").textContent = `Cargo na empresa: ${cargo}`;
    if (id)    document.getElementById("idUsuario").textContent    = `ID de Conta: ${id}`;

    carregarPacientes();
    carregarProfissionais();
});