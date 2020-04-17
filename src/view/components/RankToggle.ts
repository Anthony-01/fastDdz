// TypeScript file
namespace game {

    export const USER_SCORE_RANK = "v1/Applet/GetWeekWinCountRank";

    export class RankToggle extends eui.Component {

        //0-friend 1-world
        private m_status: number = 0;

        private _main: RankList;

        //components
        public btn_friend:eui.Component;
        public btn_world:eui.Component;

        constructor(main: RankList) {
            super();
            // this.touchChildren = false;
            this._main = main;
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            //
        }

        get status() {
            return this.m_status;
        }

        /**
         * 通过当前状态显示视图-表现
         * @author Anthony
         */
        private showStatus() {
            switch (this.m_status) {
                case 0 : {
                    this.btn_friend["img_bg"].alpha  = 1;
                    this.btn_world["img_bg"].alpha = 0;
                    break;
                }
                case 1 : {
                    this.btn_friend["img_bg"].alpha = 0;
                    this.btn_world["img_bg"].alpha = 1;
                    break;
                }
            }
        }

        private m_onComplete: boolean = false;

        private onComplete() {
            this.btn_friend.touchChildren = true;
            this.btn_world.touchChildren = true;
            this.m_onComplete = true;
            this.showStatus();
            this.btn_friend.name = "friend";
            this.btn_world.name = "world";
            this.btn_friend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
            this.btn_world.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        }

        private onChange(e: egret.TouchEvent) {
            e.stopImmediatePropagation();
            let name = e.currentTarget.name;
            console.log("点击：", name);
            if (name == "friend") {
                this.showWxRank();
            } else {
                this.showEuiRank();
            }
            this.showStatus();
        }

        private showWxRank() {
            //判断是否需要打开
            if (this.m_status == 0) return;
            this.m_status = 0;
            this._main.openFriendRank();
        }

        private showEuiRank() {
            if (this.m_status == 1) return;
            this.m_status = 1;
            this._main.closeFriendRank();
            // this.httpWorld();
        }

        private showWorld(data: any[]) {
            this._main.showByData(data);
        }

        public requestData():Promise<any> {
            return new Promise((resolve, reject) => {
                this.updateData().then(data => {
                    resolve(data);
                })
            })
        }
        //请求世界排行榜数据
        //{rankID: 6, userID: 9019, nickName: "tencent_game_19", faceUrl: "", rankValue: 18888897}
        private httpWorld() {
            this.updateData().then(data => {
                this.showWorld(data);
            });
            // let self = this;
            // let params = this.getCheckInfoParams();
            // params = "?" + params;
            // let httpURL: string = CHECK_IN_HOST + USER_SCORE_RANK;
            // let httpRequest = new utils.HttpRequest();//egret.HttpResponseType.ARRAY_BUFFER
            // let callBack = (evt?) => {
            //     console.log("正常返回");
            //     if (evt) {
            //         let request = <egret.HttpRequest>evt.currentTarget;
            //         let data = JSON.parse(request.response);
            //         console.log(httpURL+":");
            //         console.log("get data : ",request.response);
            //         console.log(data.payload);
            //         if (data.codeID == 0) {
            //             this.showWorld(data.payload);
            //         } else if (data.codeID == 1005) {
            //
            //         }
            //     }
            // };
            // let errorBack = (msg?) => {
            //     console.log("错误返回");
            //     if (msg) {
            //         console.log(msg);
            //     }
            // };
            // httpRequest.initHttpRequest(this, httpURL, params, egret.HttpMethod.GET, callBack, errorBack);
        }

        private updateData(): Promise<any> {
            return new Promise((resolve, reject) => {
                let params = this.getCheckInfoParams();
                params = "?" + params;
                let httpURL: string = CHECK_IN_HOST + USER_SCORE_RANK;
                let httpRequest = new utils.HttpRequest();//egret.HttpResponseType.ARRAY_BUFFER
                let callBack = (evt?) => {
                    if (evt) {
                        let request = <egret.HttpRequest>evt.currentTarget;
                        let data = JSON.parse(request.response);
                        console.log(httpURL+":");
                        console.log("get data : ",request.response);
                        console.log(data.payload);
                        if (data.codeID == 0) {
                            resolve(data.payload);
                        } else if (data.codeID == 1005) {

                        }
                    }
                };
                let errorBack = (msg?) => {
                    if (msg) {
                        console.log(msg);
                    }
                    reject(msg);
                };
                httpRequest.initHttpRequest(this, httpURL, params, egret.HttpMethod.GET, callBack, errorBack);
            })
        }

        private getCheckInfoParams(): string {
            const userID = managers.FrameManager.getInstance().m_GlobalUserItem ? managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID : 9000;
            // const userID = 9018;
            const serverTime = Math.floor(new Date().getTime() / 1000);
            let now = new Date();
            const TimeStamp = utils.formateDateAndTimeToString(now);
            const stationID = 1000;
            const nonceStr = Math.floor(Math.random() * Math.pow(10, 8));//随机生成八位数

            //StationID={StationID}&UserID={UserID}&NonceStr={NonceStr}&TimeStamp={TimeStamp}&Signature={Signature}
            let params = `StationID=${stationID}&UserID=${userID}&NonceStr=${nonceStr}&TimeStamp=${TimeStamp}`;
            let signature = utils.MD5.MD5_HEX(`UserID=${userID}&NonceStr=${nonceStr}&TimeStamp=${TimeStamp}&Key=wsdeflkfignvgdhfbsgtrs`);
            signature = signature.toUpperCase();
            params = `${params}&signature=${signature}`;

            return params;
        }
    }
}