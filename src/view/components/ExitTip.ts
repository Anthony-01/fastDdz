namespace game {
    export class ExitTip extends eui.Component{

        public btn_close:eui.Button;
        public btn_exit:eui.Button;
        public btn_give_up:eui.Button;

        /**
         * @param okFunc: 确定按钮回调函数
         * @param cancelFunc: 取消按钮回调函数
         * */

        private _onComplete: boolean = false;
        private _okFun: any = null;
        private _cancelFun: any = null;
        constructor(okFunc: any, cancelFunc?: any) {
            super();
            this._okFun = okFunc;
            this._cancelFun = cancelFunc;
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            // this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        }

        private _actionQueue: any[] = [];
        private onComplete() {
            console.log("结算页面组件初始化完毕");
            this._onComplete = true;
            this.init();
            this.beginAction();
        }

        private beginAction() {
            let callBack = this._actionQueue[0] as Function;
            if (callBack != null) {
                callBack();
                this._actionQueue.splice(0, 1);
                this.beginAction();
            }
        }

        private init() {
            // console.log(this);
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.btn_exit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit, this);
            this.btn_give_up.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        }

        private removeEvent() {
            this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.btn_exit.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit, this);
            this.btn_give_up.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        }

        private onStage() {
            let self = this;
            if (this._onComplete) {
                self.init();
            } else {
                self._actionQueue.push(self.init);
            }
        }

        private onRemove() {
            // this.removeEvent();
            let self = this;
            if (this._onComplete) {
                self.removeEvent();
            } else {
                self._actionQueue.push(self.removeEvent);
            }
        }

        /*
        * 关闭弹窗
        * */
        private onClose() {
            if (this._cancelFun != null) {
                this._cancelFun();
            }
            utils.GameConst.removeChild(this);
        }

        /*
        * 退出游戏
        * */
        private onExit() {
            if (null != this._okFun) {
                this._okFun();
            }
            utils.GameConst.removeChild(this);
        }
    }
}