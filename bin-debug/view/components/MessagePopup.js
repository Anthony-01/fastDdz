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
    var MessagePopup = (function (_super) {
        __extends(MessagePopup, _super);
        function MessagePopup() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.okFunc = null;
            _this.cancelFunc = null;
            return _this;
        }
        MessagePopup.prototype.initBtn = function () {
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
            this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSure, this);
        };
        MessagePopup.prototype.setMessage = function (str, okFunc, cancelFunc) {
            var self = this;
            this.okFunc = okFunc;
            this.cancelFunc = cancelFunc;
            var callBack = function () {
                self.message_label.text = str;
            };
            if (this.m_ifComplete) {
                callBack();
            }
            else {
                this._actionList.push(callBack);
            }
        };
        MessagePopup.prototype.onCancel = function () {
            if (this.cancelFunc) {
                this.cancelFunc();
            }
        };
        MessagePopup.prototype.onSure = function () {
            if (this.okFunc) {
                this.okFunc();
            }
        };
        return MessagePopup;
    }(base.BaseComponent));
    game.MessagePopup = MessagePopup;
    __reflect(MessagePopup.prototype, "game.MessagePopup");
})(game || (game = {}));
