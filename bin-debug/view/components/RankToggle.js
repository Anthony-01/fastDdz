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
// TypeScript file
var game;
(function (game) {
    game.USER_SCORE_RANK = "v1/Applet/GetWeekWinCountRank";
    var RankToggle = (function (_super) {
        __extends(RankToggle, _super);
        function RankToggle(main) {
            var _this = _super.call(this) || this;
            //0-friend 1-world
            _this.m_status = 0;
            _this.m_onComplete = false;
            // this.touchChildren = false;
            _this._main = main;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            return _this;
            //
        }
        Object.defineProperty(RankToggle.prototype, "status", {
            get: function () {
                return this.m_status;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 通过当前状态显示视图-表现
         * @author Anthony
         */
        RankToggle.prototype.showStatus = function () {
            switch (this.m_status) {
                case 0: {
                    this.btn_friend["img_bg"].alpha = 1;
                    this.btn_world["img_bg"].alpha = 0;
                    break;
                }
                case 1: {
                    this.btn_friend["img_bg"].alpha = 0;
                    this.btn_world["img_bg"].alpha = 1;
                    break;
                }
            }
        };
        RankToggle.prototype.onComplete = function () {
            this.btn_friend.touchChildren = true;
            this.btn_world.touchChildren = true;
            this.m_onComplete = true;
            this.showStatus();
            this.btn_friend.name = "friend";
            this.btn_world.name = "world";
            this.btn_friend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
            this.btn_world.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        };
        RankToggle.prototype.onChange = function (e) {
            e.stopImmediatePropagation();
            var name = e.currentTarget.name;
            console.log("点击：", name);
            if (name == "friend") {
                this.showWxRank();
            }
            else {
                this.showEuiRank();
            }
            this.showStatus();
        };
        RankToggle.prototype.showWxRank = function () {
            //判断是否需要打开
            if (this.m_status == 0)
                return;
            this.m_status = 0;
            this._main.openFriendRank();
        };
        RankToggle.prototype.showEuiRank = function () {
            if (this.m_status == 1)
                return;
            this.m_status = 1;
            this._main.closeFriendRank();
            // this.httpWorld();
        };
        RankToggle.prototype.showWorld = function (data) {
            this._main.showByData(data);
        };
        RankToggle.prototype.requestData = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.updateData().then(function (data) {
                    resolve(data);
                });
            });
        };
        //请求世界排行榜数据
        //{rankID: 6, userID: 9019, nickName: "tencent_game_19", faceUrl: "", rankValue: 18888897}
        RankToggle.prototype.httpWorld = function () {
            var _this = this;
            this.updateData().then(function (data) {
                _this.showWorld(data);
            });
            // let self = this;
            // let params = this.getCheckInfoParams();
            // params = "?" + params;
            // let httpURL: string = CHECK_IN_HOST + USER_SCORE_RANK;
            // let httpRequest = new utils.HttpRequest();//egret.HttpResponseType.ARRAY_BUFFER
            // let callBack = (evt?) => {
            //     console.log("正常返回");
            //     if (evt) {
            //         let request = <egret.HttpRequest>evt.currentTarget;
            //         let data = JSON.parse(request.response);
            //         console.log(httpURL+":");
            //         console.log("get data : ",request.response);
            //         console.log(data.payload);
            //         if (data.codeID == 0) {
            //             this.showWorld(data.payload);
            //         } else if (data.codeID == 1005) {
            //
            //         }
            //     }
            // };
            // let errorBack = (msg?) => {
            //     console.log("错误返回");
            //     if (msg) {
            //         console.log(msg);
            //     }
            // };
            // httpRequest.initHttpRequest(this, httpURL, params, egret.HttpMethod.GET, callBack, errorBack);
        };
        RankToggle.prototype.updateData = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var params = _this.getCheckInfoParams();
                params = "?" + params;
                var httpURL = game.CHECK_IN_HOST + game.USER_SCORE_RANK;
                var httpRequest = new utils.HttpRequest(); //egret.HttpResponseType.ARRAY_BUFFER
                var callBack = function (evt) {
                    if (evt) {
                        var request = evt.currentTarget;
                        var data = JSON.parse(request.response);
                        console.log(httpURL + ":");
                        console.log("get data : ", request.response);
                        console.log(data.payload);
                        if (data.codeID == 0) {
                            resolve(data.payload);
                        }
                        else if (data.codeID == 1005) {
                        }
                    }
                };
                var errorBack = function (msg) {
                    if (msg) {
                        console.log(msg);
                    }
                    reject(msg);
                };
                httpRequest.initHttpRequest(_this, httpURL, params, egret.HttpMethod.GET, callBack, errorBack);
            });
        };
        RankToggle.prototype.getCheckInfoParams = function () {
            var userID = managers.FrameManager.getInstance().m_GlobalUserItem ? managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID : 9000;
            // const userID = 9018;
            var serverTime = Math.floor(new Date().getTime() / 1000);
            var now = new Date();
            var TimeStamp = utils.formateDateAndTimeToString(now);
            var stationID = 1000;
            var nonceStr = Math.floor(Math.random() * Math.pow(10, 8)); //随机生成八位数
            //StationID={StationID}&UserID={UserID}&NonceStr={NonceStr}&TimeStamp={TimeStamp}&Signature={Signature}
            var params = "StationID=" + stationID + "&UserID=" + userID + "&NonceStr=" + nonceStr + "&TimeStamp=" + TimeStamp;
            var signature = utils.MD5.MD5_HEX("UserID=" + userID + "&NonceStr=" + nonceStr + "&TimeStamp=" + TimeStamp + "&Key=wsdeflkfignvgdhfbsgtrs");
            signature = signature.toUpperCase();
            params = params + "&signature=" + signature;
            return params;
        };
        return RankToggle;
    }(eui.Component));
    game.RankToggle = RankToggle;
    __reflect(RankToggle.prototype, "game.RankToggle");
})(game || (game = {}));
