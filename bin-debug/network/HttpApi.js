var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var http;
(function (http) {
    http.CHECK_IN_HOST = "https://minigame.foxuc.com/"; //请求主机名
    http.GET_SHARE_INFO_URL = "v1/Applet/GetGameShareItem"; //get路径一
    http.POST_SHARE_URL = "v1/Applet/UserGameShare"; //post路径二
    http.GET_CHECK_IN_INFO_URL = "v1/Applet/GetCheckInItem"; //GET路径三
    http.POST_CHECK_IN_URL = "v1/Applet/UserCheckIn"; //post路径四
    var test_one = [
        "v1/Applet/GetWeekWinCountRank",
        "v1/Applet/GetWeekWinScoreRank",
        "v1/Applet/GetUserScoreRank"
    ];
    var httpApi = (function () {
        function httpApi() {
            this._times = 0;
        }
        httpApi.prototype.getCheckInfo = function () {
            var self = this;
            var params = this.getCheckInfoParams();
            params = "?" + params;
            var httpURL = http.CHECK_IN_HOST + test_one[(this._times++) % 3];
            var httpRequest = new utils.HttpRequest(); //egret.HttpResponseType.ARRAY_BUFFER
            var callBack = function (evt) {
                console.log("正常返回");
                if (evt) {
                    var request = evt.currentTarget;
                    var data = JSON.parse(request.response);
                    console.log(httpURL + ":");
                    console.log("get data : ", request.response);
                    console.log(data.payload);
                    // if (null == data.payload) {
                    //     // self.btn_sign_in.enabled = true;
                    //     this.setDays(1, false);
                    //     return;
                    // }
                    // self.setDetailByData(data);
                    if (data.codeID == 0) {
                        // console.log("获取签到消息");
                        // console.log(data);
                    }
                    else if (data.codeID == 1005) {
                        // console.log("打印签到失败消息");
                        // console.log(data.message);
                    }
                }
            };
            var errorBack = function (msg) {
                console.log("错误返回");
                if (msg) {
                    console.log(msg);
                }
            };
            httpRequest.initHttpRequest(this, httpURL, params, egret.HttpMethod.GET, callBack, errorBack);
        };
        httpApi.prototype.getCheckInfoParams = function () {
            var userID = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
            var serverTime = Math.floor(new Date().getTime() / 1000);
            var now = new Date();
            var TimeStamp = utils.formateDateAndTimeToString(now);
            var stationID = df.STATION_ID;
            var nonceStr = Math.floor(Math.random() * Math.pow(10, 8)); //随机生成八位数
            var params = "StationID=" + stationID + "&UserID=" + userID + "&NonceStr=" + nonceStr + "&TimeStamp=" + TimeStamp;
            var signature = utils.MD5.MD5_HEX("UserID=" + userID + "&NonceStr=" + nonceStr + "&TimeStamp=" + TimeStamp + "&Key=wsdeflkfignvgdhfbsgtrs");
            signature = signature.toUpperCase();
            params = params + "&signature=" + signature;
            return params;
        };
        return httpApi;
    }());
    http.httpApi = httpApi;
    __reflect(httpApi.prototype, "http.httpApi");
})(http || (http = {}));
