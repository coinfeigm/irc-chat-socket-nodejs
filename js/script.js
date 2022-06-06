$(function () {
    const color = "%23" + (Math.round(Math.random() * 127) + 127).toString(16) + (Math.round(Math.random() * 127) + 127).toString(16) + (Math.round(Math.random() * 127) + 127).toString(16);
    const field = Object.freeze({
        input: $("#p-input-message"),
        message: $("#p-div-message"),
        online: $("#p-div-online"),
        label: $("#p-div-label-online")
    });
    let user = "";

    while (!user) {
        user = prompt("Enter your name");
    }

    field.input.focus();

    const ws = new WebSocket("ws://192.168.1.103:8080?user=" + user + "&color=" + color);

    ws.onopen = (() => { });
    ws.onmessage = ((res) => {
        console.log(res.data);
        res = JSON.parse(res.data);
        if (res.online !== undefined) {
            field.online.children().not("div").remove();
            field.label.html("Online - " + res.online.length);

            res.online.forEach((element) => {
                field.online.append("<p style='color: " + element.color + "'>" + element.user + "</p>");
            });
        } else {
            field.message.append("<p class='text-white'><span style='color: " + res.color + "'>" + res.user + " :</span> " + res.content + "</p>");
            if (field.message.get(0).scrollHeight > field.message.height()) {
                field.message.scrollTop(field.message[0].scrollHeight);
            }
        }
    });
    ws.onerror = (() => { location.reload(true) });

    field.input.on("keypress", (e) => {
        if (e.which === 13) {
            ws.send(field.input.val());
            field.input.val("");
        }
    });
});