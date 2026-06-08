window.addEventListener("load", () => {
    const nome = localStorage.getItem("medicoNome");
    const cargo = localStorage.getItem("medicoCargo");
    const email = localStorage.getItem("medicoEmail");

    if (nome) {
        document.getElementById("nomeMedico").value = nome;
    }

    if (cargo) {
        document.getElementById("cargoMedico").value = cargo;
    }

    if (email) {
        document.getElementById("emailMedico").value = email;
    }
});

function cancelar() {
    window.location.href = "cadastro_paciente.html";
}

function salvar() {
    const nome = document.getElementById("nomeMedico").value;
    const cargo = document.getElementById("cargoMedico").value;
    const email = document.getElementById("emailMedico").value;

    localStorage.setItem("medicoNome", nome);
    localStorage.setItem("medicoCargo", cargo);
    localStorage.setItem("medicoEmail", email);

    window.location.href = "cadastro_paciente.html";
}