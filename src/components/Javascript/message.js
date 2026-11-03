//读取本地存储
var msgArr = JSON.parse(localStorage.getItem('msgList')) || [];
// 渲染游记
function render() {
    var list = document.getElementById('msgList');
    if (!list) {
        return;
    }
    list.innerHTML = '';
    for (var i = 0; i < msgArr.length; i++) {
        var item = msgArr[i];
        var div = document.createElement('div');
        div.className = 'msg-item';
        // 字符串拼接
        div.innerHTML =
            '<div class="msg-text">' +
            '<div>【' + item.time + '】</div>' +
            '<div>' + item.content + '</div>' +
            '</div>' +
            '<button class="del-btn" onclick="delMsg(' + i + ')">删除</button>';
        list.appendChild(div);
    }
}
// 提交游记
function submitMsg() {
    var content = document.getElementById('msgContent').value.trim();
    if (!content) {
        alert("请输入游记内容！");
        return;
    }
    var time = new Date().toLocaleString();
    msgArr.unshift({ content: content, time: time });
    localStorage.setItem('msgList', JSON.stringify(msgArr));
    document.getElementById('msgContent').value = '';
    render();
}
// 删除单条
function delMsg(index) {
    msgArr.splice(index, 1);
    localStorage.setItem('msgList', JSON.stringify(msgArr));
    render();
}
// 清空全部
function clearAll() {
    if (confirm('确定要清空所有内容吗？')) {
        msgArr = [];
        localStorage.setItem('msgList', JSON.stringify(msgArr));
        render();
    }
}
// 初始化
render();