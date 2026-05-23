// Configuração da API do SaaS
const API_BASE_URL = "https://sapienia.calculadoraunivesp.com.br";

// Variáveis Globais de Estado
let userToken = "";
let lastResolution = "";

// ============================================================
// Inicialização após o DOM estar completamente carregado
// ============================================================
document.addEventListener("DOMContentLoaded", () => {

  // ---- Referências ao DOM ----
  const statusBadge        = document.getElementById("status-badge");
  const statusText         = document.getElementById("status-text");
  const setupView          = document.getElementById("setup-view");
  const workspaceView      = document.getElementById("workspace-view");
  const loadingView        = document.getElementById("loading-view");
  const resultView         = document.getElementById("result-view");
  const tokenInput         = document.getElementById("token-input");
  const saveTokenBtn       = document.getElementById("save-token-btn");
  const creditsCount       = document.getElementById("credits-count");
  const refreshCreditsBtn  = document.getElementById("refresh-credits-btn");
  const cropBtn            = document.getElementById("crop-btn");
  const textQuestionInput  = document.getElementById("text-question-input");
  const solveTextBtn       = document.getElementById("solve-text-btn");
  const disconnectBtn      = document.getElementById("disconnect-btn");
  const loadingTitle       = document.getElementById("loading-title");
  const loadingDesc        = document.getElementById("loading-desc");
  const backToWorkspaceBtn = document.getElementById("back-to-workspace-btn");
  const imagePreviewContainer   = document.getElementById("image-preview-container");
  const croppedPreviewImg       = document.getElementById("cropped-preview-img");
  const textPreviewContainer    = document.getElementById("text-preview-container");
  const questionTextPreview     = document.getElementById("question-text-preview");
  const resolutionContent       = document.getElementById("resolution-content");
  const copyResolutionBtn       = document.getElementById("copy-resolution-btn");
  const newSolveBtn             = document.getElementById("new-solve-btn");

  // ---- Utilitários de UI ----

  function showView(targetView) {
    [setupView, workspaceView, loadingView, resultView].forEach(view => {
      view.classList.remove("active");
    });
    targetView.classList.add("active");
  }

  function setConnectionStatus(connected) {
    if (connected) {
      statusBadge.classList.add("connected");
      statusText.innerText = "Conectado";
    } else {
      statusBadge.classList.remove("connected");
      statusText.innerText = "Desconectado";
    }
  }

  function showLoading(title, desc) {
    loadingTitle.innerText = title;
    loadingDesc.innerText = desc;
    showView(loadingView);
  }

  // ---- Validação de Token com a API ----

  async function validateAndConnect(token) {
    showLoading("Conectando...", "Verificando suas credenciais...");
    try {
      const response = await fetch(`${API_BASE_URL}/api/solve`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        userToken = token;
        await chrome.storage.local.set({ sapienia_token: token });
        creditsCount.innerText = `${data.credits} resoluções`;
        setConnectionStatus(true);
        showView(workspaceView);
      } else {
        alert(data.error || "Token inválido ou expirado. Verifique no painel do Sapienia.");
        setConnectionStatus(false);
        showView(setupView);
      }
    } catch (error) {
      console.error("Erro ao validar token:", error);
      alert("Não foi possível conectar ao servidor. Verifique sua conexão de rede.");
      setConnectionStatus(false);
      showView(setupView);
    }
  }

  // ---- Carregar Token Salvo na Inicialização ----

  chrome.storage.local.get(["sapienia_token"], (result) => {
    if (result.sapienia_token) {
      userToken = result.sapienia_token;
      tokenInput.value = userToken;
      validateAndConnect(userToken);
    } else {
      showView(setupView);
    }
  });

  // ---- Event Listeners ----

  // Botão "Conectar Conta"
  saveTokenBtn.addEventListener("click", () => {
    const token = tokenInput.value.trim();
    if (!token) {
      alert("Por favor, cole seu token de acesso.");
      return;
    }
    validateAndConnect(token);
  });

  // Botão "Meu Painel" — abre o dashboard em nova aba
  const openDashboardBtn = document.getElementById("open-dashboard-btn");
  openDashboardBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: `${API_BASE_URL}/dashboard` });
  });

  // Botão "Desconectar Conta"
  disconnectBtn.addEventListener("click", () => {
    if (confirm("Deseja realmente desconectar sua conta?")) {
      chrome.storage.local.remove(["sapienia_token"], () => {
        userToken = "";
        tokenInput.value = "";
        setConnectionStatus(false);
        showView(setupView);
      });
    }
  });

  // Botão "Atualizar Créditos"
  refreshCreditsBtn.addEventListener("click", async () => {
    if (!userToken) return;
    refreshCreditsBtn.innerText = "⏳";
    try {
      const response = await fetch(`${API_BASE_URL}/api/solve`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        creditsCount.innerText = `${data.credits} resoluções`;
      }
    } catch (error) {
      console.error("Erro ao atualizar créditos:", error);
    } finally {
      refreshCreditsBtn.innerText = "🔄";
    }
  });

  // Botão "Selecionar Questão" (Crop)
  cropBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "START_CROP" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Erro ao enviar mensagem:", chrome.runtime.lastError.message);
        return;
      }
      if (response && !response.success) {
        alert(response.error);
      }
    });
  });

  // Botão "Resolver Texto"
  solveTextBtn.addEventListener("click", () => {
    const text = textQuestionInput.value.trim();
    if (!text) {
      alert("Por favor, digite o enunciado da questão.");
      return;
    }
    questionTextPreview.innerText = text;
    textPreviewContainer.classList.remove("hidden");
    imagePreviewContainer.classList.add("hidden");
    sendToSolveAPI({ text });
  });

  // Botões de volta / nova questão
  backToWorkspaceBtn.addEventListener("click", () => showView(workspaceView));
  newSolveBtn.addEventListener("click", () => showView(workspaceView));

  // Botão "Copiar Resolução"
  copyResolutionBtn.addEventListener("click", () => {
    if (!lastResolution) return;
    navigator.clipboard.writeText(lastResolution)
      .then(() => {
        copyResolutionBtn.innerText = "✓ Copiado!";
        setTimeout(() => {
          copyResolutionBtn.innerText = "📋 Copiar Resolução";
        }, 2000);
      })
      .catch(err => console.error("Erro ao copiar:", err));
  });

  // ---- Ouvir Mensagem de Resultado do Crop ----
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "CROP_RESULT") {
      processCroppedImage(message.dataUrl, message.coords, message.dpr);
    }
  });

  // ---- Processamento de Imagem Recortada ----

  function processCroppedImage(dataUrl, coords, dpr) {
    showLoading("Processando Recorte", "Preparando imagem para envio...");
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = coords.w;
      canvas.height = coords.h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        coords.x * dpr, coords.y * dpr,
        coords.w * dpr, coords.h * dpr,
        0, 0,
        coords.w, coords.h
      );
      const croppedBase64 = canvas.toDataURL("image/png");
      croppedPreviewImg.src = croppedBase64;
      imagePreviewContainer.classList.remove("hidden");
      textPreviewContainer.classList.add("hidden");
      sendToSolveAPI({ image: croppedBase64 });
    };
    img.onerror = (err) => {
      console.error("Erro ao carregar imagem:", err);
      alert("Falha ao processar captura de tela.");
      showView(workspaceView);
    };
  }

  // ---- Envio para a API de Resolução ----

  async function sendToSolveAPI(payload) {
    showLoading("Resolvendo Questão", "A Inteligência Artificial está analisando o problema...");
    try {
      const response = await fetch(`${API_BASE_URL}/api/solve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        lastResolution = data.resolution;
        resolutionContent.innerHTML = parseMarkdownToHtml(data.resolution);
        creditsCount.innerText = `${data.credits} resoluções`;
        textQuestionInput.value = "";
        showView(resultView);
      } else {
        alert(data.error || "Ocorreu um erro ao resolver a questão.");
        showView(workspaceView);
      }
    } catch (error) {
      console.error("Erro na requisição Solve:", error);
      alert("Erro de comunicação com o servidor. Tente novamente.");
      showView(workspaceView);
    }
  }

  // ---- Parser de Markdown Seguro (Anti-XSS) ----

  function parseMarkdownToHtml(md) {
    if (!md) return "";

    // Escapar HTML existente para evitar XSS
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks (``` ```)
    html = html.replace(/```([\s\S]+?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);

    // Inline code (` `)
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bold
    html = html.replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/__([\s\S]+?)__/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*([^\n*]+?)\*/g, "<em>$1</em>");
    html = html.replace(/_([^\n_]+?)_/g, "<em>$1</em>");

    // Blockquotes
    html = html.replace(/^\s*&gt;\s*(.+)$/gm, "<blockquote>$1</blockquote>");

    // Headers
    html = html.replace(/^\s*###\s+(.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^\s*##\s+(.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^\s*#\s+(.+)$/gm, "<h1>$1</h1>");

    // Bullet lists
    html = html.replace(/^\s*[-*]\s+(.+)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>[\s\S]+?<\/li>)/g, "<ul>$1</ul>");
    html = html.replace(/<\/ul>\s*<ul>/g, "");

    // Numbered lists
    html = html.replace(/^\s*\d+\.\s+(.+)$/gm, "<li-num>$1</li-num>");
    html = html.replace(/(<li-num>[\s\S]+?<\/li-num>)/g, "<ol>$1</ol>");
    html = html.replace(/<\/ol>\s*<ol>/g, "");
    html = html.replace(/<li-num>/g, "<li>").replace(/<\/li-num>/g, "</li>");

    // Parágrafos
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs.map(p => {
      p = p.trim();
      if (!p) return "";
      if (p.startsWith("<h") || p.startsWith("<pre") || p.startsWith("<ul") || p.startsWith("<ol") || p.startsWith("<blockquote")) {
        return p;
      }
      return `<p>${p.replace(/\n/g, "<br>")}</p>`;
    }).join("");

    return html;
  }

}); // fim do DOMContentLoaded
