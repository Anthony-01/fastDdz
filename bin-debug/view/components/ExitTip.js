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
    var ExitTip = (function (_super) {
        __extends(ExitTip, _super);
        function ExitTip(okFunc, cancelFunc) {
            var _this = _super.call(this) || this;
            /**
             * @param okFunc: 确定按钮回调函数
             * @param cancelFunc: 取消按钮回调函数
             * */
            _this._onComplete = false;
            _this._okFun = null;
            _this._cancelFun = null;
            _this._actionQueue = [];
            _this._okFun = okFunc;
            _this._cancelFun = cancelFunc;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            // this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onStage, this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemove, _this);
            return _this;
        }
        ExitTip.prototype.onComplete = function () {
            console.log("结算页面组件初始化完毕");
            this._onComplete = true;
            this.init();
            this.beginAction();
        };
        ExitTip.prototype.beginAction = function () {
            var callBack = this._actionQueue[0];
            if (callBack != null) {
                callBack();
                this._actionQueue.splice(0, 1);
                this.beginAction();
            }
        };
        ExitTip.prototype.init = function () {
            // console.log(this);
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.btn_exit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit, this);
            this.btn_give_up.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        };
        ExitTip.prototype.removeEvent = function () {
            this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.btn_exit.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit, this);
            this.btn_give_up.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        };
        ExitTip.prototype.onStage = function () {
            var self = this;
            if (this._onComplete) {
                self.init();
            }
            else {
                self._actionQueue.push(self.init);
            }
        };
        ExitTip.prototype.onRemove = function () {
            // this.removeEvent();
            var self = this;
            if (this._onComplete) {
                self.removeEvent();
            }
            else {
                self._actionQueue.push(self.removeEvent);
            }
        };
        /*
        * 关闭弹窗
        * */
        ExitTip.prototype.onClose = function () {
            if (this._cancelFun != null) {
                this._cancelFun();
            }
            utils.GameConst.removeChild(this);
        };
        /*
        * 退出游戏
        * */
        ExitTip.prototype.onExit = function () {
            if (null != this._okFun) {
                this._okFun();
            }
            utils.GameConst.removeChild(this);
        };
        return ExitTip;
    }(eui.Component));
    game.ExitTip = ExitTip;
    __reflect(ExitTip.prototype, "game.ExitTip");
})(game || (game = {}));
