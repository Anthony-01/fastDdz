var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var ADD_TIME = 1000;
    var UserComponent = (function () {
        function UserComponent(res, index) {
            this.res = res;
            this.index = index;
            // this._userGolds = 189866;
        }
        UserComponent.prototype.setOrigin = function (value) {
            this._userGolds = value;
            this.res.parent["gold_" + this.index].text = utils.GameConst.transformScore(this._userGolds);
        };
        /**
         * 金币增长动画,使用Tween可以实现曲线增长
         * @param add: 金币增长目标数值
         * @param cell: 增长单位
         * */
        UserComponent.prototype.addGolds = function (add, cell) {
            if (null != this._addTimer) {
                this._addTimer.stop();
                this._userGolds = this._goalGolds;
                this.res.parent["gold_" + this.index].text = utils.GameConst.transformScore(this._userGolds);
                this._goalGolds = null;
                this._addTimer = null;
            }
            this._goalGolds = this._userGolds + add;
            this._addCell = cell;
            var times = Math.floor(add / cell);
            this._addTimer = new egret.Timer(ADD_TIME / times, times);
            this._addTimer.addEventListener(egret.TimerEvent.TIMER, this.onAdd, this);
            this._addTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onAddComplete, this);
            this._addTimer.start();
        };
        UserComponent.prototype.onAdd = function () {
            this._userGolds += this._addCell;
            this.res.parent["gold_" + this.index].text = utils.GameConst.transformScore(this._userGolds);
        };
        UserComponent.prototype.onAddComplete = function () {
            this._userGolds = this._goalGolds;
            console.log("金币增长完成");
        };
        UserComponent.prototype.toThousand = function (value) {
            var back = ""; //如果玩家金币数量以万、兆单位，该如何显示
            if (value >= 1000) {
                var front = Math.floor(value / 1000);
                var behind = value % 1000;
                back = front + "," + this.toHundred(behind);
            }
            else {
                back = value + "";
            }
            return back;
        };
        UserComponent.prototype.toHundred = function (value) {
            var back = "";
            if (value > 100) {
                back += value;
            }
            else if (value < 100 && value >= 10) {
                back = "0" + value;
            }
            else {
                back = "00" + value;
            }
            return back;
        };
        return UserComponent;
    }());
    game.UserComponent = UserComponent;
    __reflect(UserComponent.prototype, "game.UserComponent");
})(game || (game = {}));
