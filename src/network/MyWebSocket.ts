namespace network {
    export class MyWebSocket  {

        private static m_Instance: MyWebSocket;

        public static getIns() {
            if (MyWebSocket.m_Instance == null) {
                MyWebSocket.m_Instance = new MyWebSocket();
                MyWebSocket.m_Instance.init();
            }
            return MyWebSocket.m_Instance;
        }

        public init() {

        }

        private _socket: WebSocket;

        private _ifClose: boolean;

        public connect(url: string, port: number) {
            let test = "wss://" + url +":" + port;
            // let mini = "wss://minigame.foxuc.com:9221";

            this._socket = new WebSocket(test);
            this._socket.binaryType = "arraybuffer";
            this.initSocket(this._socket);
            this._ifClose = false;
        }

        //主动断开连接;
        public close() {
            this._ifClose = true;
            if (this._socket) {
                this._socket.close();
            }
        }

        private initSocket(socket: WebSocket) {
            socket.onopen = (ev: any) => {
                this.onSocketConnect();
            };
            socket.onerror = (ev: Event) => {
                this.onSocketError(ev);
            };
            socket.onmessage = (ev: MessageEvent) => {
                this.onReceiveMessage(ev);
            };
            socket.onclose = (ev: CloseEvent) => {
                this.onSocketClose(ev);
            };
        }

        private onReceiveMessage(ev: MessageEvent) {
            console.log("消息接收", ev);
            //加入缓冲队列
            if (this.m_SocketServiceModule) {
                //获取到的data
                let data = <ArrayBuffer>ev.data;
                // let socket = <egret.WebSocket>(ev.target);

                //读取数据流
                let buffer: utils.ByteArray = new utils.ByteArray(data);
                // buffer.setByteArray(data);
                // socket.readBytes(buffer.getByteArray(), 0);

                console.log(`接收长度=======${buffer.getLength()}`);
                this.m_SocketServiceModule.pushRecvBuffer(buffer);
            }
        }

        private onSocketError(e: any) {
            // let obj = JSON.stringify(e);
            utils.GameConst.colorConsole("连接错误:");
            console.log(e);
            if (e.data) {
                let obj = JSON.stringify(e.data);
                console.log(JSON.parse(obj));
            }
            // //失败通知
            // if (this.m_SocketServiceModule) {
            //     if (this.isConnected()) {
            //         //需断线重连
            //         console.log("断线1");
            //         // this.m_SocketServiceModule.onReconnect();
            //     } else {
            //         //连接异常 连接错误 超时
            //         console.log("断线2");
            //         // this.m_SocketServiceModule.onReconnect();
            //     }
            // }
            //
            // //设置socket状态
            // this.setConnectStatus(df.eSocketStatus.soc_error);
            console.log("socket error");
        }

        private onSocketClose(e: any) {
            utils.GameConst.colorConsole("TcpSocket连接关闭:");
            console.log(e);
            //服务关闭
            managers.ServiceCtrl.getInstance().closeService();

            //设置socket状态
            this.setConnectStatus(df.eSocketStatus.soc_unConnect);
            console.log("socket close");

            //发布前注释
            managers.FrameManager.getInstance().dismissPopWait();
        }

        private m_eSocketStatus: number = df.eSocketStatus.soc_unConnect;

        public setConnectStatus(status): void {
            this.m_eSocketStatus = status;
        }

        writeBytes(bytes: egret.ByteArray, offset?: number, length?: number) {
            // utils.GameConst.colorConsole("MyWebSocket写操作");
            let write = bytes.buffer;
            if (!offset) {
                offset = 0;
            }
            if (!length) {
                length = write.byteLength;
            }
            let last = write.slice(offset, offset + length);
            //主动调用关闭以后停止发送数据
            if (!this._ifClose) {
                this._socket.send(last);
            }
        }

        readBytes(bytes: egret.ByteArray, offset?: number, length?: number): void {
            utils.GameConst.colorConsole("MyWebSocket读操作");
        }

        /**
         * 连接状态
         */
        public isConnected(): boolean {
            // console.log("连接状态是否:", this.m_eSocketStatus == df.eSocketStatus.soc_connected);
            return this.m_eSocketStatus == df.eSocketStatus.soc_connected;
        }

        /**
         * 服务实例
         */
        private m_SocketServiceModule: any;

        /**
         * TCP服务实例
         */
        public setServiceModule(serviceModule: any): void {
            if (this.m_SocketServiceModule)
                this.m_SocketServiceModule = null;

            this.m_SocketServiceModule = serviceModule;
        }


        /**
         * 连接监听
         */
        onSocketConnect() {
            utils.GameConst.colorConsole("TcpSocket连接成功:");
            if (this.m_SocketServiceModule) {
                this.m_SocketServiceModule.socketConnectSuccess();
            }
        }
    }
}