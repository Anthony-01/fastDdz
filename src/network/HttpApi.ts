namespace http {

    export const CHECK_IN_HOST = "https://minigame.foxuc.com/"; //请求主机名
    export const GET_SHARE_INFO_URL = "v1/Applet/GetGameShareItem"; //get路径一

    export const POST_SHARE_URL = "v1/Applet/UserGameShare"; //post路径二

    export const GET_CHECK_IN_INFO_URL = "v1/Applet/GetCheckInItem"; //GET路径三

    export const POST_CHECK_IN_URL = "v1/Applet/UserCheckIn"; //post路径四

    const test_one = [
        "v1/Applet/GetWeekWinCountRank",
        "v1/Applet/GetWeekWinScoreRank",
        "v1/Applet/GetUserScoreRank"
    ];

    export class httpApi {
        
        constructor() {

        }

        private _times: number = 0;

        private getCheckInfo() {
            let self = this;
            let params = this.getCheckInfoParams();
            params = "?" + params;
            let httpURL: string = CHECK_IN_HOST + test_one[(this._times++)%3];
            let httpRequest = new utils.HttpRequest();//egret.HttpResponseType.ARRAY_BUFFER
            let callBack = (evt?) => {
                console.log("正常返回");
                if (evt) {
                    let request = <egret.HttpRequest>evt.currentTarget;
                    let data = JSON.parse(request.response);
                    console.log(httpURL+":");
                    console.log("get data : ",request.response);
                    console.log(data.payload);
                    // if (null == data.payload) {
                    //     // self.btn_sign_in.enabled = true;
                    //     this.setDays(1, false);
                    //     return;
                    // }
                    // self.setDetailByData(data);

                    if (data.codeID == 0) { //获取签到成功
                        // console.log("获取签到消息");
                        // console.log(data);
                    } else if (data.codeID == 1005) { //签到失败
                        // console.log("打印签到失败消息");
                        // console.log(data.message);
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

        public getCheckInfoParams(): string {
            const userID = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
            const serverTime = Math.floor(new Date().getTime() / 1000);
            let now = new Date();
            const TimeStamp = utils.formateDateAndTimeToString(now);
            const stationID = df.STATION_ID;
            const nonceStr = Math.floor(Math.random() * Math.pow(10, 8));//随机生成八位数

            let params = `StationID=${stationID}&UserID=${userID}&NonceStr=${nonceStr}&TimeStamp=${TimeStamp}`;
            let signature = utils.MD5.MD5_HEX(`UserID=${userID}&NonceStr=${nonceStr}&TimeStamp=${TimeStamp}&Key=wsdeflkfignvgdhfbsgtrs`);
            signature = signature.toUpperCase();
            params = `${params}&signature=${signature}`;

            return params;
        }
    }
}