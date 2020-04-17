namespace game {

    export const GOLD_POSITION = [{
        x: 549,
        y: 605
    }, {
        x: 93,
        y: 367
    }, {
        x: 241,
        y: 367
    }, {
        x: 398,
        y: 367
    }, {
        x: 93,
        y: 555
    }, {
        x: 241,
        y: 555
    }, {
        x: 398,
        y: 555
    }, {
        x: 586,
        y: 463
    }];

    export class GoldAddAnimation extends eui.Component {

        public gold_0:eui.Image;
        public gold_1:eui.Image;
        public gold_2:eui.Image;
        public gold_3:eui.Image;
        public gold_4:eui.Image;
        public gold_5:eui.Image;
        public gold_6:eui.Image;
        public gold_7:eui.Image;
        public gold_8:eui.Image;
        public gold_9:eui.Image;
        public gold_10:eui.Image;

        private _position: number = null;

        constructor(position?: number) {
            super();
            this._position = position;
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        }

        private onComplete() {
            console.log("金币增长动画组件初始化完毕");
            // console.log(this["animation_group"]);
            if (this._position) {
                for (let n = 0; n <= 10; n++) {
                    this["gold_" + n].x = GOLD_POSITION[this._position].x;
                    this["gold_" + n].y = GOLD_POSITION[this._position].y;
                }
            }
        }

        setPosition(position: number) {
            this._position = position;
            console.log("金币位置:", position);
            for (let n = 0; n <= 10; n++) {
                this["gold_" + n].x = GOLD_POSITION[position].x;
                this["gold_" + n].y = GOLD_POSITION[position].y;
            }
        }

        private onStage() {

        }

        private onRemove() {

        }
    }
}