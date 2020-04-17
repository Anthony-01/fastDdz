var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 玩家信息
 */
var models;
(function (models) {
    var UserItem = (function () {
        /**
         * 构造拷贝
         */
        function UserItem(item) {
            /**
             * 玩家数据
             */
            this.dwGameID = 0;
            this.dwUserID = 0;
            this.wFaceID = 0;
            this.dwCustomID = 0;
            this.cbGender = df.GENDER_MANKIND;
            this.cbMemberOrder = 0;
            this.wTableID = df.INVALID_TABLE;
            this.wChairID = df.INVALID_CHAIR;
            this.cbUserStatus = 0;
            this.lGold = 0;
            this.lScore = 0;
            this.dwWinCount = 0;
            this.dwLostCount = 0;
            this.dwDrawCount = 0;
            this.dwFleeCount = 0;
            this.dwExperience = 0;
            this.szNickName = "";
            this.szExternUID = "";
            this.szHeadURL = "";
            /**
             * 用户经纬度
             */
            this.dGlobalPosLng = 0.0;
            this.dGlobalPosLat = 0.0;
            if (null != item) {
                this.dwGameID = item.dwGameID;
                this.dwUserID = item.dwUserID;
                this.wFaceID = item.wFaceID;
                this.dwCustomID = item.dwCustomID;
                this.cbGender = item.cbGender;
                this.cbMemberOrder = item.cbMemberOrder;
                this.wTableID = item.wTableID;
                this.wChairID = item.wChairID;
                this.cbUserStatus = item.cbUserStatus;
                this.lScore = item.lScore;
                this.lGold = item.lGold;
                this.dwWinCount = item.dwWinCount;
                this.dwLostCount = item.dwLostCount;
                this.dwDrawCount = item.dwDrawCount;
                this.dwFleeCount = item.dwFleeCount;
                this.dwExperience = item.dwExperience;
                this.szNickName = item.szNickName;
                this.szHeadURL = item.szHeadURL;
                /**
                 * 用户经纬度
                 */
                this.dGlobalPosLng = item.dGlobalPosLng;
                this.dGlobalPosLat = item.dGlobalPosLat;
            }
        }
        Object.defineProperty(UserItem.prototype, "TableID", {
            get: function () {
                return this.wTableID;
            },
            set: function (wTableID) {
                this.wTableID = wTableID;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserItem.prototype, "ChairID", {
            get: function () {
                return this.wChairID;
            },
            set: function (wChairID) {
                this.wChairID = wChairID;
            },
            enumerable: true,
            configurable: true
        });
        return UserItem;
    }());
    models.UserItem = UserItem;
    __reflect(UserItem.prototype, "models.UserItem");
})(models || (models = {}));
