var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var utils;
(function (utils) {
    var TimerControl = (function () {
        function TimerControl() {
            this._timerQueue = [];
        }
        TimerControl.getTimerControl = function () {
            if (null == this.m_sInstance) {
                this.m_sInstance = new TimerControl();
                this.m_sInstance.init();
            }
            return this.m_sInstance;
        };
        TimerControl.prototype.init = function () {
            this._timerQueue.forEach(function (item) {
                var timer = item.timer;
                var callBack = item.callBack;
                var target = item.target;
                timer.removeEventListener(egret.TimerEvent.TIMER, callBack, target);
                timer.stop();
                timer = null;
            });
            this._timerQueue = [];
        };
        TimerControl.prototype.createTimer = function (target, delay, repeat, callBack, key) {
            //遍历查找
            for (var i = 0; i < this._timerQueue.length; i++) {
                var timer_1 = this._timerQueue[i];
                if (timer_1.key == key) {
                    console.log("队列中存在相同KEY的定时器");
                    return false;
                }
            }
            //创建定时
            var timer = new egret.Timer(delay, repeat);
            timer.addEventListener(egret.TimerEvent.TIMER, callBack, target);
            timer.start();
            //定时信息
            var map = {
                target: target,
                key: key,
                callBack: callBack,
                timer: timer
            };
            //加入队列
            this._timerQueue.push(map);
            return true;
        };
        TimerControl.prototype.cleanTimer = function (target, key) {
            for (var i = 0; i < this._timerQueue.length; i++) {
                var timerInfo = this._timerQueue[i];
                if (timerInfo.key == key) {
                    egret.warn(target == timerInfo.target);
                    if (target != timerInfo.target) {
                        console.log("对象不匹配");
                        return false;
                    }
                    //回调方法
                    var callback = timerInfo.callBack;
                    var timer = timerInfo.timer;
                    //移除监听
                    timer.removeEventListener(egret.TimerEvent.TIMER, callback, target);
                    //停止定时
                    timer.stop();
                    //引用置空
                    timer = null;
                    //移除队列
                    this._timerQueue.splice(i, 1);
                    break;
                }
            }
            return true;
        };
        return TimerControl;
    }());
    utils.TimerControl = TimerControl;
    __reflect(TimerControl.prototype, "utils.TimerControl");
})(utils || (utils = {}));
