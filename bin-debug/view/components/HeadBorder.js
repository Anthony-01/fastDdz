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
        y: 57,
        r: 75,
        startAngle: -90 * Math.PI / 180
    };
    var DOT_CONFIG = {
        x: 57,
        y: 6
    };
    var total = 20000;
    // const count = 600;
    var borderR = 51;
    var borderRadius = 13.5;
    var speed = 104 * 4 / total; //每毫秒速度
    //框宽度是4px,dot运动半径是矩形宽是51；
    var TEST_HEAD = "https://wx.qlogo.cn/mmopen/vi_32/QVceiat5EC5ICxz374XicDOvobQ65B2U7qdCLb37uXwwBFjXQQRGMaL599YdBRPbdLI8fzE9tadOXSe01bM1VX0Q/132";
    var HeadBorder = (function (_super) {
        __extends(HeadBorder, _super);
        function HeadBorder() {
            var _this = _super.call(this) || this;
            _this._framePerSecond = 20;
            _this._updateCount = 0;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            return _this;
        }
        HeadBorder.prototype.onComplete = function () {
            // console.log("头像组件初始化完毕!");
            this.head.mask = this.head_mask;
            this.count_down_border.visible = false;
            this.border_dot.visible = false;
            this.m_ifComplete = true;
            // this.initBtn();
            this.beginComponentAction();
            // this.showCountDown();
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stopOperate, this);
        };
        /**
         * 显示头像倒计时
         * */
        HeadBorder.prototype.showCountDown = function (time) {
            if (this._borderMask == null) {
                this._borderMask = new egret.Shape();
            }
            this.count_down_border.visible = true;
            this.border_dot.visible = true;
            this.count_down_border.mask = this._borderMask;
            this.addChild(this._borderMask);
            var totalTime;
            if (time) {
                totalTime = time * 1000;
            }
            else {
                totalTime = total;
            }
            this._updateCount = (totalTime / 1000) * this._framePerSecond;
            this._borderTimer = new egret.Timer(1000 / this._framePerSecond, this._updateCount);
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
            var angle = (time / this._updateCount) * 360;
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
            var boundaryL_0 = Math.atan2(borderR - borderRadius, borderR);
            var boundaryA_0 = boundaryL_0 * (180 / Math.PI);
            var boundaryL_1 = Math.atan2(borderR, borderR - borderRadius);
            var boundaryA_1 = boundaryL_1 * (180 / Math.PI);
            //头像框部分
            if ((angle >= 0 && angle < boundaryA_0) || angle >= 180 - boundaryA_0 && angle < 180) {
                this.border_dot.x = CONFIG.x + Math.abs(Math.tan(angle * (Math.PI / 180)) * borderR);
            }
            else if ((angle >= 180 && angle < 180 + boundaryA_0) || (angle >= 360 - boundaryA_0 && angle < 360)) {
                this.border_dot.x = CONFIG.x - Math.abs(Math.tan(angle * (Math.PI / 180)) * borderR);
            }
            else if ((angle >= boundaryA_0 && angle < boundaryA_1)) {
                var changeAngle = ((angle - boundaryA_0) / (boundaryA_1 - boundaryA_0)) * 90;
                this.border_dot.x = (CONFIG.x + borderR - borderRadius + 2) + (borderRadius - 2) * Math.sin(changeAngle * (Math.PI / 180));
                this.border_dot.y = (CONFIG.y - borderR + borderRadius - 2) - (borderRadius - 2) * Math.cos(changeAngle * (Math.PI / 180));
            }
            else if ((angle >= 360 - boundaryA_1 && angle < 360 - boundaryA_0)) {
                var changeAngle = ((angle - (360 - boundaryA_1)) / (boundaryA_1 - boundaryA_0)) * 90;
                this.border_dot.x = (CONFIG.x - borderR + borderRadius - 2) - (borderRadius - 2) * Math.cos(changeAngle * (Math.PI / 180));
                this.border_dot.y = (CONFIG.y - borderR) + (borderRadius - 2) - (borderRadius - 2) * Math.sin(changeAngle * (Math.PI / 180));
            }
            else if ((angle >= boundaryA_1 && angle < 180 - boundaryA_1)) {
                if (angle >= boundaryA_1 && angle < 90) {
                    this.border_dot.y = CONFIG.y - borderR / Math.tan(angle * (Math.PI / 180));
                }
                else {
                    this.border_dot.y = CONFIG.y + borderR * Math.tan((angle - 90) * (Math.PI / 180));
                }
            }
            else if ((angle >= (180 + boundaryA_1) && angle < (360 - boundaryA_1))) {
                if (angle >= (180 + boundaryA_1) && angle < 270) {
                    this.border_dot.y = CONFIG.y + borderR / Math.tan((angle - 180) * (Math.PI / 180));
                }
                else {
                    this.border_dot.y = CONFIG.y - borderR * Math.tan((angle - 270) * (Math.PI / 180));
                }
            }
            else if ((angle >= (90 + boundaryA_0)) && (angle < (90 + boundaryA_1))) {
                var changeAngle = ((angle - (90 + boundaryA_0)) / (boundaryA_1 - boundaryA_0)) * 90;
                this.border_dot.x = (CONFIG.x + borderR - borderRadius + 2) + (borderRadius - 2) * Math.cos(changeAngle * (Math.PI / 180));
                this.border_dot.y = (CONFIG.y + borderR - borderRadius + 2) + (borderRadius - 2) * Math.sin(changeAngle * (Math.PI / 180));
            }
            else if ((angle >= (180 + boundaryA_0) && angle < (180 + boundaryA_1))) {
                var changeAngle = ((angle - (180 + boundaryA_0)) / (boundaryA_1 - boundaryA_0)) * 90;
                this.border_dot.x = (CONFIG.x - borderR + borderRadius - 2) - (borderRadius - 2) * Math.sin(changeAngle * (Math.PI / 180));
                this.border_dot.y = (CONFIG.y + borderR - borderRadius + 2) + (borderRadius - 2) * Math.cos(changeAngle * (Math.PI / 180));
            }
        };
        HeadBorder.prototype.showComplete = function () {
            // console.log("玩家操作时间到!");
            this.count_down_border.visible = false;
            this.border_dot.visible = false;
        };
        HeadBorder.prototype.stopOperate = function () {
            var self = this;
            var callBack = function () {
                if (self._borderTimer) {
                    self._borderTimer.reset();
                }
                self.showComplete();
                self.border_dot.x = DOT_CONFIG.x;
                self.border_dot.y = DOT_CONFIG.y;
            };
            if (this.m_ifComplete) {
                callBack();
            }
            else {
                this._actionList.push(callBack);
            }
        };
        HeadBorder.prototype.setHeadUrl = function (url) {
            var self = this;
            var callBack = function () {
                self.head.source = url;
            };
            if (this.m_ifComplete) {
                callBack();
            }
            else {
                this._actionList.push(callBack);
            }
            // this.head.source = TEST_HEAD;
        };
        return HeadBorder;
    }(base.BaseComponent));
    game.HeadBorder = HeadBorder;
    __reflect(HeadBorder.prototype, "game.HeadBorder");
})(game || (game = {}));
