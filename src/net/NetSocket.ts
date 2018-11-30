namespace net {
    import ByteArray = egret.ByteArray;

    export class NetSocket {

        private ws: egret.WebSocket;

        private isBin: boolean = false;

        constructor() {

        }

        public connect(url, port): void {
            this.ws = new egret.WebSocket();
            this.ws.type = this.isBin ? egret.WebSocket.TYPE_BINARY : egret.WebSocket.TYPE_STRING;
            this.ws.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
            this.ws.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
            this.ws.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.ws.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
            this.ws.connect(url, port);
        }

        public sendData(msg: string) {
            console.log("发送消息:", msg);
            if (this.isBin) {
                let byte: ByteArray = new ByteArray();
                byte.writeUTF(msg);
                byte.position = 0;
                this.ws.writeBytes(byte, 0, byte.bytesAvailable);
            } else {
                this.ws.writeUTF(msg);
            }
        }

        private onReceiveMessage(){
            console.log('socket  收到了消息');
            if (this.isBin) {
                let byte:egret.ByteArray = new egret.ByteArray();
                this.ws.readBytes(byte);
                let msg:string = byte.readUTF();
                console.log('收到二进制数据', "readBYTE:" + msg);
            }else
            {
                var msg = this.ws.readUTF();
                console.log('收到字符串数据', 'readUTF:' + msg);
            }
            NetController.getInstance().readData(JSON.parse(msg));
        }

        private onSocketOpen() {
            NetController.getInstance().showState("socket连接成功");
        }

        private onSocketClose() {
            NetController.getInstance().showState("socket连接关闭");
        }

        private onSocketError() {
            NetController.getInstance().showState("socket error");
        }
    }
}