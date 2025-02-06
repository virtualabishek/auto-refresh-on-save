const enabledCheckbox = document.getElementById("enabled");
const portInput = document.getElementById("port");
const statusIndicator = document.getElementById("statusIndicator");
const statusText = document.getElementById("statusText");

// Load saved settings
chrome.storage.sync.get(["enabled", "port"], (result) => {
  enabledCheckbox.checked = result.enabled ?? true;
  portInput.value = result.port ?? 3000;
});

// Save settings when changed
enabledCheckbox.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabledCheckbox.checked });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "toggleAutoRefresh",
      enabled: enabledCheckbox.checked,
    });
  });
});

portInput.addEventListener("change", () => {
  chrome.storage.sync.set({ port: portInput.value });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "updatePort",
      port: portInput.value,
    });
  });
});

// Get connection status
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { type: "getStatus" }, (response) => {
    if (response && response.connected) {
      statusIndicator.classList.replace("disconnected", "connected");
      statusText.textContent = "Connected";
    }
  });
});
