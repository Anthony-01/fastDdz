var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var network;
(function (network) {
    var WXWebSocket = (function () {
        function WXWebSocket() {
            this.m_eSocketStatus = 0 /* soc_unConnect */;
        }
        WXWebSocket.prototype.connect = function (url, port) {
            var test = "wss://" + url + ":" + port;
            // let mini = "wss://minigame.foxuc.com:9221";
            // this._socket = new WebSocket(test);
            // this._socket.binaryType = "arraybuffer";
            // this.initSocket(this._socket);
            //需要传递回调函数111
            this._socket = platform.connectWxSocket(test, this);
        };
        //主动断开连接;
        WXWebSocket.prototype.close = function () {
            if (this._socket && this.isConnected()) {
                this._socket.close({
                    reason: "正常关闭",
                    success: function () {
                        console.log("连接关闭成功");
                    },
                    fail: function () {
                        console.log("连接关闭失败");
                    },
                    complete: function () {
                        console.log("关闭回调");
                    }
                });
            }
        };
        WXWebSocket.prototype.initSocket = function (socket) {
            var _this = this;
            socket.onopen = function (ev) {
                _this.onSocketConnect(ev);
            };
            socket.onerror = function (ev) {
                _this.onSocketError(ev);
            };
            socket.onmessage = function (ev) {
                _this.onReceiveMessage(ev);
            };
            socket.onclose = function (ev) {
                _this.onSocketClose(ev);
            };
        };
        WXWebSocket.prototype.onReceiveMessage = function (ev) {
            console.log("消息接收", ev);
            //加入缓冲队列
            if (this.m_SocketServiceModule) {
                //获取到的data
                var data = ev.data;
                // let socket = <egret.WebSocket>(ev.target);
                //读取数据流
                var buffer = new utils.ByteArray(data);
                // buffer.setByteArray(data);
                // socket.readBytes(buffer.getByteArray(), 0);
                console.log("\u63A5\u6536\u957F\u5EA6=======" + buffer.getLength());
                this.m_SocketServiceModule.pushRecvBuffer(buffer);
            }
        };
        WXWebSocket.prototype.onSocketError = function (e) {
            // let obj = JSON.stringify(e);
            utils.GameConst.colorConsole("连接错误:");
            console.log(e);
            if (e.data) {
                var obj = JSON.stringify(e.data);
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
            this._socket.close({
                reason: "正常关闭",
                success: function () {
                    console.log("连接关闭成功");
                },
                fail: function () {
                    console.log("连接关闭失败");
                },
                complete: function () {
                    console.log("关闭回调");
                }
            });
            console.log("socket error");
        };
        WXWebSocket.prototype.onSocketClose = function (e) {
            utils.GameConst.colorConsole("TcpSocket连接关闭:");
            console.log(e);
            //服务关闭
            managers.ServiceCtrl.getInstance().closeService();
            //设置socket状态
            this.setConnectStatus(0 /* soc_unConnect */);
            console.log("socket close");
            //发布前注释
            managers.FrameManager.getInstance().dismissPopWait();
        };
        WXWebSocket.prototype.setConnectStatus = function (status) {
            this.m_eSocketStatus = status;
        };
        WXWebSocket.prototype.writeBytes = function (bytes, offset, length) {
            // utils.GameConst.colorConsole("MyWebSocket写操作");
            var write = bytes.buffer;
            if (!offset) {
                offset = 0;
            }
            if (!length) {
                length = write.byteLength;
            }
            var last = write.slice(offset, offset + length);
            if (this._socket) {
                this._socket.send({
                    data: last,
                    success: function () {
                        console.log("发送成功!");
                    },
                    fail: function () {
                        console.log("发送失败!");
                    }
                });
            }
            // this._socket.send(last);
        };
        WXWebSocket.prototype.readBytes = function (bytes, offset, length) {
            utils.GameConst.colorConsole("Wx读操作");
        };
        /**
         * 连接状态
         */
        WXWebSocket.prototype.isConnected = function () {
            // console.log("连接状态是否:", this.m_eSocketStatus == df.eSocketStatus.soc_connected);
            return this.m_eSocketStatus == 2 /* soc_connected */;
        };
        /**
         * TCP服务实例
         */
        WXWebSocket.prototype.setServiceModule = function (serviceModule) {
            if (this.m_SocketServiceModule)
                this.m_SocketServiceModule = null;
            this.m_SocketServiceModule = serviceModule;
        };
        /**
         * 连接监听
         */
        WXWebSocket.prototype.onSocketConnect = function (open) {
            utils.GameConst.colorConsole("TcpSocket连接成功:");
            console.log(open);
            if (this.m_SocketServiceModule) {
                this.m_SocketServiceModule.socketConnectSuccess();
            }
        };
        return WXWebSocket;
    }());
    network.WXWebSocket = WXWebSocket;
    __reflect(WXWebSocket.prototype, "network.WXWebSocket");
})(network || (network = {}));
