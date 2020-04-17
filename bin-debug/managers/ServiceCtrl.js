/**
 * 服务单例
 **/
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var managers;
(function (managers) {
    managers.OFFLINE = 0;
    managers.ONLINE = 1;
    var ServiceCtrl = (function () {
        function ServiceCtrl() {
            /**
             * 消息队列
             */
            this._MsgQueue = [];
            /**
             * 派发标识
             */
            this._isAllowDispatch = true;
            /**
             * 当前服务列表
             */
            this._curServerList = [];
            /**
             * 当前服务索引
             */
            this._curServerIdx = 0;
            /**
             * 最大连接次数
             */
            this.m_ReConnectMax = 10;
            /**
             * 连接超时
             */
            this.m_ReConnectTimeOut = 5;
            /**
             * 重连标识
             */
            this.m_bReConnect = false;
            /**
             *广场连接
             */
            this.m_bPlaza = false;
            /**接入超时*/
            this._NetWorkTimeOut = 0;
            /**
             * 房间缓存
             * */
            /**
             * 默认服务信息
             */
            this.m_DefaultServerInfo = {
                // domain: "172.16.10.50", //胡
                // port: 8801,
                // domain: "39.108.54.88", //测试
                // port: 9206,
                domain: "wss://minigame.foxuc.com",
                port: 9221,
                webAddr: ""
            };
            this.connectStatus = 2;
            //创建服务
            this._host = "";
            this._port = 0;
        }
        /**
         *获取当前实例
         */
        ServiceCtrl.getInstance = function () {
            if (this.m_sInstance == null) {
                this.m_sInstance = new ServiceCtrl();
                this.m_sInstance.init();
            }
            return this.m_sInstance;
        };
        ServiceCtrl.getNewInstance = function () {
            this.m_sInstance = null;
            this.m_sInstance = new ServiceCtrl();
            this.m_sInstance.init();
            return this.m_sInstance;
        };
        ServiceCtrl.prototype.init = function () {
            //请求网关
            this.getAccessList();
            // this.addNetWorkStatusListen();
            this.addWXNetWork();
        };
        /**获取网关列表 */
        ServiceCtrl.prototype.getAccessList = function () {
            var _this = this;
            //请求地址
            var URL = "https://minigame.foxuc.com/v1/game/GetLogonServer?ver=1";
            var onCompleteHandler = function (e) {
                console.log("请求成功");
                var jsonData = JSON.parse(e.target.response);
                console.log(jsonData);
                if (null == jsonData) {
                    console.log("json Error");
                }
                else {
                    var serviceList = [];
                    jsonData = jsonData.payload;
                    if (jsonData && jsonData.length) {
                        for (var i = 0; i < jsonData.length; i++) {
                            var map = { domain: jsonData[i].serviceDomain, port: jsonData[i].servicePort };
                            serviceList.push(map);
                        }
                        _this.setCurServerList(serviceList);
                        utils.GameConst.colorConsole("网关请求：");
                        console.log(serviceList);
                    }
                }
            };
            var onErrorHandler = function (e) {
                console.log("请求失败");
                var serviceList = [];
                var map = { domain: _this.m_DefaultServerInfo.domain, port: _this.m_DefaultServerInfo.port };
                serviceList.push(map);
                _this.setCurServerList(serviceList);
                console.log(serviceList);
            };
            utils.HttpRequest.createHttpRequest(this, URL, "", egret.HttpMethod.GET, onCompleteHandler, onErrorHandler);
        };
        /**
         * 服务索引
         */
        ServiceCtrl.prototype.setServerIdx = function (idx) {
            this._curServerIdx = idx;
        };
        /**
         * 当前服务列表
         */
        ServiceCtrl.prototype.setCurServerList = function (list) {
            this._curServerList = list;
        };
        //连接大厅
        ServiceCtrl.prototype.onConnectServer = function () {
            var szAddr;
            var nPort;
            var loginRecord = this.loadAgentPlazaRecord();
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
        };
        //加载上次成功地址
        ServiceCtrl.prototype.loadAgentPlazaRecord = function () {
            // console.log(typeof localStorage.getItem(df.LocalStorageKey.LASTLOGIN));
            // console.log(localStorage.getItem(df.LocalStorageKey.LASTLOGIN).length);
            if (localStorage.getItem(df.LocalStorageKey.LASTLOGIN).length == 0)
                return false;
            console.log("打印localStorage", localStorage.getItem(df.LocalStorageKey.LASTLOGIN));
            var localStoraget = JSON.parse(localStorage.getItem(df.LocalStorageKey.LASTLOGIN));
            return localStoraget;
        };
        //保存地址
        ServiceCtrl.prototype.saveAgentPlazaRecord = function () {
            //本地缓存
            var session = {
                'host': "",
                'port': 0,
            };
            session.host = this._host;
            session.port = this._port;
            localStorage.setItem(df.LocalStorageKey.LASTLOGIN, JSON.stringify(session));
        };
        //连接成功
        ServiceCtrl.prototype.socketConnectSuccess = function () {
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
        };
        /**
         * 微信检测网络变化
         * */
        ServiceCtrl.prototype.addWXNetWork = function () {
            var self = this;
            this._connectDelegate = new egret.EventDispatcher();
            this._connectDelegate.addEventListener("connectchange", this.onWxConnectChange, this);
            platform.addWXNetStatusChange(this._connectDelegate);
        };
        ServiceCtrl.prototype.onWxConnectChange = function (e) {
            var self = this;
            if (e.data.isConnect == false) {
                this.connectInterrupt();
            }
            else if (e.data.isConnect == true) {
                this.reConnect();
            }
        };
        ServiceCtrl.prototype.connectInterrupt = function () {
            var self = this;
            GameEngine.getInstance().setGameStatus = cmd.GAME_SCENE_FREE;
            if (this.connectStatus == 1)
                return;
            this.stopConnect();
        };
        /**
         * 主动断开连接
         * */
        ServiceCtrl.prototype.stopConnect = function () {
            var self = this;
            if (self._NetWorkTimeOut != 0)
                return;
            utils.GameConst.colorConsole("网络中断!");
            self._NetWorkTimeOut = setTimeout(function () {
                // self.m_pTcpService.closeService();
                //回到开始界面
                managers.FrameManager.getInstance().showDailog(1, "无网络接入,请检查当前网络!", function () {
                    GameEngine.getInstance().startGameHandler(); //服务器连接断开
                }, 1);
                self._NetWorkTimeOut = 0;
            }, 10000);
            if (this.m_pTcpService) {
                console.log("断线情况下主动断开连接278");
                this.m_pTcpService.closeService();
                this.connectStatus = 0;
            }
            self.NotifyNetStatus(managers.OFFLINE); //等待时候界面
            // managers.FrameManager.getInstance().showToast("无网络接入,请检查当前网络");
            this.connectStatus = 1;
        };
        ServiceCtrl.prototype.reConnect = function () {
            var self = this;
            if (managers.FrameManager.getInstance().gameStatus != managers.DGameStatus.ING)
                return;
            // if (this.connectStatus == 2) return;
            if (self._NetWorkTimeOut != 0) {
                clearTimeout(self._NetWorkTimeOut);
                self._NetWorkTimeOut = 0;
                self.onReconnect();
                // self.getTcpService().ServiceModule = df.eServerModule.SERVICE_MODULE_SERVER;//ServiceCtrl变为游戏模块
                utils.GameConst.colorConsole("网络重连!");
                self.NotifyNetStatus(managers.ONLINE);
                this.connectStatus = 2;
            }
            else {
            }
        };
        /**
         * 网络监测
         */
        ServiceCtrl.prototype.NotifyNetStatus = function (netStatus) {
            if (netStatus === void 0) { netStatus = managers.OFFLINE; }
            if (netStatus == managers.OFFLINE) {
                managers.FrameManager.getInstance().showPopWait("尝试重新连接!");
            }
            else if (netStatus == managers.ONLINE) {
                managers.FrameManager.getInstance().dismissPopWait();
            }
        };
        /**
         * 重连机制
         */
        ServiceCtrl.prototype.onReconnect = function (szTips) {
            // console.log("Ctrl:重新连接");
            var self = this;
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
            var server = this._curServerList[this._curServerIdx++];
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
        };
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
        ServiceCtrl.prototype.onReconnectTimeOut = function () {
        };
        /**
         * 重连失败
         */
        ServiceCtrl.prototype.onReconnectFailure = function () {
            utils.GameConst.colorConsole("重连失败");
            GameEngine.getInstance().showMessage("连接失败,请重新进入游戏!", function () {
                GameEngine.getInstance().startGameHandler();
            });
            this.closeService();
            if (null == this._delegate)
                return;
            managers.FrameManager.getInstance().dismissPopWait();
            this._delegate.getDispatcher().dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_CONNECT_FAIlURE));
        };
        /**
         * 消息代理
         */
        ServiceCtrl.prototype.setDelegate = function (delegate) {
            //置空引用
            this._delegate = null;
            this._delegate = delegate;
        };
        ServiceCtrl.prototype.getDelegate = function () {
            return this._delegate;
        };
        /**
         * 获取TCP服务
         */
        ServiceCtrl.prototype.getTcpService = function () {
            return this.m_pTcpService;
        };
        /**
         * socket连接
         * @param host 主机域名
         * @param port 主机端口
         * @param serviceKind 服务模块
         */
        ServiceCtrl.prototype.Connect = function (host, port, serviceKind) {
            if (serviceKind === void 0) { serviceKind = 4 /* SERVICE_MODULE_LOGON */; }
            var tcpService = new service.TcpSocketService(serviceKind);
            tcpService.createConnect(host, port);
            this.m_pTcpService = null;
            this.m_pTcpService = tcpService;
            this.m_bPlaza = (serviceKind == 4 /* SERVICE_MODULE_LOGON */);
            if (true == this.m_bPlaza) {
                this._host = host;
                this._port = port;
            }
        };
        /**
         * 关闭服务
         */
        ServiceCtrl.prototype.closeService = function (msg, close) {
            if (msg === void 0) { msg = ""; }
            if (close === void 0) { close = false; }
            console.log("Ctrl主动断开443");
            if (this.m_pTcpService) {
                //关闭SOCKET
                if (close) {
                    this.m_pTcpService.closeService(msg, true);
                }
                else {
                    this.m_pTcpService.closeService();
                }
                this.m_pTcpService = null;
                //重置变量
                // utils.GameConst.colorConsole("当前引用");
                console.log(this._delegate);
                this._delegate = null;
            }
        };
        /**
         * 刷新服务
         */
        ServiceCtrl.prototype.onUpdate = function () {
            //服务刷新
            // console.log("服务刷新");
            if (this.m_pTcpService && this.m_pTcpService.onUpdate) {
                this.m_pTcpService.onUpdate();
            }
            if (this._MsgQueue.length == 0 || (null == this._delegate) || !this._isAllowDispatch)
                return;
            //处理队列
            if (null != this._delegate.onMessage) {
                //变量定义
                var dispatch = [];
                var length_1 = this._MsgQueue.length;
                length_1 = (length_1 < df.MAX_UNIT) ? length_1 : df.MAX_UNIT;
                //分帧处理
                dispatch = this._MsgQueue.slice(0, length_1);
                this._MsgQueue.splice(0, length_1);
                //消息分发
                while (dispatch.length) {
                    var msg = dispatch[0];
                    this._delegate.getDispatcher().dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, false, false, msg));
                    dispatch.shift();
                }
            }
        };
        return ServiceCtrl;
    }());
    managers.ServiceCtrl = ServiceCtrl;
    __reflect(ServiceCtrl.prototype, "managers.ServiceCtrl", ["df.IConnectSocket", "df.ISocketService"]);
})(managers || (managers = {}));
