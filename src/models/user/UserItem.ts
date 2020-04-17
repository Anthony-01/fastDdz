/**
 * 玩家信息
 */
namespace models {
    export class UserItem {
        /**
         * 玩家数据
         */
        public dwGameID = 0;
        public dwUserID = 0;

        public wFaceID = 0;
        public dwCustomID = 0;

        public cbGender = df.GENDER_MANKIND;
        public cbMemberOrder = 0;

        private wTableID = df.INVALID_TABLE ;
        private wChairID = df.INVALID_CHAIR;
        public cbUserStatus = 0;

        public lGold = 0;
        public lScore = 0;

        public dwWinCount = 0;
        public dwLostCount = 0;
        public dwDrawCount = 0;
        public dwFleeCount = 0;
        public dwExperience = 0;

        public szNickName = "";
        public szExternUID = "";
        public szHeadURL = "";

        /**
         * 用户经纬度
         */
        public dGlobalPosLng = 0.0;
        public dGlobalPosLat = 0.0;

        /**
         * 构造拷贝
         */
        constructor(item?: UserItem) {
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

        public set TableID(wTableID: number) {
            this.wTableID = wTableID;
        }
        public get TableID() {
            return this.wTableID;
        }

        public set ChairID(wChairID: number) {
            this.wChairID = wChairID;
        }
        public get ChairID() {
            return this.wChairID;
        }



    }
}