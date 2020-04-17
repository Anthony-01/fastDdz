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
    var pokerWidth = 132;
    var pokerHeight = 180;
    game.SELECT_CARD = "SELECT_CARD_mp3";
    var Poker = (function (_super) {
        __extends(Poker, _super);
        function Poker(value, anchorOffset) {
            var _this = _super.call(this) || this;
            _this.poker = new egret.Bitmap();
            _this.value = NaN;
            _this.chosenStatus = false;
            _this.value = value;
            _this.positiveRes = "poker_" + _this.getColor(value) + _this.getValue(value).toString(16).toUpperCase();
            _this.negativeRes = "poker_bg_0";
            _this.poker.texture = RES.getRes(_this.negativeRes);
            _this.addChild(_this.poker);
            if (!anchorOffset) {
                _this.poker.anchorOffsetX = pokerWidth / 2;
                _this.poker.anchorOffsetY = pokerHeight / 2;
                if (null == _this._pokerMask) {
                    _this._pokerShadow = new egret.Bitmap(RES.getRes("poker_mask_png"));
                    _this._pokerShadow.anchorOffsetX = _this._pokerShadow.width / 2;
                    _this._pokerShadow.anchorOffsetY = _this._pokerShadow.height / 2;
                    _this.addChild(_this._pokerShadow);
                }
            }
            _this.init();
            _this._pokerMask = new eui.Rect(122, 172, 0x000000);
            _this._pokerMask.x = -61;
            _this._pokerMask.y = -86;
            _this._pokerMask.ellipseWidth = 45;
            _this._pokerMask.ellipseHeight = 60;
            // console.log(this.width);
            _this._pokerMask.fillAlpha = 0.3;
            return _this;
            //增加一张图片；
        }
        Poker.prototype.changeToBack = function () {
            this.poker.texture = RES.getRes(this.negativeRes);
        };
        /**
         * 翻牌动画
         * */
        Poker.prototype.changeToFront = function () {
            this.poker.texture = RES.getRes(this.positiveRes);
            // return new Promise((resolve, reject) => {
            //     egret.Tween.get(this.poker).to({scaleX: 0}, 30).call(() => {
            //         this.poker.texture = RES.getRes(this.positiveRes);
            //         //层级变化
            //     }).to({scaleX: 1}, 30).call(() => {
            //         //层级变化
            //         resolve();
            //     });
            // });
        };
        Poker.prototype.init = function () {
            // this.touchEnabled = true;
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChosen, this);
        };
        Poker.prototype.setWinLogo = function () {
            if (null == this._winLogo) {
                this._winLogo = new eui.Image();
                this._winLogo.source = RES.getRes("logo_win_png");
                this._winLogo.x = 62;
                this._winLogo.top = 0;
            }
            this.addChild(this._winLogo);
        };
        Poker.prototype.onChosen = function () {
            this.chosenStatus = !this.chosenStatus;
            if (this.chosenStatus) {
                sound.SoundManager.getIns().playSoundAsync(game.SELECT_CARD, 1, 300);
                this.y -= 30;
            }
            else {
                this.y += 30;
            }
        };
        Poker.prototype.addMask = function () {
            if (null == this._pokerMask) {
                this._pokerMask = new eui.Rect(this.width, this.height, 0x000000);
                this._pokerMask.fillAlpha = 0.6;
            }
            this.addChild(this._pokerMask);
        };
        Poker.prototype.removeMask = function () {
            if (this._pokerMask) {
                utils.GameConst.removeChild(this._pokerMask);
            }
        };
        Object.defineProperty(Poker.prototype, "status", {
            get: function () {
                return this.chosenStatus;
            },
            enumerable: true,
            configurable: true
        });
        Poker.prototype.toggleSelected = function () {
            this.onChosen();
        };
        Poker.prototype.getColor = function (value) {
            return value >> 4;
        };
        Poker.prototype.getValue = function (value) {
            return 0x0F & value;
        };
        Poker.prototype.ontOut = function () {
            if (this.chosenStatus == true) {
                this.onChosen();
            }
            this.removeMask();
        };
        return Poker;
    }(eui.Component));
    game.Poker = Poker;
    __reflect(Poker.prototype, "game.Poker");
})(game || (game = {}));
