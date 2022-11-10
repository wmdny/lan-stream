var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/lan-stream');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/message', function (greeting) {
            showGreeting(JSON.parse(greeting.body));
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    const json = {'type': 'txt', 'content': $("#name").val()}
    stompClient.send("/app/send", {}, JSON.stringify(json));
}

function sendFile() {
    // 1. 将 jQuery 对象转化为 DOM 对象，并获取选中的文件列表
    const files = $("#myfile")[0].files;
    // 2. 判断是否选择了文件
    if (files.length <= 0) {
        return;
    }
    const fd = new FormData();
    let res;
    fd.append('file', files[0])
    $.ajax({
        method: 'POST',
        url: "/file-upload",
        data: fd,
        // 不修改 Content-Type 属性，使用 FormData 默认的 Content-Type 值
        contentType: false,
        // 不对 FormData 中的数据进行 url 编码，而是将 FormData 数据原样发送到服务器
        processData: false,
        success: function(data) {
            const json = {
                'type': 'pic',
                'content': data
            }
            stompClient.send("/app/send", {}, JSON.stringify(json));
            $("#myfile").val("")
        }
    })
    
}

function showGreeting(data) {
    if (!data) {
        return
    }
    if (data.type === 'txt') {
        $("#greetings").append("<tr><td>" + data.content + "</td></tr>");
    } else if (data.type === 'pic') {
        $("#greetings").append(`<tr><td><a href="#" class="thumbnail"><img src="${data.content}" alt=""></a></td></tr>`);
    }
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
    $( "#myfile").change(function() { sendFile(); });
});

window.onload=function(){
    connect()
}
