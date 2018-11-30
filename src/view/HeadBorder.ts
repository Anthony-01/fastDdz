namespace game {
    const CONFIG = {
        x: 57,
        y: 59,
        r: 75,
        startAngle: - 90 * Math.PI / 180
    };

    const total = 10000;
    const count = 600;
    const borderR = 51;
    const borderRadius = 13.5;
    const speed = 104 * 4 / total;//每毫秒速度

    //框宽度是4px,dot运动半径是矩形宽是51；

    export class HeadBorder extends eui.Component {
        public bg:eui.Image;
        public count_down_border:eui.Image;
        public border_dot:eui.Image;



        constructor() {
            super();
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        }

        private onComplete() {
            console.log("组件初始化完毕!");
            this.showCountDown();
        }


        private _borderMask: egret.Shape;
        private _borderTimer: egret.Timer;
        /**
         * 显示头像倒计时
         * */
        showCountDown() {
            if (this._borderMask == null) {
                this._borderMask = new egret.Shape();
            }
            this.count_down_border.visible = true;
            this.border_dot.visible = true;
            this.count_down_border.mask = this._borderMask;
            this.addChild(this._borderMask);
            this._borderTimer= new egret.Timer( total / count, count);

            this._borderTimer.addEventListener(egret.TimerEvent.TIMER, this.updateMask, this);
            this._borderTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.showComplete, this);

            this._borderTimer.start();
        }

        /**
         * 更新border遮罩
         * */
        private updateMask(event: egret.TimerEvent) {
            //根据定时器当前的执行次数来更新遮罩
            let time = (<egret.Timer>event.target).currentCount;
            let angle = (time / count) * 360;
            let endAngle = (-90 + angle) * Math.PI / 180;
            let graphics = this._borderMask.graphics;
            graphics.clear();
            graphics.beginFill(0xffffff);
            graphics.moveTo(CONFIG.x, CONFIG.y);
            graphics.lineTo(CONFIG.x, CONFIG.y - CONFIG.r);
            graphics.drawArc(CONFIG.x, CONFIG.y, CONFIG.r, CONFIG.startAngle, endAngle, true);//逆时针
            graphics.lineTo(CONFIG.x, CONFIG.y);
            graphics.endFill();

            //同时根据角度计算出count_down_dot的位置并进行移动
            this.moveDot(angle);
        }

        private moveDot(angle: number) {
            let boundary_0 = Math.atan2(borderR - borderRadius, borderR);
            let point_0 = new egret.Point(boundary_0 * borderR + borderR, CONFIG.y - borderR);

            if (Math.tan(angle * (Math.PI / 180)) < boundary_0) {
                this.border_dot.x = borderR + Math.tan(angle * (Math.PI / 180)) * borderR;
            } else {
                // let point = new egret.Point(boundary_0 * borderR + borderR, CONFIG.y - borderR);
            }
        }

        private showComplete() {
            console.log("玩家操作时间到!");
            this.count_down_border.visible = false;
        }

        public stopOperate() {
            if (this._borderTimer) {
                this._borderTimer.reset();
            }
            this.showComplete();
        }
    }
}