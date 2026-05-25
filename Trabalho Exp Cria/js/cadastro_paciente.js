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