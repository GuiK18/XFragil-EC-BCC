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

const LIMIAR_AMARELO  = { M: 0.56, F: 0.55 };
const LIMIAR_VERMELHO = { M: 0.73, F: 0.76 };

let pacienteAtivo  = null; 
let historico      = [];    
let obsAtual       = [];    
let obsSelecionada = null;  

function dataHoje() {
    return new Date().toLocaleDateString("pt-BR");
}

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

document.querySelectorAll(".sintoma").forEach(s => {
    s.addEventListener("click", () => s.classList.toggle("selecionado"));
});

function calcularPontuacao() {
    const sexoRaw = document.getElementById("sexoPaciente").value.trim().toUpperCase();
    const sexo    = sexoRaw === "F" ? "F" : "M";

    let pontuacao = 0;
    document.querySelectorAll(".sintoma.selecionado").forEach(s => {
        const peso = PESOS[s.dataset.key]?.[sexo];
        if (peso !== null && peso !== undefined) pontuacao += peso;
    });

    return {
        pontuacao:     parseFloat(pontuacao.toFixed(2)),
        limiarAmarelo: LIMIAR_AMARELO[sexo],
        limiarVermelho: LIMIAR_VERMELHO[sexo],
        sexo
    };
}

function renderResultado(pontuacao, limiarAmarelo, limiarVermelho, sexo) {
    const box    = document.getElementById("resultadoBox");
    const simbolo = sexo === "M" ? "♂" : "♀";

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

function renderHistorico(hist) {
    const box        = document.getElementById("historicoBox");
    const resultadoBox = document.getElementById("resultadoBox");

    if (!hist || hist.length === 0) {
        box.innerHTML = "<p style='color:#999; font-size:14px;'>Nenhum cálculo realizado ainda.</p>";
        if (resultadoBox) resultadoBox.innerHTML = "";
        document.getElementById("resultadoCalculo").style.display = "none";
        return;
    }

    document.getElementById("resultadoCalculo").style.display = "block";

    box.innerHTML = hist.slice().reverse().map((h, i) => {
        const cor = h.pontuacao >= h.limiarVermelho ? "#c0392b"
                  : h.pontuacao >= h.limiarAmarelo  ? "#d68910"
                  : "#27ae60";
        const delta = i < hist.length - 1
            ? (() => {
                const anterior = hist[hist.length - 1 - i - 1];
                const diff     = parseFloat((h.pontuacao - anterior.pontuacao).toFixed(2));
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
                <span style="color:#777;">${h.pontuacao >= h.limiarVermelho ? " Urgente" : h.pontuacao >= h.limiarAmarelo ? " Atenção" : " Rotina"}</span>
            </div>
        `;
    }).join("");
}

async function apenasCalcular() {
    const { pontuacao, limiarAmarelo, limiarVermelho, sexo } = calcularPontuacao();
    renderResultado(pontuacao, limiarAmarelo, limiarVermelho, sexo);
}

async function registrarPaciente() {
    const nome = document.getElementById("nomePaciente").value;
    const cpf  = document.getElementById("cpfPaciente").value;
    const sexo = document.getElementById("sexoPaciente").value;
    const data = document.getElementById("dataNascimento").value;

    if (!nome || !cpf || !sexo || !data) {
        alert("Por favor, preencha todos os campos obrigatórios (Nome, CPF, Sexo e Data de Nascimento).");
        return;
    }

    const sintomasAtual = {};
    document.querySelectorAll(".sintoma").forEach(s => {
        sintomasAtual[s.dataset.key] = s.classList.contains("selecionado");
    });

    const textoObservacoes = obsAtual.map(o => o.texto).join(" | ");

    const payload = {
        nome,
        cpf,
        sexo:        sexo.toUpperCase().trim(),
        nascimento:  data,
        responsavel: document.getElementById("responsavelPaciente").value,
        sintomas:    sintomasAtual,
        observacoes: textoObservacoes
    };

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:3000/pacientes", {
            method:  "POST",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const resultadoBD = await response.json();

        if (!response.ok) {
            throw new Error(resultadoBD.erro || "Falha ao registrar paciente no servidor.");
        }

        if (!pacienteAtivo) {
            pacienteAtivo = { id: resultadoBD.idPaciente, nome, dados: payload };
        } else {
            pacienteAtivo.id = resultadoBD.idPaciente;
        }

        document.getElementById("tabTitulo").textContent = `Ficha: ${nome}`;

        const { pontuacao, limiarAmarelo, limiarVermelho, sexo: s } = calcularPontuacao();
        historico.push({ data: dataHoje(), pontuacao, limiarAmarelo, limiarVermelho, sexo: s });
        renderResultado(pontuacao, limiarAmarelo, limiarVermelho, s);
        renderHistorico(historico);

        sessionStorage.removeItem("pacienteAtivo");

        const mensagensPorOperacao = {
            novo:       "✅ Paciente cadastrado e triagem salva com sucesso!",
            atualizado: "🔄 Triagem atualizada com sucesso!",
            vinculado:  "🔗 Paciente já existente. Você foi vinculado e a triagem foi registrada."
        };
        alert(mensagensPorOperacao[resultadoBD.operacao] ?? "✅ Operação realizada com sucesso!");

    } catch (erro) {
        alert("Erro na integração: " + erro.message);
    }
}

const NOMES_SINTOMAS = {
    deficiencia_intelectual:  "Deficiência intelectual",
    face_alongada:            "Face alongada/orelhas",
    macroorquidismo:          "Macroorquidismo",
    hipermobilidade:          "Hipermobilidade articular",
    dificuldade_aprendizagem: "Dificuldades de aprendizagem",
    deficit_atencao:          "Déficit de atenção",
    mov_repetitivos:          "Mov. repetitivos",
    atraso_fala:              "Atraso na fala",
    hiperatividade:           "Hiperatividade",
    evita_visual:             "Evita contato visual",
    evita_fisico:             "Evita contato físico",
    agressividade:            "Agressividade"
};

function exportarPDF() {
    const sintomasSelecionados = Array.from(document.querySelectorAll(".sintoma.selecionado"))
        .map(s => NOMES_SINTOMAS[s.dataset.key] || s.dataset.key);

    const ultimoPontuacao = historico.length > 0 ? historico[historico.length - 1] : null;

    gerarRelatorioPDF({
        nomePaciente:     document.getElementById("nomePaciente").value        || "Não informado",
        dataNascimento:   document.getElementById("dataNascimento").value       || "Não informado",
        cpf:              document.getElementById("cpfPaciente").value          || "Não informado",
        sexo:             document.getElementById("sexoPaciente").value         || "Não informado",
        responsavel:      document.getElementById("responsavelPaciente").value  || "Não informado",
        idPaciente:       pacienteAtivo?.id                                     || "Novo",
        nomeProfissional: localStorage.getItem("userNome")                      || "Não informado",
        idProfissional:   localStorage.getItem("userId")                        || "Não informado",
        dataRelatorio:    new Date().toLocaleDateString("pt-BR"),
        pontuacao:        ultimoPontuacao?.pontuacao,
        limiarAmarelo:    ultimoPontuacao?.limiarAmarelo,
        limiarVermelho:   ultimoPontuacao?.limiarVermelho,
        sintomasSelecionados,
        historico,
        observacoes: obsAtual
    });
}

document.getElementById("tabVoltar").addEventListener("click", () => {
    sessionStorage.removeItem("pacienteAtivo");
    const role = (localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || "").toUpperCase().trim();

    if (role === "ADM") {
        window.location.href = "adm.html"; 
    } else {
        window.location.href = "painel_medico.html"; 
    }
});


window.addEventListener("load", () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) { window.location.href = "login.html"; return; }

    const nomeProfissional = localStorage.getItem("userNome") || "Profissional";
    document.getElementById("tituloProfissional").textContent =
        `Profissional responsável: ${nomeProfissional}`;

    const dadosSessao = sessionStorage.getItem("pacienteAtivo");
    if (!dadosSessao) return; 

    pacienteAtivo = JSON.parse(dadosSessao);

    document.getElementById("nomePaciente").value        = pacienteAtivo.dados.nome        || "";
    document.getElementById("dataNascimento").value      = pacienteAtivo.dados.data        || "";
    document.getElementById("cpfPaciente").value         = String(pacienteAtivo.dados.cpf) || "";
    document.getElementById("sexoPaciente").value        = pacienteAtivo.dados.sexo        || "";
    document.getElementById("responsavelPaciente").value = pacienteAtivo.dados.responsavel || "";

    if (pacienteAtivo.sintomas) {
        document.querySelectorAll(".sintoma").forEach(s => {
            s.classList.toggle("selecionado", !!pacienteAtivo.sintomas[s.dataset.key]);
        });
    }

    if (pacienteAtivo.observacoes && pacienteAtivo.observacoes.length > 0) {
        obsAtual = pacienteAtivo.observacoes.map(o => ({ ...o }));
        renderObservacoes();
    }

    if (pacienteAtivo.historico && pacienteAtivo.historico.length > 0) {
        historico = [...pacienteAtivo.historico];
        const ultimo = historico[historico.length - 1];
        renderResultado(ultimo.pontuacao, ultimo.limiarAmarelo, ultimo.limiarVermelho, ultimo.sexo);
        renderHistorico(historico);
    }

    document.getElementById("tabTitulo").textContent =
        `Ficha: ${pacienteAtivo.nome || "Paciente"}`;
});