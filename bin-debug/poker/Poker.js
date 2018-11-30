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
    var Poker = (function (_super) {
        __extends(Poker, _super);
        function Poker(value) {
            var _this = _super.call(this) || this;
            _this.poker = new egret.Bitmap();
            _this.value = NaN;
            _this._pokerMask = null;
            _this.chosenStatus = false;
            _this.value = value;
            var source = "poker" + "_" + _this.getColor(value) + _this.getValue(value).toString(16).toUpperCase();
            _this.poker.texture = RES.getRes(source);
            _this.addChild(_this.poker);
            _this.init();
            return _this;
        }
        Poker.prototype.init = function () {
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChosen, this);
        };
        Poker.prototype.onChosen = function () {
            this.chosenStatus = !this.chosenStatus;
            if (this.chosenStatus) {
                this.y -= 10;
                // if (this._pokerMask == null) {
                //     this._pokerMask = new egret.Shape();
                //     this._pokerMask.graphics.beginFill(0xFFFFFF, 0.5);
                //     this._pokerMask.graphics.drawRect(0, 0, this.width, this.height);
                //     this._pokerMask.graphics.endFill();
                // }
                // this.addChild(this._pokerMask);
                // this.poker.mask = this._pokerMask;
            }
            else {
                this.y += 10;
                // this.removeChild(this._pokerMask);
            }
        };
        Object.defineProperty(Poker.prototype, "status", {
            get: function () {
                return this.chosenStatus;
            },
            enumerable: true,
            configurable: true
        });
        Poker.prototype.getColor = function (value) {
            return value >> 4;
        };
        Poker.prototype.getValue = function (value) {
            return 0x0F & value;
        };
        return Poker;
    }(eui.Component));
    game.Poker = Poker;
    __reflect(Poker.prototype, "game.Poker");
})(game || (game = {}));
