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
    var StartGameLayer = (function (_super) {
        __extends(StartGameLayer, _super);
        function StartGameLayer() {
            var _this = _super.call(this) || this;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            return _this;
        }
        //游戏开始界面初始化
        /**
         * 初始化游戏数据
         * */
        StartGameLayer.prototype.initData = function () {
            this.gameData = {
                label: "初始label"
            };
        };
        /**
         * 组件初始化完成
         * */
        StartGameLayer.prototype.onComplete = function () {
            this.initData();
            this.initButton();
        };
        StartGameLayer.prototype.initButton = function () {
            this.btnStartGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartGame, this);
        };
        //游戏逻辑
        StartGameLayer.prototype.onStartGame = function () {
            //游戏匹配机制
            //向服务器发送消息，进入排队队列
            //随机匹配
        };
        return StartGameLayer;
    }(egret.Sprite));
    game.StartGameLayer = StartGameLayer;
    __reflect(StartGameLayer.prototype, "game.StartGameLayer");
})(game || (game = {}));
