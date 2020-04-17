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
var game;
(function (game) {
    var ServiceCtrl = managers.ServiceCtrl;
    game.BGM_SOURCE = "backgournd_music_mp3";
    var EActionType;
    (function (EActionType) {
        EActionType[EActionType["AK_GAME_BEGIN"] = 0] = "AK_GAME_BEGIN";
        EActionType[EActionType["AK_DEAL_CARDS"] = 1] = "AK_DEAL_CARDS";
        EActionType[EActionType["AK_FLOP_CARDS"] = 2] = "AK_FLOP_CARDS";
        EActionType[EActionType["AK_PRIORITY_AM"] = 3] = "AK_PRIORITY_AM";
        EActionType[EActionType["AK_OUT_CARDS"] = 4] = "AK_OUT_CARDS";
        EActionType[EActionType["AK_PASS_AM"] = 5] = "AK_PASS_AM";
        EActionType[EActionType["AK_GAME_OVER"] = 6] = "AK_GAME_OVER";
        EActionType[EActionType["AK_POPUP_SHOW"] = 7] = "AK_POPUP_SHOW";
        EActionType[EActionType["AK_SCORE_ADD"] = 8] = "AK_SCORE_ADD"; //金币增长动画
    })(EActionType = game.EActionType || (game.EActionType = {}));
    var GameEngine = (function (_super) {
        __extends(GameEngine, _super);
        function GameEngine() {
            var _this = _super.call(this) || this;
            _this._actionList = [];
            _this.AK_GAME_BEGIN = 0; //游戏开始
            //设置为true可以跳过获取微信环节。
            _this._ifLogonFrame = false;
            _this._isReConnect = false;
            _this.currentStage = null;
            _this.reConnectFlag = false;
            _this.messageScene = null;
            _this._PopPriority = null;
            /**游戏状态 */
            _this._cbGameStatus = cmd.GAME_SCENE_FREE;
            _this._gameUsers = [];
            _this.m_currentUser = null;
            _this._sceneReCon = false;
            _this._dispatcher = new egret.EventDispatcher();
            sound.SoundManager.getIns().playBG(game.BGM_SOURCE);
            _this.init();
            //注册通知
            // this.addEventListener(customEvent.CustomEvent.EVENT_USER_ENTER, this.onUserEnter, this);
            //为什么两个通知会造成卡顿
            // this.addEventListener(customEvent.CustomEvent.EVENT_USER_STATUS, this.onUserStatus, this);
            // this.addEventListener(customEvent.CustomEvent.EVENT_USER_SCORE, this.onUserScore, this);
            //监听小程序进入后台
            // this.addEventListener("onhide", this.onHide, this);
            // this.addEventListener("onshow", this.onShow, this);
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onExit, _this);
            return _this;
        }
        GameEngine.prototype.loginFrame = function () {
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
            var logonFrame = new frame.LogonFrame(this);
            // utils.GameConst.colorConsole("设置小程序信息");
            logonFrame.setMiniProgramInfo(this._mini);
            logonFrame.onMiniProgramLogon();
        };
        GameEngine.prototype.connectComplete = function () {
            if (this._isReConnect) {
                var wServerID = JSON.parse(localStorage.getItem("serverID")).wServerID;
                utils.GameConst.colorConsole("重连登录房间");
                console.log(wServerID);
                managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = 6 /* SERVICE_MODULE_SERVER */; //ServiceCtrl变为游戏模块
                if (this._gameFrame) {
                    this._gameFrame.onLogonRoom(wServerID);
                }
            }
        };
        GameEngine.prototype.addListener = function () {
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onGameMessage, this); //需要onMessage
        };
        GameEngine.prototype.removeListener = function () {
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onGameMessage, this);
        };
        GameEngine.getInstance = function () {
            if (!this._instance) {
                this._instance = new GameEngine();
            }
            return this._instance;
        };
        Object.defineProperty(GameEngine.prototype, "StartScenes", {
            get: function () {
                if (this.startGame) {
                    return this.startGame;
                }
                else {
                    return null;
                }
            },
            enumerable: true,
            configurable: true
        });
        GameEngine.prototype.init = function () {
            // this.startGame = new StartGameLayer(this);
            // this.gameScenes = new GameScenesLayer(this);
            this.overScenes = new game.GameOverLayer(this);
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
        };
        /**开始游戏的场景 */
        GameEngine.prototype.startGameHandler = function () {
            var _this = this;
            var self = this;
            var callBack = function () {
                var current = false;
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
                console.log("添加开始界面!");
                self.addChild(self.startGame);
                managers.FrameManager.getInstance().gameStatus = DGameStatus.START;
                self._isReConnect = false;
                self.reConnectFlag = false;
                self._sceneReCon = false;
            };
            if (null == this.startGame) {
                console.log("开始加载front资源");
                RES.loadGroup("frontload").then(function () {
                    console.log("加载成功");
                    self.startGame = new game.StartGameLayer(_this);
                    callBack();
                }).catch(function (err) {
                    console.log("加载失败:");
                    console.log(err);
                });
            }
            else {
                callBack();
            }
        };
        /**游戏场景 */
        GameEngine.prototype.onGameScenesHandler = function () {
            var _this = this;
            var self = this;
            var callBack = function () {
                self.currentStage = self.gameScenes;
                sound.SoundManager.getIns().playSoundAsync("GAME_START_mp3");
                var callBackTo = function (node) {
                    node.visible = false;
                };
                self.gameScenes.clearDesk(callBackTo);
                if (self.reConnectFlag) {
                    self.reConnectFlag = false;
                    if (self.currentStage != self.gameScenes) {
                        utils.GameConst.removeChild(self.startGame);
                        utils.GameConst.removeChild(self.overScenes);
                        _this.addChild(self.gameScenes);
                    }
                }
                else {
                    self.replaceView(self.startGame, self.gameScenes, true);
                }
                managers.FrameManager.getInstance().gameStatus = DGameStatus.ING;
                RES.loadGroup("resultScene", 1);
            };
            if (null == this.gameScenes) {
                //waiting
                managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
                RES.loadGroup("gameScene", 2).then(function () {
                    self.gameScenes = new game.GameScenesLayer(self);
                    managers.FrameManager.getInstance().dismissPopWait();
                    callBack();
                }).catch(function (err) {
                    managers.FrameManager.getInstance().dismissPopWait();
                    console.log(err);
                });
            }
            else {
                callBack();
            }
        };
        /**游戏结束场景 */
        GameEngine.prototype.showGameOverSceneHandler = function () {
            this.currentStage = this.overScenes;
            if (this.startGame && this.startGame.parent) {
                utils.GameConst.removeChild(this.startGame);
            }
            if (this.gameScenes && this.gameScenes.parent) {
                this.gameScenes.removeEvent();
                this.addChild(this.overScenes);
                if (this.messageScene && this.messageScene.parent) {
                    this.swapChildren(this.overScenes, this.messageScene);
                }
                // utils.GameConst.removeChild(this.gameScenes);
            }
            // this.addChild(this.overScenes);
        };
        GameEngine.prototype.replaceView = function (remove, add, right) {
            var startX, endX;
            if (right) {
                startX = 750;
                endX = -750;
            }
            else {
                startX = -750;
                endX = 750;
            }
            add.x = startX;
            this.addChild(add);
            egret.Tween.get(remove).to({ x: endX }, 300);
            egret.Tween.get(add).to({ x: 0 }, 300).call(function () {
                utils.GameConst.removeChild(remove);
            });
        };
        GameEngine.prototype.onCloseResult = function (again) {
            if (again === void 0) { again = false; }
            this.currentStage = this.gameScenes;
            if (this.overScenes && this.overScenes.parent) {
                // this.gameScenes.removeChild(this.overScenes);
                utils.GameConst.removeChild(this.overScenes);
            }
            this.gameScenes.clearDesk();
            if (again) {
                this.gameScenes.onAgain();
            }
        };
        GameEngine.prototype.onEnterTable = function () {
            this.onGameScenesHandler();
        };
        Object.defineProperty(GameEngine.prototype, "GameFrame", {
            set: function (gameFrame) {
                this._gameFrame = gameFrame;
            },
            enumerable: true,
            configurable: true
        });
        GameEngine.prototype.showMessage = function (szString, okFunc, priority) {
            var _this = this;
            if (this._PopPriority && this._PopPriority > priority)
                return;
            this._PopPriority = priority;
            managers.FrameManager.getInstance().dismissPopWait(); //移除等待界面
            if (null == this.messageScene) {
                this.messageScene = new game.MessagePopup();
                this.messageScene.verticalCenter = 0;
                this.messageScene.horizontalCenter = 0;
            }
            // this.startGame.btnDisable();
            if (this.gameScenes && this.gameScenes.initFlag) {
                this.gameScenes.btnDisable();
            }
            this.addChildAt(this.messageScene, df.TOP_ZORDER);
            var self = this;
            var callBack = function () {
                self.startGame.btnActive();
                if (self.gameScenes && self.gameScenes.initFlag) {
                    self.gameScenes.btnActive();
                }
                // self.gameScenes.btnActive();
                if (okFunc) {
                    okFunc();
                    self._PopPriority = null;
                }
                _this.removeChild(self.messageScene);
            };
            this.messageScene.setMessage(szString, callBack, callBack);
        };
        /**
         * 进入排队队列
         * */
        GameEngine.prototype.requestMatch = function () {
            var _this = this;
            var self = this;
            // this._timeEnter = Date.now();
            var callBack = function () {
                managers.FrameManager.getInstance().showPopWait("正在进入游戏房间...");
                if (self.gameScenes) {
                    self.gameScenes.showAnimation = true;
                    self.gameScenes.clearUsers();
                }
                if (self._ifLogonFrame == true) {
                    platform.login().then(function (data) {
                        GameEngine.getInstance().userInfo = data;
                        utils.GameConst.colorConsole("获取微信Info:");
                        console.log(data);
                        self.loginFrame();
                    });
                }
                else {
                    self.loginFrame();
                    self._ifLogonFrame = true;
                }
            };
            if (null == this.gameScenes) {
                //waiting
                // let time = Date.now();
                managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
                RES.loadGroup("gameScene", 2).then(function () {
                    self.gameScenes = new game.GameScenesLayer(self);
                    callBack();
                }).catch(function (err) {
                    managers.FrameManager.getInstance().dismissPopWait();
                    _this.showMessage(err);
                });
            }
            else {
                callBack();
            }
            // this.onGameScenesHandler();
        };
        /**=========================服务端消息=============================*/
        GameEngine.prototype.onUserEnter = function (e) {
            var data = e.data;
            var user = data.user;
            // console.log("进入房间玩家信息:", user);
            if (null != this.gameScenes) {
                // this.gameScenes.pushUpdate(user);
                this.gameScenes.onUpdateUser(user);
            }
        };
        GameEngine.prototype.onUserStatus = function (object) {
            var data = object.data;
            var user = data.user;
            var newstatus = data.newstatus;
            var oldstatus = data.oldstatus;
            // utils.GameConst.colorConsole(`更新玩家状态${user.szNickName}`);
            // console.log(object.data);
            if (null != this.gameScenes) {
                this.gameScenes.onUpdateUser(user, newstatus, oldstatus);
                // this.gameScenes.pushUpdate(user, newstatus, oldstatus);
            }
        };
        GameEngine.prototype.onUserScore = function (object) {
            // utils.GameConst.colorConsole("更新玩家分数:");
            // console.log(object);
            var userIndex = this.switchViewChairID(object.data.user.ChairID);
            // if (this.gameScenes) {
            //     this.gameScenes.updateScore(userIndex, object.data.score);
            // }
            var data = {
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
        };
        GameEngine.prototype.getGameStatus = function () {
            return this._cbGameStatus;
        };
        Object.defineProperty(GameEngine.prototype, "setGameStatus", {
            set: function (value) {
                this._cbGameStatus = value;
            },
            enumerable: true,
            configurable: true
        });
        /**游戏场景 */
        GameEngine.prototype.onGameScene = function (status, object) {
            utils.LOG("GameClientEngine: 游戏场景");
            this._cbGameStatus = status;
            managers.FrameManager.getInstance().dismissPopWait(); //移除等待界面
            switch (this._cbGameStatus) {
                case cmd.GAME_SCENE_FREE:
                    {
                        this.onSceneFree(object); //进入游戏,断线重连上来游戏已经结束的状况
                    }
                    break;
                case cmd.GAME_SCENE_PLAY:
                    {
                        this.onScenePlaying(object); //断线重连
                    }
                    break;
            }
        };
        GameEngine.prototype.onExit = function () {
            //移除通知
            this.removeEventListener(customEvent.CustomEvent.EVENT_USER_ENTER, this.onUserEnter, this);
            this.removeEventListener(customEvent.CustomEvent.EVENT_USER_STATUS, this.onUserStatus, this);
            this.removeEventListener(customEvent.CustomEvent.EVENT_USER_SCORE, this.onUserScore, this);
        };
        /**
         * 服务器下发消息
         * */
        GameEngine.prototype.onGameMessage = function (data) {
            console.log("GameEngine:", data);
            // if (data) {
            //     return;
            // }
            var msg = data;
            var wMainCmd = msg.wMainCmd;
            switch (msg.wSubCmd) {
                case cmd.SUB_S_GAME_START: {
                    this.onSubGameStart(data.cbBuffer);
                    break;
                }
                case cmd.SUB_S_OUT_CARD: {
                    this.onSubOutCards(data.cbBuffer);
                    break;
                }
                case cmd.SUB_S_PASS_CARD: {
                    this.onSubPass(data.cbBuffer);
                    break;
                }
                case cmd.SUB_S_GAME_END: {
                    this.onSubGameOver(data.cbBuffer);
                    break;
                }
                case cmd.SUB_S_PHRASE: {
                    // console.log("玩家发言");
                    break;
                }
                case cmd.SUB_S_TRUSTEE: {
                    this.onSubTrustee(data.cbBuffer);
                    // console.log("用户托管");
                    break;
                }
                case cmd.SUB_S_TURN_CACULATE: {
                    this.onSubTurnCaculate(data.cbBuffer);
                    // console.log("每轮结算");
                    break;
                }
            }
        };
        //subGame游戏开始
        GameEngine.prototype.onSubGameStart = function (buffer) {
            //标识游戏状态
            var time = Date.now();
            // utils.GameConst.colorConsole("进入游戏房间所耗费的时间:");
            console.log((this._timeEnter - time) / 1000);
            this._cbGameStatus = cmd.GAME_SCENE_PLAY;
            this._actionList = [];
            managers.FrameManager.getInstance().dismissPopWait();
            var start = new cmd.CMD_S_GameStart();
            start.onInit(buffer);
            // console.log("GameStart:", start);
            if (this.gameScenes) {
                this.gameScenes.showGameStart(start); //
                this._gameUsers = this.gameScenes.userList.concat();
            }
            // let tableId = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
            // console.log();
            //进行游戏玩家查询
            // this._gameFrame.queryUserInfo(newstatus.wTableID, newstatus.wChairID);
        };
        //玩家出牌
        GameEngine.prototype.onSubOutCards = function (buffer) {
            // console.log("%c玩家出牌", "color: red;font-size: 2em");
            var outCard = new cmd.CMD_S_OutCard(buffer);
            // console.log(outCard);
            this.m_currentUser = outCard.wOutCardUser;
            // if (this.gameScenes) {
            //     this.gameScenes.onNotifyOutCards(outCard);
            // }
            var action = {
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
        };
        //玩家过牌
        GameEngine.prototype.onSubPass = function (buffer) {
            // console.log("%c玩家过牌", "color: red;font-size: 2em");
            var pass = new cmd.CMD_S_PassCard();
            pass.onInit(buffer);
            var action = {
                bLock: false,
                nKind: EActionType.AK_PASS_AM,
                data: pass,
                start: Date.now()
            };
            this._actionList.push(action);
            this.beginGameAction();
        };
        GameEngine.prototype.onSubGameOver = function (buffer) {
            var _this = this;
            if (this.gameScenes) {
                this.gameScenes.finishGameOver();
            }
            var gameEnd = new cmd.CMD_S_GameEnd(buffer);
            var user = [];
            var self = this;
            if (this.gameScenes && this.gameScenes.userList) {
                this.gameScenes.m_overFlag = true;
                //过滤用户
                user = this._gameUsers.concat();
                if (user.length == 2) {
                    user.push(this.getMeUserItem());
                }
                if (user.length > 2) {
                    var origin_1 = [];
                    origin_1.push(this.getMeUserItem());
                    user.forEach(function (use) {
                        if (use.TableID == _this.getMeUserItem().TableID && use.cbUserStatus == df.US_PLAYING) {
                            //再检查UserId需要与已有的不同
                            var check = false;
                            for (var n = 0; n < origin_1.length; n++) {
                                if (origin_1[n].dwUserID == use.dwUserID) {
                                    check = true;
                                    break;
                                }
                            }
                            if (check == false && origin_1.length != 3) {
                                origin_1.push(use);
                            }
                        }
                    });
                    if (origin_1.length > 3) {
                        origin_1.splice(3, origin_1.length - 3);
                    }
                    user = origin_1;
                }
            }
            var action = {
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
        };
        GameEngine.prototype.onSubTrustee = function (buffer) {
            var trustee = new cmd.CMD_S_Trustee(buffer);
            if (this.gameScenes) {
                this.gameScenes.onNotifyTrustee(trustee);
            }
        };
        GameEngine.prototype.onSubTurnCaculate = function (buffer) {
            var caculate = new cmd.CMD_S_Turn_Caculate();
            caculate.onInit(buffer);
            //action 或者直接表现//
            if (this.gameScenes) {
                this.gameScenes.showTurnCaculate(caculate);
            }
        };
        GameEngine.prototype.switchViewChairID = function (chairID) {
            if (chairID < 0 || chairID >= this.gamePlayerCount())
                return -1;
            var myChair = this._gameFrame.getChairID();
            var userIndex = -1;
            var playerCount = this.gamePlayerCount();
            userIndex = ((playerCount - myChair) + chairID) % playerCount;
            if (userIndex < 0 || userIndex >= this.gamePlayerCount()) {
                console.log("位置解析错误");
                return -1;
            }
            return userIndex;
        };
        GameEngine.prototype.getGlobalChairID = function (index) {
            var myChair = this._gameFrame.getChairID();
            return (myChair + index) % 3;
        };
        /**游戏人数 */
        GameEngine.prototype.gamePlayerCount = function () {
            return cmd.GAME_PLAYER;
        };
        GameEngine.prototype.requestOutCard = function (cbCards) {
            //发送数据
            var outBuffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            outBuffer.Append_Byte(cbCards.length);
            cbCards.forEach(function (value, index) {
                outBuffer.Append_Byte(value);
            });
            this._gameFrame.sendData(df.MDM_GF_GAME, cmd.SUB_C_OUT_CARD, outBuffer);
            var mySelf = this._gameFrame.getMeUserItem();
            this.m_currentUser = mySelf.ChairID;
            //如果用户出牌为火箭的话，current与outUser是一样的
            var outCard = {
                cbCardCount: cbCards.length,
                wCurrentUser: (mySelf.ChairID + 1) % 3,
                wOutCardUser: mySelf.ChairID,
                cbCardData: cbCards
            };
            var action = {
                bLock: false,
                nKind: EActionType.AK_OUT_CARDS,
                data: outCard,
                start: Date.now()
            };
            this._actionList.push(action);
            this.beginGameAction();
        };
        GameEngine.prototype.requestPass = function () {
            var passBuffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            this._gameFrame.sendData(df.MDM_GF_GAME, cmd.SUB_C_PASS_CARD, passBuffer);
            var mySelf = this._gameFrame.getMeUserItem();
            var outPass = {};
            if ((mySelf.ChairID + 1) % 3 == this.m_currentUser) {
                outPass.cbTurnOver = true;
            }
            else {
                outPass.cbTurnOver = false;
            }
            outPass.wPassCardUser = mySelf.ChairID;
            outPass.wCurrentUser = (mySelf.ChairID + 1) % 3;
            var action = {
                nKind: EActionType.AK_PASS_AM,
                bLock: false,
                data: outPass,
                start: Date.now()
            };
            this._actionList.push(action);
            this.beginGameAction();
        };
        GameEngine.prototype.requestTrustee = function (is) {
            var trusteeBuffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            trusteeBuffer.Append_BOOL(is);
            this._gameFrame.sendData(df.MDM_GF_GAME, cmd.SUB_C_TRUSTEE, trusteeBuffer);
        };
        GameEngine.prototype.onMissilePassAction = function (index) {
            var data_1 = new cmd.CMD_S_PassCard();
            data_1.cbTurnOver = false;
            data_1.wPassCardUser = this.getGlobalChairID((index + 1) % 3); //全局坐标
            data_1.wCurrentUser = this.getGlobalChairID((index + 2) % 3);
            var action1 = {
                bLock: false,
                nKind: EActionType.AK_PASS_AM,
                data: data_1,
                start: Date.now()
            };
            this._actionList.push(action1);
            var data_2 = new cmd.CMD_S_PassCard();
            data_2.cbTurnOver = true;
            data_2.wPassCardUser = this.getGlobalChairID((index + 2) % 3); //全局坐标
            data_2.wCurrentUser = this.getGlobalChairID((index + 3) % 3);
            var action2 = {
                bLock: false,
                nKind: EActionType.AK_PASS_AM,
                data: data_2,
                start: Date.now()
            };
            this._actionList.push(action2);
            this.beginGameAction();
        };
        /**空闲场景 */
        GameEngine.prototype.onSceneFree = function (data) {
            // if (data) {
            //     return;
            // }
            if (this.gameScenes) {
                if (this._sceneReCon == true) {
                    this.gameScenes.showSceneFree(data, true);
                    this._sceneReCon = false;
                }
                else {
                    this.gameScenes.showSceneFree(data, false);
                }
            }
        };
        /**游戏场景 */
        GameEngine.prototype.onScenePlaying = function (data) {
            var dataBuffer = data;
            var scenePlaying = new cmd.CMD_S_StatusPlay(dataBuffer.cbBuffer);
            if (this.gameScenes) {
                this.gameScenes.showScenePlaying(scenePlaying);
            }
        };
        /**离开游戏*/
        GameEngine.prototype.onExitGame = function (szReason) {
            //判断用户状态
            if (null == this._gameFrame)
                return;
            var myself = this._gameFrame.getMeUserItem();
            this._gameFrame.onStandUp(myself.cbUserStatus >= df.US_PLAYING ? true : false);
            this._gameFrame.onExitGame();
            this._gameFrame = null;
            managers.ServiceCtrl.getInstance().setServerIdx(0);
            // this.startGameHandler();
            this._actionList = []; //动作队列清空
        };
        /**返回大厅 */
        GameEngine.prototype.onQueryExitGame = function () {
            var _this = this;
            //游戏状态判断
            var status = this.getGameStatus() == cmd.GAME_SCENE_FREE;
            var msg = this.getGameStatus() == cmd.GAME_SCENE_FREE ? "是否确定退出游戏？" : "游戏已经开始，退出将由憨憨机器人代打哦！\n 是否确定退出游戏？";
            if (status == false) {
                //弹窗
                var ExitPopup = new game.ExitTip(function () {
                    _this.onExitGame();
                });
            }
            else {
                this.onExitGame();
            }
        };
        /**获取玩家自己 */
        GameEngine.prototype.getMeUserItem = function () {
            if (null != this._gameFrame) {
                return this._gameFrame.getMeUserItem();
            }
            return null;
        };
        GameEngine.prototype.onHide = function () {
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
        };
        GameEngine.prototype.onShow = function () {
            if ((this.gameScenes && this.gameScenes.soundIsOpen) || (this.gameScenes == null)) {
                sound.SoundManager.getIns().playBG(game.BGM_SOURCE);
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
        };
        /**游戏动作
         * 可以使用组合模式以及观察者模式联合实现
         */
        GameEngine.prototype.beginGameAction = function () {
            var action = this._actionList[0];
            if (null == action || action.bLock) {
                var now = Date.now();
                var time = now - action.start;
                console.log("持续时间:", time / 1000);
                if (time > 4000) {
                    this._actionList.splice(0, 1);
                    this.beginGameAction();
                }
                return; //bLock动作锁(表示该动作正在执行)
            }
            action.bLock = true;
            switch (action.nKind) {
                case EActionType.AK_GAME_BEGIN: {
                    break;
                }
                case EActionType.AK_DEAL_CARDS: {
                    break;
                }
                case EActionType.AK_FLOP_CARDS: {
                    break;
                }
                case EActionType.AK_PRIORITY_AM: {
                    break;
                }
                case EActionType.AK_OUT_CARDS: {
                    //出牌设置定时器，3秒后执行removeAction;
                    this.startOutCard(action);
                    break;
                }
                case EActionType.AK_PASS_AM: {
                    this.startPass(action);
                    break;
                }
                case EActionType.AK_GAME_OVER: {
                    this.startGameOver(action);
                    break;
                }
                case EActionType.AK_SCORE_ADD: {
                    this.startGoldAdd(action);
                    break;
                }
            }
        };
        /**移除动作 */
        GameEngine.prototype.removeGameAction = function (bContinue) {
            if (bContinue === void 0) { bContinue = true; }
            //清除出牌动作的计时器
            if (this._outCardsTimer) {
                this._outCardsTimer.stop();
                this._outCardsTimer = null;
            }
            var action = this._actionList[0];
            if (null == action || !action.bLock)
                return;
            var nkind = action.nKind;
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
        };
        GameEngine.prototype.startOutCard = function (action) {
            var _this = this;
            //可以设置游戏状态等，最好把出牌等，记录在GameEngine里
            var callBack = function () {
                _this.removeGameAction(true);
            };
            this._outCardsTimer = new egret.Timer(3000, 1);
            this._outCardsTimer.addEventListener(egret.TimerEvent.TIMER, this.removeGameAction, this);
            this._outCardsTimer.start();
            if (this.gameScenes) {
                this.gameScenes.startOutCards(action.data, callBack);
            }
            else {
                throw new Error("游戏组件未初始化完成");
            }
        };
        GameEngine.prototype.finishOutCard = function (action) {
            if (this.gameScenes) {
                this.gameScenes.finishOutCards(action.data);
            }
            else {
                throw new Error("游戏组件未初始化完成");
            }
        };
        GameEngine.prototype.startPass = function (action) {
            var _this = this;
            var callBack = function () {
                // console.log("%c准备移除过牌动作", "color: red; font-size: 1.5em");
                _this.removeGameAction(true);
            };
            if (this.gameScenes) {
                this.gameScenes.startPass(action.data, callBack);
            }
            else {
                throw new Error("游戏组件未初始化完成");
            }
        };
        GameEngine.prototype.finishPass = function (action) {
            if (this.gameScenes) {
                this.gameScenes.finishPass(action.data);
            }
            else {
                throw new Error("游戏组件未初始化完成");
            }
        };
        GameEngine.prototype.startGameOver = function (action) {
            var _this = this;
            var self = this;
            var callBack = function () {
                var callFunc = function (node) {
                    node.visible = false;
                };
                var lastCards = [];
                lastCards = self.gameScenes.lastCards.concat();
                self.gameScenes.clearDesk(callFunc); //front
                var callBack = function () {
                    // console.log("%c准备结束", "color: red; font-size: 1.5em");
                    self.removeGameAction(true);
                };
                if (_this.overScenes) {
                    self.showGameOverSceneHandler();
                    self.overScenes.onGameOver(action.data.gameEnd, action.data.user, lastCards, callBack);
                    //设定如果未点再来一局，30秒后自动退出房间
                    self.startOverTimer();
                }
                else {
                    throw new Error("游戏组件未初始化完成");
                }
            };
            managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
            RES.loadGroup("resultScene").then(function () {
                _this.overScenes = new game.GameOverLayer(self);
                managers.FrameManager.getInstance().dismissPopWait();
                callBack();
            }).catch(function (err) {
                managers.FrameManager.getInstance().dismissPopWait();
                GameEngine.getInstance().showMessage(err);
            });
        };
        GameEngine.prototype.startOverTimer = function () {
            var self = this;
            this._overTimer = setTimeout(function () {
                //退出游戏
                utils.GameConst.colorConsole("自动退出游戏");
                self.startGameHandler();
                self.onExitGame();
                self.showMessage("长时间未开始游戏，已自动退出!");
            }, 10 * 1000);
        };
        GameEngine.prototype.clearTimer = function () {
            if (this._overTimer) {
                clearTimeout(this._overTimer);
                this._overTimer = null;
            }
        };
        GameEngine.prototype.finishGameOver = function (action) {
            //游戏结束以后调用查询低保；
            // this._gameFrame.searchBaseEnsure();
            // if (this.gameScenes) {
            //     this.gameScenes.finishGameOver();
            // }
        };
        GameEngine.prototype.startGoldAdd = function (action) {
            var _this = this;
            var callBack = function () {
                _this.removeGameAction(true);
            };
            if (this.gameScenes) {
                this.gameScenes.updateScore(action.data.index, action.data.score, callBack);
            }
        };
        GameEngine.prototype.finishGoldAdd = function (action) {
        };
        GameEngine.prototype.updateBaseEnsure = function (data) {
            if (this.gameScenes) {
                this.gameScenes.updateBaseEnsure(data);
            }
        };
        GameEngine.prototype.onSystemMessage = function (msg) {
            console.log(msg);
        };
        GameEngine.prototype.getCheckInfoParams = function () {
            var userID = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
            var serverTime = Math.floor(new Date().getTime() / 1000);
            var now = new Date();
            var TimeStamp = utils.formateDateAndTimeToString(now);
            var stationID = df.STATION_ID;
            var nonceStr = Math.floor(Math.random() * Math.pow(10, 8)); //随机生成八位数
            var params = "StationID=" + stationID + "&UserID=" + userID + "&NonceStr=" + nonceStr + "&TimeStamp=" + TimeStamp;
            var signature = utils.MD5.MD5_HEX("UserID=" + userID + "&NonceStr=" + nonceStr + "&TimeStamp=" + TimeStamp + "&Key=wsdeflkfignvgdhfbsgtrs");
            signature = signature.toUpperCase();
            params = params + "&signature=" + signature;
            return params;
        };
        GameEngine.prototype.addBase = function () {
            if (this.gameScenes) {
                this.gameScenes.addBase();
            }
        };
        return GameEngine;
    }(eui.UILayer));
    game.GameEngine = GameEngine;
    __reflect(GameEngine.prototype, "game.GameEngine");
})(game || (game = {}));
