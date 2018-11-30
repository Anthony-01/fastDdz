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
    var CARDS_CONFIG = {
        x: 347,
        y: 1962,
        off: 4,
        r: 800,
    };
    var GameScenesLayer = (function (_super) {
        __extends(GameScenesLayer, _super);
        function GameScenesLayer() {
            var _this = _super.call(this) || this;
            _this._cards = [];
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            console.log("游戏开始界面");
            return _this;
        }
        GameScenesLayer.prototype.onComplete = function () {
            console.log("游戏场景界面组件初始化完毕");
            this.initCards([1]);
            this.initBtn();
        };
        /**=========================初始化各类组件逻辑=============================*/
        GameScenesLayer.prototype.initCards = function (cards) {
            for (var n = 0; n < 14; n++) {
                var cards_1 = new game.Poker(0x01); //0x01
                var index = this.getIndex(n, 14);
                var angle = 90 - index * CARDS_CONFIG.off;
                cards_1.x = CARDS_CONFIG.x + Math.cos(((2 * Math.PI) / 360) * angle) * CARDS_CONFIG.r;
                cards_1.y = CARDS_CONFIG.y - Math.sin(((2 * Math.PI) / 360) * angle) * CARDS_CONFIG.r;
                var rotation = Math.abs(90 - angle);
                if (angle > 90) {
                    cards_1.rotation = -rotation;
                }
                else {
                    cards_1.rotation = rotation;
                }
                this.addChild(cards_1);
                this._cards.push(cards_1);
                // console.log("初始化",cards.status);
            }
        };
        /**
         * 添加各类按钮事件
         * */
        GameScenesLayer.prototype.initBtn = function () {
            this.btn_out_cards.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOutCards, this);
        };
        /**==========================按钮事件============================*/
        GameScenesLayer.prototype.onOutCards = function () {
            this._cards.forEach(function (poker) {
                console.log(poker.status);
            });
            for (var n = 0; n < this._cards.length;) {
                if (this._cards[n].status == true) {
                    var card = this._cards.splice(n, 1)[0];
                    this.removeChild(card);
                }
                else {
                    n++;
                }
            }
            this.moveCards();
        };
        /**======================================================*/
        /**==========================数据处理============================*/
        GameScenesLayer.prototype.getIndex = function (index, length) {
            //center = 8;
            var center = (length % 2) ? Math.floor(length / 2) : length / 2;
            return index - center;
        };
        GameScenesLayer.prototype.moveCards = function () {
            //生成新位置的配置
            var config = [];
            for (var n = 0; n < this._cards.length; n++) {
                var index = this.getIndex(n, this._cards.length);
                var angle = 90 - index * CARDS_CONFIG.off;
                var rotation = Math.abs(90 - angle);
                var last = void 0;
                if (angle > 90) {
                    last = -rotation;
                }
                else {
                    last = rotation;
                }
                var item = {
                    x: CARDS_CONFIG.x + Math.cos(((2 * Math.PI) / 360) * angle) * CARDS_CONFIG.r,
                    y: CARDS_CONFIG.y - Math.sin(((2 * Math.PI) / 360) * angle) * CARDS_CONFIG.r,
                    rotation: last
                };
                config.push(item);
            }
            this.moveCardsByConfig(config);
        };
        /**
         * 通过配置移动手牌
         * */
        GameScenesLayer.prototype.moveCardsByConfig = function (config) {
            for (var n = 0; n < this._cards.length; n++) {
                egret.Tween.get(this._cards[n]).to(config[n], 100);
            }
        };
        /**======================================================*/
        /**=========================服务端消息=============================*/
        /**
         * 更新用户信息
         * */
        GameScenesLayer.prototype.onUpdateUser = function (user) {
            console.log("更新用户信息:", user);
        };
        return GameScenesLayer;
    }(eui.Component));
    game.GameScenesLayer = GameScenesLayer;
    __reflect(GameScenesLayer.prototype, "game.GameScenesLayer");
})(game || (game = {}));
