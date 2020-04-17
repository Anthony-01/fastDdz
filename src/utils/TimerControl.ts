namespace utils {

    interface ITimer {
        timer: egret.Timer,
        callBack: () => void,
        target: any,
        key: string
    }

    export class TimerControl {

        public static m_sInstance: TimerControl;

        private _timerQueue: ITimer[] =[];

        public static getTimerControl(): TimerControl {
            if (null == this.m_sInstance) {
                this.m_sInstance = new TimerControl();
                this.m_sInstance.init();
            }
            return this.m_sInstance;
        }

        public init(): void {
            this._timerQueue.forEach(item => {
                let timer = item.timer;
                let callBack = item.callBack;
                let target = item.target;
                timer.removeEventListener(egret.TimerEvent.TIMER, callBack, target);
                timer.stop();
                timer = null;
            });

            this._timerQueue = [];
        }

        public createTimer(target: any, delay: number, repeat: number, callBack: ()=> void, key: string): boolean {
            //遍历查找
            for (let i = 0; i < this._timerQueue.length; i++) {
                const timer = this._timerQueue[i];
                if (timer.key == key) {
                    console.log("队列中存在相同KEY的定时器");
                    return false;
                }
            }


            //创建定时
            let timer = new egret.Timer(delay, repeat);
            timer.addEventListener(egret.TimerEvent.TIMER, callBack, target);
            timer.start();

            //定时信息
            let map =
                {
                    target: target,
                    key: key,
                    callBack: callBack,
                    timer: timer
                };

            //加入队列
            this._timerQueue.push(map);

            return true;
        }

        public cleanTimer(target: any, key: string): boolean {
            for (let i = 0; i < this._timerQueue.length; i++) {
                let timerInfo = this._timerQueue[i];
                if (timerInfo.key == key) {
                    egret.warn(target == timerInfo.target);
                    if (target != timerInfo.target) {
                        console.log("对象不匹配");
                        return false;
                    }

                    //回调方法
                    let callback = timerInfo.callBack;
                    let timer = timerInfo.timer;

                    //移除监听
                    timer.removeEventListener(egret.TimerEvent.TIMER, callback, target);

                    //停止定时
                    timer.stop();

                    //引用置空
                    timer = null;

                    //移除队列
                    this._timerQueue.splice(i,1);
                    break;
                }
            }
            return true;
        }
    }
}