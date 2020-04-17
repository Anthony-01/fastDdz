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
    game.CHECK_IN_HOST = "https://minigame.foxuc.com/"; //请求主机名
    game.GET_SHARE_INFO_URL = "v1/Applet/GetGameShareItem"; //get路径一
    game.POST_SHARE_URL = "v1/Applet/UserGameShare"; //post路径二
    game.GET_CHECK_IN_INFO_URL = "v1/Applet/GetCheckInItem"; //GET路径三
    game.POST_CHECK_IN_URL = "v1/Applet/UserCheckIn"; //post路径四
    game.CANT_ANIMATION_POSITION = {
        x: 135,
        y: 224,
        upX: 135,
        upY: 214,
        size: 25,
        color: 0xffc369
    };
    var GoldPopup = (function (_super) {
        __extends(GoldPopup, _super);
        function GoldPopup(main) {
            var _this = _super.call(this) || this;
            _this._onComplete = false;
            _this._actionQueue = [];
            _this._touchButton = null;
            _this.baseTime = 0;
            _this._main = main;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemove, _this);
            return _this;
        }
        GoldPopup.prototype.onComplete = function () {
            this._onComplete = true;
            console.log("领取金币弹窗组件初始化完毕");
            this.showShareTimers(0);
            this.initBtn();
            this.activeBtn();
            this.beginAction();
            this.getCheckInfo();
        };
        GoldPopup.prototype.beginAction = function () {
            var callBack = this._actionQueue[0];
            if (callBack != null) {
                callBack();
                this._actionQueue.splice(0, 1);
                this.beginAction();
            }
        };
        GoldPopup.prototype.initBtn = function () {
            this.btn_sign_in.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSignIn, this);
            this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
            this.btn_details.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDetails, this);
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.addBtnChange(this.btn_sign_in);
        };
        GoldPopup.prototype.addBtnChange = function (button) {
            button.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        };
        GoldPopup.prototype.removeBrnChange = function (button) {
            button.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        };
        GoldPopup.prototype.onTouchBeginChange = function (e) {
            this._touchButton = e.currentTarget;
            var scale = this._touchButton.scaleX - 0.1;
            this._touchButton.scaleX = this._touchButton.scaleY = scale;
        };
        GoldPopup.prototype.onTouchMoveChange = function (e) {
            if (e.currentTarget != this._touchButton) {
            }
        };
        GoldPopup.prototype.onTouchEndChange = function (e) {
            if (e.currentTarget != this._touchButton) {
            }
            if (null != this._touchButton) {
                var scale = this._touchButton.scaleX + 0.1;
                this._touchButton.scaleX = this._touchButton.scaleY = scale;
            }
            this._touchButton = null;
        };
        GoldPopup.prototype.showShareTimers = function (time) {
            var self = this;
            var callBack = function () {
                self.give_times.text = time + "_3";
            };
            if (this._onComplete) {
                callBack();
            }
            else {
                this._actionQueue.push(callBack);
            }
        };
        /**
         * 签到
         * */
        GoldPopup.prototype.onSignIn = function () {
            //做游戏状态的处理，如果是游戏
            // if (this.testQuery()) {return}
            // return;
            var _this = this;
            //播放签到动画
            // this._main.playSignIn(0);
            // let baseEnsure = new frame.BaseEnsureFrame(this);
            // baseEnsure.sendFlushBaseEnsure();
            var self = this;
            self.btn_sign_in.enabled = false;
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
                        _this._main.addGold(data.payload.presentGold);
                        self.btn_sign_in.enabled = false;
                        _this.testQuery();
                    }
                    else if (data.codeID == 1005) {
                        //显示message
                        self.btn_sign_in.enabled = true;
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
        GoldPopup.prototype.testQuery = function () {
            game.GameEngine.getInstance()._gameFrame.queryUserScore();
            return true;
        };
        GoldPopup.prototype.onDetails = function () {
            var _this = this;
            var self = this;
            if (null == this._detailPopup) {
                managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
                RES.loadGroup("details").then(function () {
                    managers.FrameManager.getInstance().dismissPopWait();
                    self._detailPopup = new game.DetailsPopup(_this._main);
                    self._detailPopup.horizontalCenter = 0;
                    self._detailPopup.y = 202;
                    self._main.adjustComponent(_this._detailPopup, true);
                    self._main.addPopup(self._detailPopup);
                }).catch(function (err) {
                    managers.FrameManager.getInstance().dismissPopWait();
                    game.GameEngine.getInstance().showMessage(err);
                });
            }
            else {
                this._main.addPopup(this._detailPopup);
            }
            // this._detailPopup.setDays(7);
        };
        GoldPopup.prototype.onShare = function () {
            platform.getGold().then(function () {
                console.log("领取金币成功");
            });
        };
        GoldPopup.prototype.onClose = function () {
            utils.GameConst.removeChild(this);
            this._main.removeMask();
            //如何移除父组件的全屏遮罩
        };
        GoldPopup.prototype.onRemove = function () {
            this.disabledBtn();
        };
        GoldPopup.prototype.onStage = function () {
            var self = this;
            var callBack = function () {
                self.activeBtn();
                self.getCheckInfo();
            };
            if (this._onComplete) {
                callBack();
            }
            else {
                this._actionQueue.push(callBack);
            }
        };
        GoldPopup.prototype.activeBtn = function () {
            // this.btn_sign_in.enabled = true;
            this.btn_share.enabled = true;
            this.btn_details.enabled = true;
            this.btn_close.enabled = true;
        };
        GoldPopup.prototype.disabledBtn = function () {
            this.btn_sign_in.enabled = false;
            this.btn_share.enabled = false;
            this.btn_details.enabled = false;
            this.btn_close.enabled = false;
        };
        /**
         * 低保领取
         * */
        GoldPopup.prototype.connectComplete = function () {
            console.log("BaseEnsure: complete!");
        };
        GoldPopup.prototype.addBaseTime = function () {
            var _this = this;
            var self = this;
            var callBack = function () {
                self.baseTime += 1;
                self.give_times.text = _this.baseTime + "_3";
            };
            if (this._onComplete) {
                callBack();
            }
            else {
                this._actionQueue.push(callBack);
            }
        };
        GoldPopup.prototype.updateBaseEnsureInformation = function (msg) {
            this.baseTime = msg.times;
            var self = this;
            var callBack = function () {
                self.give_times.text = msg.times + "_3";
            };
            if (this._onComplete) {
                callBack();
            }
            else {
                this._actionQueue.push(callBack);
            }
        };
        GoldPopup.prototype.getCheckInfo = function () {
            // let status = GameEngine.getInstance().getGameStatus();
            // if (status == cmd.GAME_SCENE_PLAY) { //游戏状态按钮为灰色
            //     this.btn_sign_in.enabled = false;
            //     return;
            // }
            // this.testQuery();
            var self = this;
            var params = game.GameEngine.getInstance().getCheckInfoParams();
            params = "?" + params;
            var httpURL = game.CHECK_IN_HOST + game.GET_CHECK_IN_INFO_URL;
            var httpRequest = new utils.HttpRequest(); //egret.HttpResponseType.ARRAY_BUFFER
            var callBack = function (evt) {
                console.log("正常返回");
                if (evt) {
                    var request = evt.currentTarget;
                    var data = JSON.parse(request.response);
                    console.log("get data : ", data);
                    console.log(data.payload);
                    if (data.codeID == 0) {
                        // console.log("获取签到消息");
                        // console.log(data);
                        var checkEnabled = !self.isCheckIn(data.payload.collectDate);
                        // console.log(checkEnabled);
                        self.btn_sign_in.enabled = checkEnabled;
                    }
                    else if (data.codeID == 1005) {
                        // console.log("打印签到失败消息");
                        console.log(data.message);
                        self.btn_sign_in.enabled = true;
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
        GoldPopup.prototype.isCheckIn = function (old) {
            console.log(old);
            old = old.replace(/-/g, "/");
            if (old == "")
                return false;
            var oldTime = new Date(old);
            var nowTime = new Date();
            // utils.GameConst.colorConsole("判断是否签到");
            // console.log("oldTime", oldTime);
            // console.log("newTime", nowTime);
            var _a = [nowTime.getFullYear(), oldTime.getFullYear()], nowYear = _a[0], oldYear = _a[1];
            var _b = [nowTime.getMonth(), oldTime.getMonth()], nowMonth = _b[0], oldMonth = _b[1];
            var _c = [nowTime.getDay(), oldTime.getDay()], nowDay = _c[0], oldDay = _c[1];
            console.log(nowYear, oldYear);
            if (nowYear - oldYear != 0)
                return false;
            if (nowMonth - oldMonth != 0)
                return false;
            return nowDay == oldDay;
        };
        return GoldPopup;
    }(eui.Component));
    game.GoldPopup = GoldPopup;
    __reflect(GoldPopup.prototype, "game.GoldPopup");
})(game || (game = {}));
