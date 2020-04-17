/**
 * 封装websocket
 */

namespace network {
    /**
     * 套接字处理
     */
    export class TcpSocket extends egret.WebSocket {
        /**
         *套接字状态
         */
        private m_eSocketStatus: number = df.eSocketStatus.soc_unConnect;

        /**
         * 服务实例
         */
        private m_SocketServiceModule: any;

        /**
         * 构造套接字
         */
        constructor(host?: string, port?: number) {
            super();

            //设置数据格式为二进制，默认为字符串
            this.type = egret.WebSocket.TYPE_BINARY;

            //数据监听
            this.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);

            //连接监听
            this.addEventListener(egret.Event.CONNECT, this.onSocketConnect, this);

            //关闭监听
            this.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);

            //异常监听
            this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        }

        private static m_Instance: TcpSocket;

        public static getIns() {
            if (TcpSocket.m_Instance == null) {
                TcpSocket.m_Instance = new TcpSocket();
                TcpSocket.m_Instance.init();
            }
            return TcpSocket.m_Instance;
        }

        public init() {

        }

        /**
         * 将套接字连接到指定的主机和端口
         * @param host 要连接到的主机的名称或 IP 地址
         * @param port 要连接到的端口号
         */
        connect(host: string, port: number): void {

            //设置状态
            this.setConnectStatus(df.eSocketStatus.soc_connecting);

            let url = host + ":" + port;
            this.connectByUrl(url);
            // SocketMrg.SocketManager.getInstance().pushSocket(this);
            // super.connect(host, port);
        }
        /**
         * 根据提供的url连接
         * @param url 全地址。如ws://echo.websocket.org:80
         */
        connectByUrl(url: string): void {
            let ws: string = "wss://" + url;
            // let ws: string = "ws://" + "39.108.54.88:9206";
            // let test = "wss://minigame.foxuc.com:9221";
            // test = test.replace(/\u2006/g, '');
            utils.GameConst.colorConsole("连接主机");
            console.log(ws);
            super.connectByUrl(ws);
        }
        /**
         * 关闭连接
         */
        close() {
            //socket关闭
            super.close();

            //释放服务模块
            this.setServiceModule(null);

            //移除监听
            this.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);

            //连接监听
            this.removeEventListener(egret.Event.CONNECT, this.onSocketConnect, this);

            //关闭监听
            this.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);

            //异常监听
            this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        }

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
        onSocketConnect(e: egret.Event) {
            utils.GameConst.colorConsole("TcpSocket连接成功:");
            if (this.m_SocketServiceModule) {
                this.m_SocketServiceModule.socketConnectSuccess();
            }
        }

        /**
         * 数据监听
         */
        onReceiveMessage(e: egret.ProgressEvent) {
            console.log("消息接收");
            //加入缓冲队列
            if (this.m_SocketServiceModule) {
                let socket = <egret.WebSocket>(e.target);

                //读取数据流
                let buffer: utils.ByteArray = new utils.ByteArray();
                socket.readBytes(buffer.getByteArray(), 0);

                console.log(`接收长度=======${buffer.getLength()}`);
                this.m_SocketServiceModule.pushRecvBuffer(buffer);
            }
        }

        /**
         * 关闭监听
         */
        onSocketClose(e: egret.Event) {
            // utils.GameConst.colorConsole("连接关闭:");
            // console.log(e);
            //服务关闭
            // managers.ServiceCtrl.getInstance().closeService();

            //设置socket状态
            this.setConnectStatus(df.eSocketStatus.soc_unConnect);
            console.log("socket close");

            //发布前注释
            managers.FrameManager.getInstance().dismissPopWait();
        }

        /**
         * 异常监听
         */
        onSocketError(e: egret.IOErrorEvent) {
            // let obj = JSON.stringify(e);
            utils.GameConst.colorConsole("连接错误:");
            //失败通知
            if (this.m_SocketServiceModule) {
                if (this.isConnected()) {
                    //需断线重连
                    console.log("断线1");
                    this.m_SocketServiceModule.onReconnect();
                } else {
                    //连接异常 连接错误 超时
                    console.log("断线2");
                    this.m_SocketServiceModule.onReconnect();
                }
            }

            //设置socket状态
            this.setConnectStatus(df.eSocketStatus.soc_error);
            console.log("socket error");
        }

        /**
         * 连接状态
         */
        public setConnectStatus(status): void {
            this.m_eSocketStatus = status;
        }

        /**
         * 连接状态
         */
        public isConnected(): boolean {
            // console.log("连接状态是否:", this.m_eSocketStatus == df.eSocketStatus.soc_connected);
            return this.m_eSocketStatus == df.eSocketStatus.soc_connected;
        }
    }
}