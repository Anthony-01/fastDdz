/**
 * 封装websocket
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var network;
(function (network) {
    /**
     * 套接字处理
     */
    var TcpSocket = (function (_super) {
        __extends(TcpSocket, _super);
        /**
         * 构造套接字
         */
        function TcpSocket(host, port) {
            var _this = _super.call(this) || this;
            /**
             *套接字状态
             */
            _this.m_eSocketStatus = 0 /* soc_unConnect */;
            //设置数据格式为二进制，默认为字符串
            _this.type = egret.WebSocket.TYPE_BINARY;
            //数据监听
            _this.addEventListener(egret.ProgressEvent.SOCKET_DATA, _this.onReceiveMessage, _this);
            //连接监听
            _this.addEventListener(egret.Event.CONNECT, _this.onSocketConnect, _this);
            //关闭监听
            _this.addEventListener(egret.Event.CLOSE, _this.onSocketClose, _this);
            //异常监听
            _this.addEventListener(egret.IOErrorEvent.IO_ERROR, _this.onSocketError, _this);
            return _this;
        }
        TcpSocket.getIns = function () {
            if (TcpSocket.m_Instance == null) {
                TcpSocket.m_Instance = new TcpSocket();
                TcpSocket.m_Instance.init();
            }
            return TcpSocket.m_Instance;
        };
        TcpSocket.prototype.init = function () {
        };
        /**
         * 将套接字连接到指定的主机和端口
         * @param host 要连接到的主机的名称或 IP 地址
         * @param port 要连接到的端口号
         */
        TcpSocket.prototype.connect = function (host, port) {
            //设置状态
            this.setConnectStatus(1 /* soc_connecting */);
            var url = host + ":" + port;
            this.connectByUrl(url);
            // SocketMrg.SocketManager.getInstance().pushSocket(this);
            // super.connect(host, port);
        };
        /**
         * 根据提供的url连接
         * @param url 全地址。如ws://echo.websocket.org:80
         */
        TcpSocket.prototype.connectByUrl = function (url) {
            var ws = "wss://" + url;
            // let ws: string = "ws://" + "39.108.54.88:9206";
            // let test = "wss://minigame.foxuc.com:9221";
            // test = test.replace(/\u2006/g, '');
            utils.GameConst.colorConsole("连接主机");
            console.log(ws);
            _super.prototype.connectByUrl.call(this, ws);
        };
        /**
         * 关闭连接
         */
        TcpSocket.prototype.close = function () {
            //socket关闭
            _super.prototype.close.call(this);
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
        };
        /**
         * TCP服务实例
         */
        TcpSocket.prototype.setServiceModule = function (serviceModule) {
            if (this.m_SocketServiceModule)
                this.m_SocketServiceModule = null;
            this.m_SocketServiceModule = serviceModule;
        };
        /**
         * 连接监听
         */
        TcpSocket.prototype.onSocketConnect = function (e) {
            utils.GameConst.colorConsole("TcpSocket连接成功:");
            if (this.m_SocketServiceModule) {
                this.m_SocketServiceModule.socketConnectSuccess();
            }
        };
        /**
         * 数据监听
         */
        TcpSocket.prototype.onReceiveMessage = function (e) {
            console.log("消息接收");
            //加入缓冲队列
            if (this.m_SocketServiceModule) {
                var socket = (e.target);
                //读取数据流
                var buffer = new utils.ByteArray();
                socket.readBytes(buffer.getByteArray(), 0);
                console.log("\u63A5\u6536\u957F\u5EA6=======" + buffer.getLength());
                this.m_SocketServiceModule.pushRecvBuffer(buffer);
            }
        };
        /**
         * 关闭监听
         */
        TcpSocket.prototype.onSocketClose = function (e) {
            // utils.GameConst.colorConsole("连接关闭:");
            // console.log(e);
            //服务关闭
            // managers.ServiceCtrl.getInstance().closeService();
            //设置socket状态
            this.setConnectStatus(0 /* soc_unConnect */);
            console.log("socket close");
            //发布前注释
            managers.FrameManager.getInstance().dismissPopWait();
        };
        /**
         * 异常监听
         */
        TcpSocket.prototype.onSocketError = function (e) {
            // let obj = JSON.stringify(e);
            utils.GameConst.colorConsole("连接错误:");
            //失败通知
            if (this.m_SocketServiceModule) {
                if (this.isConnected()) {
                    //需断线重连
                    console.log("断线1");
                    this.m_SocketServiceModule.onReconnect();
                }
                else {
                    //连接异常 连接错误 超时
                    console.log("断线2");
                    this.m_SocketServiceModule.onReconnect();
                }
            }
            //设置socket状态
            this.setConnectStatus(3 /* soc_error */);
            console.log("socket error");
        };
        /**
         * 连接状态
         */
        TcpSocket.prototype.setConnectStatus = function (status) {
            this.m_eSocketStatus = status;
        };
        /**
         * 连接状态
         */
        TcpSocket.prototype.isConnected = function () {
            // console.log("连接状态是否:", this.m_eSocketStatus == df.eSocketStatus.soc_connected);
            return this.m_eSocketStatus == 2 /* soc_connected */;
        };
        return TcpSocket;
    }(egret.WebSocket));
    network.TcpSocket = TcpSocket;
    __reflect(TcpSocket.prototype, "network.TcpSocket");
})(network || (network = {}));
