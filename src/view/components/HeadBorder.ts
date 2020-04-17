namespace game {
    const CONFIG = {
        x: 57,
        y: 57,
        r: 75,
        startAngle: - 90 * Math.PI / 180
    };
    const DOT_CONFIG = {
        x: 57,
        y: 6
    };

    const total = 20000;
    // const count = 600;
    const borderR = 51;
    const borderRadius = 13.5;
    const speed = 104 * 4 / total;//每毫秒速度

    //框宽度是4px,dot运动半径是矩形宽是51；
    const TEST_HEAD = "https://wx.qlogo.cn/mmopen/vi_32/QVceiat5EC5ICxz374XicDOvobQ65B2U7qdCLb37uXwwBFjXQQRGMaL599YdBRPbdLI8fzE9tadOXSe01bM1VX0Q/132";

    export class HeadBorder extends base.BaseComponent {
        public bg:eui.Image;
        public head:eui.Image;
        public head_mask:eui.Rect;
        public count_down_border:eui.Image;
        public border_dot:eui.Image;

        constructor() {
            super();
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        }

        onComplete() {
            // console.log("头像组件初始化完毕!");
            this.head.mask = this.head_mask;
            this.count_down_border.visible = false;
            this.border_dot.visible = false;
            this.m_ifComplete = true;
            // this.initBtn();
            this.beginComponentAction();
            // this.showCountDown();
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stopOperate, this);
        }


        private _borderMask: egret.Shape;
        private _borderTimer: egret.Timer;

        private _framePerSecond: number = 20;
        private _updateCount: number = 0;
        /**
         * 显示头像倒计时
         * */
        showCountDown(time?: number) {
            if (this._borderMask == null) {
                this._borderMask = new egret.Shape();
            }
            this.count_down_border.visible = true;
            this.border_dot.visible = true;
            this.count_down_border.mask = this._borderMask;
            this.addChild(this._borderMask);
            let totalTime;
            if (time) {
                totalTime = time * 1000;
            } else {
                totalTime = total;
            }
            this._updateCount = (totalTime / 1000) * this._framePerSecond;
            this._borderTimer= new egret.Timer( 1000 / this._framePerSecond, this._updateCount);

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
            let angle = (time / this._updateCount) * 360;
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
            let boundaryL_0 = Math.atan2(borderR - borderRadius, borderR);
            let boundaryA_0 = boundaryL_0 * (180 / Math.PI);
            let boundaryL_1 = Math.atan2(borderR, borderR - borderRadius);
            let boundaryA_1 = boundaryL_1 * (180 / Math.PI);

            //头像框部分
            if ((angle >= 0 && angle < boundaryA_0) || angle >= 180 - boundaryA_0 && angle < 180 ) { //x轴运动(上下)
                this.border_dot.x = CONFIG.x + Math.abs(Math.tan(angle * (Math.PI / 180)) * borderR);
            } else if ((angle >= 180 && angle < 180 + boundaryA_0) || (angle >= 360 - boundaryA_0 && angle < 360)) {
                this.border_dot.x = CONFIG.x - Math.abs(Math.tan(angle * (Math.PI / 180)) * borderR)
            } else if ((angle >= boundaryA_0 && angle < boundaryA_1)) { //圆弧运动（上右）
                let changeAngle = ((angle - boundaryA_0) / (boundaryA_1 - boundaryA_0)) * 90;
                this.border_dot.x = (CONFIG.x + borderR - borderRadius + 2) + (borderRadius - 2) * Math.sin(changeAngle * (Math.PI / 180));
                this.border_dot.y = (CONFIG.y - borderR + borderRadius - 2) - (borderRadius - 2) * Math.cos(changeAngle * (Math.PI / 180));
            } else if ((angle >= 360 - boundaryA_1  && angle < 360 - boundaryA_0)) { //（上左）
                let changeAngle = ((angle - (360 - boundaryA_1)) / (boundaryA_1 - boundaryA_0)) * 90;
                this.border_dot.x = (CONFIG.x - borderR + borderRadius - 2) - (borderRadius - 2) * Math.cos(changeAngle * (Math.PI / 180));
                this.border_dot.y = (CONFIG.y - borderR) + (borderRadius - 2) - (borderRadius - 2) * Math.sin(changeAngle * (Math.PI / 180));
            } else if ((angle >= boundaryA_1 && angle < 180 - boundaryA_1)) { //y轴运动（右）
                if (angle >= boundaryA_1 && angle < 90) {
                    this.border_dot.y = CONFIG.y - borderR / Math.tan(angle * (Math.PI / 180));
                } else {
                    this.border_dot.y = CONFIG.y + borderR * Math.tan((angle - 90) * (Math.PI / 180));
                }
            } else if ((angle >= (180 + boundaryA_1) && angle < (360 - boundaryA_1))) {//左
                if (angle >= (180 + boundaryA_1) && angle < 270) {
                    this.border_dot.y = CONFIG.y + borderR / Math.tan((angle - 180) * (Math.PI / 180));
                } else {
                    this.border_dot.y = CONFIG.y - borderR * Math.tan((angle - 270) * (Math.PI / 180));
                }
            } else if ((angle >= (90 + boundaryA_0)) && (angle < (90 + boundaryA_1))) { //下半区运动 （下右）
                let changeAngle = ((angle - (90 + boundaryA_0)) / (boundaryA_1 - boundaryA_0)) * 90;
                this.border_dot.x = (CONFIG.x + borderR - borderRadius + 2) + (borderRadius - 2) * Math.cos(changeAngle * (Math.PI / 180));
                this.border_dot.y = (CONFIG.y + borderR - borderRadius + 2) + (borderRadius - 2) * Math.sin(changeAngle * (Math.PI / 180));
            } else if ((angle >= (180 + boundaryA_0) && angle < (180 + boundaryA_1))) { //（下左）
                let changeAngle = ((angle - (180 + boundaryA_0)) / (boundaryA_1 - boundaryA_0)) * 90;
                this.border_dot.x = (CONFIG.x - borderR + borderRadius - 2) - (borderRadius - 2) * Math.sin(changeAngle * (Math.PI / 180));
                this.border_dot.y = (CONFIG.y + borderR - borderRadius + 2) + (borderRadius - 2) * Math.cos(changeAngle * (Math.PI / 180));
            }
        }

        private showComplete() {
            // console.log("玩家操作时间到!");
            this.count_down_border.visible = false;
            this.border_dot.visible = false;
        }

        public stopOperate() {
            let self = this;
            let callBack = () => {
                if (self._borderTimer) {
                    self._borderTimer.reset();
                }
                self.showComplete();
                self.border_dot.x = DOT_CONFIG.x;
                self.border_dot.y = DOT_CONFIG.y;
            };

            if (this.m_ifComplete) {
                callBack();
            } else {
                this._actionList.push(callBack);
            }
        }

        setHeadUrl(url: string) {
            let self = this;
            let callBack = () => {
                self.head.source = url;
            };
            if (this.m_ifComplete) {
                callBack();
            } else {
                this._actionList.push(callBack);
            }
            // this.head.source = TEST_HEAD;
        }
    }
}