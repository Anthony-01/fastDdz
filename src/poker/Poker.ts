namespace game {
    export class Poker extends eui.Component {

        private poker: egret.Bitmap = new egret.Bitmap();
        public value : number = NaN;

        constructor(value: number) {
            super();
            this.value = value;
            let source = "poker" + "_" + this.getColor(value) + this.getValue(value).toString(16).toUpperCase();
            this.poker.texture = RES.getRes(source);
            this.addChild(this.poker);
            this.init();
        }

        private init() {
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChosen, this);
        }

        private _pokerMask: egret.Shape = null;
        private chosenStatus: boolean = false;
        private onChosen() {
            this.chosenStatus = !this.chosenStatus;
            if (this.chosenStatus) {
                this.y -= 10;
                // if (this._pokerMask == null) {
                //     this._pokerMask = new egret.Shape();
                //     this._pokerMask.graphics.beginFill(0xFFFFFF, 0.5);
                //     this._pokerMask.graphics.drawRect(0, 0, this.width, this.height);
                //     this._pokerMask.graphics.endFill();
                // }
                // this.addChild(this._pokerMask);
                // this.poker.mask = this._pokerMask;
            } else {
                this.y += 10;
                // this.removeChild(this._pokerMask);
            }
        }

        get status(): boolean {
            return this.chosenStatus;
        }

        getColor(value: number): number {
            return value >> 4;
        }

        getValue(value: number): number {
            return 0x0F & value;
        }
    }
}