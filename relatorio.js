let observacoes = [
    {
        titulo: "Observação",
        data: "Data/do/exame",
        texto: "Observaçõesobservaçõesobservaçõesobservaçõesobservaçõesobservaçõesobservaçõesobservaçõesobservaçõesobservaçõesobservaçõesobservações",
        aberta: true
    },
    { titulo: "Observação", data: "Data/do/exame", texto: "", aberta: false },
    { titulo: "Observação", data: "Data/do/exame", texto: "", aberta: false },
    { titulo: "Observação", data: "Data/do/exame", texto: "", aberta: false },
    { titulo: "Observação", data: "Data/do/exame", texto: "", aberta: false },
    { titulo: "Observação", data: "Data/do/exame", texto: "", aberta: false },
    { titulo: "Observação", data: "Data/do/exame", texto: "", aberta: false }
];

function renderObservacoes() {
    const lista = document.getElementById("listaObservacoes");
    lista.innerHTML = "";

    observacoes.forEach((obs, index) => {
        const item = document.createElement("div");
        item.className = "item-observacao";

        item.innerHTML = `
            <p>
                <strong>${obs.aberta ? "⌃" : "⌄"} ${obs.titulo}</strong>
                <span>${obs.data}</span>
            </p>
            ${obs.aberta ? `<span>${obs.texto}</span>` : ""}
        `;

        item.addEventListener("click", () => {
            observacoes[index].aberta = !observacoes[index].aberta;
            renderObservacoes();
        });

        lista.appendChild(item);
    });
}

document.querySelectorAll("#listaSintomas button").forEach(botao => {
    botao.addEventListener("click", () => {
        botao.classList.toggle("selecionado");
    });
});

function imprimirRelatorio() {
    window.print();
}

function deletarRelatorio() {
    const confirmar = confirm("Tem certeza que deseja deletar este relatório?");

    if (confirmar) {
        alert("Relatório deletado.");
        window.location.href = "ficha_paciente_admin.html";
    }
}

renderObservacoes();