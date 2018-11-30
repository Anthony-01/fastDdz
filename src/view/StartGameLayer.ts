namespace game {
    interface IGameData {
        label: string;
    }

    interface IMain extends egret.DisplayObject{
        onSendCards(cards: number[]):void
    }

    export class StartGameLayer extends eui.Component {

        gameData:IGameData;

        public gameLogo:eui.Image;
        public gold:eui.Component;
        public label:eui.Label;
        public group_btn:eui.Group;
        public btnStartGame:eui.Button;
        public btnShare:eui.Button;
        public rankFriend:eui.Button;
        public rankGroup:eui.Button;


        private _gameEngine: GameEngine;

        //游戏开始界面初始化
        constructor(engine: GameEngine) {
            super();
            this._gameEngine = engine;
            this.addEventListener(eui.UIEvent.COMPLETE, this.onInitComplete, this);
        }

        /**
         * 组件初始化完成
         * */
        onInitComplete() {
            this.initData();
            this.initButton();
            let test = new HeadBorder();
            this.addChild(test);
        }

        /**
         * 初始化游戏数据
         * */
        initData() {
            this.gameData = {
                label: "初始label"
            }
        }

        private initButton() {
            this.btnStartGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartGame, this);
            this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
            this.rankFriend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showFriendsRank, this);
            // this.pushArray();
        }

        //游戏逻辑

        onStartGame() {
            //游戏匹配机制
            //向服务器发送消息，进入排队队列
            console.log("游戏开始,切换到游戏匹配界面");//阴影加转动界面，或者。。。
            this._gameEngine.requestMatch();
            // Main.Instance.onSendCards([]);
            // this.main.onSendCards([12, 3]);
            // GameControl.Instance.onGameScenesHandler();
        }

        //分享按钮
        private shareGame() {
            platform.shareAppMessage().then(data => {
                console.log(data);
            });
        }

        private _rankList: egret.Bitmap;
        private _btnRankClose: eui.Button;
        private _rankListMask: egret.Shape;
        private isRankClick: boolean = false;

        //好友排行榜
        private showFriendsRank() {
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
            this._rankListMask.graphics.beginFill(0x000000,1);
            this._rankListMask.graphics.drawRect(0,0,this.stage.width,this.stage.height);
            this._rankListMask.graphics.endFill();
            this._rankListMask.alpha = 0.2;
            this._rankListMask.touchEnabled = true;
            this.addChildAt(this._rankListMask,999);

            // this.addChild(this._btnRankClose);

            this._rankList = platform.openDataContext.createDisplayObject(null,this.stage.stageWidth, this.stage.stageHeight);
            this.addChild(this._rankList);
            platform.openDataContext.postMessage({
                command: "open"
            });
            this.addChild(this._btnRankClose);
        }

        private onCloseRank() {
            this.removeChild(this._btnRankClose);
            this.removeChild(this._rankListMask);
            this.removeChild(this._rankList);
            this.pushArray();
        }

        private _rankScore: number = 1000;

        private pushArray() {
            platform.openDataContext.postMessage({
                command: "save",
                userInfo: GameEngine.getInstance().userInfo,
                score: this._rankScore += 1000
            })
        }


    }
}