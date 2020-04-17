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
    var test_one = [
        "v1/Applet/GetWeekWinCountRank",
        "v1/Applet/GetWeekWinScoreRank",
        "v1/Applet/GetUserScoreRank"
    ];
    var DESK_Y = 444;
    var LOGO_X = 134;
    var StartGameLayer = (function (_super) {
        __extends(StartGameLayer, _super);
        //游戏开始界面初始化
        function StartGameLayer(engine) {
            var _this = _super.call(this) || this;
            _this.onComplete = false;
            _this.actionQueue = [];
            _this._components = [];
            _this._scaleComponent = [];
            _this._touchButton = null;
            _this._testCount = 0;
            _this._times = 0;
            _this.isRankClick = false;
            _this._rank_bg = null;
            _this._rankScore = 15;
            _this._gameEngine = engine;
            _this.skinName = StartGameSkin;
            console.log("添加初始化事件");
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onInitComplete, _this);
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.start, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.remove, _this);
            return _this;
        }
        /**
         * 组件初始化完成
         * */
        StartGameLayer.prototype.onInitComplete = function () {
            console.log("开始界面初始化完毕!");
            // console.log("%c开始界面初始化完毕:", "color: red;font-size: 2em" );
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onInitComplete, this);
            this.onComplete = true;
            //适配问题
            this.initData();
            this.initButton();
            this.beginAction();
            // this.pushArray();
            // let test = new HeadBorder();
            // this.addChild(test);
        };
        StartGameLayer.prototype.start = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.start, this);
            // this.btnDisable();
            var self = this;
            var callBack = function () {
                self.startAnimation().then(function () {
                    // self.group_btn.visible = true;
                    // self.initButton();
                    self.flashAnimation();
                });
            };
            // console.log(this.onComplete);
            if (this.onComplete) {
                callBack();
            }
            else {
                this.actionQueue.push(callBack);
            }
        };
        //移出舞台
        StartGameLayer.prototype.remove = function () {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.remove, this);
            if (this.flashTimer) {
                this.flashTimer.stop();
                this.flashTimer = null;
            }
        };
        StartGameLayer.prototype.clear = function () {
            if (this.onComplete) {
                this.group_btn.visible = false;
                this.gameLogo.alpha = 0;
                this.gameLogo.x = 750;
                this.group_desk.y = 1624;
                this.img_flash.visible = false;
                this.img_flash.x = 169;
            }
        };
        StartGameLayer.prototype.beginAction = function () {
            var callBack = this.actionQueue[0];
            if (callBack != null) {
                callBack();
                this.actionQueue.splice(0, 1);
                this.beginAction();
            }
        };
        StartGameLayer.prototype.flashAnimation = function () {
            var _this = this;
            // this.btnDisable();
            this.group_btn.visible = true;
            this.group_btn.alpha = 0;
            this.img_flash.visible = true;
            this.img_flash.alpha = 0;
            egret.Tween.get(this.group_btn).to({ alpha: 1 }, 300).call(function () {
                if (null == _this.flashTimer) {
                    _this.btnFlash();
                    _this.flashTimer = new egret.Timer(5000);
                    _this.flashTimer.addEventListener(egret.TimerEvent.TIMER, _this.btnFlash, _this);
                    _this.flashTimer.start();
                }
                // egret.Tween.get(this.img_flash).to({x: 375, alpha: 1}, 500).to({alpha: 0}, 300).call(() => {
                //     this.img_flash.visible = false;
                //     this.btnActive();
                // });
            });
        };
        StartGameLayer.prototype.btnFlash = function () {
            var _this = this;
            this.img_flash.x = 169;
            this.img_flash.visible = true;
            this.img_flash.alpha = 0;
            egret.Tween.get(this.img_flash).to({ x: 375, alpha: 1 }, 500).to({ alpha: 0 }, 300).call(function () {
                _this.img_flash.visible = false;
                _this.btnActive();
            });
        };
        /**
         * 初始化游戏数据
         * 游戏界面适配问题
         * */
        StartGameLayer.prototype.initData = function () {
            this.gameData = {
                label: "初始label"
            };
            this._components.push(this.img_bg);
            this._components.push(this.group_desk);
            this._components.push(this.desk);
            this._components.push(this.login_poker_0);
            this._components.push(this.login_poker_1);
            this._components.push(this.login_poker_2);
            this._components.push(this.login_poker_3);
            this._components.push(this.gameLogo);
            this._components.push(this.label);
            this._components.push(this.group_btn);
            this._components.push(this.btnStartGame);
            this._components.push(this.btnShare);
            this._components.push(this.rankFriend);
            this._components.push(this.rankGroup);
            this._components.push(this.img_flash);
            this._components.forEach(function (component) {
                component.y = component.y * game.RATE;
            });
            this._scaleComponent.push(this.btnStartGame);
            this._scaleComponent.push(this.btnShare);
            this._scaleComponent.forEach(function (component) {
                component.scaleX = component.scaleY = game.RATE;
            });
        };
        StartGameLayer.prototype.initButton = function () {
            this.btnStartGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartGame, this);
            this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
            this.rankFriend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showFriendsRank, this);
            this.rankGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
            // console.log(this.btnStartGame);
            // this.btnStartGame["mainImg"].src = RES.getRes("startSene_json#btn_start_game_png");
            // this.addBtnChange(this.btnStartGame);
            this.addBtnChange(this.btnShare);
            this.addBtnChange(this.rankFriend);
            this.addBtnChange(this.rankGroup);
        };
        StartGameLayer.prototype.createChildren = function () {
            // this.btnStartGame["mainImg"].src = RES.getRes("startSene_json#btn_start_game_png");
            console.log(this.btnStartGame);
            this.onInitComplete();
        };
        StartGameLayer.prototype.addBtnChange = function (button) {
            button.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        };
        StartGameLayer.prototype.removeBrnChange = function (button) {
            button.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        };
        StartGameLayer.prototype.onTouchBeginChange = function (e) {
            this._touchButton = e.currentTarget;
            var scale = this._touchButton.scaleX - 0.1;
            this._touchButton.scaleX = this._touchButton.scaleY = scale;
        };
        StartGameLayer.prototype.onTouchMoveChange = function (e) {
            if (e.currentTarget != this._touchButton) {
            }
        };
        StartGameLayer.prototype.onTouchEndChange = function (e) {
            if (e.currentTarget != this._touchButton) {
            }
            if (null != this._touchButton) {
                var scale = this._touchButton.scaleX + 0.1;
                this._touchButton.scaleX = this._touchButton.scaleY = scale;
            }
            this._touchButton = null;
        };
        StartGameLayer.prototype.btnDisable = function () {
            this.btnStartGame.enabled = false;
            this.btnShare.enabled = false;
            this.rankFriend.enabled = false;
            this.rankGroup.enabled = false;
        };
        StartGameLayer.prototype.rankDisable = function () {
            var self = this;
            var callBack = function () {
                self.rankFriend.visible = false;
            };
            if (this.onComplete) {
                callBack();
            }
            else {
                this.actionQueue.push(callBack);
            }
        };
        StartGameLayer.prototype.rankActive = function () {
            var self = this;
            var callBack = function () {
                self.rankFriend.visible = true;
            };
            if (this.onComplete) {
                callBack();
            }
            else {
                this.actionQueue.push(callBack);
            }
        };
        StartGameLayer.prototype.btnActive = function () {
            this.btnStartGame.enabled = true;
            this.btnShare.enabled = true;
            this.rankGroup.enabled = true;
            this.rankFriend.enabled = true;
        };
        //游戏逻辑
        StartGameLayer.prototype.onStartGame = function () {
            //游戏匹配机制
            //向服务器发送消息，进入排队队列
            console.log("游戏开始,切换到游戏匹配界面"); //阴影加转动界面，或者。。。
            // this._gameEngine.requestMatch();
            game.GameEngine.getInstance().requestMatch();
        };
        //分享按钮
        StartGameLayer.prototype.shareGame = function () {
            //转发功能
            platform.shareAppMessage().then(function (data) {
                console.log(data);
            });
            // this.getCheckInfo();
            // GameEngine.getInstance()._gameFrame.queryUserScore();
            // this.getCheckInfo();
        };
        StartGameLayer.prototype.onSignIn = function () {
            //播放签到动画
            // this._main.playSignIn(0);
            // let baseEnsure = new frame.BaseEnsureFrame(this);
            // baseEnsure.sendFlushBaseEnsure();
            var self = this;
            var params = game.GameEngine.getInstance().getCheckInfoParams();
            var httpURL = game.CHECK_IN_HOST + game.POST_CHECK_IN_URL;
            var httpRequest = new utils.HttpRequest(); //egret.HttpResponseType.ARRAY_BUFFER
            var callBack = function (evt) {
                console.log("正常返回");
                if (evt) {
                    var request = evt.currentTarget;
                    console.log("get data : ", request.response);
                    var data = JSON.parse(request.response);
                    console.log(data.payload);
                    //codeID 0: 操作成功  codeID 1005 msg:
                    if (data.codeID == 0) {
                        //签到成功表现 -> 按钮变化 data.payload.lxGold
                    }
                    else if (data.codeID == 1005) {
                        //显示message
                    }
                }
            };
            var errorBack = function (msg) {
                console.log("错误返回");
                if (msg) {
                    console.log(msg);
                }
            };
            httpRequest.initHttpRequest(this, httpURL, params, egret.HttpMethod.POST, callBack, errorBack);
        };
        StartGameLayer.prototype.getCheckInfo = function () {
            var self = this;
            var params = this.getCheckInfoParams();
            params = "?" + params;
            var httpURL = game.CHECK_IN_HOST + test_one[(this._times++) % 3];
            var httpRequest = new utils.HttpRequest(); //egret.HttpResponseType.ARRAY_BUFFER
            var callBack = function (evt) {
                console.log("正常返回");
                if (evt) {
                    var request = evt.currentTarget;
                    var data = JSON.parse(request.response);
                    console.log(httpURL + ":");
                    console.log("get data : ", request.response);
                    console.log(data.payload);
                    // if (null == data.payload) {
                    //     // self.btn_sign_in.enabled = true;
                    //     this.setDays(1, false);
                    //     return;
                    // }
                    // self.setDetailByData(data);
                    if (data.codeID == 0) {
                        // console.log("获取签到消息");
                        // console.log(data);
                    }
                    else if (data.codeID == 1005) {
                        // console.log("打印签到失败消息");
                        // console.log(data.message);
                    }
                }
            };
            var errorBack = function (msg) {
                console.log("错误返回");
                if (msg) {
                    console.log(msg);
                }
            };
            httpRequest.initHttpRequest(this, httpURL, params, egret.HttpMethod.GET, callBack, errorBack);
        };
        StartGameLayer.prototype.getCheckInfoParams = function () {
            // const userID = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
            var userID = 9018;
            var serverTime = Math.floor(new Date().getTime() / 1000);
            var now = new Date();
            var TimeStamp = utils.formateDateAndTimeToString(now);
            var stationID = df.STATION_ID;
            var nonceStr = Math.floor(Math.random() * Math.pow(10, 8)); //随机生成八位数
            //StationID={StationID}&UserID={UserID}&NonceStr={NonceStr}&TimeStamp={TimeStamp}&Signature={Signature}
            var params = "StationID=" + stationID + "&UserID=" + userID + "&NonceStr=" + nonceStr + "&TimeStamp=" + TimeStamp;
            var signature = utils.MD5.MD5_HEX("UserID=" + userID + "&NonceStr=" + nonceStr + "&TimeStamp=" + TimeStamp + "&Key=wsdeflkfignvgdhfbsgtrs");
            signature = signature.toUpperCase();
            params = params + "&signature=" + signature;
            return params;
        };
        StartGameLayer.prototype.loginFrame = function () {
            var testI = new df.CMiniProgramInfo();
            testI.sCode = this._userInfo.code;
            testI.sRawData = this._userInfo.rawData;
            testI.sEncryptedData = this._userInfo.encryptedData;
            testI.sIv = this._userInfo.iv;
            testI.signature = this._userInfo.signature;
            var logonFrame = new frame.LogonFrame(this);
            logonFrame.setMiniProgramInfo(testI);
            logonFrame.onMiniProgramLogon();
        };
        StartGameLayer.prototype.testClose = function () {
            var _this = this;
            // if (this._gameEngine && this._gameEngine.onExitGame) {
            //     this._gameEngine.onExitGame();
            // }
            platform.login().then(function (data) {
                _this._userInfo = data;
                _this.loginFrame();
            });
            // SocketMrg.SocketManager.getInstance().closeAllSocket();
        };
        StartGameLayer.prototype.showTest = function () {
            // this.closeBtn.visible = true;
            var openDataContext = wx.getOpenDataContext();
            //主要示例代码开始
            var bitmapdata1 = new egret.BitmapData(window["sharedCanvas"]);
            bitmapdata1.$deleteSource = false;
            var texture = new egret.Texture();
            texture.bitmapData = bitmapdata1;
            this.bitmap = new egret.Bitmap(texture);
            this.bitmap.width = this.stage.stageWidth;
            this.bitmap.height = this.stage.stageHeight;
            this.bitmap.anchorOffsetX = this.bitmap.width / 2;
            this.bitmap.anchorOffsetY = this.bitmap.height / 2;
            this.bitmap.x = this.stage.stageWidth / 2;
            this.bitmap.y = this.stage.stageHeight / 2;
            this.addChild(this.bitmap);
            egret.startTick(function (timeStarmp) {
                egret.WebGLUtils.deleteWebGLTexture(bitmapdata1.webGLTexture);
                bitmapdata1.webGLTexture = null;
                return false;
            }, this);
            //主要示例代码结束
            //发送消息
            openDataContext.postMessage({
                text: "hello",
                year: (new Date()).getFullYear()
            });
            console.log("data");
            // this.addChild(this.closeBtn);
        };
        //打开排行榜
        StartGameLayer.prototype.showFriendsRank = function () {
            var _this = this;
            //主屏幕遮罩
            if (null == this._rankListMask) {
                this._rankListMask = new egret.Shape();
                this._rankListMask.graphics.beginFill(0x000000, 1);
                this._rankListMask.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
                this._rankListMask.graphics.endFill();
                this._rankListMask.alpha = 0.2;
                this._rankListMask.touchEnabled = true;
            }
            this.addChild(this._rankListMask);
            if (null == this._rank_bg) {
                var self_1 = this;
                var callBack = function () {
                    self_1.onCloseRank();
                    utils.GameConst.removeChild(_this._rank_bg);
                };
                this._rank_bg = new game.RankList(this, callBack);
            }
            this.addChild(this._rank_bg);
            //打开排行榜要进行一次请求
            //要判断是处于世界排行榜还是好友排行榜
            // this._rank_bg.updateWorldData();
            //纠正当前用户的微信排行榜数据
            if (this._rank_bg.status == 0) {
                this._rankList = platform.openDataContext.createDisplayObject(null, this.stage.stageWidth, this.stage.stageHeight);
                this.addChild(this._rankList);
                // this._rank_bg.postWeekWin();
                platform.openDataContext.postMessage({
                    command: "open"
                });
            }
            else {
                this._rank_bg.closeFriendRankAndUpdate();
            }
            // this.addChild(this._btnRankClose);
        };
        StartGameLayer.prototype.onCloseRank = function () {
            this.removeChild(this._rankListMask); //mask
            utils.GameConst.removeChild(this._rankList); //bg
            if (this._rank_bg.status == 0) {
                platform.openDataContext.postMessage({
                    command: "close"
                });
            }
        };
        StartGameLayer.prototype.onCloseFriend = function () {
            if (this._rank_bg.status == 1) {
                utils.GameConst.removeChild(this._rankList);
                // this.pushArray();
                platform.openDataContext.postMessage({
                    command: "close"
                });
            }
        };
        StartGameLayer.prototype.openFriendRank = function () {
            this.addChild(this._rankList);
            // this.pushArray();
            platform.openDataContext.postMessage({
                command: "open"
            });
        };
        StartGameLayer.prototype.pushArray = function () {
            platform.openDataContext.postMessage({
                command: "save",
                nickName: game.GameEngine.getInstance().userInfo.nickName,
                score: this._rankScore
            });
        };
        StartGameLayer.prototype.addWinning = function () {
            platform.openDataContext.postMessage({
                command: "add",
                nickName: game.GameEngine.getInstance().userInfo.nickName
            });
        };
        /**==========================动画============================*/
        StartGameLayer.prototype.startAnimation = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                egret.Tween.get(_this.group_desk).to({ y: DESK_Y }, 300).call(function () {
                    egret.Tween.get(_this.gameLogo).to({ x: LOGO_X, alpha: 1 }, 300).call(function () {
                        resolve();
                    });
                });
            });
        };
        /**======================================================*/
        /**==========================客户端发送消息============================*/
        /**
         * 请求加入游戏队列
         * */
        StartGameLayer.prototype.requestMatch = function () {
        };
        /**
         * 请求退出游戏队列
         *
         * */
        StartGameLayer.prototype.requestCancelMatch = function () {
        };
        return StartGameLayer;
    }(eui.Component));
    game.StartGameLayer = StartGameLayer;
    __reflect(StartGameLayer.prototype, "game.StartGameLayer");
    // declare var wx: any = {}
})(game || (game = {}));
