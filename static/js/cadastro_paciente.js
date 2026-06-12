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
    const resultadoBox = document.getElementById("resultadoBox"); // Captura a caixa do resultado atual

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

// Substitua a função registrarPaciente antiga por esta:
async function registrarPaciente() {
    const aba = abas.find(a => a.id === abaAtiva);
    if (!aba) return;

    salvarEstadoAba(abaAtiva);

    // Validações básicas antes de enviar ao servidor
    if (!aba.dados.nome || !aba.dados.cpf || !aba.dados.sexo || !aba.dados.data) {
        alert("Por favor, preencha todos os campos obrigatórios (Nome, CPF, Sexo e Data de Nascimento).");
        return;
    }

    // Coleta as observações em formato texto simples
    const textoObservacoes = aba.observacoes.map(o => o.texto).join(" | ");

    // Payload estruturado correspondente ao que o Backend espera
    const payload = {
        nome: aba.dados.nome,
        cpf: aba.dados.cpf,
        sexo: aba.dados.sexo.toUpperCase().trim(),
        nascimento: aba.dados.data,
        responsavel: aba.dados.responsavel,
        sintomas: aba.sintomas,
        observacoes: textoObservacoes
    };

    // Recupera o token JWT que foi salvo no momento do login (ajuste a chave se necessário)
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:3000/pacientes", { // Certifique-se de usar a URL/Porta correta do seu servidor Node
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const resultadoBD = await response.json();

        if (!response.ok) {
            throw new Error(resultadoBD.erro || "Falha ao registrar paciente no servidor.");
        }

        // Calcula localmente apenas para renderizar a resposta visual da aba de imediato
        const { pontuacao, limiarAmarelo, limiarVermelho, sexo } = calcularPontuacao();
        const entrada = { data: dataHoje(), pontuacao, limiarAmarelo, limiarVermelho, sexo };
        
        aba.historico.push(entrada);
        renderResultado(pontuacao, limiarAmarelo, limiarVermelho, sexo);
        renderHistorico(aba.historico);

        // Atualiza o estado da aba com o ID real retornado do MySQL
        aba.pacienteId = resultadoBD.idPaciente;
        aba.tabNome = "Ficha " + resultadoBD.idPaciente;

        alert("Paciente e Triagem salvos com sucesso no Banco de Dados!");
        
        // Recarrega a lista de pacientes do painel principal
        carregarMeusPacientes();
        renderTabs();

    } catch (erro) {
        alert("Erro na integração: " + erro.message);
    }
}

// Adicione esta nova função para renderizar dinamicamente os dados vindos do MySQL
async function carregarMeusPacientes() {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const lista = document.getElementById("listaPacientes");
    
    try {
        const response = await fetch("http://localhost:3000/pacientes/meus", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) return;

        const dadosPacientes = await response.json();
        pacientes = dadosPacientes.map(p => {
            // Conversão de data SQL para formato BR
            const dataFormatada = new Date(p.Nascimento).toLocaleDateString("pt-BR");
            // Formata o score vindo do banco de volta para decimal (ex: 56 vira 0.56)
            const scoreDecimal = p.Score ? (p.Score / 100).toFixed(2) : 0;

            return {
                id: p.IDPaciente,
                nome: p.NomePaciente,
                dados: { nome: p.NomePaciente, data: p.Nascimento.split('T')[0], cpf: p.CPF, sexo: p.Sexo, responsavel: p.Responsavel || "" },
                observacoes: p.Observacoes ? [{ titulo: "Histórico Clínico", data: dataHoje(), texto: p.Observacoes, aberta: false }] : [],
                sintomas: {},
                historico: p.Score ? [{ data: dataHoje(), pontuacao: parseFloat(scoreDecimal), limiarAmarelo: p.Sexo === 'M' ? 0.56 : 0.55, limiarVermelho: p.Sexo === 'M' ? 0.73 : 0.76, sexo: p.Sexo }] : []
            };
        });

        // Renderiza no HTML os cards reais vindos do banco
        lista.innerHTML = "";
        if (pacientes.length === 0) {
            lista.innerHTML = `<div class="patient-card"><span>Nenhum paciente vinculado.</span></div>`;
            return;
        }

        pacientes.forEach(pac => {
            const card = document.createElement("div");
            card.className = "patient-card";
            card.dataset.pacId = pac.id;
            card.style.cursor = "pointer";
            
            const scoreExibicao = pac.historico.length > 0 ? `Último Score: ${pac.historico[0].pontuacao}` : "Sem triagem";
            card.innerHTML = `<span><b>${pac.nome}</b> | ID: ${pac.id}</span><i>${scoreExibicao}</i>`;
            card.addEventListener("click", () => abrirFicha(pac.id));
            lista.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao listar pacientes do banco:", erro);
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
    const termo = this.value.toLowerCase();
    document.querySelectorAll(".patient-card").forEach(card => {
        const nome = card.querySelector("b").textContent.toLowerCase();
        card.style.display = nome.includes(termo) ? "" : "none";
    });
});

document.querySelectorAll(".sintoma").forEach(s => {
    s.addEventListener("click", () => s.classList.toggle("selecionado"));
});

document.querySelector(".tab:first-child").addEventListener("click", irParaPerfil);
document.querySelector(".plus-button").addEventListener("click", abrirNovaAba);
document.getElementById("tabCriar").style.display = "none";

// Altere o escopo do window.onload para disparar a busca dos pacientes assim que a tela abrir
window.addEventListener("load", () => {
    carregarMeusPacientes();
    
    const nome = localStorage.getItem("medicoNome");
    const cargo = localStorage.getItem("medicoCargo");

    if (nome) {
        document.querySelector(".profile h1").textContent = nome;
        document.querySelector(".tab:first-child").textContent = nome;
    }
    if (cargo) {
        document.querySelector(".profile p:nth-of-type(1)").textContent = cargo;
    }
});