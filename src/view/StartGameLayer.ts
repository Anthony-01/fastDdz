namespace game {
    interface IGameData {
        label: string;
    }

    export class StartGameLayer extends GameModel {

        gameData:IGameData;

        public label:eui.Label;
        public btnStartGame:eui.Button;

        //游戏开始界面初始化

        /**
         * 组件初始化完成
         * */
        onInitComplete() {
            console.log("组件初始化完成");
            this.initData();
            this.initButton();
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
        }

        //游戏逻辑

        onStartGame() {
            //游戏匹配机制
            //向服务器发送消息，进入排队队列
            //随机匹配
        }


    }
}