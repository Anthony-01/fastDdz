namespace game {
    export class GameModel extends eui.Component { //负责与服务器进行通信

        public _gameFrame: frame.GameFrame;//游戏框架
        public _gameViewLayer: any;//主游戏视图

        constructor() {
            super();
            this.addEventListener(eui.UIEvent.COMPLETE, this.onInitComplete, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onExit, this);

            let timerControl = utils.TimerControl.getTimerControl();

            timerControl.createTimer(this, 1000 / 60, 0, this.onUpdateSecond, "update");

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

        onExit() {
            //移除定时器
            utils.TimerControl.getTimerControl().cleanTimer(this, "update");
        }


    }
}