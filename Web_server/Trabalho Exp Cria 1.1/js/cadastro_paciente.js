// ABRIR ABA DE CRIAR PACIENTE
function abrirCriar() {

    document.getElementById("telaPerfil").style.display = "none";

    document.getElementById("telaCriar").style.display = "flex";

    document.getElementById("tabCriar").style.display = "flex";
}



// FECHAR ABA DE CRIAR PACIENTE
function fecharCriar() {

    document.getElementById("telaCriar").style.display = "none";

    document.getElementById("telaPerfil").style.display = "block";

    document.getElementById("tabCriar").style.display = "none";
}



// REGISTRAR NOVO PACIENTE
function registrarPaciente() {

    // PEGA O NOME DIGITADO
    let nome = document.getElementById("nomePaciente").value;

    // CASO ESTEJA VAZIO
    if (nome.trim() === "") {
        nome = "Nome paciente";
    }

    // LISTA DE PACIENTES
    let lista = document.getElementById("listaPacientes");

    // CRIA CARD
    let paciente = document.createElement("div");

    paciente.className = "patient-card";

    paciente.innerHTML = `
        <span>
            <b>${nome}</b> | #id.paciente
        </span>

        <i>data/ultimo/exame</i>
    `;

    // ADICIONA NA LISTA
    lista.appendChild(paciente);

    // LIMPA INPUT
    document.getElementById("nomePaciente").value = "";

    // FECHA A ABA
    fecharCriar();
}



// ABRIR E FECHAR OBSERVAÇÃO
const observacoes = document.querySelectorAll(".obs");

observacoes.forEach((obs) => {

    obs.addEventListener("click", () => {

        obs.classList.toggle("aberta");

    });

});

// MARCAR E DESMARCAR SINTOMAS
const sintomas = document.querySelectorAll(".sintoma");

sintomas.forEach((sintoma) => {
    sintoma.addEventListener("click", () => {
        sintoma.classList.toggle("selecionado");
    });
});

const botoesSintomas = document.querySelectorAll(".botao-sintoma");

botoesSintomas.forEach((botao) => {
    botao.addEventListener("click", function () {
        this.classList.toggle("ativo");
    });
});

function abrirModalPerfil() {
    document.getElementById("modalPerfil").style.display = "flex";
}

function fecharModalPerfil() {
    document.getElementById("modalPerfil").style.display = "none";
}

function salvarPerfil() {
    let nome = document.getElementById("inputNomePerfil").value;
    let cargo = document.getElementById("inputCargoPerfil").value;
    let email = document.getElementById("inputEmailPerfil").value;

    document.querySelector(".profile h1").innerText = nome;

    let textosPerfil = document.querySelectorAll(".profile p");
    textosPerfil[0].innerText = cargo;
    textosPerfil[1].innerText = "#id.de.conta";

    document.querySelector(".tab").innerText = nome;

    fecharModalPerfil();
}