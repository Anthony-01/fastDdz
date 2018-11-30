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
    var GameEngine = (function (_super) {
        __extends(GameEngine, _super);
        function GameEngine() {
            var _this = _super.call(this) || this;
            _this.init();
            return _this;
        }
        GameEngine.getInstance = function () {
            if (!this._instance) {
                this._instance = new GameEngine();
            }
            return this._instance;
        };
        GameEngine.prototype.init = function () {
            this.startGame = new game.StartGameLayer(this);
            this.gameScenes = new game.GameScenesLayer();
            this.overScenes = new game.GameOverLayer();
            //添加游戏开始界面
            this.startGameHandler();
            net.NetController.getInstance().connect();
            // net.NetController.getInstance().addListener() 定义服务器主动发送来消息的处理
        };
        /**开始游戏的场景 */
        GameEngine.prototype.startGameHandler = function () {
            if (this.gameScenes && this.gameScenes.parent) {
                utils.GameConst.removeChild(this.gameScenes);
            }
            if (this.gameScenes && this.overScenes.parent) {
                utils.GameConst.removeChild(this.overScenes);
            }
            this.addChild(this.startGame);
            this.invalidateSize();
        };
        /**游戏场景 */
        GameEngine.prototype.onGameScenesHandler = function () {
            if (this.startGame && this.startGame.parent) {
                utils.GameConst.removeChild(this.startGame);
            }
            if (this.overScenes && this.overScenes.parent) {
                utils.GameConst.removeChild(this.overScenes);
            }
            this.addChild(this.gameScenes);
            // this.invalidateSize();
        };
        /**游戏结束场景 */
        GameEngine.prototype.showGameOverSceneHandler = function () {
            if (this.startGame && this.startGame.parent) {
                utils.GameConst.removeChild(this.startGame);
            }
            if (this.gameScenes && this.gameScenes.parent) {
                utils.GameConst.removeChild(this.gameScenes);
            }
            this.addChild(this.overScenes);
        };
        /**
         * 进入排队队列
         * */
        GameEngine.prototype.requestMatch = function () {
            // let data = new net.BaseMsg();
            // data.command = net.Commands.MATCH_PLAYER;
            // this.playerName = Math.floor(Math.random() * 100) + "";
            // data.content = { "name": this.playerName };
            // net.NetController.getInstance().sendData(data, this.onMatchPlayerBack, this);
            this.onGameScenesHandler();
        };
        /**
         * requestMatch的成功回调函数
         * */
        GameEngine.prototype.onMatchPlayerBack = function (data) {
            console.log("匹配完毕，开始发牌:", data);
            var meg = data;
            //如果成功，切换到游戏场景
            this.onGameScenesHandler();
        };
        /**
         * 请求登录接口
         * */
        GameEngine.prototype.requestLogin = function (data) {
            var message = new net.BaseMsg();
            message.command = net.Commands.LOGIN;
            message.content = data;
            net.NetController.getInstance().sendData(data, this.onLoginBack, this);
        };
        /**
         * 登录成功回调
         * */
        GameEngine.prototype.onLoginBack = function (data) {
            console.log("登录成功：", data);
        };
        /**=========================服务端消息=============================*/
        GameEngine.prototype.onGameMessage = function (data) {
            var command = data.command;
            switch (command) {
            }
        };
        return GameEngine;
    }(eui.UILayer));
    game.GameEngine = GameEngine;
    __reflect(GameEngine.prototype, "game.GameEngine");
})(game || (game = {}));
