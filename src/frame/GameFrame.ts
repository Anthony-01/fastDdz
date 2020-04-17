/**
 * 游戏框架
 */

namespace frame {
    import DTP_GR_COMPUTER_ID = df.DTP_GR_COMPUTER_ID;
    const NORMAL = 0;
    const RETRY = 1;
    const BATTLE = 2;
    const DISTRIBUTE = 4;
    const MATCH = 5;
    const VIDEO = 6;

    const ACTION_TYPE_GAME = 1;
    const ACTION_TYPE_FRAME = 2;
    export class GameFrame extends BaseFrame {
        private _dismissState: { [key: number]: number } = {};               //约战状态
        private _wKindID = df.INVALID_WORD;                                  //游戏ID
        private _dwKindVersion = utils.PROCESS_VERSION(1, 1, 0, 1)           //游戏版本
        private _wTableCount = 0;                                             //桌子数目
        private _wChairCount = 0;                                             //椅子数目
        private _wServerType = 0;                                             //游戏类型
        private _dwServerRule = 0;                                            //游戏规则
        private _cbSegmentGame = 0;                                          //游戏段位
        private _dwGameBuglePrice = 0;                                       //喇叭价格
        private _dwRoomBuglePrice = 0;                                       //喇叭价格
        private _UserList: { [key: number]: models.UserItem } = {};           //用户列表
        private _TableUserList: { [key: number]: any[] } = {};                //玩家MAP
        private _TableStatus: { [key: number]: number } = {};                 //桌子状态
        private _BattleUserInfo: { [key: number]: any } = {};                //约战玩家信息

        private _wTableID = df.INVALID_TABLE;                                 //桌子ID
        private _wChairID = df.INVALID_CHAIR;                                 //椅子ID
        private _wVideoChair = df.INVALID_CHAIR;
        private _cbTableLock = 0;
        private _cbGameStatus = 0;                                            //游戏状态
        private _cbAllowLookon = 0;                                           //允许旁观

        private _PlayCountEx = 0;                                            //游戏人数
        private _BattleParam: df.CMD_GF_TableParam;                          //约战信息
        private _LogonType: number = NORMAL;                                 //连接类型

        private self: GameFrame = this;

        constructor(delegate?: any) {
            super(delegate);
        }

        /**设置游戏信息 */
        private _gameModule: any;
        public setKindInfo(kindID: number, version: number, gameModule: any) {
            this._wKindID = kindID;
            this._dwKindVersion = version;
            this._gameModule = gameModule;
        }

        //观看模式
        public isLookonMode() {

        }
        /**服务类型 */
        public getServerType(): number {
            return this._wServerType;
        }
        /**金币模式 */
        public isGoldMode(): boolean {
            return this._wServerType && ((this._wServerType & df.GAME_GENRE_GOLD) != 0);
        }
        /**积分模式 */
        public isScoreMode(): boolean {
            return this._wServerType && ((this._wServerType & df.GAME_GENRE_SCORE) != 0);
        }
        /**比赛模式 */
        public isMatchMode(): boolean {
            return this._wServerType && ((this._wServerType & df.GAME_GENRE_MATCH) != 0);
        }
        /**约战模式 */
        public isBattleMode(): boolean {
            if (this.isVedioMode()) {
                return this._wServerType && ((this._wServerType & df.TABLE_GENRE_CREATE) != 0)
            }
            return this._LogonType == BATTLE;
        }
        /**视频模式 */
        public isVedioMode(): boolean {
            return this._LogonType == VIDEO;
        }

        /*获取游戏状态*/
        public getGameStatus() {
            return this._cbGameStatus
        }

        /**获取游戏模式 */
        public getLogonMode() {
            return this._LogonType;
        }
        //设置游戏状态
        public setGameStatus(cbGameStatus) {
            this._cbGameStatus = cbGameStatus;
        }

        //约战信息
        public getBattleParams() {
            return this._BattleParam;
        }

        //椅子张数
        public getChairCount() {
            return this._wChairCount;
        }

        //桌子张数
        public getTableCount() {
            return this._wTableCount;
        }

        //获取桌子ID
        public getTableID() {
            return this._wTableID;
        }

        //获取椅子ID
        public getChairID() {
            if (this._LogonType == VIDEO)
                return this._wVideoChair - 1;
            return this._wChairID;
        }

        /**
         * 登录房间
         */
        public onLogonRoom(wServerID) {
            //登录房间   
            let logonRoom = new df.CMD_GR_LogonByMobile();
            logonRoom.wGameID = df.KINDID;
            logonRoom.dwPlazaVersion = df.PLAZA_VERSION;
            logonRoom.dwProcessVersion = this._dwKindVersion;
            logonRoom.cbDeviceType = df.DEVICE_TYPE;
            logonRoom.wBehaviorFlags = df.BEHAVIOR_LOGON_IMMEDIATELY;
            logonRoom.wPageTableCount = 1;
            logonRoom.dwUserStationID = managers.FrameManager.getInstance().m_GlobalUserItem.dwStationID;
            logonRoom.dwPlazaStationID = df.STATION_ID;
            logonRoom.dwUserID = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
            logonRoom.szAccounts = managers.FrameManager.getInstance().m_GlobalUserItem.szAccounts;
            logonRoom.szPasspublic = managers.FrameManager.getInstance().m_GlobalUserItem.szLogonPass;
            logonRoom.szDynamicPass = managers.FrameManager.getInstance().m_GlobalUserItem.szDynamicPass;
            logonRoom.wServerID = wServerID;
            logonRoom.szServerpasswd = "";
            logonRoom.szMachineID = managers.FrameManager.getInstance().m_GlobalUserItem.szMachine;
            logonRoom.dGlobalPosLng = 0;
            logonRoom.dGlobalPosLat = 0;
            logonRoom.dwMatchID = 0;
            logonRoom.lMatchNo = 0;

            this.sendLogonRoom(logonRoom);

            let serverInfo = {
                wServerID: wServerID
            };

            localStorage.setItem("serverID", JSON.stringify(serverInfo));

            // DTP_GR_COMPUTER_ID
        }

        /**当前激活tcp */
        private getCurActiveTcp() {
            return managers.ServiceCtrl.getInstance().getTcpService();
        }

        /**发送游戏消息包 */
        public sendData(wMainCmd: number, wSubCmd: number, buffer: utils.ByteArray) {
            if (null == this.getCurActiveTcp())
                return;

            console.log("是否发送数据成功:");//当前TCP服务为游戏模块
            console.log(this.getCurActiveTcp().SendSocketData(wMainCmd, wSubCmd, buffer, buffer.getLength()));
        }

        /** 网络消息*/
        public onMessage(e: egret.Event): void {
            console.log("GameFrame命令:", e.data);
            let msg = e.data as network.Message;
            const wServerModule = msg.wServerModule;
            if (msg.wSubCmd == df.SUB_GP_USER_INDIVIDUAL) {
                utils.GameConst.colorConsole("查询玩家个人资料:")
                console.log(msg);
            }
            switch (wServerModule) {
                case df.eServerModule.SERVICE_MODULE_SERVER:
                    {
                        this.onSocketEventServer(msg);
                    }
                    break;
                case df.eServerModule.SERVICE_MODULE_ACCESS:
                    {
                        this.onSocketEventAccess(msg);
                    }  
                    break;
                case df.eServerModule.SERVICE_MODULE_LOGON: //低保服务
                    {
                        this.onBaseEnsureServer(msg);
                    }
                default: {
                    console.log("其他消息");
                }
            }
        }

        private onSocketEventServer(msg: network.Message) {
             const wMainCmd = msg.wMainCmd;
             console.log("游戏框架代理主命令:", wMainCmd);
             switch (wMainCmd) {
                case df.MDM_GR_LOGON:
                    {
                        this.onSocketLogonEvent(msg);
                    }
                    break;
                case df.MDM_GR_USER:
                    {
                        this.onSocketUserEvent(msg);
                    }
                    break;
                case df.MDM_GR_STATUS:
                    {
                        console.log("状态命令");
                    }
                    break;
                case df.MDM_GF_FRAME://框架命令
                    {
                        this.onSocketFrameEvent(msg);
                    }
                    break;
                case df.MDM_GF_GAME:
                    {
                        if (null != this._delegate && this._delegate.onGameMessage) {
                            this._delegate.onGameMessage(msg);
                        } else {
                            console.log("游戏协议未实现");
                        }
                    }
                    break;
                case df.MDM_CM_SYSTEM:
                    {
                        this.onSocketCMSystemMessage(msg)
                    }
                    break;
            }
        }

        private onSocketEventAccess(msg: network.Message) {
            const wMainCmd = msg.wMainCmd;
             switch (wMainCmd) {
                case df.MDM_GA_ACCESS_SERVICE:
                    {
                        this.onSocketAccessEvent(msg);
                    }
                    break;
                default:
                    {
                        egret.warn(false,"未知命令");
                    }   
                    break; 
             }
        }

        private onBaseEnsureServer(msg: network.Message) {
            // let msg = e.data as network.Message;
            const wMainCmd = msg.wMainCmd;
            const wSubCmd = msg.wSubCmd;
            switch (wMainCmd) {
                case 5:
                {
                    if (wSubCmd == df.SUB_GP_BASEENSURE_INFO) {
                        this.onSubBaseEnsureInfo(msg.cbBuffer);
                        // managers.ServiceCtrl.getInstance().closeService();
                    } else if (wSubCmd == df.SUB_GP_BASEENSURE_RESULT) {
                        this.onSubBaseEnsureResult(msg.cbBuffer)
                        // managers.ServiceCtrl.getInstance().closeService();
                    } else if (wSubCmd == df.SUB_GP_BASEENSURE_FAILED) {
                        this.onSubBaseEnsureFailure(msg.cbBuffer);
                        // managers.ServiceCtrl.getInstance().closeService();
                    } else if (wSubCmd == df.SUB_GP_VALIDATECDOE_INFO) {
                        this.onValidateCodeEvent(msg.cbBuffer)
                    }else if (wSubCmd == df.SUB_GP_USER_WEALTH) {
                        console.log("查询财富服务：");
                        this.onSubQueryWealth(msg.cbBuffer);
                    } else if (wSubCmd == df.SUB_GP_USER_INDIVIDUAL) {
                        utils.GameConst.colorConsole("查询个人信息：");
                        console.log(msg.cbBuffer);
                    }
                }
                    break;
                default:
                {
                    egret.assert(false);
                    console.log("未知命令码");
                }
            }
        }

        private onSubQueryWealth(buffer: utils.ByteArray) {
            let message = new df.CMD_GP_UserWealth();
            message.init(buffer);
            managers.FrameManager.getInstance().m_GlobalUserItem.lUserScore = message.lUserScore;
            this._UserList[managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID].lScore = message.lUserScore;
            utils.GameConst.colorConsole("查询财富:");
            console.log(message.lUserScore);
        }

        //低保配置
        private onSubBaseEnsureInfo(buffer: utils.ByteArray) {
            //领取信息
            let cbTakedTimes = buffer.Pop_Byte();
            //低保配置
            let lTakeGold = buffer.Pop_SCORE();
            let lTakeCondition = buffer.Pop_SCORE();
            let cbTakeTimesPerAccounts = buffer.Pop_Byte();

            let score = buffer.Pop_SCORE();
            let insure = buffer.Pop_SCORE();

            console.log("低保信息:", cbTakedTimes, lTakeGold, lTakeCondition, cbTakeTimesPerAccounts, score, insure);
            let msg = {
                times: cbTakedTimes,
                gold: lTakeGold,
                condition: lTakeCondition,
                totalTime: cbTakeTimesPerAccounts,
                userGold: score,
                insure: insure
            };
            GameEngine.getInstance().updateBaseEnsure(msg);

            //财富信息
            // managers.FrameManager.getInstance().m_GlobalUserItem.lUserScore = buffer.Pop_SCORE();
            // managers.FrameManager.getInstance().m_GlobalUserItem.lUserInsure = buffer.Pop_SCORE();

            // if (this._delegate && this._delegate.onRefreshBaseEnsureInfo) {
            //     this._delegate.onRefreshBaseEnsureInfo(this._cbTakedTimes,this._lTakeGold,this._lTakeCondition,this._cbTakeTimesPerAccounts);
            // }
        }

        private _baseEnsureFrame: BaseEnsureFrame = null;
        set baseEnsure(frame: BaseEnsureFrame) {
            this._baseEnsureFrame = frame;
        }

        searchBaseEnsure() {
            if (this._baseEnsureFrame) {
                this._baseEnsureFrame.sendFlushBaseEnsure();
            }
        }

        //领取结果
        private onSubBaseEnsureResult(buffer: utils.ByteArray) {
            let cbTakedTimes = buffer.Pop_Byte();						                                        //领取次数
            let Score = buffer.Pop_SCORE();				//当前金币

            let msg = buffer.Pop_UTF16(buffer.getByteArray().bytesAvailable/2);

            console.log("领取结果：", cbTakedTimes, Score, msg);
            // managers.FrameManager.getInstance().showToast(msg);

            // //刷新界面
            // if (this._delegate && this._delegate.onBaseEnsureResult) {
            //     this._delegate.onBaseEnsureResult(cbTakedTimes);
            // }
        }

        private onSubBaseEnsureFailure(buffer: utils.ByteArray) {
            let msg = buffer.Pop_UTF16(buffer.getByteArray().bytesAvailable/2);
            console.log("操作失败:", msg);
            // managers.FrameManager.getInstance().showToast(msg);

            // if (this._delegate && this._delegate.onTakeBaseEnsureFailure) {
            //     this._delegate.onTakeBaseEnsureFailure();
            // }
        }

        private onValidateCodeEvent(buffer: utils.ByteArray) {
            let dwValidateCode = buffer.Pop_DWORD();
            const a = (dwValidateCode&0xff000000)>>24;
            const b = (dwValidateCode&0x00ff0000)>>16;
            const c = (dwValidateCode&0x0000ff00)>>8;
            const d = dwValidateCode&0x000000ff;

            let result: string = String.fromCharCode(d) + "-" + String.fromCharCode(c) + "-" + String.fromCharCode(b) + "-" + String.fromCharCode(a);
            result = result.toUpperCase();

            console.log("验证码信息:", a, b, c, d, result);
            // this._szValidateCode = utils.MD5.MD5_HEX("Validate:"+result).toUpperCase();
            // this.sendGetBaseEnsure();
        }

        
        /**登录协议 */
        public onSocketLogonEvent(msg: network.Message) {
            const wSubCmd = msg.wSubCmd;
            switch (wSubCmd) {
                case df.SUB_GR_LOGON_FINISH:
                    {
                        this.onSubLogonFinish(msg);
                        GameEngine.getInstance()._isReConnect = false;
                    }
                    break;
                case df.SUB_GR_LOGON_SUCCESS:
                    {
                        this.onSubLogonSuccess(msg);
                    }
                    break;
                case df.SUB_GR_LOGON_FAILURE:
                    {
                        let failure = new df.CMD_GR_LogonFailure(msg);
                        let self = this;
                        let callBack = () => {
                            self.onExitGame();
                            GameEngine.getInstance().startGameHandler();
                            managers.FrameManager.getInstance().dismissPopWait();
                        };
                        managers.FrameManager.getInstance().showToast(failure.szDescribeString, callBack);
                        
                        managers.ServiceCtrl.getInstance().closeService();
                        console.log("房间登录失败");
                        
                    }
                    break;
                case df.SUB_GR_UPDATE_NOTIFY:
                    {
                        let update = new df.CMD_GR_UpdateNotify(msg);
                        let self = this;
                        let callBack = () => {
                            self.onExitGame();
                            GameEngine.getInstance().startGameHandler();
                        };
                        managers.FrameManager.getInstance().showToast("游戏接入版本不匹配", callBack);
                    }
                    break;
            }
        }

        /**接入协议 */
        private onSocketAccessEvent(msg: network.Message) {
            const wSubCmd = msg.wSubCmd;
            switch (wSubCmd) {
                case df.SUB_GA_S_SYSTEM_MESSAGE:
                    {
                        this.onSocketSystemMessage(msg);
                    }
                    break;
                default:
                    {
                        egret.warn(false,"未知命令");
                    }   
                    break; 
            }
        }

        public onSubLogonSuccess(msg: network.Message) {
            let success = new df.CMD_GR_LogonSuccess(msg);
            console.log(success);

        }
        public onSubLogonFinish(msg: network.Message) {
            //断线重连判断
            if (this._wTableID != df.INVALID_TABLE) {
                this.onEnterGame()
            } 
        }

        /**用户信息 */
        public onSocketUserEvent(msg: network.Message) {
            const wSubCmd = msg.wSubCmd;
            switch (wSubCmd) {
                case df.SUB_GR_USER_ENTER:
                    {
                        this.onSocketUserEnter(msg);
                    }
                    break;
                case df.SUB_GR_USER_STATUS:
                    {
                        this.onSocketUserStatus(msg);//用户状态
                    }
                    break;
                case df.SUB_GR_USER_SCORE:
                    {
                        this.onSocketUserScore(msg);
                    }
                    break;
                case df.SUB_GR_REQUEST_FAILURE:
                    {
                        this.onSocketReQuestFailure(msg);
                    }
                    break;
            }
        }

        private _executeCount: number = 0;
        private _tableFlag: boolean = false;
        public onSocketUserEnter(msg: network.Message) {
            console.log("%c用户进入:", "color: red;font-size: 2em");
            // console.log("执行次数", ++this._executeCount);
            let userItem = new models.UserItem();

            userItem.dwGameID = msg.cbBuffer.Pop_DWORD();
            userItem.dwUserID = msg.cbBuffer.Pop_DWORD();

            //自己判断
            let bMySelf = (userItem.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID);

            //读取信息
            userItem.wFaceID = msg.cbBuffer.Pop_WORD();		    //用户头像
        
            userItem.cbGender = msg.cbBuffer.Pop_Byte();		//用户性别
            userItem.cbMemberOrder = msg.cbBuffer.Pop_Byte();	//会员等级

            userItem.TableID = msg.cbBuffer.Pop_WORD();		//桌子位置
            userItem.ChairID = msg.cbBuffer.Pop_WORD();		//椅子位置
            userItem.cbUserStatus = msg.cbBuffer.Pop_Byte();    //用户状态

            if (userItem.cbUserStatus == df.US_LOOKON) {
                if (bMySelf) {
                    let self = this;
                    let callBack = () => {
                        self.onExitGame();
                        GameEngine.getInstance().startGameHandler();
                    };
                    managers.FrameManager.getInstance().showToast("该房间不支持旁观模式", callBack);
                    return;
                }
            }

            userItem.lGold = msg.cbBuffer.Pop_SCORE();
            userItem.lScore = msg.cbBuffer.Pop_SCORE();//用户进入的金币
            

            userItem.dwWinCount = msg.cbBuffer.Pop_DWORD();
            userItem.dwLostCount = msg.cbBuffer.Pop_DWORD();
            userItem.dwDrawCount = msg.cbBuffer.Pop_DWORD();
            userItem.dwFleeCount = msg.cbBuffer.Pop_DWORD();
            userItem.dwExperience = msg.cbBuffer.Pop_DWORD();

            //用户经纬度
            userItem.dGlobalPosLng = msg.cbBuffer.Pop_DOUBLE();
            userItem.dGlobalPosLat = msg.cbBuffer.Pop_DOUBLE();

            let wSize: number = 0;
            let wDesc: number = 0;
            while (msg.cbBuffer.getByteArray().bytesAvailable > 0) { //附加信息
                wSize = msg.cbBuffer.Pop_WORD();
                wDesc = msg.cbBuffer.Pop_WORD();
                 // console.log("用户属性", wDesc);
                 if (wDesc == df.DTP_GR_USER_EXTERNUID) {
                    userItem.szExternUID = msg.cbBuffer.Pop_UTF16(wSize / 2);
                } else if (wDesc == df.DTP_GR_USER_NICKNAME) {
                    userItem.szNickName = msg.cbBuffer.Pop_UTF16(wSize / 2);
                    // console.log("昵称：", userItem.szNickName);
                } else if (wDesc == df.DTP_GR_USER_AVATARURL) {
                     if (userItem.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                         msg.cbBuffer.Pop_UTF16(wSize / 2);
                         userItem.szHeadURL = JSON.parse(GameEngine.getInstance().userInfo.rawData)["avatarUrl"];
                         // console.log("头像URL：", userItem.szHeadURL);
                     } else {
                        userItem.szHeadURL =  msg.cbBuffer.Pop_UTF16(wSize / 2);
                        // console.log("头像URL：", userItem.szHeadURL);
                     }
                } else {
                     msg.cbBuffer.Pop_UTF16(wSize / 2);
                 }
            }

            //缓存
            let item = this._UserList[userItem.dwUserID];

            if (null != item) { //再次进入
                item.dwGameID = userItem.dwGameID;
                item.lScore = userItem.lScore;
                item.lGold = userItem.lGold;
                item.wFaceID = userItem.wFaceID;
                item.dwCustomID = userItem.dwCustomID;
                item.cbGender = userItem.cbGender;
                item.cbMemberOrder = userItem.cbMemberOrder;
                item.TableID = userItem.TableID;
                item.ChairID = userItem.ChairID;
                item.cbUserStatus = userItem.cbUserStatus;
                item.dwWinCount = userItem.dwWinCount;
                item.dwLostCount = userItem.dwLostCount;
                item.dwDrawCount = userItem.dwDrawCount;
                item.dwFleeCount = userItem.dwFleeCount;
                item.dwExperience = userItem.dwExperience;
                item.szNickName = userItem.szNickName;
                item.szHeadURL = userItem.szHeadURL;
            } else {
                // console.log("保存用户信息");
                userItem.lScore = userItem.lScore;
                this._UserList[userItem.dwUserID] = userItem;
            }

            utils.GameConst.colorConsole("用户进入入口：");
            console.log(userItem);
            //记录自己桌椅号
            // console.log("用户匹配：", userItem.dwUserID, managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID);
            if (userItem.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                this._wTableID = userItem.TableID;
                this._wChairID = userItem.ChairID;
            }
            // else if (this._tableFlag == false) {
            //     this._wTableID = userItem.TableID;
            //     this._tableFlag = true;
            // }

            if (userItem.TableID != df.INVALID_TABLE) {
                this.onUpDataTableUser(userItem.TableID, userItem.ChairID, userItem);
            }

            //通知业务层用户进入
            console.log(this._UserList[managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID]);
            console.log(userItem.TableID);

            //如果桌号已经存在并且用户相等，那么更新用户信息
            if (this._UserList[managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID] &&
                this._wTableID != df.INVALID_TABLE && userItem.TableID == this._wTableID) {
                if (null != this._delegate) {
                    let data = { table: userItem.TableID, chair: userItem.ChairID, user: userItem };
                    utils.GameConst.colorConsole("其他用户进入:");
                    console.log("GameFrame============>【用户进入】", userItem.szNickName);
                    console.log(userItem);
                    this._delegate.dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_USER_ENTER, false, false, data));
                }
            }
            else if (this._wTableID == df.INVALID_TABLE && userItem.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                // console.log(this._delegate);
                if (null != this._delegate) {
                    let data = { table: userItem.TableID, chair: userItem.ChairID, user: userItem };
                    utils.GameConst.colorConsole("自己用户进入:");
                    console.log("GameFrame============>【用户进入】", userItem.szNickName);
                    console.log(userItem);
                    this._delegate.dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_USER_ENTER, false, false, data));
                }
            }
        }

        /**用户状态 */
        public onSocketUserStatus(msg: network.Message) {
            let self = this;
            //读取信息
            // console.log("%c更新用户信息:", "color: red;font-size: 2em");
            const dwUserID = msg.cbBuffer.Pop_DWORD();
            let newstatus: any = {};
            newstatus.wTableID = msg.cbBuffer.Pop_WORD();
            newstatus.wChairID = msg.cbBuffer.Pop_WORD();
            newstatus.cbUserStatus = msg.cbBuffer.Pop_Byte();
            //是否更新游戏分数

            //自己判断
            const bMySelf = (dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID);

            console.log("是否更新自己信息", bMySelf);

            //获取自己
            let myUserItem = this.getMeUserItem();

            //更新记录
            if (bMySelf) {
                //未找到自己
                if (null == myUserItem)
                    return;

                this._wTableID = newstatus.wTableID;
                this._wChairID = newstatus.wChairID;

                myUserItem.TableID = this._wTableID;
                myUserItem.ChairID = this._wChairID;

                for (let property in this._UserList) {
                    if (this._UserList[managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID] &&
                        this._wTableID != df.INVALID_TABLE && this._UserList[property].TableID == this._wTableID) {
                        if (null != this._delegate) {
                            let data = { table: this._UserList[property].TableID, chair: this._UserList[property].ChairID, user: this._UserList[property] };
                            utils.GameConst.colorConsole("更新用户进入:");
                            console.log("GameFrame============>【用户进入】", this._UserList[property].szNickName);
                            console.log(this._UserList[property]);
                            this._delegate.dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_USER_ENTER, false, false, data));
                        }
                    }
                }

                // for (let n = 0; n < 3; n++) {
                //     this.queryUserInfo(this._wTableID, n);
                // }
            }

            //本地记录
            let localUser = this._UserList[dwUserID];//找到更新用户
            // console.log("找到本地用户:", JSON.stringify(localUser));
            //找不到用户
            if (null == localUser) {
                if (newstatus.cbUserStatus == df.US_LOOKON) {
                    // console.log("更新直接返回:520");
                    return;
                }

                //当前桌子用户
                if (this._wTableID != df.INVALID_TABLE && newstatus.wTableID == this._wTableID) {
                    //构造玩家
                    localUser = new models.UserItem();
                    localUser.szNickName = "游戏玩家";
                    localUser.dwUserID = dwUserID;
                    localUser.cbUserStatus = newstatus.cbUserStatus;
                    localUser.TableID = newstatus.wTableID;
                    localUser.ChairID = newstatus.wChairID;
                    this._UserList[dwUserID] = localUser;
                    //发送查询
                    this.queryUserInfo(newstatus.wTableID, newstatus.wChairID);
                    utils.GameConst.colorConsole("查询游戏玩家:");
                    console.log(newstatus.wTableID, newstatus.wChairID);
                }
                // console.log("更新直接返回:536");
                return;

            } else {
                if (localUser.cbUserStatus != df.US_LOOKON && newstatus.cbUserStatus == df.US_LOOKON) {
                    newstatus.cbUserStatus = df.US_FREE;
                    newstatus.wTableID = df.INVALID_TABLE;
                    newstatus.wChairID = df.INVALID_CHAIR;
                }
            }

            //记录旧状态
            let oldstatus: any = {};
            oldstatus.wTableID = localUser.TableID;
            oldstatus.wChairID = localUser.ChairID;
            oldstatus.cbUserStatus = localUser.cbUserStatus;

            //更新信息
            localUser.cbUserStatus = newstatus.cbUserStatus;
            localUser.TableID = newstatus.wTableID;
            localUser.ChairID = newstatus.wChairID;

            //比赛过滤起立
            if (newstatus.cbUserStatus == df.US_FREE && oldstatus.cbUserStatus > df.US_FREE && this.isMatchMode()) {
                if (bMySelf) {
                    this._wTableID = oldstatus.wTableID;
                    this._wChairID = oldstatus.wChairID;
                }
                console.log("更新直接返回:563");
                return;
            }

            //清除旧桌子椅子记录
            if (oldstatus.wTableID != df.INVALID_TABLE) {
                //新旧桌子不同 新旧椅子不同
                if ((oldstatus.wTableID != newstatus.wTableID) || (oldstatus.wChairID != newstatus.wChairID)) {
                    this.onUpDataTableUser(oldstatus.wTableID, oldstatus.wChairID, null);//起立
                }
            }
            //新桌子记录	
            if (newstatus.wTableID != df.INVALID_TABLE) {
                this.onUpDataTableUser(newstatus.wTableID, newstatus.wChairID, localUser);//坐下
            }

            //自己状态
            if (bMySelf == true) {
                //离开
                if (newstatus.cbUserStatus == df.US_NULL) {
                    console.log("用户状态: 离开");
                    this.onExitGame();
                } else if (newstatus.cbUserStatus == df.US_FREE && oldstatus.cbUserStatus > df.US_FREE) {
                    console.log("用户状态: 起立");
                    this.onExitGame();
                } else if (newstatus.cbUserStatus > df.US_FREE && oldstatus.cbUserStatus < df.US_SIT) {
                    console.log("用户状态: 坐下");
                    this.onEnterGame();//进入桌面
                } else {
                    console.log("用户状态");
                    //通知用户状态
                    if (null != this._delegate) {
                        let data = { user: localUser, newstatus: newstatus, oldstatus: oldstatus };
                        console.log("GameFrame【更新当前用户状态:】", localUser.szNickName, localUser.cbUserStatus, localUser.szHeadURL);
                        this._delegate.dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_USER_STATUS, false, false, data));
                    }
                }
            } else { //其他玩家状态

                //通知用户状态
                if (null != this._delegate) {
                    let data = { user: localUser, newstatus: newstatus, oldstatus: oldstatus };
                    console.log("GameFrame【更新其他用户状态】", localUser.szNickName, localUser.szHeadURL);

                    this._delegate.dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_USER_STATUS, false, false, data));
                }

                //删除用户
                if (localUser.cbUserStatus == df.US_NULL || localUser.cbUserStatus == df.US_LOOKON) {
                    this.onRemoveUser(dwUserID)
                }
            }
        }

        /**用户分数 */
        public onSocketUserScore(msg: network.Message) {
            let MobileUserScore = new df.CMD_GR_MobileUserScore();
            MobileUserScore.onInit(msg.cbBuffer);

            //查找用户
            let item = this._UserList[MobileUserScore.dwUserID];
            if (null == item) return;

            //通知更新
            if (this._wTableID != df.INVALID_TABLE && item.TableID == this._wTableID) {
                let data = { user: item, score: MobileUserScore.UserScore.lScore };
                item.lScore = MobileUserScore.UserScore.lScore;
                this._delegate.dispatchEvent(new customEvent.CustomEvent(customEvent.CustomEvent.EVENT_USER_SCORE, false, false, data));
            }

            //更新数据
            if (MobileUserScore.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID &&
                (this._wServerType & df.GAME_GENRE_GOLD)) {
                managers.FrameManager.getInstance().m_GlobalUserItem.lUserScore = MobileUserScore.UserScore.lScore;
            }

            console.log("GameFrame【用户分数】", item.szNickName, MobileUserScore.UserScore.lScore);
        }

        /**框架消息 */
        public onSocketFrameEvent(msg: network.Message) {
            const wSubCmd = msg.wSubCmd;
            switch (wSubCmd) {
                case df.SUB_GF_GAME_STATUS:
                {
                    this._cbGameStatus = msg.cbBuffer.Pop_Byte();
                    this._cbAllowLookon = msg.cbBuffer.Pop_Byte();
                }
                    break;
                case df.SUB_GF_GAME_SCENE:
                {
                    if (null != this._delegate && this._delegate.onGameScene) {
                        this._delegate.onGameScene(this._cbGameStatus, msg);
                    } else {
                        console.log("游戏场景未实现");
                    }
                }
                    break;
                case df.SUB_GF_SYSTEM_MESSAGE:
                {
                    this.onSocketSystemMessage(msg);
                }
                    break;
            }
        }
        /**系统消息 */
        public onSocketSystemMessage(msg: network.Message) {
            const wType = msg.cbBuffer.Pop_WORD();
            const wElpase = msg.cbBuffer.Pop_WORD();
            const wLength = msg.cbBuffer.Pop_WORD();
            const szString = msg.cbBuffer.Pop_UTF16(msg.cbBuffer.getByteArray().bytesAvailable / 2);
            const bCloseRoom: boolean = (wType & df.SMT_CLOSE_ROOM) ? true : false;
            const bCloseGame: boolean = (wType & df.SMT_CLOSE_GAME) ? true : false;
            const bCloseLink: boolean = (wType & df.SMT_CLOSE_LINK) ? true : false;

            const bClose: boolean = (bCloseRoom || bCloseGame || bCloseLink);

            if (this._delegate && this._delegate.showMessage && bClose == true) {
                let callBack = () => {
                    this.onExitGame();
                };
                this._delegate.showMessage(szString, callBack, 1);
                // this.onExitGame();
            }

            this.onSystemMessage(bClose, wType, szString)
        }

        /**系统动作 */
        public onSocketActionMessage(msg: network.Message) {
            const wType = msg.cbBuffer.Pop_WORD();
            const wLength = msg.cbBuffer.Pop_WORD();
            const nButtonType = msg.cbBuffer.Pop_INT();
            const szString = msg.cbBuffer.Pop_UTF16(msg.cbBuffer.getByteArray().bytesAvailable / 2);

            const bCloseRoom: boolean = (wType & df.SMT_CLOSE_ROOM) ? true : false;
            const bCloseGame: boolean = (wType & df.SMT_CLOSE_GAME) ? true : false;
            const bCloseLink: boolean = (wType & df.SMT_CLOSE_LINK) ? true : false;

            const bClose: boolean = (bCloseRoom || bCloseGame || bCloseLink)

            this.onSystemMessage(bClose, wType, szString)
        }
       
        /**系统消息 */
        public onSocketCMSystemMessage(msg: network.Message) {
            let describe: string = "";
            let wType: number = 0;
            if (msg.wSubCmd == df.SUB_CM_SYSTEM_MESSAGE) {
                wType = msg.cbBuffer.Pop_WORD();
                let wElpase = msg.cbBuffer.Pop_WORD();
                let wLength = msg.cbBuffer.Pop_WORD();

                describe = msg.cbBuffer.Pop_UTF16(msg.cbBuffer.getByteArray().bytesAvailable / 2);
            } else if (msg.wSubCmd == df.SUB_CM_ACTION_MESSAGE) {
                wType = msg.cbBuffer.Pop_WORD();
                let wLength = msg.cbBuffer.Pop_WORD();
                let nButtonType = msg.cbBuffer.Pop_INT();
                describe = msg.cbBuffer.Pop_UTF16(msg.cbBuffer.getByteArray().bytesAvailable / 2);
            }

            let bCloseRoom = wType & df.SMT_CLOSE_ROOM;
            let bCloseGame = wType & df.SMT_CLOSE_GAME;
            let bCloseLink = wType & df.SMT_CLOSE_LINK;

            let bClose = (bCloseRoom != 0 || bCloseGame != 0 || bCloseLink != 0);
            this.onSystemMessage(bClose, wType, describe);
        }

        public onSystemMessage(bClose: boolean, wType: number, message: string = "") {
            console.log("system msg bClose:", bClose);
            console.log("system msg wType:", wType);
            console.log("system msg message:", message);

            let self = this;

            let callback: any = null;
            if (true == bClose) { //点击“确定”以后回到初始界面
                managers.FrameManager.getInstance().dismissPopWait();

                if (true == managers.FrameManager.getInstance().isGameController()) {
                    callback = () => {
                        this.onExitGame();
                        GameEngine.getInstance().startGameHandler();
                    }
                }
                managers.FrameManager.getInstance().showDailog(bClose ? df.eDialogMode.OK_ONLY : df.eDialogMode.OK_CANCELL, message, callback);
                return;
            }

            if (message.length > 0) {
                if (this._delegate && this._delegate.onSystemMessage) {
                    if (wType != 1 && wType != 4099) {
                        managers.FrameManager.getInstance().showDailog(bClose ? df.eDialogMode.OK_ONLY : df.eDialogMode.OK_CANCELL, message, () => {
                            self.onExitGame();
                            GameEngine.getInstance().startGameHandler();
                        });
                    } else if (wType == 1){
                        // managers.FrameManager.getInstance().showToast(message);
                        this._delegate.onSystemMessage(message);
                    } else {
                        if (wType == 4099) {
                            //更新消息
                            GameEngine.getInstance().addBase();
                        }
                        managers.FrameManager.getInstance().showToast(message);
                    }
                    return;
                }
                managers.FrameManager.getInstance().showToast(message);
                // df.SUB_CM_SYSTEM_MESSAGE
            }
        }

        /**请求失败 */
        public onSocketReQuestFailure(msg: network.Message) {
            let failure = new df.CMD_GR_RequestFailure(msg);
            console.log(failure.szDescribeString);

            //登出房间
            this.LoginOut();

            //关闭socket
            managers.ServiceCtrl.getInstance().closeService();
        }

        
  
        /**请求坐下 */
        public sitDown(table: number, chair: number, password: string = "") {
            //构造数据
            let sitdown = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            sitdown.Append_WORD(table);
            sitdown.Append_WORD(chair);
            sitdown.Append_UTF16(password, df.LEN_PASSWORD);
            this.sendData(df.MDM_GR_USER, df.SUB_GR_USER_SITDOWN, sitdown);
        }
        /**防作弊分组 */
        public queryDistributeMode() {
            this.sitDown(df.INVALID_TABLE, df.INVALID_CHAIR);
        }

        /**用户查询 */
        public queryUserInfoID(id: number, tableid: number) {
            //构造数据
            let query = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            query.Append_DWORD(id);
            query.Append_WORD(tableid);
            this.sendData(df.MDM_GR_USER, df.SUB_GR_USER_INFO_REQ, query);
        }

        /**查询用户 */
        public queryUserInfo(tableid: number, chair: number) {
            //构造数据
            utils.GameConst.colorConsole("用户查询");
            console.log(tableid, chair);
            let query = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            query.Append_WORD(tableid);
            query.Append_WORD(chair);
            this.sendData(df.MDM_GR_USER, df.SUB_GR_USER_CHAIR_INFO_REQ, query);
        }

        /**查询财富*/
        public queryUserScore() {
            if (null == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                console.log("no User");
                return;
            }
            managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = df.eServerModule.SERVICE_MODULE_LOGON; //切换成低保服务模块
            let query = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            query.Append_DWORD(managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID);
            this.sendData(df.MDM_GR_USER, df.SUB_GP_QUERY_WEALTH_WEB, query);
            managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = df.eServerModule.SERVICE_MODULE_SERVER;
            // SERVICE_MODULE_LOGON
        }

        /**请求换桌 */
        public onChangeDesk() {
            //构造数据
            let changeDesk = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            this.sendData(df.MDM_GR_USER, df.SUB_GR_USER_CHAIR_REQ, changeDesk);
        }

        /**请求起立 */
        public onStandUp(bForce: boolean) {
            //构造数据
            console.log("用户起立");
            let standup = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            standup.Append_WORD(this.getTableID());
            standup.Append_WORD(this.getChairID());
            standup.Append_Byte(bForce ? 1 : 0);
            this.sendData(df.MDM_GR_USER, df.SUB_GR_USER_STANDUP, standup);
        }

        /**用户准备*/
        public onUserReady() {
            //构造数据
            let ready = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            this.sendData(df.MDM_GF_FRAME, df.SUB_GF_USER_READY, ready);
        }

        /**登录房间 */
        public sendLogonRoom(data: df.CMD_GR_LogonByMobile) {
            let logonRoom = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);

            logonRoom.Append_WORD(data.wServerID);
            //构造数据
            logonRoom.Append_WORD(data.wGameID);
            logonRoom.Append_DWORD(data.dwPlazaVersion);
            logonRoom.Append_DWORD(data.dwProcessVersion);

            logonRoom.Append_Byte(data.cbDeviceType);
            logonRoom.Append_WORD(data.wBehaviorFlags);
            logonRoom.Append_WORD(data.wPageTableCount);

            logonRoom.Append_DWORD(data.dwUserStationID);
            logonRoom.Append_DWORD(data.dwPlazaStationID);

            logonRoom.Append_DWORD(data.dwUserID);
            logonRoom.Append_UTF16(data.szAccounts,df.LEN_ACCOUNTS);
            logonRoom.Append_UTF16(data.szPasspublic, df.LEN_PASSWORD);
            logonRoom.Append_UTF16(data.szDynamicPass,df.LEN_PASSWORD);
            logonRoom.Append_UTF16(data.szMachineID, df.LEN_MACHINE_SERIAL);

            logonRoom.Append_UTF16(data.szServerpasswd, df.LEN_PASSWORD);
        
            logonRoom.Append_DOUBLE(data.dGlobalPosLng);
            logonRoom.Append_DOUBLE(data.dGlobalPosLat);

            logonRoom.Append_DWORD(data.dwMatchID);
            logonRoom.Append_SCORE(data.lMatchNo);

            // logonRoom.Append_DWORD(data.dwClientIP);

            this.sendData(df.MDM_GR_LOGON, df.SUB_GR_LOGON_MOBILE, logonRoom);
        }

        /**请求场景 */
        public sendGameOption() {
            let option = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            option.Append_Byte(0);

            option.Append_DWORD(df.PLAZA_VERSION);
            option.Append_DWORD(this._dwKindVersion);

            this.sendData(df.MDM_GF_FRAME, df.SUB_GF_GAME_OPTION, option);
        }

        /**进入游戏 */
        public onEnterGame() {
            // if (null == this._delegate) {
            //     this._delegate = GameEngine.getInstance();
            // }
            //锁定重置
            managers.FrameManager.getInstance().m_GlobalUserItem.wLockServerID = 0;

            //请求场景
            this.sendGameOption();

            //切入游戏场景
            if (null != this._delegate && this._delegate.onEnterTable) {
                console.log("GameFrame: enterGame");
                this._delegate.onEnterTable();
            }
        }


        /**退出游戏 */
        public onExitGame(message?: string) {

                //登出游戏
                this.LoginOut();

                let serverInfo = {
                    wServerID: 0
                };
                localStorage.setItem("serverID", JSON.stringify(serverInfo));

                //切换界面
                // managers.FrameManager.getInstance().replaceScene(new controller.LoginController(),true);
                GameEngine.getInstance().startGameHandler();

                //关闭socket
                 managers.ServiceCtrl.getInstance().closeService();

                 managers.ServiceCtrl.getInstance().setDelegate(null);

                 // managers.ServiceCtrl.getNewInstance();

                 // SocketMrg.SocketManager.getInstance().closeAllSocket();

        }

        //玩家登出
        private LoginOut() {
            let buffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            this.sendData(df.MDM_GR_LOGON,df.SUB_GR_LOGON_LOGOUT,buffer); 
        }

       
        ////////////////////////////////////////////////////////////////////////////////////
        //规则判断

        //隐藏信息
        public isAllowAvertCheatMode() {
            return this._dwServerRule & 0x00010000
        }

        //语音允许
        public isAllowVoiceChat() {
            return this._dwServerRule & 0x00000040
        }

        //聊天允许
        public isForBidGameChat() {
            return this._dwServerRule & 0x00000020;
        }

        //协议解散允许
        public isAllowAgreementDismiss() {
            return this._dwServerRule & 0x00080000;
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**用户管理*/

        //更新桌椅用户
        public onUpDataTableUser(tableid, chairid, useritem) {
            if (null == this._TableUserList[tableid]) {
                this._TableUserList[tableid] = [];
            }

            //去掉重复 
            if (this._TableUserList[tableid].length > 0) {
                for (let i = 0; i < this._TableUserList[tableid].length; i++) {
                    let userInfo = this._TableUserList[tableid][i];
                    if (userInfo.chair == chairid) {
                        this._TableUserList[tableid].splice(i, 1);
                        break;
                    }
                }
            }

            if (null != useritem) {
                this._TableUserList[tableid].push({ chair: chairid, userid: useritem.dwUserID });
            }
        }
        //获取自己游戏信息
        public getMeUserItem() {
            if (this.isVedioMode()) {

            } else {
                return this._UserList[managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID];
            }
        }

        //获取用户
        public getTableUserItem(tableid: number, chairid: number) {
            if (this.isVedioMode()) {

            } else {
                let id: number = (tableid == df.INVALID_TABLE) ? this._wTableID : tableid;
                let userid: number = 0;
                if (null != this._TableUserList[id]) {
                    for (let i = 0; i < this._TableUserList[id].length; i++) {
                        const userinfo = this._TableUserList[id][i] as any;

                        if (null == userinfo)
                            return null;

                        egret.warn(null != userinfo.chair);
                        if (chairid == userinfo.chair) {
                            userid = userinfo.userid;
                        }
                    }
                }

                if (0 != userid) {
                    return this._UserList[userid];
                }
            }
            return null;
        }

        //移除用户
        public onRemoveUser(dwUserID: number) {
           this._UserList[dwUserID] = null;
        }
    }
}