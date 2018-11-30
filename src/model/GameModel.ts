namespace game {

    export class GameModel extends eui.UILayer { //负责与服务器进行通信

        public _gameFrame: frame.GameFrame;//游戏框架
        public _gameViewLayer: any;//主游戏视图

        constructor() {
            super();
            this.addEventListener(eui.UIEvent.COMPLETE, this.onInitComplete, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);

            let timerControl = utils.TimerControl.getTimerControl();

            timerControl.createTimer(this, 1000 / 60, 0, this.onUpdateSecond, "update");

            this.createSocket();
        }

        /**
         * 子类重新覆盖组件实例化后的onComplete
         * */
        onInitComplete() {

        }

        /**
         * 每帧更新
         * */
        onUpdateSecond() {

        }

        onGameMessage(object: any): void {
            let message = JSON.parse(object.data);
            console.log(message);
        }

        /**
         * socket连接
         * */
        ws: any;

        private createSocket():void {
            this.ws = new WebSocket('ws://127.0.01:8180');
            this.ws.onopen = this.onOpen;
            this.ws.onmessage = this.onGameMessage;
        }

        private onOpen(e: any) {
            console.log("socket has been connected!");

        }

        sendMessage(data: any) {
            //传输的信息要加上用户的信息
            data.nickName = "海青";
            let message = JSON.stringify(data);
            if(this.ws.readyState == 1) {
                this.ws.send(message);
            } else {
                console.log("%csocket连接失败：", "color: red; font-size: 2em");
                console.log(this.ws.readyState);
            }
        }

        onExit() {
            //移除定时器
            utils.TimerControl.getTimerControl().cleanTimer(this, "update");
        }


    }
}