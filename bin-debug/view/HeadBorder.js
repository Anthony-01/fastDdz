var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var game;
(function (game) {
    var CONFIG = {
        x: 57,
        y: 59,
        r: 75,
        startAngle: -90 * Math.PI / 180
    };
    var total = 10000;
    var count = 600;
    var borderR = 51;
    var borderRadius = 13.5;
    var speed = 104 * 4 / total; //每毫秒速度
    //框宽度是4px,dot运动半径是矩形宽是51；
    var HeadBorder = (function (_super) {
        __extends(HeadBorder, _super);
        function HeadBorder() {
            var _this = _super.call(this) || this;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            return _this;
        }
        HeadBorder.prototype.onComplete = function () {
            console.log("组件初始化完毕!");
            this.showCountDown();
        };
        /**
         * 显示头像倒计时
         * */
        HeadBorder.prototype.showCountDown = function () {
            if (this._borderMask == null) {
                this._borderMask = new egret.Shape();
            }
            this.count_down_border.visible = true;
            this.border_dot.visible = true;
            this.count_down_border.mask = this._borderMask;
            this.addChild(this._borderMask);
            this._borderTimer = new egret.Timer(total / count, count);
            this._borderTimer.addEventListener(egret.TimerEvent.TIMER, this.updateMask, this);
            this._borderTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.showComplete, this);
            this._borderTimer.start();
        };
        /**
         * 更新border遮罩
         * */
        HeadBorder.prototype.updateMask = function (event) {
            //根据定时器当前的执行次数来更新遮罩
            var time = event.target.currentCount;
            var angle = (time / count) * 360;
            var endAngle = (-90 + angle) * Math.PI / 180;
            var graphics = this._borderMask.graphics;
            graphics.clear();
            graphics.beginFill(0xffffff);
            graphics.moveTo(CONFIG.x, CONFIG.y);
            graphics.lineTo(CONFIG.x, CONFIG.y - CONFIG.r);
            graphics.drawArc(CONFIG.x, CONFIG.y, CONFIG.r, CONFIG.startAngle, endAngle, true); //逆时针
            graphics.lineTo(CONFIG.x, CONFIG.y);
            graphics.endFill();
            //同时根据角度计算出count_down_dot的位置并进行移动
            this.moveDot(angle);
        };
        HeadBorder.prototype.moveDot = function (angle) {
            // let currentX = CONFIG.x + Math.tan(angle * (Math.PI / 180)) * borderR;
            // if (currentX >= -(borderR - borderRadius) && currentX <= -(borderR - borderRadius)) { //直线运动
            //     this.border_dot.x = currentX;
            //     this.border_dot.y = borderR;
            // }
            // if (CONFIG.x + (borderR - borderRadius))
            // if (Math.tan(angle * (Math.PI / 180))) {
            //
            // }
            var boundary_0 = Math.atan2(borderR - borderRadius, borderR);
            console.log(Math.tan(angle * (Math.PI / 180)), boundary_0);
            if (Math.tan(angle * (Math.PI / 180)) < boundary_0) {
                this.border_dot.x = borderR + Math.tan(angle * (Math.PI / 180)) * borderR;
                // this.border_dot.y = CONFIG.x - borderR;
            }
        };
        HeadBorder.prototype.showComplete = function () {
            console.log("玩家操作时间到!");
            this.count_down_border.visible = false;
        };
        HeadBorder.prototype.stopOperate = function () {
            if (this._borderTimer) {
                this._borderTimer.reset();
            }
            this.showComplete();
        };
        return HeadBorder;
    }(eui.Component));
    game.HeadBorder = HeadBorder;
    __reflect(HeadBorder.prototype, "game.HeadBorder");
})(game || (game = {}));
