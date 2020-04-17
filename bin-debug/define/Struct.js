var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var df;
(function (df) {
    //叠加信息
    var tagDataDescribe = (function () {
        function tagDataDescribe() {
        }
        tagDataDescribe.prototype.convertBytes = function () {
            var bytes = new utils.ByteArray();
            bytes.Append_WORD(this.wDataSize);
            bytes.Append_WORD(this.wDataDesc);
            bytes.Append_UTF16(this.pBuffer, Math.floor(this.wDataSize / 2));
            return bytes;
        };
        return tagDataDescribe;
    }());
    df.tagDataDescribe = tagDataDescribe;
    __reflect(tagDataDescribe.prototype, "df.tagDataDescribe");
    //用户积分
    var tagUserScore = (function () {
        function tagUserScore() {
        }
        return tagUserScore;
    }());
    df.tagUserScore = tagUserScore;
    __reflect(tagUserScore.prototype, "df.tagUserScore");
    ;
    //用户积分
    var tagMobileUserScore = (function () {
        function tagMobileUserScore() {
        }
        tagMobileUserScore.prototype.onInit = function (buffer) {
            this.lGold = buffer.Pop_SCORE();
            this.lScore = buffer.Pop_SCORE();
            this.lWinCount = buffer.Pop_DWORD();
            this.lLostCount = buffer.Pop_DWORD();
            this.lDrawCount = buffer.Pop_DWORD();
            this.lFleeCount = buffer.Pop_DWORD();
            this.lExperience = buffer.Pop_DWORD();
        };
        return tagMobileUserScore;
    }());
    df.tagMobileUserScore = tagMobileUserScore;
    __reflect(tagMobileUserScore.prototype, "df.tagMobileUserScore");
    ;
    //用户状态
    var tagUserStatus = (function () {
        function tagUserStatus() {
        }
        return tagUserStatus;
    }());
    df.tagUserStatus = tagUserStatus;
    __reflect(tagUserStatus.prototype, "df.tagUserStatus");
    ;
    //用户段位
    var tagUserSegment = (function () {
        function tagUserSegment() {
        }
        return tagUserSegment;
    }());
    df.tagUserSegment = tagUserSegment;
    __reflect(tagUserSegment.prototype, "df.tagUserSegment");
    ;
    //桌子状态
    var tagTableStatus = (function () {
        function tagTableStatus() {
        }
        return tagTableStatus;
    }());
    df.tagTableStatus = tagTableStatus;
    __reflect(tagTableStatus.prototype, "df.tagTableStatus");
    ;
    //轮次子项
    var tagMatchRoundItem = (function () {
        function tagMatchRoundItem() {
        }
        return tagMatchRoundItem;
    }());
    df.tagMatchRoundItem = tagMatchRoundItem;
    __reflect(tagMatchRoundItem.prototype, "df.tagMatchRoundItem");
    ;
})(df || (df = {}));
