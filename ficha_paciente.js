let observacoes = [
    {
        titulo: "Observação",
        data: "Data/do/exame",
        texto: "Observações observações observações observações observações observações",
        aberta: true
    },
    {
        titulo: "Observação",
        data: "Data/do/exame",
        texto: "",
        aberta: false
    }
];

let relatorios = [
    "Id.formulário  |  Data/do/exame",
    "Id.formulário  |  Data/do/exame",
    "Id.formulário  |  Data/do/exame"
];

let historico = [
    "mudança | #Id.da.conta",
    "mudança | #Id.da.conta",
    "mudança | #Id.da.conta"
];

let observacaoSelecionada = null;

function renderObservacoes() {
    const lista = document.getElementById("listaObservacoes");
    lista.innerHTML = "";

    observacoes.forEach((obs, index) => {
        const item = document.createElement("div");
        item.className = "item-observacao";

        if (index === observacaoSelecionada) {
            item.classList.add("selecionada");
        }

        item.innerHTML = `
            <p>
                <strong>${obs.aberta ? "⌃" : "⌄"} ${obs.titulo}</strong>
                <span>${obs.data}</span>
            </p>
            ${obs.aberta ? `<span>${obs.texto}</span>` : ""}
        `;

        item.addEventListener("click", () => {
            observacaoSelecionada = index;
            observacoes[index].aberta = !observacoes[index].aberta;
            renderObservacoes();
        });

        lista.appendChild(item);
    });
}

function adicionarObservacao() {
    const texto = prompt("Digite a observação:");

    if (!texto || texto.trim() === "") return;

    observacoes.push({
        titulo: "Observação",
        data: new Date().toLocaleDateString("pt-BR"),
        texto: texto,
        aberta: true
    });

    historico.push("adicionou observação | #Id.da.conta");
    renderObservacoes();
    renderHistorico();
}

function editarObservacao() {
    if (observacaoSelecionada === null) {
        alert("Selecione uma observação.");
        return;
    }

    const novoTexto = prompt(
        "Edite a observação:",
        observacoes[observacaoSelecionada].texto
    );

    if (novoTexto === null) return;

    observacoes[observacaoSelecionada].texto = novoTexto;
    observacoes[observacaoSelecionada].aberta = true;

    historico.push("editou observação | #Id.da.conta");
    renderObservacoes();
    renderHistorico();
}

function deletarObservacao() {
    if (observacaoSelecionada === null) {
        alert("Selecione uma observação.");
        return;
    }

    observacoes.splice(observacaoSelecionada, 1);
    observacaoSelecionada = null;

    historico.push("deletou observação | #Id.da.conta");
    renderObservacoes();
    renderHistorico();
}

function renderRelatorios() {
    const lista = document.getElementById("listaRelatorios");
    lista.innerHTML = "";

    relatorios.forEach(relatorio => {
        const item = document.createElement("div");
        item.className = "item-relatorio";
        item.textContent = relatorio;
        lista.appendChild(item);
    });
}

function adicionarRelatorio() {
    const novo = "Id.formulário  |  " + new Date().toLocaleDateString("pt-BR");
    relatorios.push(novo);

    historico.push("adicionou relatório | #Id.da.conta");

    renderRelatorios();
    renderHistorico();
}

function renderHistorico() {
    const lista = document.getElementById("listaHistorico");
    lista.innerHTML = "";

    historico.forEach(itemHistorico => {
        const item = document.createElement("div");
        item.className = "item-historico";
        item.textContent = itemHistorico;
        lista.appendChild(item);
    });
}

document.getElementById("buscarRelatorio").addEventListener("input", function () {
    const termo = this.value.toLowerCase();

    document.querySelectorAll(".item-relatorio").forEach(item => {
        const texto = item.textContent.toLowerCase();

        if (texto.includes(termo)) {
            item.classList.remove("oculto");
        } else {
            item.classList.add("oculto");
        }
    });
});

document.querySelectorAll("#listaSintomas button").forEach(botao => {
    botao.addEventListener("click", () => {
        botao.classList.toggle("selecionado");

        historico.push("alterou sintoma | #Id.da.conta");
        renderHistorico();
    });
});

renderObservacoes();
renderRelatorios();
renderHistorico();