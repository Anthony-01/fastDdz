namespace game {
    export class WaitingScene extends eui.Component {

        public logo:eui.Image;
        public label:eui.Label;


        constructor() {
            super();
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.start, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.remove, this);
        }

        private _ifComplete: boolean = false;
        private onComplete() {
            this._ifComplete = true;
            console.log("加载界面初始化完毕!");
            this.adjustComponent();
            this.beginAction();
        }

        turnAround(): Promise<any> {
            return new Promise((resolve, reject) => {
                egret.Tween.get(this.logo).to({rotation: 360}, 1000).call(() => {
                    this.logo.rotation = 0;
                    resolve();
                })
            })
        }

        private _components: any[] = [];
        private _scaleComponent: any[] = [];
        private adjustComponent() {
            this._components.push(this.logo);
            this._components.push(this.label);
            // this._com
            this._components.forEach(component => {
                component.y =  component.y * RATE;
            });

            this._scaleComponent.push(this.logo);
            this._scaleComponent.push(this.label);
            this._scaleComponent.forEach(component => {
                component.scaleX = component.scaleY = RATE;
            })
        }

        private ifContinue: boolean = false;
        private start() {
            let self = this;
            this.ifContinue = true;
            let callBack = () => {
                if (this.ifContinue) {
                    self.turnAround().then(() => {
                        callBack();
                    })
                }
            };
            if (this._ifComplete) {
                callBack();
            } else {
                this._actionList.push(callBack);
            }
        }

        private remove() {
            this.ifContinue = false;
        }

        private _actionList: Function[] = [];

        private beginAction() {
            let callBack = this._actionList[0] as Function;
            if (callBack != null) {
                callBack();
                this._actionList.splice(0, 1);
                this.beginAction();
            }
        }

        public setStr(str: string) {
            let self = this;
            let callBack = () => {
                self.label.text = str;
            };
            if (this._ifComplete) {
                callBack();
            } else {
                this._actionList.push(callBack);
            }
        }
    }
}