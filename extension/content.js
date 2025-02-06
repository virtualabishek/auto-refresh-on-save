let ws = null;
let enabled = true;
let port = 3000;

function connect() {
  if (!enabled) return;

  ws = new WebSocket(`ws://localhost:${port}`);

  ws.onmessage = (event) => {
    if (event.data === "reload") {
      window.location.reload();
    }
  };

  ws.onopen = () => {
    console.log("Auto Refresh connected");
  };

  ws.onerror = (error) => {
    console.log("Auto Refresh connection error:", error);
  };

  ws.onclose = () => {
    setTimeout(connect, 2000); // Reconnect after 2 seconds
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "toggleAutoRefresh":
      enabled = message.enabled;
      if (enabled) {
        connect();
      } else if (ws) {
        ws.close();
      }
      break;
    case "updatePort":
      port = message.port;
      if (ws) {
        ws.close(); // Will trigger reconnect with new port
      }
      break;
    case "getStatus":
      sendResponse({ connected: ws && ws.readyState === WebSocket.OPEN });
      break;
  }
});

// Initial connection
chrome.storage.sync.get(["enabled", "port"], (result) => {
  enabled = result.enabled ?? true;
  port = result.port ?? 3000;
  if (enabled) {
    connect();
  }
});
