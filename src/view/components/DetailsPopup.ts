namespace game {
    const CHINA_NUMBER = ["一", "二", "三", "四", "五", "六", "七"];

    export class DetailsPopup extends eui.Component {
        public img_back:eui.Image;
        public gold_0:eui.Component;
        public gold_1:eui.Component;
        public gold_2:eui.Component;
        public gold_3:eui.Component;
        public gold_4:eui.Component;
        public gold_5:eui.Component;
        public gold_6:eui.Component;
        public btn_close:eui.Image;


        private _main: GameScenesLayer;

        constructor(main: GameScenesLayer) {
            super();
            this._main = main;
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        }

        private _completeFlag: boolean = false;
        private onComplete() {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this._completeFlag = true;
            console.log("详情页组件初始化完毕");
            for (let n = 0; n < 7; n++) {
                if (n == 5) {
                    this["gold_" + n].img_gold.source = RES.getRes("details_gold_" + n + "_png");
                    this["gold_" + n].img_gold.scaleX = this["gold_" + n].img_gold.scaleY = 0.7;
                } else if (n == 6) {
                    this["gold_" + n].img_gold.source = RES.getRes("details_gold_" + 5 + "_png");
                } else {
                    this["gold_" + n].img_gold.source = RES.getRes("details_gold_" + n + "_png");
                }
                (<eui.Label>this["gold_" + n].label_day).text = "第 " + (n + 1) + " 天";
                (<eui.Label>this["gold_" + n].label_gold).text = this.toThousand(Math.pow(2, n) * 100);
                this["gold_" + n].img_border.visible = false;
            }

            //获得当前的签到信息
            this.getCheckInfo(this.httpCallBack);
        }

        private getCheckInfo(sucCallBack: Function) {
            let self = this;
            let params = GameEngine.getInstance().getCheckInfoParams();
            params = "?" + params;
            let httpURL: string = CHECK_IN_HOST + GET_CHECK_IN_INFO_URL;
            let httpRequest = new utils.HttpRequest();//egret.HttpResponseType.ARRAY_BUFFER
            let callBack = (evt?) => {
                console.log("正常返回");
                if (evt) {
                    let request = <egret.HttpRequest>evt.currentTarget;
                    let data = JSON.parse(request.response);
                    console.log("get data : ",request.response);
                    console.log(data.payload);
                    // if (null == data.payload) {
                    //     // self.btn_sign_in.enabled = true;
                    //     this.setDays(1, false);
                    //     return;
                    // }
                    // self.setDetailByData(data);

                    if (data.codeID == 0) { //获取签到成功
                        console.log("获取签到消息");
                        console.log(data);
                        self.setDetailByData(data);
                    } else if (data.codeID == 1005) { //签到失败
                        console.log("打印签到失败消息");
                        console.log(data.message);
                        this.setDays(1, false);
                    }
                }
            };
            let errorBack = (msg?) => {
                console.log("错误返回");
                if (msg) {
                    console.log(msg);
                }
            };
            httpRequest.initHttpRequest(this, httpURL, params, egret.HttpMethod.GET, callBack, errorBack);
        }

        private httpCallBack(evt: egret.Event) {
            console.log("正常返回");
            if (evt) {
                let request = <egret.HttpRequest>evt.currentTarget;
                let data = JSON.parse(request.response);
                console.log("get data : ",request.response);
                console.log(data.payload);
                this.setDetailByData(data);
            }
        }

        public getIsCheckIn(): Promise<any> {
            let self = this;
            return new Promise((resolve, reject) => {
                self.getCheckInfo( (evt: egret.Event) => {
                    let request = <egret.HttpRequest>evt.currentTarget;
                    let data = JSON.parse(request.response);
                    resolve(this.isCheckIn(data.payload.collectDate))
                })
            })
        }

        private setDetailByData(data: any) {
            //判断今日是否已经签到
            console.log("判断今日是否已经签到:", data);
            let lxCount = data.payload.lxCount;
            let oldTime = data.payload.collectDate;
            let dayApart = this.getDayApart(oldTime);
            if (dayApart == df.INVALID_CHAIR) {
                this.setDays(1, false);
            } else if (dayApart == 0) { //今日已签
                this.setDays(lxCount, true);
            } else if (dayApart == 1) { //今日未签
                this.setDays(lxCount + 1, false);
            } else {
                this.setDays(1, false);
            }

            // this.setDays(lxCount + 1);
        }

        private onStage() {
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.getCheckInfo(this.httpCallBack);
        }

        private getDayApart(old: string) {
            old = old.replace(/-/g, "/");
            if (old == "") return df.INVALID_CHAIR;
            let oldTime = new Date(old);
            let nowTime = new Date();

            if (nowTime.getFullYear() - oldTime.getFullYear() != 0) return df.INVALID_CHAIR;
            if (nowTime.getMonth() - oldTime.getMonth() != 0) return df.INVALID_CHAIR;
            return nowTime.getDay() - oldTime.getDay();
        }

        public isCheckIn(old: string): boolean {
            //ios兼容性问题
            old = old.replace(/-/g, "/");
            if (old == "") return false;
            let oldTime = new Date(old);
            let nowTime = new Date();

            if (nowTime.getFullYear() - oldTime.getFullYear() != 0) return false;
            if (nowTime.getMonth() - oldTime.getMonth() != 0) return false;
            return nowTime.getDay() == oldTime.getDay();
        }

        private onRemove() {
            this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        }

        private onClose() {
            this._main.removeCurrentPopup();
            this._main.getGold(new egret.Event(""));
        }

        private _signInFlag: boolean = false;
        private _actionQueue: any[];
        private _day: number;
        public setDays(day: number, toDay: boolean = false) {
            this._day = day;
            if (day > 7) return;
            for (let n = 0; n < day; n++) {
                if (n == 5) {
                    this["gold_" + n].img_gold.scaleX = this["gold_" + n].img_gold.scaleY = 1;
                }
                this["gold_" + n].img_border.visible = false;
                if (n < day - 1) {
                    this["gold_" + n].img_gold.source = RES.getRes("details_got_png");//打钩Z
                } else if(toDay) {
                    this["gold_" + n].img_gold.source = RES.getRes("details_got_png");//打钩Z
                }
            }

            this["gold_" + (day - 1)].img_border.visible = true;
            //金币动画
            // this["gold_" + (day - 1)].once(egret.TouchEvent.TOUCH_TAP, this.onSignIn, this);
        }

        private onSignIn() {
            //签到
            console.log("每日签到");
            // this["gold_" + (this._day - 1)].img_border.visible = false;
            // this["gold_" + n].img_gold.visible = false;
            // console.log(RES.getRes("details_got_png"));
            this["gold_" + (this._day - 1)].img_gold.source = RES.getRes("details_got_png");
            //金币增长动画
            this._main.playSignIn(this._day);
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