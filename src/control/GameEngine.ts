namespace game {
    export class GameEngine extends eui.UILayer {

        private static _instance: GameEngine;

        public userInfo: any;

        constructor() {
            super();
            this.init();
        }

        public static getInstance() {
            if (!this._instance) {
                this._instance = new GameEngine()
            }
            return this._instance;
        }

        //开始游戏
        private startGame: StartGameLayer;
        /**游戏场景 */
        private gameScenes: GameScenesLayer;
        /**结束场景 */
        private overScenes: GameOverLayer;

        private init() {
            this.startGame = new StartGameLayer(this);
            this.gameScenes = new GameScenesLayer();
            this.overScenes = new GameOverLayer();
            //添加游戏开始界面
            this.startGameHandler();
            net.NetController.getInstance().connect();

            // net.NetController.getInstance().addListener() 定义服务器主动发送来消息的处理
        }

        /**开始游戏的场景 */
        public startGameHandler(): void {
            if (this.gameScenes && this.gameScenes.parent) {
                utils.GameConst.removeChild(this.gameScenes);
            }
            if (this.gameScenes && this.overScenes.parent) {
                utils.GameConst.removeChild(this.overScenes);
            }
            this.addChild(this.startGame);
            this.invalidateSize();
        }

        /**游戏场景 */
        public onGameScenesHandler(): void {
            if (this.startGame && this.startGame.parent) {
                utils.GameConst.removeChild(this.startGame);
            }

            if (this.overScenes && this.overScenes.parent) {
                utils.GameConst.removeChild(this.overScenes);
            }
            this.addChild(this.gameScenes);
            // this.invalidateSize();
        }

        /**游戏结束场景 */
        public showGameOverSceneHandler(): void {
            if (this.startGame && this.startGame.parent) {
                utils.GameConst.removeChild(this.startGame)
            }

            if (this.gameScenes && this.gameScenes.parent) {
                utils.GameConst.removeChild(this.gameScenes);
            }
            this.addChild(this.overScenes);
        }

        /**=========================客户端请求=============================*/

        private playerName: any;

        /**
         * 进入排队队列
         * */
        public requestMatch() {
            // let data = new net.BaseMsg();
            // data.command = net.Commands.MATCH_PLAYER;
            // this.playerName = Math.floor(Math.random() * 100) + "";
            // data.content = { "name": this.playerName };
            // net.NetController.getInstance().sendData(data, this.onMatchPlayerBack, this);
            this.onGameScenesHandler();
        }

        /**
         * requestMatch的成功回调函数
         * */
        private onMatchPlayerBack(data: net.BaseMsg) {
            console.log("匹配完毕，开始发牌:", data);
            let meg = data;

            //如果成功，切换到游戏场景
            this.onGameScenesHandler();
        }

        /**
         * 请求登录接口
         * */
        public requestLogin(data: any) {
            let message = new net.BaseMsg();
            message.command = net.Commands.LOGIN;
            message.content = data;
            net.NetController.getInstance().sendData(data, this.onLoginBack, this);
        }

        /**
         * 登录成功回调
         * */
        private onLoginBack(data: net.BaseMsg) {
            console.log("登录成功：", data);
        }


        /**=========================服务端消息=============================*/
        onGameMessage(data: any) {
            let command = data.command;
            switch(command) {

            }
        }
    }
}