const websocket = require("ws");
const url = require("url");
const wss = new websocket.Server({ port: 8080 });

wss.on("connection", (ws, req) => {
    ws.user = escape(url.parse(req.url, true).query.user);
    ws.color = url.parse(req.url, true).query.color;
    ws.ip = ws._socket.remoteAddress;
    console.log(Array.from(wss.clients));
    broadcast({ online: Array.from(wss.clients) });
    //broadcast({ online: Array.from(wss.clients) });

    ws.on("message", (data) => {
        broadcast({ content: escape(data), user: ws.user, color: ws.color });
    });
    ws.on("close", () => {
    });
    ws.on("error", () => { });
});

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === websocket.OPEN) {
            //console.log(JSON.stringify(data));
            client.send(JSON.stringify(data));
        }
    });
}

function escape(s) {
    return s.replace(/[^0-9A-Za-z ]/g, function (c) {
        return "&#" + c.charCodeAt(0) + ";".trim();
    });
}