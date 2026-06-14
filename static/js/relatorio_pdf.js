const LOGO_IBK = "data:image/png;base64,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";

function gerarRelatorioPDF(dados) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const azulEscuro = [69, 85, 149];
    const azulMedio  = [120, 136, 201];
    const azulClaro  = [200, 209, 242];
    const branco     = [255, 255, 255];
    const preto      = [30, 30, 30];

    const W = 210;
    const margem = 18;
    let y = 0;

    function cabecalho() {
        doc.setFillColor(...azulEscuro);
        doc.rect(0, 0, W, 36, "F");
        doc.setFillColor(...azulMedio);
        doc.rect(0, 36, W, 4, "F");

        doc.addImage(LOGO_IBK, "PNG", margem, 4, 38, 28);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...branco);
        doc.text("R. Fernando Simas, 172 - Bigorrilho, Curitiba - PR, 80430-190", margem + 42, 16);
        doc.text("Tel: (41) 3156-0309 ou (41) 99103-4847", margem + 42, 22);
        doc.text("contato@institutobukokaesemodel.org.br", margem + 42, 28);

        y = 50;
    }

    function rodape() {
        const totalPag = doc.getNumberOfPages();
        const dataAtual = new Date().toLocaleDateString("pt-BR");
        for (let i = 1; i <= totalPag; i++) {
            doc.setPage(i);
            doc.setFillColor(...azulEscuro);
            doc.rect(0, 283, W, 14, "F");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(...branco);
            doc.text("Instituto Buko Kaesemodel  |  contato@institutobukokaesemodel.org.br  |  (41) 3156-0309 ou (41) 99103-4847", margem, 289);
            doc.text("Data de emissão: " + dataAtual + "   |   Página " + i + " de " + totalPag, W - margem, 294, { align: "right" });
        }
    }

    function cabecalhoContinuacao() {
        doc.setFillColor(...azulEscuro);
        doc.rect(0, 0, W, 12, "F");
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(...branco);
        doc.text("Instituto Buko Kaesemodel — continuação", margem, 8);
        y = 20;
    }

    function secaoTitulo(titulo) {
        if (y > 255) { doc.addPage(); cabecalhoContinuacao(); }
        doc.setFillColor(...azulMedio);
        doc.rect(margem, y, W - margem * 2, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...branco);
        doc.text(titulo, margem + 3, y + 5);
        y += 11;
    }

    function linhaInfo(label, valor) {
        if (y > 265) { doc.addPage(); cabecalhoContinuacao(); }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...azulEscuro);
        doc.text(label + ":", margem, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...preto);
        doc.text(String(valor || "—"), margem + 38, y);
        y += 6;
    }

    function blocoTexto(texto) {
        if (!texto) return;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...preto);
        const linhas = doc.splitTextToSize(String(texto), W - margem * 2 - 6);
        linhas.forEach(linha => {
            if (y > 265) { doc.addPage(); cabecalhoContinuacao(); }
            doc.text(linha, margem + 3, y);
            y += 5;
        });
        y += 2;
    }

    function observacaoBloco(obs) {
        if (y > 255) { doc.addPage(); cabecalhoContinuacao(); }

        const titulo = (obs.titulo || "Observação") + "  —  " + (obs.data || "");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);

        const linhas = doc.splitTextToSize(String(obs.texto || ""), W - margem * 2 - 6);

        const alturaTitulo = 6;
        const alturaTexto = linhas.length * 5;
        const alturaTotal = alturaTitulo + alturaTexto + 4;

        doc.setFillColor(...azulClaro);
        doc.rect(margem, y, W - margem * 2, alturaTotal, "F");

        doc.setTextColor(...azulEscuro);
        doc.text(titulo, margem + 3, y + 4);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...preto);

        let yTexto = y + 8;
        linhas.forEach(linha => {
            doc.text(linha, margem + 3, yTexto);
            yTexto += 5;
        });

        y += alturaTotal + 4;
    }

    function cabecalhoHistorico() {
        doc.setFillColor(...azulClaro);
        doc.rect(margem, y, W - margem * 2, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...azulEscuro);
        doc.text("Data", margem + 3, y + 5);
        doc.text("Pontuação", margem + 45, y + 5);
        doc.text("Resultado", margem + 80, y + 5);
        y += 7;
    }

    function historicoBloco(h, i) {
        const alturaLinha = 7;

        if (y + alturaLinha > 270) {
            doc.addPage();
            cabecalhoContinuacao();
            cabecalhoHistorico();
        }

        if (i % 2 === 0) {
            doc.setFillColor(240, 242, 250);
            doc.rect(margem, y, W - margem * 2, alturaLinha, "F");
        }

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...preto);

        doc.text(String(h.data || ""), margem + 3, y + 4);
        doc.text(String(h.pontuacao ?? ""), margem + 45, y + 4);

        const pontuacao = Number(h.pontuacao) || 0;
        const limiarVermelho = Number(h.limiarVermelho) || 999;
        const limiarAmarelo  = Number(h.limiarAmarelo) || 999;

        const res = pontuacao >= limiarVermelho ? "Encaminhar (urgente)"
                : pontuacao >= limiarAmarelo  ? "Atenção"
                : "Rotina";

        doc.text(res, margem + 80, y + 4);

        y += alturaLinha;
    }

    function caixaResultado(pontuacao, limiarAmarelo, limiarVermelho, sexo) {
        if (y > 255) { doc.addPage(); cabecalhoContinuacao(); }
        const simbolo = sexo === "F" ? "F" : "M";
        let cor, msg;
        if (pontuacao >= limiarVermelho) {
            cor = [192, 57, 43];
            msg = "ENCAMINHAR — minima perda de casos (sensibilidade 95%)";
        } else if (pontuacao >= limiarAmarelo) {
            cor = [180, 120, 10];
            msg = "ATENCAO — pontuacao acima do limiar, considerar encaminhamento";
        } else {
            cor = [39, 174, 96];
            msg = "ABAIXO DO LIMIAR — acompanhamento de rotina";
        }
        doc.setFillColor(...cor);
        doc.rect(margem, y, W - margem * 2, 14, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...branco);
        doc.text(msg, margem + 4, y + 6);
        doc.setFontSize(8);
        doc.text(
            "Pontuacao: " + pontuacao +
            "   |   Limiar amarelo (" + simbolo + "): " + limiarAmarelo +
            "   |   Limiar vermelho (" + simbolo + "): " + limiarVermelho,
            margem + 4, y + 11
        );
        y += 18;
    }

    cabecalho();

    secaoTitulo("IDENTIFICAÇÃO DO PACIENTE");
    linhaInfo("Nome", dados.nomePaciente);
    linhaInfo("Data de nascimento", dados.dataNascimento);
    linhaInfo("CPF", dados.cpf);
    linhaInfo("Sexo", dados.sexo);
    linhaInfo("Responsável", dados.responsavel);
    linhaInfo("ID do paciente", dados.idPaciente);
    y += 4;

    secaoTitulo("SCORE DE TRIAGEM");
    if (dados.pontuacao !== undefined) {
        caixaResultado(dados.pontuacao, dados.limiarAmarelo, dados.limiarVermelho, dados.sexo);
    } else {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("Nenhum cálculo salvo para este paciente.", margem + 3, y);
        y += 8;
    }

    secaoTitulo("PROFISSIONAL RESPONSÁVEL");
    linhaInfo("Nome", dados.nomeProfissional);
    linhaInfo("ID da conta", dados.idProfissional);
    linhaInfo("Data do relatório", dados.dataRelatorio || new Date().toLocaleDateString("pt-BR"));
    y += 4;

    if (dados.sintomasSelecionados && dados.sintomasSelecionados.length > 0) {
        secaoTitulo("SINTOMAS PRESENTES");
        dados.sintomasSelecionados.forEach(s => {
            if (y > 265) { doc.addPage(); cabecalhoContinuacao(); }
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...preto);
            doc.text("• " + s, margem + 4, y);
            y += 5;
        });
        y += 3;
    }

    if (dados.historico && dados.historico.length > 0) {
        secaoTitulo("HISTÓRICO DE PONTUAÇÕES");
        cabecalhoHistorico();
        dados.historico.forEach((h, i) => {
            historicoBloco(h, i);
        });
        y += 4;
    }

    if (dados.observacoes && dados.observacoes.length > 0) {
        secaoTitulo("OBSERVAÇÕES CLÍNICAS");
        dados.observacoes.forEach(obs => {
            observacaoBloco(obs);
        });
    }

    rodape();

    const nomeArquivo = "relatorio_" + (dados.nomePaciente || "paciente").replace(/\s+/g, "_") + ".pdf";
    doc.save(nomeArquivo);
}