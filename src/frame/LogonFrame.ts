/**
 * 登录服消息
 */
namespace frame {

    /**操作标识 */
    const LOGON_MODE_ACCOUNT = 1    //账号登录
    const LOGON_MODE_REGISTER = 2   //注册登录
    const LOGON_MODE_MINIPRO = 3    //小程序登录

    export class LogonFrame extends BaseFrame {
        private _operateCode: number = 0;
        private _MiniProgramInfo: df.CMiniProgramInfo;

        constructor(delegate?: any) {
            super(delegate);
        }

        public onRegist() {
            this._operateCode = LOGON_MODE_REGISTER;
            this.onConnectPlaza();
        }

        public onLogon() {
            this._operateCode = LOGON_MODE_ACCOUNT;
            this.onConnectPlaza();
        }

        public onMiniProgramLogon() {
            this._operateCode = LOGON_MODE_MINIPRO;
            this.onConnectPlaza();
        }

        /**连接广场 */
        public onConnectPlaza() {
            managers.ServiceCtrl.getInstance().setDelegate(this);
            managers.ServiceCtrl.getInstance().onConnectServer();
            // managers.ServiceCtrl.getInstance().onReconnect();
        }

        //小程序信息
        public setMiniProgramInfo(info: df.CMiniProgramInfo) {
            this._MiniProgramInfo = info;
        }

        /**连接成功*/
        public connectComplete(): void {
            utils.GameConst.colorConsole("登录成功，发送微信Info：");
            super.connectComplete();

            switch (this._operateCode) {
                case LOGON_MODE_MINIPRO: {
                    let weChatProgram = new df.CMD_MB_LogonMiniProgram();
                    weChatProgram.wModuleID = df.INVALID_WORD;                          //模块标识
                    weChatProgram.wMarketID = df.MARKET_ID;							    //渠道标识
                    weChatProgram.cbDeviceType = df.DEVICE_TYPE;                        //设备类型
                    weChatProgram.dwAppVersion = utils.PROCESS_VERSION(1, 1, 0, 1);	    //应用版本
                    weChatProgram.dwPlazaVersion = utils.PROCESS_VERSION(1, 1, 0, 0);	//广场版本
                    weChatProgram.dwStationID = df.STATION_ID;

                    weChatProgram.wRequestMask = 0x00;
                    // weChatProgram.dwClientIP = 0;
                    weChatProgram.szMachineID = utils.StringUtils.getGUID();	        //机器标识

                    weChatProgram.szWXCode = this._MiniProgramInfo.sCode;
                    weChatProgram.szSignature = this._MiniProgramInfo.signature;
                    weChatProgram.szInitVector = this._MiniProgramInfo.sIv;

                    //数据缓冲
                    let pBuffer: utils.ByteArray = weChatProgram.onInit();

                    //叠加包
                    let msg: string = this._MiniProgramInfo.sRawData;
                    let dataDesc = new df.tagDataDescribe();
                    dataDesc.wDataSize = msg.length * 2;
                    dataDesc.wDataDesc = df.DTP_GP_RAWDATA;
                    dataDesc.pBuffer = msg;
                    pBuffer.Append_Bytes(dataDesc.convertBytes().getByteArray());

                    //叠加包
                    let encryptedData = this._MiniProgramInfo.sEncryptedData;
                    dataDesc = new df.tagDataDescribe();
                    dataDesc.wDataSize = encryptedData.length * 2;
                    dataDesc.wDataDesc = df.DTP_GP_ENCRYPTDATA;
                    dataDesc.pBuffer = encryptedData;
                    pBuffer.Append_Bytes(dataDesc.convertBytes().getByteArray());

                    //发送数据
                    console.log(pBuffer);
                    let tcpService = managers.ServiceCtrl.getInstance().getTcpService();
                    tcpService.SendSocketData(df.MDM_MB_LOGON, df.SUB_MB_LOGON_MINIPROGRAM_WEB, pBuffer, pBuffer.getLength());
                }
                    break;
                default: {
                    egret.warn(false, "未知登录");
                }
                    break;
            }
        }

        /**
         * 网络消息
         */
        public onMessage(e: egret.Event): void {
            let msg = <network.Message>e.data;
            console.log("LogonFrame:", msg);
            var wMainCmd = msg.wMainCmd;
            switch (wMainCmd) {
                case df.MDM_MB_LOGON: //广场登录
                {
                    this.onSocketEventLogon(msg);
                }
                    break;
                case df.MDM_MB_SERVER_LIST: //列表命令
                {
                    this.onSocketEventServerList(msg);
                }
                    break;
                case df.MDM_ARS_ROUTE_SERVICE: //路由服务
                {
                    this.onSocketEventRouteService(msg);
                }
                    break;
                default: {
                    egret.warn(false, "未知消息");
                }
            }
        }

        private onSocketEventLogon(msg: network.Message) {
            let wSubCmd = msg.wSubCmd;
            switch (wSubCmd) {
                case df.SUB_MB_LOGON_SUCCESS: //登录成功
                {
                    // managers.FrameManager.getInstance().dismissPopWait();//游戏等待界面
                    let logonSuccess = new df.CMD_MB_LogonSuccess(); //用户个人信息
                    logonSuccess.onRead(msg.cbBuffer);
                    // console.log(logonSuccess);

                    //保存玩家数据
                    console.log("%cLogonFrame: 登录成功", "color: red;font-size: 2em");
                    console.log(logonSuccess);
                    managers.FrameManager.getInstance().m_GlobalUserItem = new models.UserData(logonSuccess);

                    //判断锁表
                    if (logonSuccess.wLockServerID == 0) {
                        //查询房间
                        console.log("进行房间查询");
                        this.onCheckRoom();
                    } else {
                        //进入指定房间
                        this.onEnterRoom(logonSuccess.wLockServerID);
                    }
                }
                    break;
                case df.SUB_MB_LOGON_FAILURE: {
                    console.log("%cLogonFrame: 登录失败", "color: red;font-size: 2em");
                    managers.FrameManager.getInstance().dismissPopWait();

                    let lErrorCode = msg.cbBuffer.Pop_LONG();
                    let szError = msg.cbBuffer.Pop_UTF16(msg.cbBuffer.getByteArray().bytesAvailable / 2);
                    console.log(lErrorCode, szError);
                    let self = this;
                    let callBack = () => {
                        GameEngine.getInstance().startGameHandler();
                    };
                    managers.FrameManager.getInstance().showToast(szError, callBack);

                    managers.ServiceCtrl.getInstance().closeService();
                }
                    break;
                case df.SUB_MB_UPDATE_NOTIFY: {
                    managers.ServiceCtrl.getInstance().closeService();
                }
                    break;
                case df.SUB_MB_LOGON_FINISH: //登录完成
                {
                    console.log("登录完成");
                }
                    break;
                default: {
                    egret.warn(false, "未知命令");
                }
                    break;
            }
        }

        private onSocketEventServerList(msg: network.Message) {
            let wSubCmd = msg.wSubCmd;
            switch (wSubCmd) {
                case df.SUB_MB_LIST_FINISH: {
                    console.log("列表完成");
                }
                    break;
                default: {
                    egret.warn(false, "未知命令");
                }
            }
        }

        private onSocketEventRouteService(msg: network.Message) {
            let wSubCmd = msg.wSubCmd;
            switch (wSubCmd) {
                case df.SUB_AR_S_SERVER_INFO: {
                    let serverInfo = new df.CMD_AR_S_ServerInfo();
                    serverInfo.onRead(msg.cbBuffer);
                    console.log("查询房间成功：", serverInfo);//游戏标识（111）以及房间号

                    if (serverInfo.wServerID == 0) {
                        //服务器繁忙
                        // this._delegate.showErrMsg(serverInfo.szDescribeString);
                    }
                    this.onEnterRoom(serverInfo.wServerID);
                }
                    break;
                default: {
                    egret.warn(false, "未知命令");
                }
            }
        }

        //查询房间
        public onCheckRoom() {
            managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = df.eServerModule.SERVICE_MODULE_ROUTE;//ServiceCtrl服务变成路由模块
            managers.ServiceCtrl.getInstance().setDelegate(this);
            let checkServer = new df.CMD_AR_C_QueryServer();
            checkServer.wKindID = df.KINDID;//火速斗地主小游戏标识
            checkServer.dwUserID = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;//玩家个人信息2027
            let buffer = checkServer.onInit();
            let tcpService = managers.ServiceCtrl.getInstance().getTcpService();
            tcpService.SendSocketData(df.MDM_ARS_ROUTE_SERVICE, df.SUB_AR_C_QUERY_SERVER, buffer, buffer.getLength());//发送查询房间的消息
        }

        private _gameFrame: frame.GameFrame = null;

        //进入房间
        private onEnterRoom(wServerID) {
            managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = df.eServerModule.SERVICE_MODULE_SERVER;//ServiceCtrl变为游戏模块
            // if (this._gameFrame == null) {
            let gameFrame = new frame.GameFrame();
            // }
            // let gameFrame = new frame.GameFrame();
            managers.ServiceCtrl.getInstance().setDelegate(gameFrame);//更换ServiceCtrl的代理为游戏模块
            gameFrame.setDelegate(GameEngine.getInstance());
            GameEngine.getInstance().GameFrame = gameFrame;
            //在这里查询低保
            let baseEnsure = new frame.BaseEnsureFrame();
            gameFrame.baseEnsure = baseEnsure;
            baseEnsure.sendFlushBaseEnsure();
            gameFrame.onLogonRoom(wServerID);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
    }
}