namespace game {

    import ServiceCtrl = managers.ServiceCtrl;
    import clear = egret.localStorage.clear;
    export const BGM_SOURCE = "backgournd_music_mp3";

    export interface IUserInfo {
        code: string,
        rawData: string,
        encryptedData: string,
        iv: string,
        signature: string,
        nickName: string
    }

    export interface IAction {
        bLock: boolean,                 //动画锁
        nKind: EActionType,             //动画类型
        actions?: EActionType[],        //子动作类型
        data: any,                      //数据类型,动画所需要的各种数据
        start: number
    }

    export enum EActionType { //动作类型
        AK_GAME_BEGIN = 0,        //游戏开始动画,包括三个子动画（发牌、翻牌、优先权）
        AK_DEAL_CARDS = 1,        //游戏发牌动作
        AK_FLOP_CARDS = 2,        //游戏翻牌动作
        AK_PRIORITY_AM = 3,        //游戏优先权动画
        AK_OUT_CARDS = 4,        //游戏出牌动画（包括音效以及各种文字等）
        AK_PASS_AM = 5,        //游戏过牌动画（包括音效以及文字）
        AK_GAME_OVER = 6,        //游戏结束（包括音效以及文字）
        AK_POPUP_SHOW = 7,        //界面缩放动画
        AK_SCORE_ADD = 8         //金币增长动画
    }


    /*
    * 应该继承自GameModel,GameModel中自带与GameFrame交互的方法，而GameEngine自带与GameView交互的方法
    * 包括动画等GameView中定义游戏主要的动作，而动作的执行交由GameView中各个组件去完成。GameView进行统筹
    * */
    export class GameEngine extends eui.UILayer {

        public static _rate: number;

        private static _instance: GameEngine;

        public userInfo: IUserInfo;

        private _dispatcher: egret.EventDispatcher;

        public _gameFrame: frame.GameFrame;

        public _actionList: IAction[] = [];
        readonly AK_GAME_BEGIN = 0; //游戏开始

        constructor() {
            super();

            this._dispatcher = new egret.EventDispatcher();
            sound.SoundManager.getIns().playBG(BGM_SOURCE);
            this.init();


            //注册通知
            // this.addEventListener(customEvent.CustomEvent.EVENT_USER_ENTER, this.onUserEnter, this);
            //为什么两个通知会造成卡顿
            // this.addEventListener(customEvent.CustomEvent.EVENT_USER_STATUS, this.onUserStatus, this);
            // this.addEventListener(customEvent.CustomEvent.EVENT_USER_SCORE, this.onUserScore, this);

            //监听小程序进入后台
            // this.addEventListener("onhide", this.onHide, this);
            // this.addEventListener("onshow", this.onShow, this);

            this.once(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);
        }

        //设置为true可以跳过获取微信环节。
        public _ifLogonFrame: boolean = false;
        private _mini: df.CMiniProgramInfo;

        public loginFrame() {
            this._gameFrame = null;
            if (this._mini == null) {
                this._mini = new df.CMiniProgramInfo();
            }
            // let miniProgrameInfo = new df.CMiniProgramInfo();
            this._mini.sCode = this.userInfo.code;
            this._mini.sRawData = this.userInfo.rawData;
            this._mini.sEncryptedData = this.userInfo.encryptedData;
            this._mini.sIv = this.userInfo.iv;
            this._mini.signature = this.userInfo.signature;

            let logonFrame = new frame.LogonFrame(this);
            // utils.GameConst.colorConsole("设置小程序信息");
            logonFrame.setMiniProgramInfo(this._mini);
            logonFrame.onMiniProgramLogon();
        }

        public _isReConnect: boolean = false;

        public connectComplete() {
            if (this._isReConnect) {
                let wServerID = JSON.parse(localStorage.getItem("serverID")).wServerID;
                utils.GameConst.colorConsole("重连登录房间");
                console.log(wServerID);
                managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = df.eServerModule.SERVICE_MODULE_SERVER;//ServiceCtrl变为游戏模块
                if (this._gameFrame) {
                    this._gameFrame.onLogonRoom(wServerID);
                }
            }
        }

        public addListener() {
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onGameMessage, this);//需要onMessage
        }

        public removeListener() {
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onGameMessage, this);
        }

        public static getInstance() {
            if (!this._instance) {
                this._instance = new GameEngine();
            }
            return this._instance;
        }

        get StartScenes() {
            if (this.startGame) {
                return this.startGame;
            } else {
                return null;
            }
        }

        /**开始场景 */
        private startGame: StartGameLayer;
        /**游戏场景 */
        private gameScenes: GameScenesLayer;
        /**结束场景 */
        private overScenes: GameOverLayer;

        private currentStage: egret.DisplayObjectContainer = null;

        private init() {
            // this.startGame = new StartGameLayer(this);
            // this.gameScenes = new GameScenesLayer(this);
            this.overScenes = new GameOverLayer(this);
            // RES.loadGroup("gameScene", 3).catch((err) => {
            //     utils.GameConst.colorConsole("加载资源失败:");
            //     console.log(err);
            //     managers.FrameManager.getInstance().dismissPopWait();
            //     this.showMessage("加载资源失败，请稍后再试");
            // });

            // this.addListener();
            //添加游戏开始界面
            this.startGameHandler();
            //检测微信进入后台
            // platform.addWXOnHide(this);

        }

        /**开始游戏的场景 */
        public startGameHandler(): void {
            let self = this;
            let callBack = () => {
                let current = false;
                self.startGame.x = 0;
                if (self.currentStage == self.startGame) {
                    current = true;
                }
                self.currentStage = self.startGame;
                if (self.gameScenes && self.gameScenes.parent) {
                    utils.GameConst.removeChild(self.gameScenes);
                }
                if (self.gameScenes && self.overScenes.parent) {
                    utils.GameConst.removeChild(self.overScenes);
                }
                if (current) {
                    self.startGame.start();
                }
                self.startGame.clear();
                console.log("添加开始界面!")
                self.addChild(self.startGame);
                managers.FrameManager.getInstance().gameStatus = DGameStatus.START;
                self._isReConnect = false;
                self.reConnectFlag = false;
                self._sceneReCon = false;
            };
            if (null == this.startGame) {
                console.log("开始加载front资源");
                RES.loadGroup("frontload",).then(() => {
                    console.log("加载成功");
                    self.startGame = new StartGameLayer(this);
                    callBack();
                }).catch((err) => {
                    console.log("加载失败:");
                    console.log(err);
                })
            } else {
                callBack();
            }

        }

        public reConnectFlag: boolean = false;

        /**游戏场景 */
        public onGameScenesHandler(): void {
            let self = this;
            let callBack = () => {
                self.currentStage = self.gameScenes;
                sound.SoundManager.getIns().playSoundAsync("GAME_START_mp3");
                let callBackTo = (node: egret.DisplayObject) => {
                    node.visible = false;
                };
                self.gameScenes.clearDesk(callBackTo);
                if (self.reConnectFlag) {
                    self.reConnectFlag = false;
                    if (self.currentStage != self.gameScenes) {
                        utils.GameConst.removeChild(self.startGame);
                        utils.GameConst.removeChild(self.overScenes);
                        this.addChild(self.gameScenes);
                    }
                } else {
                    self.replaceView(self.startGame, self.gameScenes, true);
                }
                managers.FrameManager.getInstance().gameStatus = DGameStatus.ING;
                RES.loadGroup("resultScene", 1);
            };
            if (null == this.gameScenes) {
                //waiting
                managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
                RES.loadGroup("gameScene", 2).then(() => {
                    self.gameScenes = new GameScenesLayer(self);
                    managers.FrameManager.getInstance().dismissPopWait();
                    callBack();
                }).catch((err) => {
                    managers.FrameManager.getInstance().dismissPopWait();
                    console.log(err);
                })
            } else {
                callBack();
            }

        }

        /**游戏结束场景 */
        public showGameOverSceneHandler(): void {
            this.currentStage = this.overScenes;
            if (this.startGame && this.startGame.parent) {
                utils.GameConst.removeChild(this.startGame);
            }

            if (this.gameScenes && this.gameScenes.parent) {
                this.gameScenes.removeEvent();
                this.addChild(this.overScenes);
                if (this.messageScene && this.messageScene.parent) {
                    this.swapChildren( this.overScenes, this.messageScene);
                }
                // utils.GameConst.removeChild(this.gameScenes);
            }
            // this.addChild(this.overScenes);
        }

        private replaceView(remove: egret.DisplayObjectContainer, add: egret.DisplayObjectContainer, right: boolean) {
            let startX, endX;
            if (right) {
                startX = 750;
                endX = -750;
            } else {
                startX = -750;
                endX = 750;
            }
            add.x = startX;
            this.addChild(add);
            egret.Tween.get(remove).to({x: endX}, 300);
            egret.Tween.get(add).to({x: 0}, 300).call(() => {
                utils.GameConst.removeChild(remove);
            });
        }

        public onCloseResult(again: boolean = false): void {
            this.currentStage = this.gameScenes;
            if (this.overScenes && this.overScenes.parent) {
                // this.gameScenes.removeChild(this.overScenes);
                utils.GameConst.removeChild(this.overScenes);
            }
            this.gameScenes.clearDesk();
            if (again) {
                this.gameScenes.onAgain();
            }
        }

        public onEnterTable() {
            this.onGameScenesHandler();
        }

        public set GameFrame(gameFrame: any) {
            this._gameFrame = gameFrame;
        }

        private messageScene: game.MessagePopup = null;

        private _PopPriority: number = null;

        showMessage(szString: string, okFunc?: Function, priority?: number) {
            if (this._PopPriority && this._PopPriority > priority) return;
            this._PopPriority = priority;
            managers.FrameManager.getInstance().dismissPopWait();//移除等待界面

            if (null == this.messageScene) {
                this.messageScene = new MessagePopup();
                this.messageScene.verticalCenter = 0;
                this.messageScene.horizontalCenter = 0;
            }
            // this.startGame.btnDisable();
            if (this.gameScenes && this.gameScenes.initFlag) {
                this.gameScenes.btnDisable();
            }
            this.addChildAt(this.messageScene, df.TOP_ZORDER);
            let self = this;
            let callBack = () => {
                self.startGame.btnActive();
                if (self.gameScenes && self.gameScenes.initFlag) {
                    self.gameScenes.btnActive();
                }
                // self.gameScenes.btnActive();
                if (okFunc) {
                    okFunc();
                    self._PopPriority = null;
                }
                this.removeChild(self.messageScene);
            };
            this.messageScene.setMessage(szString, callBack, callBack);
        }

        /**=========================客户端请求=============================*/

        private _timeEnter: number;
        /**
         * 进入排队队列
         * */
        public requestMatch() {
            let self = this;
            // this._timeEnter = Date.now();
            let callBack = () => {
                managers.FrameManager.getInstance().showPopWait("正在进入游戏房间...");
                if (self.gameScenes) {
                    self.gameScenes.showAnimation = true;
                    self.gameScenes.clearUsers();
                }
                if (self._ifLogonFrame == true) {
                    platform.login().then((data) => {
                        GameEngine.getInstance().userInfo = data;
                        utils.GameConst.colorConsole("获取微信Info:");
                        console.log(data);
                        self.loginFrame();
                    });
                } else {
                    self.loginFrame();
                    self._ifLogonFrame = true;
                }
            };

            if (null == this.gameScenes) {
                //waiting
                // let time = Date.now();
                managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
                RES.loadGroup("gameScene", 2).then(() => {
                    self.gameScenes = new GameScenesLayer(self);
                    callBack();
                }).catch((err) => {
                    managers.FrameManager.getInstance().dismissPopWait();
                    this.showMessage(err);
                })
            } else {
                callBack();
            }
            // this.onGameScenesHandler();
        }

        /**=========================服务端消息=============================*/

        private onUserEnter(e: egret.Event) {
            const data = e.data;
            let user = data.user as models.UserItem;

            // console.log("进入房间玩家信息:", user);
            if (null != this.gameScenes) {
                // this.gameScenes.pushUpdate(user);
                this.gameScenes.onUpdateUser(user);
            }

        }

        private onUserStatus(object: any) {
            const data = object.data;
            let user = data.user as models.UserItem;
            let newstatus = data.newstatus;
            let oldstatus = data.oldstatus;

            // utils.GameConst.colorConsole(`更新玩家状态${user.szNickName}`);
            // console.log(object.data);
            if (null != this.gameScenes) {
                this.gameScenes.onUpdateUser(user, newstatus, oldstatus);
                // this.gameScenes.pushUpdate(user, newstatus, oldstatus);
            }
        }

        private onUserScore(object: any) {
            // utils.GameConst.colorConsole("更新玩家分数:");
            // console.log(object);
            let userIndex = this.switchViewChairID(object.data.user.ChairID);
            // if (this.gameScenes) {
            //     this.gameScenes.updateScore(userIndex, object.data.score);
            // }
            let data = {
                index: userIndex,
                score: object.data.score
            };
            this.gameScenes.updateScore(data.index, data.score);

            // let action: IAction = {
            //     bLock: false,
            //     nKind: EActionType.AK_SCORE_ADD,
            //     data: data,
            //     start: Date.now()
            // };
            //
            // this._actionList.push(action);
            // this.beginGameAction();
        }

        /**游戏状态 */
        public _cbGameStatus: number = cmd.GAME_SCENE_FREE;

        public getGameStatus() {
            return this._cbGameStatus;
        }

        set setGameStatus(value: number) {
            this._cbGameStatus = value;
        }

        /**游戏场景 */
        onGameScene(status: number, object: any): void {
            utils.LOG("GameClientEngine: 游戏场景");
            this._cbGameStatus = status;

            managers.FrameManager.getInstance().dismissPopWait();//移除等待界面

            switch (this._cbGameStatus) {
                case cmd.GAME_SCENE_FREE: {
                    this.onSceneFree(object);//进入游戏,断线重连上来游戏已经结束的状况
                }
                    break;
                case cmd.GAME_SCENE_PLAY: {
                    this.onScenePlaying(object); //断线重连
                }
                    break;
            }


        }

        private onExit() {
            //移除通知
            this.removeEventListener(customEvent.CustomEvent.EVENT_USER_ENTER, this.onUserEnter, this);
            this.removeEventListener(customEvent.CustomEvent.EVENT_USER_STATUS, this.onUserStatus, this);
            this.removeEventListener(customEvent.CustomEvent.EVENT_USER_SCORE, this.onUserScore, this);
        }


        /**
         * 服务器下发消息
         * */
        onGameMessage(data: any) {
            console.log("GameEngine:", data);
            // if (data) {
            //     return;
            // }
            let msg = data as network.Message;
            const wMainCmd = msg.wMainCmd;
            switch (msg.wSubCmd) {
                case cmd.SUB_S_GAME_START : {
                    this.onSubGameStart(data.cbBuffer);
                    break;
                }
                case cmd.SUB_S_OUT_CARD : {
                    this.onSubOutCards(data.cbBuffer);
                    break;
                }
                case cmd.SUB_S_PASS_CARD : {
                    this.onSubPass(data.cbBuffer);
                    break;
                }
                case cmd.SUB_S_GAME_END : {
                    this.onSubGameOver(data.cbBuffer);
                    break;
                }
                case cmd.SUB_S_PHRASE : {
                    // console.log("玩家发言");
                    break;
                }
                case cmd.SUB_S_TRUSTEE : {
                    this.onSubTrustee(data.cbBuffer);
                    // console.log("用户托管");
                    break;
                }
                case cmd.SUB_S_TURN_CACULATE : {
                    this.onSubTurnCaculate(data.cbBuffer);
                    // console.log("每轮结算");
                    break;
                }
            }
        }

        private _gameUsers: models.UserItem[] = [];
        //subGame游戏开始
        private onSubGameStart(buffer: utils.ByteArray) {
            //标识游戏状态
            let time = Date.now();
            // utils.GameConst.colorConsole("进入游戏房间所耗费的时间:");
            console.log((this._timeEnter - time) / 1000);
            this._cbGameStatus = cmd.GAME_SCENE_PLAY;
            this._actionList = [];
            managers.FrameManager.getInstance().dismissPopWait();
            let start = new cmd.CMD_S_GameStart();
            start.onInit(buffer);
            // console.log("GameStart:", start);

            if (this.gameScenes) {
                this.gameScenes.showGameStart(start);//
                this._gameUsers = this.gameScenes.userList.concat();
            }

            // let tableId = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
            // console.log();
            //进行游戏玩家查询
            // this._gameFrame.queryUserInfo(newstatus.wTableID, newstatus.wChairID);

        }



        private m_currentUser: number = null;

        //玩家出牌
        private onSubOutCards(buffer: utils.ByteArray) {
            // console.log("%c玩家出牌", "color: red;font-size: 2em");
            let outCard = new cmd.CMD_S_OutCard(buffer);
            // console.log(outCard);
            this.m_currentUser = outCard.wOutCardUser;

            // if (this.gameScenes) {
            //     this.gameScenes.onNotifyOutCards(outCard);
            // }

            let action: IAction = {
                bLock: false,
                nKind: EActionType.AK_OUT_CARDS,
                data: outCard,
                start: Date.now()
            };

            //如果下一个玩家是undefined
            console.log(outCard);
            if (outCard.wCurrentUser == 65535) {
                this._gameUsers = this.gameScenes.userList.concat();
            }
            this._actionList.push(action);
            this.beginGameAction();

        }

        //玩家过牌
        private onSubPass(buffer: utils.ByteArray) {
            // console.log("%c玩家过牌", "color: red;font-size: 2em");
            let pass = new cmd.CMD_S_PassCard();
            pass.onInit(buffer);

            let action: IAction = {
                bLock: false,
                nKind: EActionType.AK_PASS_AM,
                data: pass,
                start: Date.now()
            };

            this._actionList.push(action);
            this.beginGameAction();
        }

        private onSubGameOver(buffer: utils.ByteArray) {

            if (this.gameScenes) {
                this.gameScenes.finishGameOver();
            }

            let gameEnd = new cmd.CMD_S_GameEnd(buffer);
            let user: models.UserItem[] = [];

            let self = this;

            if (this.gameScenes && this.gameScenes.userList) {
                this.gameScenes.m_overFlag = true;
                //过滤用户
                user = this._gameUsers.concat();
                if (user.length == 2) {
                    user.push(this.getMeUserItem());
                } if (user.length > 2) {
                    let origin: models.UserItem[] = [];
                    origin.push(this.getMeUserItem());
                    user.forEach(use => {
                        if (use.TableID == this.getMeUserItem().TableID && use.cbUserStatus == df.US_PLAYING) {
                            //再检查UserId需要与已有的不同
                            let check = false;
                            for (let n = 0; n < origin.length; n++) {
                                if (origin[n].dwUserID == use.dwUserID) {
                                    check = true;
                                    break;
                                }
                            }
                            if (check == false && origin.length != 3) {
                                origin.push(use);
                            }
                        }
                    });
                    if (origin.length > 3) {
                        origin.splice(3, origin.length - 3);
                    }
                    user = origin;
                }
            }

            let action: IAction = {
                bLock: false,
                nKind: EActionType.AK_GAME_OVER,
                data: {
                    gameEnd: gameEnd,
                    user: user
                },
                start: Date.now()
            };

            utils.GameConst.colorConsole("用户结束数据:");
            console.log(action);


            this._actionList.push(action);
            this.beginGameAction();

            this._cbGameStatus = cmd.GAME_SCENE_FREE;
        }

        private onSubTrustee(buffer: utils.ByteArray) {
            let trustee = new cmd.CMD_S_Trustee(buffer);

            if (this.gameScenes) {
                this.gameScenes.onNotifyTrustee(trustee);
            }
        }

        private onSubTurnCaculate(buffer: utils.ByteArray) { ////TURN_CACULATE
            let caculate = new cmd.CMD_S_Turn_Caculate();
            caculate.onInit(buffer);

            //action 或者直接表现//
            if (this.gameScenes) {
                this.gameScenes.showTurnCaculate(caculate);
            }
        }


        public switchViewChairID(chairID: number) {
            if (chairID < 0 || chairID >= this.gamePlayerCount())
                return -1;

            let myChair = this._gameFrame.getChairID();
            let userIndex: number = -1;
            const playerCount = this.gamePlayerCount();
            userIndex = ((playerCount - myChair) + chairID) % playerCount;
            if (userIndex < 0 || userIndex >= this.gamePlayerCount()) {
                console.log("位置解析错误");
                return -1;
            }
            return userIndex;
        }

        private getGlobalChairID(index: number): number {
            let myChair = this._gameFrame.getChairID();
            return (myChair + index) % 3;
        }

        /**游戏人数 */
        gamePlayerCount() {
            return cmd.GAME_PLAYER;
        }

        public requestOutCard(cbCards: number[]) {
            //发送数据
            let outBuffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);

            outBuffer.Append_Byte(cbCards.length);
            cbCards.forEach((value, index) => {
                outBuffer.Append_Byte(value);
            });
            this._gameFrame.sendData(df.MDM_GF_GAME, cmd.SUB_C_OUT_CARD, outBuffer);

            let mySelf = this._gameFrame.getMeUserItem();
            this.m_currentUser = mySelf.ChairID;
            //如果用户出牌为火箭的话，current与outUser是一样的
            let outCard: cmd.CMD_S_OutCard = {
                cbCardCount: cbCards.length,
                wCurrentUser: (mySelf.ChairID + 1) % 3,
                wOutCardUser: mySelf.ChairID,
                cbCardData: cbCards
            };
            let action: IAction = {
                bLock: false,
                nKind: EActionType.AK_OUT_CARDS,
                data: outCard,
                start: Date.now()
            };

            this._actionList.push(action);
            this.beginGameAction();
        }

        public requestPass() {
            let passBuffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);

            this._gameFrame.sendData(df.MDM_GF_GAME, cmd.SUB_C_PASS_CARD, passBuffer);

            let mySelf = this._gameFrame.getMeUserItem();

            let outPass: any = {};
            if ((mySelf.ChairID + 1) % 3 == this.m_currentUser) {
                outPass.cbTurnOver = true;
            } else {
                outPass.cbTurnOver = false;
            }
            outPass.wPassCardUser = mySelf.ChairID;
            outPass.wCurrentUser = (mySelf.ChairID + 1) % 3;
            let action: IAction = {
                nKind: EActionType.AK_PASS_AM,
                bLock: false,
                data: outPass,
                start: Date.now()
            };

            this._actionList.push(action);
            this.beginGameAction();
        }

        public requestTrustee(is: boolean) {
            let trusteeBuffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);

            trusteeBuffer.Append_BOOL(is);

            this._gameFrame.sendData(df.MDM_GF_GAME, cmd.SUB_C_TRUSTEE, trusteeBuffer);
        }

        public onMissilePassAction(index: number) {
            let data_1 = new cmd.CMD_S_PassCard();
            data_1.cbTurnOver = false;
            data_1.wPassCardUser = this.getGlobalChairID((index + 1) % 3); //全局坐标
            data_1.wCurrentUser = this.getGlobalChairID((index + 2) % 3);

            let action1: IAction = {
                bLock: false,
                nKind: EActionType.AK_PASS_AM,
                data: data_1,
                start: Date.now()
            };

            this._actionList.push(action1);

            let data_2 = new cmd.CMD_S_PassCard();
            data_2.cbTurnOver = true;
            data_2.wPassCardUser = this.getGlobalChairID((index + 2) % 3); //全局坐标
            data_2.wCurrentUser = this.getGlobalChairID((index + 3) % 3);

            let action2: IAction = {
                bLock: false,
                nKind: EActionType.AK_PASS_AM,
                data: data_2,
                start: Date.now()
            };

            this._actionList.push(action2);
            this.beginGameAction();

        }

        public _sceneReCon: boolean = false;

        /**空闲场景 */
        private onSceneFree(data: any) {
            // if (data) {
            //     return;
            // }
            if (this.gameScenes) {
                if (this._sceneReCon == true) {
                    this.gameScenes.showSceneFree(data, true);
                    this._sceneReCon = false;
                } else {
                    this.gameScenes.showSceneFree(data, false);
                }
            }
        }

        /**游戏场景 */
        private onScenePlaying(data: any) {
            let dataBuffer = data as network.Message;
            let scenePlaying = new cmd.CMD_S_StatusPlay(dataBuffer.cbBuffer);

            if (this.gameScenes) {
                this.gameScenes.showScenePlaying(scenePlaying);
            }
        }

        /**离开游戏*/
        public onExitGame(szReason?: string) {
            //判断用户状态
            if (null == this._gameFrame) return;
            const myself = this._gameFrame.getMeUserItem();
            this._gameFrame.onStandUp(myself.cbUserStatus >= df.US_PLAYING ? true : false);
            this._gameFrame.onExitGame();
            this._gameFrame = null;
            managers.ServiceCtrl.getInstance().setServerIdx(0);
            // this.startGameHandler();
            this._actionList = [];//动作队列清空
        }

        /**返回大厅 */
        public onQueryExitGame() {
            //游戏状态判断
            let status = this.getGameStatus() == cmd.GAME_SCENE_FREE;
            const msg = this.getGameStatus() == cmd.GAME_SCENE_FREE ? "是否确定退出游戏？" : "游戏已经开始，退出将由憨憨机器人代打哦！\n 是否确定退出游戏？";

            if (status == false) {
                //弹窗
                let ExitPopup = new ExitTip(() => {
                    this.onExitGame();
                })
            } else {
                this.onExitGame();
            }

        }

        /**获取玩家自己 */
        public getMeUserItem() {
            if (null != this._gameFrame) {
                return this._gameFrame.getMeUserItem();
            }
            return null;
        }

        private onHide() {
            //其他玩家出去,如果出去之前没打完，进来的时候已经打完了
            // if (this.gameScenes) {
            //     this.gameScenes.clearAllUser();
            // }
            if (this._cbGameStatus == cmd.GAME_SCENE_FREE) {
                // if (this.gameScenes) { //空闲状态可以直接清理?
                //     this.gameScenes.clearAllUser();
                // }
                return;
            }
            ServiceCtrl.getInstance().stopConnect();
        }

        private onShow() {
            if ((this.gameScenes && this.gameScenes.soundIsOpen) || (this.gameScenes == null)) {
                sound.SoundManager.getIns().playBG(BGM_SOURCE);
            }
            if (this._cbGameStatus == cmd.GAME_SCENE_FREE) {
                //不能直接清理，因为玩家可能还没出去
                if (this.gameScenes) {
                    this.gameScenes.clearDesk();
                }
                return;
            }
            //如果是空闲状态，就什么都不干
            ServiceCtrl.getInstance().reConnect();
        }

        /**游戏动作
         * 可以使用组合模式以及观察者模式联合实现
         */
        public beginGameAction() {
            let action = this._actionList[0];

            if (null == action || action.bLock) {
                let now = Date.now();
                let time = now - action.start;
                console.log("持续时间:", time / 1000);
                if (time > 4000) {
                    this._actionList.splice(0, 1);
                    this.beginGameAction();
                }
                return; //bLock动作锁(表示该动作正在执行)
            }

            action.bLock = true;

            switch (action.nKind) {
                case EActionType.AK_GAME_BEGIN : {
                    break;
                }
                case EActionType.AK_DEAL_CARDS : {
                    break;
                }
                case EActionType.AK_FLOP_CARDS : {
                    break;
                }
                case EActionType.AK_PRIORITY_AM: {
                    break;
                }
                case EActionType.AK_OUT_CARDS  : {
                    //出牌设置定时器，3秒后执行removeAction;
                    this.startOutCard(action);
                    break;
                }
                case EActionType.AK_PASS_AM    : {
                    this.startPass(action);
                    break;
                }
                case EActionType.AK_GAME_OVER   : {
                    this.startGameOver(action);
                    break;
                }
                case EActionType.AK_SCORE_ADD: {
                    this.startGoldAdd(action);
                    break;
                }
            }
        }

        /**移除动作 */
        private removeGameAction(bContinue: boolean = true) {
            //清除出牌动作的计时器
            if (this._outCardsTimer) {
                this._outCardsTimer.stop();
                this._outCardsTimer = null;
            }
            let action = this._actionList[0];
            if (null == action || !action.bLock) return;

            let nkind: number = action.nKind;

            switch (nkind) {
                case EActionType.AK_OUT_CARDS: {
                    this.finishOutCard(action);
                    break;
                }
                case EActionType.AK_PASS_AM: {
                    this.finishPass(action);
                    break;
                }
                case EActionType.AK_GAME_OVER: {
                    this.finishGameOver(action);
                    break;
                }
                case EActionType.AK_SCORE_ADD: {
                    this.finishGoldAdd(action);
                    break;
                }
            }

            //移除队列
            this._actionList.splice(0, 1);

            //下一动作
            if (bContinue == true && this._actionList.length > 0) {
                this.beginGameAction();
            }
        }

        private _outCardsTimer: egret.Timer;

        private startOutCard(action: IAction) {
            //可以设置游戏状态等，最好把出牌等，记录在GameEngine里
            let callBack = () => {
                this.removeGameAction(true);
            };
            this._outCardsTimer = new egret.Timer(3000, 1);
            this._outCardsTimer.addEventListener(egret.TimerEvent.TIMER, this.removeGameAction, this);
            this._outCardsTimer.start();
            if (this.gameScenes) {
                this.gameScenes.startOutCards(action.data, callBack);
            } else {
                throw new Error("游戏组件未初始化完成");
            }
        }

        private finishOutCard(action: IAction) {
            if (this.gameScenes) {
                this.gameScenes.finishOutCards(action.data);
            } else {
                throw new Error("游戏组件未初始化完成");
            }
        }

        private startPass(action: IAction) {
            let callBack = () => {
                // console.log("%c准备移除过牌动作", "color: red; font-size: 1.5em");
                this.removeGameAction(true);
            };
            if (this.gameScenes) {
                this.gameScenes.startPass(action.data, callBack);
            } else {
                throw new Error("游戏组件未初始化完成");
            }
        }

        private finishPass(action: IAction) {
            if (this.gameScenes) {
                this.gameScenes.finishPass(action.data);
            } else {
                throw new Error("游戏组件未初始化完成");
            }
        }

        private _overTimer: number;

        private startGameOver(action: IAction) {
            let self = this;
            let callBack = () => {
                let callFunc = (node: egret.DisplayObject) => {
                    node.visible = false;
                };
                let lastCards: number[] = [];
                lastCards = self.gameScenes.lastCards.concat();
                self.gameScenes.clearDesk(callFunc);//front
                let callBack = () => {
                    // console.log("%c准备结束", "color: red; font-size: 1.5em");
                    self.removeGameAction(true);
                };

                if (this.overScenes) {
                    self.showGameOverSceneHandler();
                    self.overScenes.onGameOver(action.data.gameEnd, action.data.user, lastCards, callBack);

                    //设定如果未点再来一局，30秒后自动退出房间
                    self.startOverTimer();
                } else {
                    throw new Error("游戏组件未初始化完成");
                }
            };
            managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
            RES.loadGroup("resultScene").then(() => {
                this.overScenes = new GameOverLayer(self);
                managers.FrameManager.getInstance().dismissPopWait();
                callBack();
            }).catch((err) => {
                managers.FrameManager.getInstance().dismissPopWait();
                GameEngine.getInstance().showMessage(err);
            });

        }

        public startOverTimer() {
            let self = this;
            this._overTimer = setTimeout(function () {
                //退出游戏
                utils.GameConst.colorConsole("自动退出游戏");
                self.startGameHandler();
                self.onExitGame();
                self.showMessage("长时间未开始游戏，已自动退出!")
            }, 10 * 1000);
        }

        public clearTimer() {
            if  (this._overTimer) {
                clearTimeout(this._overTimer);
                this._overTimer = null;
            }
        }

        private finishGameOver(action: IAction) {
            //游戏结束以后调用查询低保；
            // this._gameFrame.searchBaseEnsure();
            // if (this.gameScenes) {
            //     this.gameScenes.finishGameOver();
            // }
        }

        private startGoldAdd(action: IAction) {
            let callBack = () => {
                this.removeGameAction(true);
            };

            if (this.gameScenes) {
                this.gameScenes.updateScore(action.data.index, action.data.score, callBack);
            }
        }

        private finishGoldAdd(action: IAction) {

        }

        public updateBaseEnsure(data: any) {
            if (this.gameScenes) {
                this.gameScenes.updateBaseEnsure(data);
            }
        }

        onSystemMessage(msg: string) {
            console.log(msg);
        }

        public getCheckInfoParams(): string {
            const userID = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
            const serverTime = Math.floor(new Date().getTime() / 1000);
            let now = new Date();
            const TimeStamp = utils.formateDateAndTimeToString(now);
            const stationID = df.STATION_ID;
            const nonceStr = Math.floor(Math.random() * Math.pow(10, 8));//随机生成八位数

            let params = `StationID=${stationID}&UserID=${userID}&NonceStr=${nonceStr}&TimeStamp=${TimeStamp}`;
            let signature = utils.MD5.MD5_HEX(`UserID=${userID}&NonceStr=${nonceStr}&TimeStamp=${TimeStamp}&Key=wsdeflkfignvgdhfbsgtrs`);
            signature = signature.toUpperCase();
            params = `${params}&signature=${signature}`;

            return params;
        }

        public addBase() {
            if (this.gameScenes) {
                this.gameScenes.addBase();
            }
        }
    }
}