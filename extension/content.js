// Content script para seleção de área da tela (Crop)

(function () {
  // Evitar injeções duplicadas e escutas repetidas
  if (window.hasSapieniaOverlayInitialized) {
    return;
  }
  window.hasSapieniaOverlayInitialized = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "INIT_OVERLAY") {
      createOverlay();
    }
  });

  function createOverlay() {
    // Remover overlay anterior se houver
    const existingContainer = document.getElementById("sapienia-crop-container");
    if (existingContainer) {
      existingContainer.remove();
    }

    // Criar container principal
    const container = document.createElement("div");
    container.id = "sapienia-crop-container";
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "2147483647", // Valor máximo para ficar acima de tudo
      cursor: "crosshair",
      userSelect: "none",
      webkitUserSelect: "none"
    });

    // Criar o canvas
    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%"
    });

    // Criar o indicador de ajuda ("Arraste para selecionar a questão")
    const helperText = document.createElement("div");
    helperText.innerText = "Arraste o cursor para selecionar a questão";
    Object.assign(helperText.style, {
      position: "absolute",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(10, 15, 30, 0.85)",
      color: "#ffffff",
      padding: "10px 20px",
      borderRadius: "30px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      pointerEvents: "none",
      opacity: "0",
      transition: "opacity 0.3s ease"
    });

    container.appendChild(canvas);
    container.appendChild(helperText);
    document.body.appendChild(container);

    // Mostrar o texto de ajuda com fade-in
    setTimeout(() => {
      helperText.style.opacity = "1";
    }, 50);

    const ctx = canvas.getContext("2d");
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    // Ajustar o tamanho interno do canvas de acordo com o devicePixelRatio
    const dpr = window.devicePixelRatio || 1;
    function resizeCanvas() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawMask();
    }

    // Desenhar a máscara escura semi-transparente
    function drawMask() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(10, 15, 30, 0.65)"; // Tom azul escuro semi-transparente premium
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mapear eventos de mouse
    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
      currentX = e.clientX;
      currentY = e.clientY;
      helperText.style.opacity = "0"; // Esconder texto de ajuda enquanto desenha
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isDrawing) return;
      currentX = e.clientX;
      currentY = e.clientY;
      drawSelection();
    });

    canvas.addEventListener("mouseup", (e) => {
      if (!isDrawing) return;
      isDrawing = false;
      finishSelection();
    });

    // Adicionar suporte a Esc para cancelar a seleção
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        cleanup();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    function drawSelection() {
      // Limpar e desenhar a máscara básica
      drawMask();

      // Calcular limites do retângulo
      const x = Math.min(startX, currentX) * dpr;
      const y = Math.min(startY, currentY) * dpr;
      const w = Math.abs(startX - currentX) * dpr;
      const h = Math.abs(startY - currentY) * dpr;

      // Recortar a área da seleção (deixando-a totalmente clara)
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(x, y, w, h);
      ctx.restore();

      // Desenhar uma borda premium com gradiente simulado
      ctx.strokeStyle = "#4f46e5"; // Indigo brilhante
      ctx.lineWidth = 2 * dpr;
      ctx.setLineDash([6 * dpr, 4 * dpr]); // Linha tracejada moderna
      ctx.strokeRect(x, y, w, h);
    }

    function finishSelection() {
      const x = Math.min(startX, currentX);
      const y = Math.min(startY, currentY);
      const w = Math.abs(startX - currentX);
      const h = Math.abs(startY - currentY);

      // Limpeza
      cleanup();

      // Se a seleção for muito pequena, ignora
      if (w < 10 || h < 10) {
        return;
      }

      // Enviar mensagem para a extensão contendo as coordenadas da seleção
      // Primeiro tiramos o print da tela inteira visível
      chrome.runtime.sendMessage({ action: "CAPTURE_VISIBLE" }, (response) => {
        if (response && response.success && response.dataUrl) {
          // Enviar imagem e coordenadas para o side panel
          chrome.runtime.sendMessage({
            action: "CROP_RESULT",
            dataUrl: response.dataUrl,
            coords: { x, y, w, h },
            dpr: dpr
          });
        } else {
          console.error("Erro na captura de tela:", response ? response.error : "Sem resposta.");
        }
      });
    }

    function cleanup() {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      container.remove();
    }
  }
})();
