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
        //游戏开始界面初始化
        function StartGameLayer(engine) {
            var _this = _super.call(this) || this;
            _this.isRankClick = false;
            _this._rankScore = 1000;
            _this._gameEngine = engine;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onInitComplete, _this);
            return _this;
        }
        /**
         * 组件初始化完成
         * */
        StartGameLayer.prototype.onInitComplete = function () {
            this.initData();
            this.initButton();
            var test = new game.HeadBorder();
            this.addChild(test);
        };
        /**
         * 初始化游戏数据
         * */
        StartGameLayer.prototype.initData = function () {
            this.gameData = {
                label: "初始label"
            };
        };
        StartGameLayer.prototype.initButton = function () {
            this.btnStartGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartGame, this);
            this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
            this.rankFriend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showFriendsRank, this);
            // this.pushArray();
        };
        //游戏逻辑
        StartGameLayer.prototype.onStartGame = function () {
            //游戏匹配机制
            //向服务器发送消息，进入排队队列
            console.log("游戏开始,切换到游戏匹配界面"); //阴影加转动界面，或者。。。
            this._gameEngine.requestMatch();
            // Main.Instance.onSendCards([]);
            // this.main.onSendCards([12, 3]);
            // GameControl.Instance.onGameScenesHandler();
        };
        //分享按钮
        StartGameLayer.prototype.shareGame = function () {
            platform.shareAppMessage().then(function (data) {
                console.log(data);
            });
        };
        //好友排行榜
        StartGameLayer.prototype.showFriendsRank = function () {
            //关闭按钮
            if (!this._btnRankClose) {
                this._btnRankClose = new eui.Button();
                this._btnRankClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseRank, this);
                this._btnRankClose.label = "关闭排行榜";
                this._btnRankClose.horizontalCenter = 0;
                this._btnRankClose.y = 138;
            }
            //主屏幕遮罩
            this._rankListMask = new egret.Shape();
            this._rankListMask.graphics.beginFill(0x000000, 1);
            this._rankListMask.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
            this._rankListMask.graphics.endFill();
            this._rankListMask.alpha = 0.2;
            this._rankListMask.touchEnabled = true;
            this.addChildAt(this._rankListMask, 999);
            // this.addChild(this._btnRankClose);
            this._rankList = platform.openDataContext.createDisplayObject(null, this.stage.stageWidth, this.stage.stageHeight);
            this.addChild(this._rankList);
            platform.openDataContext.postMessage({
                command: "open"
            });
            this.addChild(this._btnRankClose);
        };
        StartGameLayer.prototype.onCloseRank = function () {
            this.removeChild(this._btnRankClose);
            this.removeChild(this._rankListMask);
            this.removeChild(this._rankList);
            this.pushArray();
        };
        StartGameLayer.prototype.pushArray = function () {
            platform.openDataContext.postMessage({
                command: "save",
                userInfo: game.GameEngine.getInstance().userInfo,
                score: this._rankScore += 1000
            });
        };
        return StartGameLayer;
    }(eui.Component));
    game.StartGameLayer = StartGameLayer;
    __reflect(StartGameLayer.prototype, "game.StartGameLayer");
})(game || (game = {}));
