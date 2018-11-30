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
    var GameModel = (function (_super) {
        __extends(GameModel, _super);
        function GameModel() {
            var _this = _super.call(this) || this;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onInitComplete, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onExit, _this);
            var timerControl = utils.TimerControl.getTimerControl();
            timerControl.createTimer(_this, 1000 / 60, 0, _this.onUpdateSecond, "update");
            _this.createSocket();
            return _this;
        }
        /**
         * 子类重新覆盖组件实例化后的onComplete
         * */
        GameModel.prototype.onInitComplete = function () {
        };
        /**
         * 每帧更新
         * */
        GameModel.prototype.onUpdateSecond = function () {
        };
        GameModel.prototype.onGameMessage = function (object) {
            var message = JSON.parse(object.data);
            console.log(message);
        };
        GameModel.prototype.createSocket = function () {
            this.ws = new WebSocket('ws://127.0.01:8180');
            this.ws.onopen = this.onOpen;
            this.ws.onmessage = this.onGameMessage;
        };
        GameModel.prototype.onOpen = function (e) {
            console.log("socket has been connected!");
        };
        GameModel.prototype.sendMessage = function (data) {
            //传输的信息要加上用户的信息
            data.nickName = "海青";
            var message = JSON.stringify(data);
            if (this.ws.readyState == 1) {
                this.ws.send(message);
            }
            else {
                console.log("%csocket连接失败：", "color: red; font-size: 2em");
                console.log(this.ws.readyState);
            }
        };
        GameModel.prototype.onExit = function () {
            //移除定时器
            utils.TimerControl.getTimerControl().cleanTimer(this, "update");
        };
        return GameModel;
    }(eui.UILayer));
    game.GameModel = GameModel;
    __reflect(GameModel.prototype, "game.GameModel");
})(game || (game = {}));
