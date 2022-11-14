var stompClient = null;

function setConnected(connected) {
    if (connected) {
        $("#status").attr("style", "background-color: green");
        $("#status").text("已连接")
    } else {
        $("#status").attr("style", "background-color: red");
        $("#status").text("断开连接")
    }
}

function connect() {
    const socket = new SockJS('/lan-stream');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/message', function (greeting) {
            showMessage(JSON.parse(greeting.body));
        });
    }, function (message) {
        console.log(message)
        stompClient.disconnect();
        setConnected(false);
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    const msg = $("#message").val();
    if (!msg) {
        return
    }
    const json = {'type': 'text', 'content': msg}
    stompClient.send("/app/send", {}, JSON.stringify(json));
    $("#message").val("")
}

function sendFile() {
    // 1. 将 jQuery 对象转化为 DOM 对象，并获取选中的文件列表
    const files = $("#myfile")[0].files;
    // 2. 判断是否选择了文件
    if (files.length <= 0) {
        return;
    }
    const fileName = files[0].name;
    const fd = new FormData();
    fd.append('file', files[0])
    $.ajax({
        method: 'POST',
        url: "/file-upload",
        data: fd,
        contentType: false,
        processData: false,
        success: function (data) {
            const json = {
                'type': fileName.substr(fileName.lastIndexOf('.') + 1),
                'fileName': fileName,
                'fileSize': (files[0].size / 1024 / 1024).toFixed(2),
                'content': data
            }
            stompClient.send("/app/send", {}, JSON.stringify(json));
            $("#myfile").val("")
        }
    })

}

function showMessage(data) {
    if (!data) {
        return
    }
    if (isAssetTypeAnImage(data.type)) {
        $("#history").prepend(`<tr><td onclick="downloadFile('${data.content}');">
        <span><a href="#" class="thumbnail"><img src="${data.content}" alt=""></a>
        <span class="msg-time">${new Date(data.timestamp).toLocaleString()}</span>
        </span></td></tr>`);
    } else if (data.type === 'text') {
        $("#history").prepend(`<tr><td onclick="copyTextToClipboard('${data.content}')">
        <span>${data.content}</span><br/>
        <span class="msg-time">${new Date(data.timestamp).toLocaleString()}</span>
        </td></tr>`);
    } else {
        $("#history").prepend(`<tr><td onclick="downloadFile('${data.content}')">
        <span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span>
        <p>${data.fileName}</p> <p>${data.fileSize} MB</p><br/>
        <span class="msg-time">${new Date(data.timestamp).toLocaleString()}</span></span>
        </td></tr>`);
    }
}

function showHistoryMsg() {
    $.ajax({
        method: 'get',
        url: "/history",
        success: function (data) {
            data.forEach(e => {
                showMessage(e)
            })
        }
    })
}

window.onload = function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () {
        connect();
    });
    $("#disconnect").click(function () {
        disconnect();
    });
    $("#send").click(function () {
        sendMessage();
    });
    $("#myfile").change(function () {
        sendFile();
    });
    connect();
    showHistoryMsg();
}


/**
 * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
 */
function copyTextToClipboard(text) {
    if (!text) {
        text = document.querySelector('#result-area').textContent
    }
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        showTip('复制成功', 'success');
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}

function isAssetTypeAnImage(ext) {
    return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg', 'webp'].indexOf(ext.toLowerCase()) !== -1;
}

function downloadFile(url) {
    var $form = $('<form method="GET"></form>');
    $form.attr('action', url);
    $form.attr('target', '_blank');
    $form.appendTo($('body'));
    $form.submit();
}

//tip是提示信息，type:'success'是成功信息，'danger'是失败信息,'info'是普通信息,'warning'是警告信息
function showTip(tip, type) {
    var $tip = $('#tip');
    $tip.stop(true).prop('class', 'alert alert-' + type).text(tip).css('margin-left', -$tip.outerWidth() / 2).fadeIn(500).delay(2000).fadeOut(500);
}