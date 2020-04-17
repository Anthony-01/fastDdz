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
    var CHINA_NUMBER = ["一", "二", "三", "四", "五", "六", "七"];
    var DetailsPopup = (function (_super) {
        __extends(DetailsPopup, _super);
        function DetailsPopup(main) {
            var _this = _super.call(this) || this;
            _this._completeFlag = false;
            _this._signInFlag = false;
            _this._main = main;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            return _this;
        }
        DetailsPopup.prototype.onComplete = function () {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this._completeFlag = true;
            console.log("详情页组件初始化完毕");
            for (var n = 0; n < 7; n++) {
                if (n == 5) {
                    this["gold_" + n].img_gold.source = RES.getRes("details_gold_" + n + "_png");
                    this["gold_" + n].img_gold.scaleX = this["gold_" + n].img_gold.scaleY = 0.7;
                }
                else if (n == 6) {
                    this["gold_" + n].img_gold.source = RES.getRes("details_gold_" + 5 + "_png");
                }
                else {
                    this["gold_" + n].img_gold.source = RES.getRes("details_gold_" + n + "_png");
                }
                this["gold_" + n].label_day.text = "第 " + (n + 1) + " 天";
                this["gold_" + n].label_gold.text = this.toThousand(Math.pow(2, n) * 100);
                this["gold_" + n].img_border.visible = false;
            }
            //获得当前的签到信息
            this.getCheckInfo(this.httpCallBack);
        };
        DetailsPopup.prototype.getCheckInfo = function (sucCallBack) {
            var _this = this;
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
                    console.log("get data : ", request.response);
                    console.log(data.payload);
                    // if (null == data.payload) {
                    //     // self.btn_sign_in.enabled = true;
                    //     this.setDays(1, false);
                    //     return;
                    // }
                    // self.setDetailByData(data);
                    if (data.codeID == 0) {
                        console.log("获取签到消息");
                        console.log(data);
                        self.setDetailByData(data);
                    }
                    else if (data.codeID == 1005) {
                        console.log("打印签到失败消息");
                        console.log(data.message);
                        _this.setDays(1, false);
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
        DetailsPopup.prototype.httpCallBack = function (evt) {
            console.log("正常返回");
            if (evt) {
                var request = evt.currentTarget;
                var data = JSON.parse(request.response);
                console.log("get data : ", request.response);
                console.log(data.payload);
                this.setDetailByData(data);
            }
        };
        DetailsPopup.prototype.getIsCheckIn = function () {
            var _this = this;
            var self = this;
            return new Promise(function (resolve, reject) {
                self.getCheckInfo(function (evt) {
                    var request = evt.currentTarget;
                    var data = JSON.parse(request.response);
                    resolve(_this.isCheckIn(data.payload.collectDate));
                });
            });
        };
        DetailsPopup.prototype.setDetailByData = function (data) {
            //判断今日是否已经签到
            console.log("判断今日是否已经签到:", data);
            var lxCount = data.payload.lxCount;
            var oldTime = data.payload.collectDate;
            var dayApart = this.getDayApart(oldTime);
            if (dayApart == df.INVALID_CHAIR) {
                this.setDays(1, false);
            }
            else if (dayApart == 0) {
                this.setDays(lxCount, true);
            }
            else if (dayApart == 1) {
                this.setDays(lxCount + 1, false);
            }
            else {
                this.setDays(1, false);
            }
            // this.setDays(lxCount + 1);
        };
        DetailsPopup.prototype.onStage = function () {
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.getCheckInfo(this.httpCallBack);
        };
        DetailsPopup.prototype.getDayApart = function (old) {
            old = old.replace(/-/g, "/");
            if (old == "")
                return df.INVALID_CHAIR;
            var oldTime = new Date(old);
            var nowTime = new Date();
            if (nowTime.getFullYear() - oldTime.getFullYear() != 0)
                return df.INVALID_CHAIR;
            if (nowTime.getMonth() - oldTime.getMonth() != 0)
                return df.INVALID_CHAIR;
            return nowTime.getDay() - oldTime.getDay();
        };
        DetailsPopup.prototype.isCheckIn = function (old) {
            //ios兼容性问题
            old = old.replace(/-/g, "/");
            if (old == "")
                return false;
            var oldTime = new Date(old);
            var nowTime = new Date();
            if (nowTime.getFullYear() - oldTime.getFullYear() != 0)
                return false;
            if (nowTime.getMonth() - oldTime.getMonth() != 0)
                return false;
            return nowTime.getDay() == oldTime.getDay();
        };
        DetailsPopup.prototype.onRemove = function () {
            this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        };
        DetailsPopup.prototype.onClose = function () {
            this._main.removeCurrentPopup();
            this._main.getGold(new egret.Event(""));
        };
        DetailsPopup.prototype.setDays = function (day, toDay) {
            if (toDay === void 0) { toDay = false; }
            this._day = day;
            if (day > 7)
                return;
            for (var n = 0; n < day; n++) {
                if (n == 5) {
                    this["gold_" + n].img_gold.scaleX = this["gold_" + n].img_gold.scaleY = 1;
                }
                this["gold_" + n].img_border.visible = false;
                if (n < day - 1) {
                    this["gold_" + n].img_gold.source = RES.getRes("details_got_png"); //打钩Z
                }
                else if (toDay) {
                    this["gold_" + n].img_gold.source = RES.getRes("details_got_png"); //打钩Z
                }
            }
            this["gold_" + (day - 1)].img_border.visible = true;
            //金币动画
            // this["gold_" + (day - 1)].once(egret.TouchEvent.TOUCH_TAP, this.onSignIn, this);
        };
        DetailsPopup.prototype.onSignIn = function () {
            //签到
            console.log("每日签到");
            // this["gold_" + (this._day - 1)].img_border.visible = false;
            // this["gold_" + n].img_gold.visible = false;
            // console.log(RES.getRes("details_got_png"));
            this["gold_" + (this._day - 1)].img_gold.source = RES.getRes("details_got_png");
            //金币增长动画
            this._main.playSignIn(this._day);
        };
        DetailsPopup.prototype.toThousand = function (value) {
            var back = ""; //如果玩家金币数量以万、兆单位，该如何显示
            if (value >= 1000) {
                var front = Math.floor(value / 1000);
                var behind = value % 1000;
                back = front + "," + this.toHundred(behind);
            }
            else {
                back = value + "";
            }
            return back;
        };
        DetailsPopup.prototype.toHundred = function (value) {
            var back = "";
            if (value > 100) {
                back += value;
            }
            else if (value < 100 && value >= 10) {
                back = "0" + value;
            }
            else {
                back = "00" + value;
            }
            return back;
        };
        return DetailsPopup;
    }(eui.Component));
    game.DetailsPopup = DetailsPopup;
    __reflect(DetailsPopup.prototype, "game.DetailsPopup");
})(game || (game = {}));
