
/* =========================================================
   TEMPUS ZERO — Interações da página
   Projeto conceitual | 2026
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  inicializarMenu();
  inicializarExperiencia();
  inicializarRelogio();
  inicializarDialogoColecao();
  inicializarFormulario();
});

/* 1. Menu responsivo */
function inicializarMenu() {
  const botaoMenu = document.querySelector("#menuToggle");
  const navegacao = document.querySelector("#mainNav");

  if (!botaoMenu || !navegacao) return;

  function definirMenu(aberto) {
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu"
    );

    navegacao.classList.toggle("is-open", aberto);
    document.body.classList.toggle("menu-open", aberto);
  }

  botaoMenu.addEventListener("click", () => {
    definirMenu(
      botaoMenu.getAttribute("aria-expanded") !== "true"
    );
  });

  navegacao.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => definirMenu(false));
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") definirMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 761px)").matches) {
      definirMenu(false);
    }
  });
}

/* 2. Experiência: capture exatamente um segundo */
function inicializarExperiencia() {
  const numero = document.querySelector("#experimentNumber");
  const mensagem = document.querySelector("#experimentMessage");
  const display = document.querySelector("#experimentDisplay");
  const botaoIniciar = document.querySelector("#startExperiment");
  const botaoCapturar = document.querySelector("#stopExperiment");
  const status = document.querySelector(".experiment-status");

  if (!numero || !mensagem || !botaoIniciar || !botaoCapturar) {
    return;
  }

  let instanteInicial = 0;
  let quadroAnimacao = null;
  let executando = false;

  function atualizarStatus(texto) {
    if (!status) return;

    const ponto = status.querySelector(".status-dot");
    status.textContent = "";

    if (ponto) status.appendChild(ponto);
    status.append(` ${texto}`);
  }

  function atualizarContador() {
    if (!executando) return;

    const decorrido = (performance.now() - instanteInicial) / 1000;
    numero.textContent = decorrido.toFixed(2);

    quadroAnimacao = requestAnimationFrame(atualizarContador);
  }

  function iniciar() {
    if (executando) return;

    executando = true;
    instanteInicial = performance.now();

    numero.textContent = "00.00";
    mensagem.textContent =
      "O contador está em andamento. Pressione “Capturar instante” quando achar que passou exatamente um segundo.";

    atualizarStatus("EM ANDAMENTO");

    botaoIniciar.disabled = true;
    botaoIniciar.textContent = "Experiência em andamento";
    botaoCapturar.disabled = false;

    display?.classList.remove("is-success", "is-result");
    display?.classList.add("is-running");

    quadroAnimacao = requestAnimationFrame(atualizarContador);
  }

  function capturar() {
    if (!executando) return;

    const tempoDecorrido =
      (performance.now() - instanteInicial) / 1000;

    executando = false;

    if (quadroAnimacao !== null) {
      cancelAnimationFrame(quadroAnimacao);
    }

    quadroAnimacao = null;

    const diferenca = Math.abs(tempoDecorrido - 1);
    const diferencaMs = Math.round(diferenca * 1000);
    const acertou = diferenca <= 0.05;

    numero.textContent = tempoDecorrido.toFixed(2);

    botaoIniciar.disabled = false;
    botaoIniciar.textContent = "Tentar novamente";
    botaoCapturar.disabled = true;

    display?.classList.remove("is-running");
    display?.classList.toggle("is-success", acertou);
    display?.classList.toggle("is-result", !acertou);

    if (acertou) {
      atualizarStatus("INSTANTE CAPTURADO");

      mensagem.textContent =
        `Impressionante! Você ficou a ${diferencaMs} ms do segundo exato. ` +
        "Tente novamente para superar sua precisão.";
    } else if (tempoDecorrido < 1) {
      atualizarStatus("ANTES DO INSTANTE");

      mensagem.textContent =
        `Você capturou cedo demais: ${tempoDecorrido.toFixed(2)} s. ` +
        `Faltaram ${diferencaMs} ms para completar um segundo. Tente novamente.`;
    } else {
      atualizarStatus("INSTANTE ULTRAPASSADO");

      mensagem.textContent =
        `O instante escapou por ${diferencaMs} ms. ` +
        `Você registrou ${tempoDecorrido.toFixed(2)} s. ` +
        "Tente novamente e desafie sua percepção do tempo.";
    }
  }

  botaoIniciar.addEventListener("click", iniciar);
  botaoCapturar.addEventListener("click", capturar);
}

/* 3. Ponteiros do relógio ilustrativo */
function inicializarRelogio() {
  const hora = document.querySelector(".watch-hand-hour");
  const minuto = document.querySelector(".watch-hand-minute");
  const segundo = document.querySelector(".watch-hand-second");

  if (!hora || !minuto || !segundo) return;

  const movimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function atualizar() {
    const agora = new Date();

    const segundos =
      agora.getSeconds() + agora.getMilliseconds() / 1000;

    const minutos = agora.getMinutes() + segundos / 60;
    const horas = (agora.getHours() % 12) + minutos / 60;

    segundo.style.transform = `rotate(${segundos * 6}deg)`;
    minuto.style.transform = `rotate(${minutos * 6}deg)`;
    hora.style.transform = `rotate(${horas * 30}deg)`;
  }

  atualizar();

  if (!movimentoReduzido) {
    window.setInterval(atualizar, 100);
  }
}

/* 4. Janela com detalhes das peças */
function inicializarDialogoColecao() {
  const dialogo = document.querySelector("#productDialog");
  const botaoFechar = document.querySelector("#dialogClose");
  const titulo = document.querySelector("#dialogTitle");
  const indice = document.querySelector("#dialogIndex");
  const descricao = document.querySelector("#dialogDescription");

  if (!dialogo || !titulo || !indice || !descricao) return;

  const produtos = {
    "lost-minute": {
      indice: "PEÇA CONCEITUAL Nº 002 · TZ-002",
      titulo: "The Lost Minute",
      descricao:
        "Uma peça sobre os minutos que passam sem pedir licença. " +
        "The Lost Minute transforma a distração cotidiana em uma reflexão " +
        "sobre presença, memória e tudo aquilo que percebemos tarde demais."
    },

    "still-hour": {
      indice: "PEÇA CONCEITUAL Nº 003 · TZ-003",
      titulo: "The Still Hour",
      descricao:
        "Uma interpretação impossível de uma hora imóvel. " +
        "The Still Hour convida você a imaginar como seria observar " +
        "o mundo sem a pressão de estar sempre avançando."
    },

    "first-moment": {
      indice: "PEÇA CONCEITUAL Nº 004 · TZ-004",
      titulo: "The First Moment",
      descricao:
        "O início guardado antes de se tornar lembrança. " +
        "The First Moment celebra a expectativa de um novo começo " +
        "e a vontade de prolongar aquilo que ainda está por acontecer."
    }
  };

  document.querySelectorAll(".product-detail-trigger").forEach((botao) => {
    botao.addEventListener("click", () => {
      const produto = produtos[botao.dataset.product];

      if (!produto) return;

      indice.textContent = produto.indice;
      titulo.textContent = produto.titulo;
      descricao.textContent = produto.descricao;

      if (typeof dialogo.showModal === "function") {
        if (!dialogo.open) dialogo.showModal();
      } else {
        dialogo.setAttribute("open", "");
      }
    });
  });

  function fechar() {
    if (typeof dialogo.close === "function" && dialogo.open) {
      dialogo.close();
    } else {
      dialogo.removeAttribute("open");
    }
  }

  botaoFechar?.addEventListener("click", fechar);

  dialogo.addEventListener("click", (evento) => {
    if (evento.target === dialogo) fechar();
  });
}

/* 5. Formulário demonstrativo: não envia dados ao servidor */
function inicializarFormulario() {
  const formulario = document.querySelector("#acquisitionForm");
  const feedback = document.querySelector("#formFeedback");
  const campoNome = document.querySelector("#visitorName");
  const campoEmail = document.querySelector("#visitorEmail");
  const campoInteresse = document.querySelector("#visitorInterest");

  if (
    !formulario ||
    !feedback ||
    !campoNome ||
    !campoEmail ||
    !campoInteresse
  ) {
    return;
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    feedback.textContent = "";
    feedback.removeAttribute("data-state");

    if (!formulario.checkValidity()) {
      formulario.reportValidity();

      feedback.textContent =
        "Confira os campos obrigatórios antes de continuar.";

      feedback.dataset.state = "error";
      return;
    }

    const nome = campoNome.value.trim();

    if (nome.length < 2) {
      campoNome.setCustomValidity(
        "Digite um nome com pelo menos 2 caracteres."
      );

      campoNome.reportValidity();
      campoNome.setCustomValidity("");
      return;
    }

    const primeiroNome = nome.split(/\s+/)[0];

    feedback.textContent =
      `Obrigado, ${primeiroNome}! Sua solicitação foi registrada ` +
      "apenas nesta demonstração. Nenhum dado foi enviado ou armazenado.";

    feedback.dataset.state = "success";
    formulario.reset();
  });
}

/* 6. Navegação para o início da página */
function inicializarRetornoAoInicio() {
  const linksInicio = document.querySelectorAll('a[href="#inicio"]');

  linksInicio.forEach((link) => {
    link.addEventListener("click", (evento) => {
      evento.preventDefault();

      const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Vai diretamente ao topo, sem depender da posição do cabeçalho.
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: movimentoReduzido ? "auto" : "smooth"
      });

      // Mantém o endereço sincronizado com o início da página.
      if (window.location.hash !== "#inicio") {
        history.replaceState(null, "", "#inicio");
      }

      // Fecha o menu mobile após clicar na logo ou no link de retorno.
      const botaoMenu = document.querySelector("#menuToggle");
      const navegacao = document.querySelector("#mainNav");

      if (botaoMenu && navegacao) {
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
        navegacao.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", inicializarRetornoAoInicio);
