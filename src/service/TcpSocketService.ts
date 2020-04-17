/**
 * TCP服务
 */

namespace service {
    import TcpSocket = network.TcpSocket;
    /**
     * 心跳维护时间
     */
    const HeartTime = 5000;
    const CONNECT_SUCCESS = true;
    const CONNECT_FAILURE = false;

    export class TcpSocketService {
        /**
         * 加密实例
         */
        private m_Crypt: network.Crypt;

        /**
         * 接收长度
         */
        private m_wRecvSize: number = 0;

        /**
         * SOCKET实例
         */
        private m_Socket: network.TcpSocket;

        /**
         * 事件实例
         */
        private m_EventDispatcher: egret.EventDispatcher;
        /**
         * 当前时间
         */
        private m_CurTime: number = 0;
        /**
         * 缓冲队列
         */
        private m_RecvQueue: utils.ByteArray[] = [];
        /**
         * 服务模块
         */
        private m_ServiceModule: number;

        /**
         * 构造
         */
        constructor(serverKind: df.eServerModule.SERVICE_MODULE_LOGON) {
            //服务模块
            this.m_ServiceModule = serverKind;

            //websocket
            this.m_Socket = new network.TcpSocket();
            // this.m_Socket = network.MyWebSocket.getIns();
            this.m_Socket.setServiceModule(this);

            //事件实例
            this.m_EventDispatcher = new egret.EventDispatcher();

            //加密实例
            this.m_Crypt = new network.Crypt();

            //接收大小
            this.m_wRecvSize = 0;

            //缓冲队列
            this.m_RecvQueue = [];
        }

        /**
         * 创建连接
         */
        public createConnect(host: string, port: number): void {
            if (null == this.m_Socket) {
                //websocket
                this.m_Socket = new network.TcpSocket();
                this.m_Socket.setServiceModule(this);
            }
            this.m_Socket.connect(host, port);
        }

        //缓冲队列
        public pushRecvBuffer(buffer): void {
            this.m_RecvQueue.push(buffer);
        }

        /**
         * 服务标识
         */
        public get ServiceModule() {
            return this.m_ServiceModule;
        }

        public set ServiceModule(module) {
            this.m_ServiceModule = module;
        }

        public onReconnect() {
            managers.ServiceCtrl.getInstance().onReconnect();
        }

        /**
         * 解密数据
         */
        public setSocketBuffer(buffer: utils.ByteArray) {
            //重置变量
            this.m_CurTime = egret.getTimer();

            return new Promise((resolve, reject) => {

                let offset = 0;       //记录偏移

                try {
                    //网络长度
                    this.m_wRecvSize = buffer.getLength();

                    //解密映射
                    while (this.m_wRecvSize >= df.Len_Tcp_Head) {//大于头文件长度
                        //设置偏移
                        buffer.position(offset);

                        //数据类型
                        var cbDataKind = utils.getUnsignedByte(buffer.Pop_Byte());
                        //校验字段
                        var cbCheckCode = utils.getUnsignedByte(buffer.Pop_Byte());
                        //缓冲长度
                        var wPacketSize = buffer.Pop_WORD();

                        //长度校验
                        // egret.assert((wPacketSize >= df.Len_Tcp_Info) && (wPacketSize <= df.SOCKET_TCP_BUFFER))
                        if ((wPacketSize < df.Len_Tcp_Info) || (wPacketSize > df.SOCKET_TCP_BUFFER)) {
                            throw new Error("消息包错误");
                        }

                        //完整判断
                        if (this.m_wRecvSize < wPacketSize) {
                            throw new Error("消息包接收不完整");
                        }

                        //解密数据
                        if (this.m_Crypt.CrevasseBuffer(buffer, wPacketSize, offset) == false) {
                            egret.assert(false);
                            throw new Error("解密失败");
                        }

                        //读取命令码
                        buffer.position(df.Len_Tcp_Info);
                        var wMainCmd = buffer.Pop_WORD();
                        var wSubCmd = buffer.Pop_WORD();
                        var wTokenCount = buffer.Pop_WORD();

                        let temp = wMainCmd;
                        wMainCmd = utils.LOCMDID(temp);
                        var wServerModule = utils.HICMDID(temp);

                        console.log(`服务模块:${wServerModule},主命令: ${wMainCmd},子命令: ${wSubCmd}`);

                        if (wMainCmd == df.MDM_KN_COMMAND) {
                            //内核命令
                            if (wSubCmd == df.SUB_KN_DETECT_SOCKET) {
                                //回复心跳
                                console.log("接受心跳包");
                                managers.ServiceCtrl.getInstance().getDelegate().sendPing(this);
                            } else if (wSubCmd == df.SUB_KN_SHUT_DOWN_SOCKET) {
                                if (window["debug"]) {
                                    managers.FrameManager.getInstance().m_Reporter.Report();
                                }

                                //关闭连接
                                this.closeService("服务器连接断开!",true);

                                //通知重连
                                this.onReconnect();
                            }
                        } else {
                            //消息队列
                            var msg = new network.Message(wMainCmd, wSubCmd,wServerModule,wPacketSize - df.Len_Tcp_Head, buffer);
                            managers.ServiceCtrl.getInstance()._MsgQueue.push(msg);
                        }

                        //处理长度
                        this.m_wRecvSize -= wPacketSize;
                        egret.assert(this.m_wRecvSize >= 0);

                        //记录偏移
                        offset += wPacketSize;

                        //判断完成
                        if (this.m_wRecvSize < df.Len_Tcp_Head) {
                            resolve();
                            buffer = null;
                        }

                        console.log(`已处理长度: ${wPacketSize},剩余长度: ${this.m_wRecvSize}`);
                    }

                } catch (e) {

                    //处理长度
                    this.m_wRecvSize -= wPacketSize;

                    //记录偏移
                    offset += wPacketSize;

                    //释放引用
                    if (this.m_wRecvSize < df.Len_Tcp_Head) {
                        buffer = null;
                    }

                    reject("数据解析异常");
                }
            })
        }

        /**
         * 发送数据
         */
        public SendSocketData(wMainCmd: number, wSubCmd: number, data: utils.ByteArray, wSize: number): boolean {
            //加密消息包
            const sendSize = this.initSocketData(wMainCmd, wSubCmd, data, wSize);

            //追踪日志
            let Reporter: models.ErrorReporter = new models.ErrorReporter();
            Reporter.MainCmd = wMainCmd;
            Reporter.SubCmd = wSubCmd;
            managers.FrameManager.getInstance().m_Reporter = Reporter;

            //发送数据
            if (this.m_Socket) {
                //偏移前置
                data.position(0);

                //写字节流
                this.m_Socket.writeBytes(data.getByteArray(), 0, sendSize);

                //引用释放
                data.clear();
                data = null;
            }
            return true;
        }

        /***
         * 数据加密
         */
        public initSocketData(wMainCmd: number, wSubCmd: number, data: utils.ByteArray, wSize: number): number {
            //定义变量
            var mapResult = [];
            var dataSize: number = 0;

            //加密数据
            if (this.m_Crypt == null) return;
            if (((this.m_Crypt.getDataFlag() & network.DK_MAPPED) != 0)) {
                //设置偏移
                data.position(df.Len_Tcp_Info);

                if (wMainCmd != df.MDM_KN_COMMAND) {
                    wMainCmd = utils.MAKECMDID(wMainCmd, this.ServiceModule);
                }

                //设置命令码
                data.Append_WORD(wMainCmd);
                data.Append_WORD(wSubCmd);
                //令牌TOKEN
                data.Append_WORD(0);

                //映射数据
                mapResult = this.m_Crypt.EncryptBuffer(data, wSize);
            }

            //偏移前置
            data.position(0);

            //填充包头
            data.Append_Byte(mapResult[0]);
            data.Append_Byte(mapResult[1]);
            data.Append_WORD(mapResult[2]);

            return dataSize = mapResult[2];
        }

        //连接成功
        public socketConnectSuccess(): void {
            if (null == this.m_Socket) return;

            //连接状态
            this.m_Socket.setConnectStatus(df.eSocketStatus.soc_connected);

            //记录时间
            this.m_CurTime = egret.getTimer();

            //连接通知
            const delegate = managers.ServiceCtrl.getInstance().getDelegate();
            utils.GameConst.colorConsole("重连后是否有delegate:");
            console.log(delegate);
            if (null != delegate) {
                delegate.getDispatcher().dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_CONNECT_COMPLETE));
            }

            managers.ServiceCtrl.getInstance().socketConnectSuccess();
        }


        /**
         * 关闭服务
         */
        public closeService(msg: string = "", server: boolean = false): void {
            //关闭socket
            console.log("是否有socket", this.m_Socket);
            if (null != this.m_Socket) {
                console.log("socket是否连接", this.m_Socket.isConnected());
                if (this.m_Socket.isConnected()) {
                    this.m_Socket.close();
                }
                this.m_Socket = null;
            }

            //释放引用
            if (null != this.m_Crypt) {
                this.m_Crypt = null;
            }
            if (server) {
                //与服务器连接断开
                let message = "由于您长时间未进行游戏操作，请重新进入房间！";
                if (msg.length != 0) message = msg;
                GameEngine.getInstance().showMessage(message, () => {
                    managers.FrameManager.getInstance().dismissPopWait();
                    GameEngine.getInstance().startGameHandler();//服务器连接断开
                }, 0);
            }
            console.log("TcpService服务关闭");
        }

        /**
         * 刷新
         */
        public onUpdate(): void {
            //时间差
            let curTime: number = egret.getTimer();
            let delay = curTime - this.m_CurTime;

            // console.log(`spend ${delay}毫秒`)

            if (null == this.m_Socket) {
                return;
            }

            //发送心跳
            if (delay >= HeartTime && (true == this.m_Socket.isConnected())) {
                do {
                    if (managers.ServiceCtrl.getInstance().getDelegate()) {
                        managers.ServiceCtrl.getInstance().getDelegate().sendPing(this);
                        this.m_CurTime = egret.getTimer();
                        console.log("发送心跳");
                    }
                } while (false)
            }

            //处理队列
            // console.log(this.m_RecvQueue.length);
            if (this.m_RecvQueue.length > 0) {
                console.log("处理队列");
                var encryptBuffer = this.m_RecvQueue[0];

                this.setSocketBuffer(encryptBuffer).then(() => {
                    this.m_RecvQueue.shift();
                }).catch((err) => {
                    console.error(err);
                    //移除错误包,继续解析
                    this.m_RecvQueue.shift();
                });
            }
        }
    }
}