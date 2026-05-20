// Background service worker for Chrome Extension

// Permitir que o painel lateral abra ao clicar no ícone da extensão
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Erro ao configurar comportamento do sidePanel:", error));

// Ouvir mensagens da extensão
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_CROP") {
    // 1. Obter a aba ativa
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || tabs.length === 0) {
        sendResponse({ success: false, error: "Nenhuma aba ativa encontrada." });
        return;
      }
      const activeTab = tabs[0];
      
      // Impedir injeção em páginas sem URL ou páginas internas do Chrome
      const url = activeTab.url || "";
      if (!url || url.startsWith("chrome://") || url.startsWith("chrome-extension://") || url.startsWith("about:")) {
        sendResponse({ success: false, error: "Não é possível capturar esta página. Navegue para um site normal e tente novamente." });
        return;
      }

      try {
        // 2. Injetar o script de crop se necessário
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ["content.js"]
        });

        // 3. Enviar mensagem para o content script iniciar o overlay
        chrome.tabs.sendMessage(activeTab.id, { action: "INIT_OVERLAY" });
        sendResponse({ success: true });
      } catch (err) {
        console.error("Erro ao injetar script de crop:", err);
        sendResponse({ success: false, error: "Falha ao iniciar ferramenta de seleção. Recarregue a página e tente novamente." });
      }
    });
    return true; // Mantém o canal de resposta aberto assincronamente
  }

  if (message.action === "CAPTURE_VISIBLE") {
    // Capturar a tela inteira visível na janela ativa
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Erro ao capturar tela:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, dataUrl: dataUrl });
      }
    });
    return true;
  }
});
