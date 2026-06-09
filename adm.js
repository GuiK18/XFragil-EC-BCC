let relatorios = [
    { id: "Id.formulário", data: "Data/do/exame" },
    { id: "Id.formulário", data: "Data/do/exame" },
    { id: "Id.formulário", data: "Data/do/exame" },
    { id: "Id.formulário", data: "Data/do/exame" },
    { id: "Id.formulário", data: "Data/do/exame" }
];

let pacientes = [
    { nome: "Nome paciente", id: "#id.paciente", data: "data/ultimo/exame" }
];

let profissionais = [
    { nome: "Nome profissional", id: "#id.profissional", data: "data/ultimo/exame" }
];

function dataHoje() {
    return new Date().toLocaleDateString("pt-BR");
}

function renderRelatorios() {
    const lista = document.getElementById("listaRelatorios");
    lista.innerHTML = "";

    relatorios.forEach((relatorio, index) => {
        const item = document.createElement("div");
        item.className = "item-lista";
        item.innerHTML = `
            <span>${relatorio.id} &nbsp; | &nbsp; ${relatorio.data}</span>
        `;

        item.addEventListener("click", () => {
            alert("Abrindo relatório " + (index + 1));
        });

        lista.appendChild(item);
    });
}

function renderPacientes() {
    const lista = document.getElementById("listaPacientes");
    lista.innerHTML = "";

    pacientes.forEach((paciente, index) => {
        const item = document.createElement("div");
        item.className = "item-lista";
        item.innerHTML = `
            <span>${paciente.nome} | <small>${paciente.id}</small></span>
            <i>${paciente.data}</i>
        `;

        item.addEventListener("click", () => {
            window.location.href = "ficha_paciente.html";
        });

        lista.appendChild(item);
    });
}

function renderProfissionais() {
    const lista = document.getElementById("listaProfissionais");
    lista.innerHTML = "";

    profissionais.forEach((profissional, index) => {
        const item = document.createElement("div");
        item.className = "item-lista";
        item.innerHTML = `
            <span>${profissional.nome} | <small>${profissional.id}</small></span>
            <i>${profissional.data}</i>
        `;

        item.addEventListener("click", () => {
            alert("Abrindo profissional " + profissional.nome);
        });

        lista.appendChild(item);
    });
}

function adicionarRelatorio() {
    relatorios.push({
        id: "Id.formulário",
        data: dataHoje()
    });

    renderRelatorios();
}

function adicionarPaciente() {
    const nome = prompt("Nome do paciente:");

    if (!nome || nome.trim() === "") return;

    pacientes.push({
        nome: nome,
        id: "#" + Math.floor(Math.random() * 90000 + 10000),
        data: dataHoje()
    });

    renderPacientes();
}

function adicionarProfissional() {
    const nome = prompt("Nome do profissional:");

    if (!nome || nome.trim() === "") return;

    profissionais.push({
        nome: nome,
        id: "#" + Math.floor(Math.random() * 90000 + 10000),
        data: dataHoje()
    });

    renderProfissionais();
}

function editarPerfil() {
    window.location.href = "editar_medico.html";
}

function configurarBusca(inputId, listaId) {
    document.getElementById(inputId).addEventListener("input", function () {
        const termo = this.value.toLowerCase();

        document.querySelectorAll(`#${listaId} .item-lista`).forEach(item => {
            const texto = item.textContent.toLowerCase();

            if (texto.includes(termo)) {
                item.classList.remove("oculto");
            } else {
                item.classList.add("oculto");
            }
        });
    });
}

configurarBusca("buscarRelatorio", "listaRelatorios");
configurarBusca("buscarPaciente", "listaPacientes");
configurarBusca("buscarProfissional", "listaProfissionais");

renderRelatorios();
renderPacientes();
renderProfissionais();