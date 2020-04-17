var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var game;
(function (game) {
    var RankList = (function (_super) {
        __extends(RankList, _super);
        function RankList(main, close) {
            var _this = _super.call(this) || this;
            _this._closeFunc = null;
            //世界排行榜
            _this._page = 0;
            _this._totalPage = 0;
            _this._totalGroup = [];
            _this._main = main;
            _this._closeFunc = close;
            return _this;
        }
        RankList.prototype.onComplete = function () {
            this.btn_toggle = new game.RankToggle(this);
            this.btn_toggle.x = 42;
            this.btn_toggle.y = 132;
            this.rank.addChild(this.btn_toggle);
            this.btn_toggle.visible = false;
            _super.prototype.onComplete.call(this);
        };
        RankList.prototype.initBtn = function () {
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.btn_preview.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPre, this);
            this.btn_next.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNext, this);
            this._originScale = this.btn_preview.scaleX;
            this.addBtnChange(this.btn_preview);
            this.addBtnChange(this.btn_next);
        };
        RankList.prototype.onTouchBeginChange = function (e) {
            this._touchButton = e.currentTarget;
            var scale = this._originScale - 0.1;
            this._touchButton.scaleX = this._touchButton.scaleY = scale;
        };
        RankList.prototype.onTouchEndChange = function (e) {
            if (e.currentTarget != this._touchButton) {
            }
            if (null != this._touchButton) {
                var scale = this._originScale;
                this._touchButton.scaleX = this._touchButton.scaleY = scale;
            }
            this._touchButton = null;
        };
        Object.defineProperty(RankList.prototype, "status", {
            get: function () {
                if (this.btn_toggle) {
                    return this.btn_toggle.status;
                }
                else {
                    return 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        RankList.prototype.postWeekWin = function () {
            if (this._totalGroup.length > 0) {
                var user = managers.FrameManager.getInstance().m_GlobalUserItem;
                if (user) {
                    this.postWinMessage(user.dwUserID);
                }
            }
        };
        RankList.prototype.closeFriendRank = function () {
            this._main.onCloseFriend();
            var status = this.btn_toggle.status;
            if (this._totalGroup.length > 0) {
                if (status == 1) {
                    var startId = this._page * RankList.perPageMaxNum;
                    this._currentGroup = this._totalGroup.slice(startId, startId + RankList.perPageMaxNum);
                    this.showRankByGroup(this._currentGroup);
                    if (this.rank_page) {
                        this.rank_page.visible = true;
                        this.rank_page.text = this._page + 1 + " / " + this._totalPage;
                    }
                }
                // this.openEuiRank();
            }
        };
        RankList.prototype.closeFriendRankAndUpdate = function () {
            this._main.onCloseFriend();
            // this.btn_toggle.requestData().then(data => {
            //     //更新数据
            //     this.showByData(data);
            // })
            this.openEuiRank();
        };
        //每次打开排行榜时，进行数据请求
        //点击世界只显示上一次的排行
        RankList.prototype.updateWorldData = function () {
            var _this = this;
            this.btn_toggle.requestData().then(function (data) {
                if (_this.btn_toggle.status == 0) {
                    _this._totalGroup = data;
                    _this._totalPage = Math.ceil(data.length / RankList.perPageMaxNum);
                }
                else {
                    _this.showByData(data);
                }
                _this.postWeekWin();
            });
        };
        RankList.prototype.openFriendRank = function () {
            this._main.openFriendRank();
            this.closeEuiRank();
        };
        RankList.prototype.closeEuiRank = function () {
            for (var n = 0; n < 6; n++) {
                this["user_" + n].visible = false;
            }
            this.rank_page.visible = false;
        };
        RankList.prototype.postWinMessage = function (userID) {
            //查询totalGroup中是否存在，否则传入0
            //要考虑如果rankValue是gold情况下吗
            var weekWin = 0;
            var weekCount = 0;
            for (var n = 0; n < this._totalGroup.length; n++) {
                if (this._totalGroup[n].userID == userID) {
                    weekWin = this._totalGroup[n].score;
                    weekCount = this._totalGroup[n].rankValue;
                    break;
                }
            }
            platform.openDataContext.postMessage({
                command: "save",
                gold: weekWin,
                userId: userID,
                win: weekCount
            });
        };
        RankList.prototype.openEuiRank = function () {
            for (var n = 0; n < 6; n++) {
                this["user_" + n].visible = true;
            }
            this.rank_page.visible = true;
        };
        RankList.prototype.showByData = function (data) {
            var startId = this._page * RankList.perPageMaxNum;
            this._totalGroup = data;
            this._currentGroup = data.slice(startId, startId + RankList.perPageMaxNum);
            this._totalPage = Math.ceil(data.length / RankList.perPageMaxNum);
            this.showRankByGroup(this._currentGroup);
            //显示页数
            if (this.rank_page) {
                this.rank_page.visible = true;
                this.rank_page.text = this._page + 1 + " / " + this._totalPage;
            }
        };
        RankList.prototype.showRankByGroup = function (data) {
            var _this = this;
            data.forEach(function (user, index) {
                _this.showByEachData(user, index);
            });
            if (data.length < 6) {
                for (var n = data.length; n < 6; n++) {
                    this["user_" + n].visible = false;
                }
            }
        };
        //
        //{rankID: 1, userID: 9000, nickName: "走过了人来人往", faceUrl: "", rankValue: 5, …}
        RankList.prototype.showByEachData = function (data, index) {
            this["user_" + index].visible = true;
            var text = this.getKeyText(data.rankID);
            var rate = data.rankID.toString().length >= 2 ? 0.5 : 1;
            this["rank_key_" + index].scaleX = rate;
            this["rank_key_" + index].scaleY = rate;
            this["rank_key_" + index].text = text;
            utils.setAnchorCenter(this["rank_key_" + index]);
            this["user_head_" + index].mask = this["head_mask_" + index];
            var faceUrl = "";
            if (data.faceUrl.length == 0) {
                faceUrl = RES.getRes("default_head_png");
            }
            else {
                faceUrl = data.faceUrl;
            }
            this["user_head_" + index].source = faceUrl;
            // let name = data.nickName.slice(0, 4) + "...";
            // nickName = nickName.slice(0, 4) + "...";
            // name = name + "...";
            this["nick_name_" + index].text = data.nickName;
            if ((this["nick_name_" + index]).width >= 130) {
                var nickName = data.nickName.slice(0, 4) + "...";
                (this["nick_name_" + index]).text = nickName;
            }
            this["rank_win_" + index].text = data.rankValue;
            utils.setAnchorCenter(this["rank_win_" + index]);
            var gold = this.getGoldText(data.score);
            // console.log("财富:", gold);
            this["rank_gold_" + index].text = gold;
            utils.setAnchorCenter(this["rank_gold_" + index]);
        };
        RankList.prototype.getKeyText = function (key) {
            var text = "";
            if (key < 4) {
                switch (key) {
                    case 1: {
                        text += "f";
                        break;
                    }
                    case 2: {
                        text += "s";
                        break;
                    }
                    case 3: {
                        text += "t";
                        break;
                    }
                }
            }
            else {
                text += key;
            }
            return text;
        };
        RankList.prototype.getGoldText = function (gold) {
            var text = "";
            if (gold === undefined)
                gold = 0;
            if (gold < 0)
                return;
            var imgUrl = [];
            var str = this.transformFromScore(gold);
            for (var n = 0; n < str.length; n++) {
                if (str[n] == ".") {
                    text += "-";
                }
                else if (str[n] == "w") {
                    text += "w";
                }
                else {
                    text += str[n];
                }
            }
            return text;
        };
        RankList.prototype.transformFromScore = function (score) {
            var back = "";
            if (score >= 10000) {
                var front = Math.floor(score / 10000).toString();
                if (front.length < 4) {
                    back += front + ".";
                    var behindLength = 4 - front.length; //后面的位数
                    var behindCount = (Math.floor(score % 10000) / 10000);
                    for (var n = 0; n < behindLength; n++) {
                        back += Math.floor(behindCount * 10);
                        behindCount = behindCount * 10 - Math.floor(behindCount * 10);
                    }
                    back = back + "w";
                }
                else {
                    back = front + "w";
                }
            }
            else {
                back += Math.floor(score);
            }
            return back;
        };
        RankList.prototype.onPre = function () {
            var status = this.btn_toggle.status;
            if (status == 1) {
                if (this._page > 0) {
                    this._page -= 1;
                    var startId = this._page * RankList.perPageMaxNum;
                    this._currentGroup = this._totalGroup.slice(startId, startId + RankList.perPageMaxNum);
                    this.showRankByGroup(this._currentGroup);
                    if (this.rank_page) {
                        this.rank_page.visible = true;
                        this.rank_page.text = this._page + 1 + " / " + this._totalPage;
                    }
                }
            }
            else {
                platform.openDataContext.postMessage({
                    command: "pre"
                });
            }
        };
        RankList.prototype.onNext = function () {
            var status = this.btn_toggle.status;
            if (status == 1) {
                if (this._page < this._totalPage - 1) {
                    this._page += 1;
                    var startId = this._page * RankList.perPageMaxNum;
                    this._currentGroup = this._totalGroup.slice(startId, startId + RankList.perPageMaxNum);
                    this.showRankByGroup(this._currentGroup);
                    if (this.rank_page) {
                        this.rank_page.visible = true;
                        this.rank_page.text = this._page + 1 + " / " + this._totalPage;
                    }
                }
            }
            else {
                platform.openDataContext.postMessage({
                    command: "next"
                });
            }
        };
        RankList.prototype.onClose = function () {
            if (this._closeFunc) {
                this._closeFunc();
            }
        };
        RankList.prototype.adjustComponent = function () {
            this._adjustComponent.push(this.rank);
            this._scaleComponent.push(this.rank);
            console.log("%cRANK：", "color: red; font-size: 2em");
            console.log("比率:", game.RATE);
            console.log("转换前:", this.rank.y, this.rank.height, this.rank.scaleX);
            console.log(this._adjustComponent);
            this._adjustComponent.forEach(function (component) {
                component.y = component.y * game.RATE;
            });
            this._scaleComponent.forEach(function (component) {
                component.scaleX = component.scaleY = game.RATE;
            });
            console.log("转换后:", this.rank.y, this.rank.height, this.rank.scaleX, this.rank.height * this.rank.scaleX);
        };
        RankList.perPageMaxNum = 6;
        return RankList;
    }(base.BaseComponent));
    game.RankList = RankList;
    __reflect(RankList.prototype, "game.RankList");
})(game || (game = {}));
