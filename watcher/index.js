const WebSocket = require("ws");
const chokidar = require("chokidar");

const wss = new WebSocket.Server({ port: 3000 });
const watcher = chokidar.watch(process.cwd(), {
  ignored: /(^|[\/\\])\../,
  persistent: true,
});

watcher.on("change", (path) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("reload");
    }
  });
});

console.log("Auto Refresh Watcher running on port 3000");
