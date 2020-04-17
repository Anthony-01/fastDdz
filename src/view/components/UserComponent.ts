namespace game {
    const ADD_TIME = 1000;

    export interface IUserComponentRes extends eui.Group {

    }
    export class UserComponent {

        res: IUserComponentRes;
        index: number;

        constructor(res: IUserComponentRes, index: number) {
            this.res = res;
            this.index = index;
            // this._userGolds = 189866;
        }

        setOrigin(value: number) {
            this._userGolds = value;
            (<eui.Label>this.res.parent["gold_" + this.index]).text = utils.GameConst.transformScore(this._userGolds);
        }

        //用户当前金币数值
        private _userGolds: number;
        private _goalGolds: number;

        private _addCell: number;
        private _addTimer: egret.Timer;
        /**
         * 金币增长动画,使用Tween可以实现曲线增长
         * @param add: 金币增长目标数值
         * @param cell: 增长单位
         * */
        addGolds(add: number, cell: number) {
            if (null != this._addTimer) {
                this._addTimer.stop();
                this._userGolds = this._goalGolds;
                (<eui.Label>this.res.parent["gold_" + this.index]).text = utils.GameConst.transformScore(this._userGolds);
                this._goalGolds = null;
                this._addTimer = null;
            }
            this._goalGolds = this._userGolds + add;
            this._addCell = cell;
            let times = Math.floor(add / cell);
            this._addTimer = new egret.Timer(ADD_TIME / times, times);
            this._addTimer.addEventListener(egret.TimerEvent.TIMER, this.onAdd, this);
            this._addTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onAddComplete, this);
            this._addTimer.start();
        }

        private onAdd() {
            this._userGolds += this._addCell;
            (<eui.Label>this.res.parent["gold_" + this.index]).text = utils.GameConst.transformScore(this._userGolds);
        }

        private onAddComplete() {
            this._userGolds = this._goalGolds;
            console.log("金币增长完成");
        }

        toThousand(value: number): string {
            let back = "";//如果玩家金币数量以万、兆单位，该如何显示
            if (value >= 1000) {
                let front = Math.floor(value / 1000);
                let behind = value % 1000;
                back = front + "," + this.toHundred(behind);
            } else {
                back = value + "";
            }
            return back;
        }

        toHundred(value): string {
            let back = "";
            if (value > 100) {
                back += value;
            } else if (value < 100 && value >= 10) {
                back = "0" + value;
            } else {
                back = "00" + value;
            }
            return back;
        }
    }
}