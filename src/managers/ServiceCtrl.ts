/**
 * 服务单例
 **/

namespace managers {
    import GameFrame = frame.GameFrame;
    export const OFFLINE = 0;
    export const ONLINE = 1;

    export class ServiceCtrl implements df.IConnectSocket, df.ISocketService {
        /**
         *单例实例
         */
        private static m_sInstance: ServiceCtrl;

        /**
         * 消息队列
         */
        public _MsgQueue: network.Message[] = [];

        /**
         * 派发标识
         */
        public _isAllowDispatch: boolean = true;

        /**
         * 当前Tcp服务
         */
        private m_pTcpService: service.TcpSocketService;

        /**
         * Frame代理
         */
        private _delegate: frame.BaseFrame;

        /**
         * 当前服务列表
         */
        private _curServerList: any = [];

        /**
         * 当前服务索引
         */
        private _curServerIdx: number = 0;

        /**
         * 重连次数
         */
        public m_ReConnectCount: number;

        /**
         * 最大连接次数
         */
        public m_ReConnectMax: number = 10;

        /**
         * 连接超时
         */
        public m_ReConnectTimeOut: number = 5;

        /**
         * 重连标识
         */
        public m_bReConnect: boolean = false;

        /**
         *广场连接
         */
        public m_bPlaza: boolean = false;

        /**接入超时*/
        private _NetWorkTimeOut: number = 0;

        /**
         * 房间缓存
         * */

        /**
         * 默认服务信息
         */
        public m_DefaultServerInfo =
            {
                // domain: "172.16.10.50", //胡
                // port: 8801,
                // domain: "39.108.54.88", //测试
                // port: 9206,
                domain: "wss://minigame.foxuc.com", //正式
                port: 9221,
                webAddr: ""
            };

        /**
         *获取当前实例
         */
        public static getInstance(): ServiceCtrl {
            if (this.m_sInstance == null) {
                this.m_sInstance = new ServiceCtrl();
                this.m_sInstance.init();
            }
            return this.m_sInstance;
        }

        public static getNewInstance(): ServiceCtrl {
            this.m_sInstance = null;
            this.m_sInstance = new ServiceCtrl();
            this.m_sInstance.init();
            return this.m_sInstance;
        }

        public init(): void {
            //请求网关
            this.getAccessList();
            // this.addNetWorkStatusListen();
            this.addWXNetWork();
        }

        /**获取网关列表 */
        public getAccessList() {
            //请求地址
            let URL = "https://minigame.foxuc.com/v1/game/GetLogonServer?ver=1";

            let onCompleteHandler = (e: egret.Event) => {
                console.log("请求成功");
                let jsonData = JSON.parse(e.target.response);
                console.log(jsonData);

                if (null == jsonData) {
                    console.log("json Error");
                } else {
                    let serviceList: any[] = [];
                    jsonData = jsonData.payload;
                    if (jsonData && jsonData.length) {
                        for (let i = 0; i < jsonData.length; i++) {
                            let map = {domain: jsonData[i].serviceDomain, port: jsonData[i].servicePort};
                            serviceList.push(map);
                        }
                        this.setCurServerList(serviceList);
                        utils.GameConst.colorConsole("网关请求：");
                        console.log(serviceList);
                    }
                }

            };

            let onErrorHandler = (e: egret.Event) => {
                console.log("请求失败");
                let serviceList: any[] = [];
                let map = {domain: this.m_DefaultServerInfo.domain, port: this.m_DefaultServerInfo.port};
                serviceList.push(map);
                this.setCurServerList(serviceList);
                console.log(serviceList);
            };

            utils.HttpRequest.createHttpRequest(this, URL, "", egret.HttpMethod.GET, onCompleteHandler, onErrorHandler);
        }

        /**
         * 服务索引
         */
        public setServerIdx(idx: number) {
            this._curServerIdx = idx;
        }

        /**
         * 当前服务列表
         */
        public setCurServerList(list: any) {
            this._curServerList = list;
        }


        //连接大厅
        public onConnectServer() {
            let szAddr: string;
            let nPort: number;
            let loginRecord = this.loadAgentPlazaRecord();

            // if (loginRecord) {
            //     //保持上次连接
            //     szAddr = loginRecord.host;
            //     nPort = loginRecord.port;
            // } else {
                szAddr = this._curServerList.length && this._curServerList ? this._curServerList[0].domain : this.m_DefaultServerInfo.domain;
                nPort = this._curServerList.length && this._curServerList ? this._curServerList[0].port : this.m_DefaultServerInfo.port;
                this.setServerIdx(0);
            // }
            szAddr = szAddr.replace("wss://", "");
            // szAddr = "wss://" + szAddr;
            //wss://minigame.foxuc.com:9221
            this.Connect(szAddr, nPort);
        }

        //加载上次成功地址
        public loadAgentPlazaRecord() {
            // console.log(typeof localStorage.getItem(df.LocalStorageKey.LASTLOGIN));
            // console.log(localStorage.getItem(df.LocalStorageKey.LASTLOGIN).length);
            if (localStorage.getItem(df.LocalStorageKey.LASTLOGIN).length == 0) return false;
            console.log("打印localStorage", localStorage.getItem(df.LocalStorageKey.LASTLOGIN));
            const localStoraget = JSON.parse(localStorage.getItem(df.LocalStorageKey.LASTLOGIN));
            return localStoraget;
        }

        //保存地址
        public saveAgentPlazaRecord() {
            //本地缓存
            var session = {
                'host': "", //地址
                'port': 0, //端口
            };

            session.host = this._host;
            session.port = this._port;
            localStorage.setItem(df.LocalStorageKey.LASTLOGIN, JSON.stringify(session));
        }

        //连接成功
        public socketConnectSuccess(): void {
            //重置变量
            this.m_ReConnectCount = 0;
            this.setServerIdx(0);

            //广场登录
            if (this.m_bPlaza) {
                //保存服务
                this.saveAgentPlazaRecord();

                //重置信息
                this.m_DefaultServerInfo.domain = this._host;
                this.m_DefaultServerInfo.port = this._port;
            }
        }


        public _connectDelegate: any;

        /**
         * 微信检测网络变化
         * */
        public addWXNetWork() {
            let self = this;
            this._connectDelegate = new egret.EventDispatcher();
            this._connectDelegate.addEventListener("connectchange", this.onWxConnectChange, this);
            platform.addWXNetStatusChange(this._connectDelegate);
        }

        private connectStatus: number = 2;

        private onWxConnectChange(e: egret.Event) {
            let self = this;
            if (e.data.isConnect == false) {
                this.connectInterrupt()
            } else if (e.data.isConnect == true) {
                this.reConnect();
            }
        }

        public connectInterrupt() {
            let self = this;
            GameEngine.getInstance().setGameStatus = cmd.GAME_SCENE_FREE;
            if (this.connectStatus == 1) return;
            this.stopConnect();
        }

        /**
         * 主动断开连接
         * */
        public stopConnect() {
            let self = this;
            if (self._NetWorkTimeOut != 0) return;
            utils.GameConst.colorConsole("网络中断!");
            self._NetWorkTimeOut = setTimeout(() => {
                // self.m_pTcpService.closeService();
                //回到开始界面
                managers.FrameManager.getInstance().showDailog(1, "无网络接入,请检查当前网络!", () => {
                    GameEngine.getInstance().startGameHandler();//服务器连接断开
                }, 1);
                self._NetWorkTimeOut = 0;
            }, 10000);

            if (this.m_pTcpService) {
                console.log("断线情况下主动断开连接278");
                this.m_pTcpService.closeService();
                this.connectStatus = 0;
            }

            self.NotifyNetStatus(OFFLINE);//等待时候界面
            // managers.FrameManager.getInstance().showToast("无网络接入,请检查当前网络");
            this.connectStatus = 1;
        }

        public reConnect() {
            let self = this;
            if (managers.FrameManager.getInstance().gameStatus != managers.DGameStatus.ING) return;
            // if (this.connectStatus == 2) return;
            if (self._NetWorkTimeOut != 0) {
                clearTimeout(self._NetWorkTimeOut);
                self._NetWorkTimeOut = 0;

                self.onReconnect();
                // self.getTcpService().ServiceModule = df.eServerModule.SERVICE_MODULE_SERVER;//ServiceCtrl变为游戏模块
                utils.GameConst.colorConsole("网络重连!");

                self.NotifyNetStatus(ONLINE);

                this.connectStatus = 2;
            } else {
            }
        }



        /**
         * 网络监测
         */
        public NotifyNetStatus(netStatus: number = OFFLINE) {
            if (netStatus == OFFLINE) { //重新连接
                managers.FrameManager.getInstance().showPopWait("尝试重新连接!");
            } else if (netStatus == ONLINE) {
                managers.FrameManager.getInstance().dismissPopWait();
            }
        }

        /**
         * 重连机制
         */
        onReconnect(szTips?: string) {
            // console.log("Ctrl:重新连接");
            let self = this;
            if (this._curServerIdx >= this._curServerList.length) {
                this.onReconnectFailure();
                return;
            }

            if (this.m_pTcpService) {
                console.log("重连之前断开333");
                this.m_pTcpService.closeService();
                this.m_pTcpService = null;
                this.connectStatus = 0;
            }
            let server = this._curServerList[this._curServerIdx++];
            // let server = this._curServerList[0];
            // let server = this.m_DefaultServerInfo;

            GameEngine.getInstance()._isReConnect = true;
            GameEngine.getInstance().reConnectFlag = true;
            GameEngine.getInstance()._sceneReCon = true;
            //如何判断游戏是否结束，结束的话不能走重新连接过程
            console.log(server.domain);
            server.domain = server.domain.replace("wss://", "");
            // console.log(server);
            // server.domain = "wss://" + server.domain;
            this.Connect(server.domain, server.port);

            this.m_ReConnectCount++;

            //重连通知
            if (this._delegate) {
                this._delegate.getDispatcher().dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_RE_CONNECT));
            }

            managers.FrameManager.getInstance().showPopWait(szTips);
        }

        // private reLogon() {
        //     // let logonFrame = new frame.LogonFrame();
        //     let wServerID = JSON.parse(localStorage.getItem("serverID")).wServerID;
        //     utils.GameConst.colorConsole("重连登录房间");
        //     console.log(wServerID);
        //     managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = df.eServerModule.SERVICE_MODULE_SERVER;//ServiceCtrl变为游戏模块
        //     (<GameFrame>this._delegate).onLogonRoom(wServerID);
        //     // GameEngine.getInstance().requestMatch();
        // }

        /**
         * 重连超时
         */
        onReconnectTimeOut() {

        }

        /**
         * 重连失败
         */
        public onReconnectFailure() {
            utils.GameConst.colorConsole("重连失败");
            GameEngine.getInstance().showMessage("连接失败,请重新进入游戏!", () => {
                GameEngine.getInstance().startGameHandler();
            });
            this.closeService();
            if (null == this._delegate)
                return;

            managers.FrameManager.getInstance().dismissPopWait();
            this._delegate.getDispatcher().dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_CONNECT_FAIlURE));
        }

        /**
         * 消息代理
         */
        public setDelegate(delegate: any) {
            //置空引用
            this._delegate = null;
            this._delegate = delegate;
        }

        public getDelegate() {
            return this._delegate;
        }

        /**
         * 获取TCP服务
         */
        public getTcpService() {
            return this.m_pTcpService;
        }

        //创建服务
        private _host: string = "";
        private _port: number = 0;

        /**
         * socket连接
         * @param host 主机域名
         * @param port 主机端口
         * @param serviceKind 服务模块
         */
        public Connect(host: string, port: number, serviceKind: number = df.eServerModule.SERVICE_MODULE_LOGON) {
            let tcpService = new service.TcpSocketService(serviceKind);
            tcpService.createConnect(host, port);
            this.m_pTcpService = null;
            this.m_pTcpService = tcpService;

            this.m_bPlaza = (serviceKind == df.eServerModule.SERVICE_MODULE_LOGON);

            if (true == this.m_bPlaza) {
                this._host = host;
                this._port = port;
            }
        }

        /**
         * 关闭服务
         */
        closeService(msg: string = "", close: boolean = false): void {
            console.log("Ctrl主动断开443");
            if (this.m_pTcpService) {
                //关闭SOCKET
                if (close) {
                    this.m_pTcpService.closeService(msg, true);
                } else {
                    this.m_pTcpService.closeService();
                }
                this.m_pTcpService = null;

                //重置变量
                // utils.GameConst.colorConsole("当前引用");
                console.log(this._delegate);
                this._delegate = null;
            }
        }

        /**
         * 刷新服务
         */
        onUpdate(): void {
            //服务刷新
            // console.log("服务刷新");
            if (this.m_pTcpService && this.m_pTcpService.onUpdate) {
                this.m_pTcpService.onUpdate();
            }

            if (this._MsgQueue.length == 0 || (null == this._delegate) || !this._isAllowDispatch) return;

            //处理队列
            if (null != this._delegate.onMessage) {
                //变量定义
                let dispatch: network.Message[] = [];
                let length = this._MsgQueue.length;
                length = (length < df.MAX_UNIT) ? length : df.MAX_UNIT;

                //分帧处理
                dispatch = this._MsgQueue.slice(0, length);
                this._MsgQueue.splice(0, length);

                //消息分发
                while (dispatch.length) {
                    var msg = dispatch[0];
                    this._delegate.getDispatcher().dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, false, false, msg));
                    dispatch.shift();
                }
            }
        }
    }
}