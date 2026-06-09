const PESOS = {
    deficiencia_intelectual:  { M: 0.32, F: 0.20 },
    face_alongada:            { M: 0.29, F: 0.09 },
    macroorquidismo:          { M: 0.26, F: null  },
    hipermobilidade:          { M: 0.19, F: 0.04  },
    dificuldade_aprendizagem: { M: 0.18, F: 0.28  },
    deficit_atencao:          { M: 0.17, F: 0.12  },
    mov_repetitivos:          { M: 0.17, F: 0.05  },
    atraso_fala:              { M: 0.14, F: 0.01  },
    hiperatividade:           { M: 0.12, F: 0.04  },
    evita_visual:             { M: 0.06, F: 0.08  },
    evita_fisico:             { M: 0.04, F: 0.07  },
    agressividade:            { M: 0.01, F: 0.02  }
};
const LIMIAR_AMARELO = { M: 0.56, F: 0.55 };
const LIMIAR_VERMELHO = { M: 0.73, F: 0.76 };

let abas = [];
let abaAtiva = null;
let abaContador = 0;
let pacientes = [];


function gerarId() {
    return "#" + Math.floor(Math.random() * 90000 + 10000);
}
function dataHoje() {
    return new Date().toLocaleDateString("pt-BR");
}

function renderTabs() {
    const topBar = document.querySelector(".top-bar");
    topBar.querySelectorAll(".tab-dinamica").forEach(t => t.remove());
    const plusBtn = topBar.querySelector(".plus-button");

    abas.forEach(aba => {
        const tab = document.createElement("div");
        tab.className = "tab active tab-dinamica";
        tab.dataset.abaId = aba.id;
        tab.style.cssText = "display:flex;align-items:center;gap:10px;cursor:pointer;";
        tab.style.background = aba.id === abaAtiva ? "white" : "#ddd";

        const titulo = document.createElement("span");
        titulo.textContent = aba.tabNome || "Criar Paciente";
        titulo.addEventListener("click", () => trocarAba(aba.id));

        const fechar = document.createElement("span");
        fechar.textContent = "x";
        fechar.style.cursor = "pointer";
        fechar.addEventListener("click", (e) => { e.stopPropagation(); fecharAba(aba.id); });

        tab.appendChild(titulo);
        tab.appendChild(fechar);
        topBar.insertBefore(tab, plusBtn);
    });
}

function trocarAba(id) {
    if (abaAtiva !== null) salvarEstadoAba(abaAtiva);
    abaAtiva = id;
    document.getElementById("telaPerfil").style.display = "none";
    document.getElementById("telaCriar").style.display = "flex";
    carregarEstadoAba(id);
    renderTabs();
}

function irParaPerfil() {
    if (abaAtiva !== null) salvarEstadoAba(abaAtiva);
    abaAtiva = null;
    document.getElementById("telaCriar").style.display = "none";
    document.getElementById("telaPerfil").style.display = "block";
    renderTabs();
}

function abrirNovaAba() {
    if (abaAtiva !== null) salvarEstadoAba(abaAtiva);
    abaContador++;
    abas.push({
        id: abaContador,
        tabNome: "Criar Paciente",
        pacienteId: null,
        dados: { nome: "", data: "", cpf: "", sexo: "", responsavel: "" },
        observacoes: [],
        sintomas: {},
        historico: []
    });
    trocarAba(abaContador);
}

function abrirFicha(pacienteId) {
    const abaExistente = abas.find(a => a.pacienteId === pacienteId);
    if (abaExistente) { trocarAba(abaExistente.id); return; }

    const pac = pacientes.find(p => p.id === pacienteId);
    if (!pac) return;

    if (abaAtiva !== null) salvarEstadoAba(abaAtiva);
    abaContador++;
    abas.push({
        id: abaContador,
        tabNome: "Ficha " + pac.id,
        pacienteId: pacienteId,
        dados: { ...pac.dados },
        observacoes: pac.observacoes.map(o => ({ ...o })),
        sintomas: { ...pac.sintomas },
        historico: [...pac.historico]
    });
    trocarAba(abaContador);
}

function fecharAba(id) {
    abas = abas.filter(a => a.id !== id);
    if (abaAtiva === id) {
        if (abas.length > 0) trocarAba(abas[abas.length - 1].id);
        else {
            abaAtiva = null;
            document.getElementById("telaCriar").style.display = "none";
            document.getElementById("telaPerfil").style.display = "block";
        }
    }
    renderTabs();
}

function salvarEstadoAba(id) {
    const aba = abas.find(a => a.id === id);
    if (!aba) return;

    aba.dados = {
        nome:        document.getElementById("nomePaciente").value,
        data:        document.getElementById("dataNascimento").value,
        cpf:         document.getElementById("cpfPaciente").value,
        sexo:        document.getElementById("sexoPaciente").value,
        responsavel: document.getElementById("responsavelPaciente").value
    };

    aba.sintomas = {};
    document.querySelectorAll(".sintoma").forEach(s => {
        aba.sintomas[s.dataset.key] = s.classList.contains("selecionado");
    });

    aba.observacoes = obsAtual.map(o => ({ ...o }));

    if (aba.pacienteId !== null) {
        const pac = pacientes.find(p => p.id === aba.pacienteId);
        if (pac) {
            pac.dados = { ...aba.dados };
            pac.observacoes = aba.observacoes.map(o => ({ ...o }));
            pac.sintomas = { ...aba.sintomas };
            pac.historico = [...aba.historico];
            const card = document.querySelector(`.patient-card[data-pac-id="${aba.pacienteId}"]`);
            if (card) card.querySelector("b").textContent = aba.dados.nome || pac.nome;
        }
    }
}

function carregarEstadoAba(id) {
    const aba = abas.find(a => a.id === id);
    if (!aba) return;

    document.getElementById("nomePaciente").value        = aba.dados.nome        || "";
    document.getElementById("dataNascimento").value      = aba.dados.data        || "";
    document.getElementById("cpfPaciente").value         = aba.dados.cpf         || "";
    document.getElementById("sexoPaciente").value        = aba.dados.sexo        || "";
    document.getElementById("responsavelPaciente").value = aba.dados.responsavel || "";

    document.querySelectorAll(".sintoma").forEach(s => {
        s.classList.toggle("selecionado", !!aba.sintomas[s.dataset.key]);
    });

    obsAtual = aba.observacoes.map(o => ({ ...o }));
    obsSelecionada = null;

    renderObservacoes();
    renderHistorico(aba.historico);

    const resultadoBox = document.getElementById("resultadoBox");
    if (aba.historico && aba.historico.length > 0) {
        const ultimoCalculo = aba.historico[aba.historico.length - 1];
        renderResultado(ultimoCalculo.pontuacao, ultimoCalculo.limiarAmarelo, ultimoCalculo.limiarVermelho, ultimoCalculo.sex);
    } else {
        if (resultadoBox) resultadoBox.innerHTML = "";
    }
}

function calcularPontuacao() {
    const sexoRaw = document.getElementById("sexoPaciente").value.trim().toUpperCase();
    const sexo = sexoRaw === "F" ? "F" : "M";

    let pontuacao = 0;
    document.querySelectorAll(".sintoma.selecionado").forEach(s => {
        const peso = PESOS[s.dataset.key]?.[sexo];
        if (peso !== null && peso !== undefined) pontuacao += peso;
    });

    return {
        pontuacao: parseFloat(pontuacao.toFixed(2)),
        limiarAmarelo: LIMIAR_AMARELO[sexo],
        limiarVermelho: LIMIAR_VERMELHO[sexo],
        sexo
    };
}

function renderResultado(pontuacao, limiarAmarelo, limiarVermelho, sexo) {
    const box = document.getElementById("resultadoBox");
    const simbolo = sexo === 'M' ? '♂' : '♀';

    let cor, bg, msg;
    if (pontuacao >= limiarVermelho) {
        cor = "#c0392b"; bg = "#fdecea";
        msg = " Encaminhar imediatamente — mínima perda de casos (Probabilidade 95%)";
    } else if (pontuacao >= limiarAmarelo) {
        cor = "#d68910"; bg = "#fef9e7";
        msg = " Atenção — pontuação acima do limiar, considerar encaminhamento";
    } else {
        cor = "#27ae60"; bg = "#eafaf1";
        msg = " Abaixo do limiar — acompanhamento de rotina";
    }

    box.innerHTML = `
        <div style="border:2px solid ${cor}; border-radius:10px; padding:12px 16px; background:${bg};">
            <div style="font-size:16px; font-weight:bold; color:${cor};">${msg}</div>
            <div style="margin-top:8px; font-size:14px; color:#555;">
                Pontuação: <b>${pontuacao}</b>
                &nbsp;|&nbsp; Limiar amarelo (${simbolo}): <b>${limiarAmarelo}</b>
                &nbsp;|&nbsp; Limiar vermelho (${simbolo}): <b>${limiarVermelho}</b>
            </div>
        </div>
    `;
    document.getElementById("resultadoCalculo").style.display = "block";
}

function renderHistorico(historico) {
    const box = document.getElementById("historicoBox");
    const resultadoBox = document.getElementById("resultadoBox"); 

    if (!historico || historico.length === 0) {
        box.innerHTML = "<p style='color:#999; font-size:14px;'>Nenhum cálculo realizado ainda.</p>";
        if (resultadoBox) {
            resultadoBox.innerHTML = "";
        }
        document.getElementById("resultadoCalculo").style.display = "none";
        return;
    }

    document.getElementById("resultadoCalculo").style.display = "block";
    if (resultadoBox && resultadoBox.innerHTML !== "") {
    }

    box.innerHTML = historico.slice().reverse().map((h, i) => {
        const cor = h.pontuacao >= h.limiarVermelho ? "#c0392b"
                   : h.pontuacao >= h.limiarAmarelo ? "#d68910"
                   : "#27ae60";
        const delta = i < historico.length - 1
            ? (() => {
                const anterior = historico[historico.length - 1 - i - 1];
                const diff = parseFloat((h.pontuacao - anterior.pontuacao).toFixed(2));
                return diff > 0 ? `<span style="color:#c0392b"> (+${diff})</span>`
                     : diff < 0 ? `<span style="color:#27ae60"> (${diff})</span>`
                     : `<span style="color:#888"> (=)</span>`;
            })()
            : "";
        return `
            <div style="display:flex; justify-content:space-between; align-items:center;
                        background:#e8e8e8; border-radius:8px; padding:7px 12px; margin-bottom:5px; font-size:14px;">
                <span>${h.data}</span>
                <span style="font-weight:bold; color:${cor};">${h.pontuacao}${delta}</span>
                <span style="color:#777;">${h.pontuacao >= h.limiarVermelho ? ' Urgente' : h.pontuacao >= h.limiarAmarelo ? ' Atenção' : ' Rotina'}</span>
            </div>
        `;
    }).join("");
}

function registrarPaciente() {
    const aba = abas.find(a => a.id === abaAtiva);
    if (!aba) return;

    salvarEstadoAba(abaAtiva);

    const { pontuacao, limiarAmarelo, limiarVermelho, sexo } = calcularPontuacao();

    const entrada = { data: dataHoje(), pontuacao, limiarAmarelo, limiarVermelho, sexo };
    aba.historico.push(entrada);

    renderResultado(pontuacao, limiarAmarelo, limiarVermelho, sexo);
    renderHistorico(aba.historico);

    if (aba.pacienteId === null) {
        const nome = aba.dados.nome.trim() || "Nome paciente";
        const id = gerarId();

        aba.pacienteId = id;
        aba.tabNome = "Ficha " + id;

        const pac = {
            id,
            nome,
            data: dataHoje(),
            dados: { ...aba.dados },
            observacoes: aba.observacoes.map(o => ({ ...o })),
            sintomas: { ...aba.sintomas },
            historico: [entrada]
        };
        pacientes.push(pac);

        const lista = document.getElementById("listaPacientes");
        const placeholder = lista.querySelector(".patient-card:not([data-pac-id])");
        if (placeholder) placeholder.remove();

        const card = document.createElement("div");
        card.className = "patient-card";
        card.dataset.pacId = id;
        card.style.cursor = "pointer";
        card.innerHTML = `<span><b>${nome}</b> | ${id}</span><i>${dataHoje()}</i>`;
        card.addEventListener("click", () => abrirFicha(id));
        lista.appendChild(card);

        renderTabs();
    } else {
        const pac = pacientes.find(p => p.id === aba.pacienteId);
        if (pac) pac.historico = [...aba.historico];
    }
}

let obsAtual = [];
let obsSelecionada = null;

function renderObservacoes() {
    const container = document.querySelector(".observacoes");
    container.innerHTML = "";
    obsSelecionada = null;

    obsAtual.forEach((obs, i) => {
        const div = document.createElement("div");
        div.className = "obs" + (obs.aberta ? " aberta" : "");
        div.innerHTML = obs.aberta
            ? `<p>⌃ ${obs.titulo} &nbsp;|&nbsp; ${obs.data}</p><span>${obs.texto}</span>`
            : `<p>⌄ ${obs.titulo} &nbsp;|&nbsp; ${obs.data}</p>`;

        div.addEventListener("click", () => {
            document.querySelectorAll(".obs").forEach(o => o.style.outline = "");
            div.style.outline = "2px solid #777";
            obsAtual[i].aberta = !obsAtual[i].aberta;
            obsSelecionada = i;
            renderObservacoes();
            const divs = document.querySelectorAll(".obs");
            if (divs[i]) { divs[i].style.outline = "2px solid #777"; obsSelecionada = i; }
        });

        container.appendChild(div);
    });
}

document.querySelectorAll(".buttons button")[0].addEventListener("click", () => {
    const texto = prompt("Digite o texto da observação:");
    if (texto === null || texto.trim() === "") return;
    obsAtual.push({ titulo: "Observação", data: dataHoje(), texto, aberta: true });
    renderObservacoes();
    obsSelecionada = obsAtual.length - 1;
    document.querySelectorAll(".obs")[obsSelecionada].style.outline = "2px solid #777";
});

document.querySelectorAll(".buttons button")[1].addEventListener("click", () => {
    if (obsSelecionada === null) { alert("Selecione uma observação."); return; }
    const novoTexto = prompt("Editar:", obsAtual[obsSelecionada].texto);
    if (novoTexto === null) return;
    obsAtual[obsSelecionada].texto = novoTexto;
    renderObservacoes();
    if (document.querySelectorAll(".obs")[obsSelecionada])
        document.querySelectorAll(".obs")[obsSelecionada].style.outline = "2px solid #777";
});

document.querySelectorAll(".buttons button")[2].addEventListener("click", () => {
    if (obsSelecionada === null) { alert("Selecione uma observação."); return; }
    obsAtual.splice(obsSelecionada, 1);
    obsSelecionada = null;
    renderObservacoes();
});

document.querySelector(".patients-header input").addEventListener("input", function () {
    const termo = this.value.replace(/[^a-z0-9]/gi, "").toLowerCase();
    document.querySelectorAll(".patient-card").forEach(card => {
        if (termo === "") { card.style.display = ""; return; }

        const b = card.querySelector("b");
        const nome = b ? b.textContent.toLowerCase() : card.textContent.toLowerCase();
        const pacId = card.dataset.pacId;
        const pac = pacientes.find(p => p.id === pacId);
        const cpf = ((pac ? pac.dados.cpf : "") || card.dataset.cpf || "").replace(/[^0-9]/g, "");

        card.style.display = (nome.includes(termo) || cpf.includes(termo)) ? "" : "none";
    });
});

document.querySelectorAll(".sintoma").forEach(s => {
    s.addEventListener("click", () => s.classList.toggle("selecionado"));
});

document.querySelector(".tab:first-child").addEventListener("click", irParaPerfil);
document.querySelector(".plus-button").addEventListener("click", abrirNovaAba);
document.getElementById("tabCriar").style.display = "none";

window.addEventListener("load", () => {
    const nome = localStorage.getItem("medicoNome");
    const cargo = localStorage.getItem("medicoCargo");
    const email = localStorage.getItem("medicoEmail");

    if (nome) {
        document.querySelector(".profile h1").textContent = nome;
        document.querySelector(".tab:first-child").textContent = nome;
    }

    if (cargo) {
        document.querySelector(".profile p:nth-of-type(1)").textContent = cargo;
    }
});