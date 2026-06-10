let contadorPaciente = 2;
let contadorProfissional = 102;

function adicionarPaciente() {
    const nome = prompt("Digite o nome do paciente:");

    if (!nome || nome.trim() === "") {
        alert("Nome inválido.");
        return;
    }

    const lista = document.getElementById("listaPacientes");

    const item = document.createElement("div");
    item.className = "item";

    item.innerHTML = `
        <span>${nome} <small>| #${String(contadorPaciente).padStart(3, "0")}</small></span>
        <em>${dataAtual()}</em>
        <button onclick="removerItem(this)">X</button>
    `;

    lista.appendChild(item);
    contadorPaciente++;
}

function adicionarProfissional() {
    const nome = prompt("Digite o nome do profissional:");

    if (!nome || nome.trim() === "") {
        alert("Nome inválido.");
        return;
    }

    const lista = document.getElementById("listaProfissionais");

    const item = document.createElement("div");
    item.className = "item";

    item.innerHTML = `
        <span>${nome} <small>| #${contadorProfissional}</small></span>
        <em>${dataAtual()}</em>
        <button onclick="removerItem(this)">X</button>
    `;

    lista.appendChild(item);
    contadorProfissional++;
}

function removerItem(botao) {
    const confirmar = confirm("Deseja remover este item?");

    if (confirmar) {
        botao.parentElement.remove();
    }
}

function filtrarPacientes() {
    filtrarLista("buscarPaciente", "listaPacientes");
}

function filtrarProfissionais() {
    filtrarLista("buscarProfissional", "listaProfissionais");
}

function filtrarLista(inputId, listaId) {
    const busca = document.getElementById(inputId).value.toLowerCase();
    const itens = document.querySelectorAll(`#${listaId} .item`);

    itens.forEach(item => {
        const texto = item.innerText.toLowerCase();

        if (texto.includes(busca)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function dataAtual() {
    const hoje = new Date();

    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

function abrirModalPerfil() {
    document.getElementById("modalPerfil").style.display = "flex";

    document.getElementById("novoNome").value = document.getElementById("nomeUsuario").innerText;
    document.getElementById("novoCargo").value = document.getElementById("cargoUsuario").innerText;
    document.getElementById("novoSetor").value = document.getElementById("setorUsuario").innerText;
}

function fecharModalPerfil() {
    document.getElementById("modalPerfil").style.display = "none";
}

function salvarPerfil() {
    const nome = document.getElementById("novoNome").value;
    const cargo = document.getElementById("novoCargo").value;
    const setor = document.getElementById("novoSetor").value;

    document.getElementById("nomeUsuario").innerText = nome;
    document.getElementById("cargoUsuario").innerText = cargo;
    document.getElementById("setorUsuario").innerText = setor;

    fecharModalPerfil();
}