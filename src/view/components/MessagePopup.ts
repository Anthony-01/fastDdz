namespace game {
    export class MessagePopup extends base.BaseComponent {

        public message_label:eui.Label;
        public btn_sure:eui.Button;
        public btn_close:eui.Button;

        private okFunc: Function = null;
        private cancelFunc: Function = null;

        initBtn() {
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
            this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSure, this);
        }

        setMessage(str: string, okFunc: Function, cancelFunc?: Function) {
            let self = this;
            this.okFunc = okFunc;
            this.cancelFunc = cancelFunc;
            let callBack = () => {
                self.message_label.text = str;
            };
            if (this.m_ifComplete) {
                callBack();
            } else {
                this._actionList.push(callBack);
            }
        }

        private onCancel() {
            if (this.cancelFunc) {
                this.cancelFunc();
            }
        }

        private onSure() {
            if (this.okFunc) {
                this.okFunc();
            }
        }
    }
}