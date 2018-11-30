var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var net;
(function (net) {
    var ByteArray = egret.ByteArray;
    var NetSocket = (function () {
        function NetSocket() {
            this.isBin = false;
        }
        NetSocket.prototype.connect = function (url, port) {
            this.ws = new egret.WebSocket();
            this.ws.type = this.isBin ? egret.WebSocket.TYPE_BINARY : egret.WebSocket.TYPE_STRING;
            this.ws.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this.ws.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this.ws.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.ws.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
            this.ws.connect(url, port);
        };
        NetSocket.prototype.sendData = function (msg) {
            console.log("发送消息:", msg);
            if (this.isBin) {
                var byte = new ByteArray();
                byte.writeUTF(msg);
                byte.position = 0;
                this.ws.writeBytes(byte, 0, byte.bytesAvailable);
            }
            else {
                this.ws.writeUTF(msg);
            }
        };
        NetSocket.prototype.onReceiveMessage = function () {
            console.log('socket  收到了消息');
            if (this.isBin) {
                var byte = new egret.ByteArray();
                this.ws.readBytes(byte);
                var msg_1 = byte.readUTF();
                console.log('收到二进制数据', "readBYTE:" + msg_1);
            }
            else {
                var msg = this.ws.readUTF();
                console.log('收到字符串数据', 'readUTF:' + msg);
            }
            net.NetController.getInstance().readData(JSON.parse(msg));
        };
        NetSocket.prototype.onSocketOpen = function () {
            net.NetController.getInstance().showState("socket连接成功");
        };
        NetSocket.prototype.onSocketClose = function () {
            net.NetController.getInstance().showState("socket连接关闭");
        };
        NetSocket.prototype.onSocketError = function () {
            net.NetController.getInstance().showState("socket error");
        };
        return NetSocket;
    }());
    net.NetSocket = NetSocket;
    __reflect(NetSocket.prototype, "net.NetSocket");
})(net || (net = {}));
