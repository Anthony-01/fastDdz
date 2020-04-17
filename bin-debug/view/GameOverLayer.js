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
    var POKER_CONFIG = [{
            x: 322,
            y: 10,
            off: 35
        }, {
            x: 272 - 4 * 35,
            y: 0,
            off: 35
        }, {
            x: 21 + 3 * 35,
            y: 0,
            off: 35
        }];
    var YELLOW = 0xe8b429;
    var GREEN = 0x00dd8a;
    var GameOverLayer = (function (_super) {
        __extends(GameOverLayer, _super);
        function GameOverLayer(engine) {
            var _this = _super.call(this) || this;
            _this._onComplete = false;
            _this._actionQueue = [];
            _this._components = [];
            _this._scaleComponent = [];
            _this._continueWinCount = 0;
            _this._gameEngine = engine;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            return _this;
        }
        GameOverLayer.prototype.onComplete = function () {
            console.log("结算页面组件初始化完毕");
            this._onComplete = true;
            this.init();
            this.adjustScreen();
            this.beginAction();
        };
        GameOverLayer.prototype.beginAction = function () {
            var callBack = this._actionQueue[0];
            if (callBack != null) {
                callBack();
                this._actionQueue.splice(0, 1);
                this.beginAction();
            }
        };
        GameOverLayer.prototype.adjustScreen = function () {
            this._components.push(this.group_result);
            // this._components.push(this.cell_score);
            // this._components.push(this.user_0);
            // this._components.push(this.user_head_0);
            // this._components.push(this.head_mask_0);
            // this._components.push(this.nick_name_0);
            // this._components.push(this.left_cards_0);
            // this._components.push(this.bomb_count_0);
            // this._components.push(this.result_score_0);
            // this._components.push(this.user_1);
            // this._components.push(this.user_head_1);
            // this._components.push(this.head_mask_1);
            // this._components.push(this.nick_name_1);
            // this._components.push(this.left_cards_1);
            // this._components.push(this.bomb_count_1);
            // this._components.push(this.result_score_1);
            // this._components.push(this.user_2);
            // this._components.push(this.user_head_2);
            // this._components.push(this.head_mask_2);
            // this._components.push(this.nick_name_2);
            // this._components.push(this.left_cards_2);
            // this._components.push(this.bomb_count_2);
            // this._components.push(this.result_score_2);
            this._components.push(this.result_cards_container_0);
            this._components.push(this.result_cards_container_2);
            // this._components.push(this.poker_01);
            this._components.push(this.result_cards_container_1);
            // this._components.push(this.poker_0);
            // this._components.push(this.btn_close);
            // this._components.push(this.btn_again);
            this._components.forEach(function (component) {
                component.y = component.y * game.RATE;
            });
            // this.btn_again.y = 1161 * RATE + 213;
            if (game.RATE <= 0.9) {
                this.btn_again.y = 1161 * game.RATE + 213 * (game.RATE + 0.1);
                this.btn_again.scaleX = this.btn_again.scaleY = game.RATE + 0.1;
            }
            else {
                this.btn_again.y = this.btn_again.y * game.RATE;
                this._scaleComponent.push(this.btn_again);
            }
            this._scaleComponent.push(this.group_result);
            this._scaleComponent.push(this.result_cards_container_0);
            this._scaleComponent.push(this.result_cards_container_2);
            this._scaleComponent.push(this.result_cards_container_1);
            this._scaleComponent.forEach(function (component) {
                component.scaleX = component.scaleY = game.RATE;
            });
        };
        /**
         * version 1
         * */
        GameOverLayer.prototype.init = function () {
            //设置头像遮罩
            // for (let n = 0; n < GameConst.GAME_PLAYER; n++) {
            //     this["user_head_" + n].mask = this["head_mask_" + n];
            // }
            this.initBtn();
        };
        GameOverLayer.prototype.initBtn = function () {
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.btn_again.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgain, this);
        };
        /*
        * 生成各个玩家的牌,其中参数都是各自的本地坐标
        * 胜利玩家的牌的scale为0.8，其余为0.6.胜利玩家显示的牌为最后一次出的牌
        * */
        GameOverLayer.prototype.appearCards = function (user, cards, win) {
            var _this = this;
            if (win === void 0) { win = false; }
            var index = user.index;
            var subLength, direction;
            switch (index) {
                case 0: {
                    subLength = 0;
                    break;
                }
                case 1: {
                    subLength = 9;
                    direction = false;
                    break;
                }
                case 2: {
                    subLength = 9;
                    direction = true;
                    break;
                }
            }
            var scale = 0.6;
            var off = 25;
            this["result_cards_container_" + index].removeChildren();
            if (win) {
                scale = 0.8;
                off = 35;
            }
            cards.forEach(function (value, index_0) {
                var poker = new game.Poker(value, true);
                if (win) {
                    poker.setWinLogo();
                }
                poker.scaleX = poker.scaleY = scale;
                poker.x = POKER_CONFIG[index].x + _this.getIndex(index_0, cards.length, subLength, direction) * off;
                if (index_0 >= subLength && subLength != 0) {
                    poker.y = POKER_CONFIG[index].y + 60;
                }
                else {
                    poker.y = POKER_CONFIG[index].y;
                }
                poker.changeToFront();
                _this["result_cards_container_" + index].addChild(poker);
            });
        };
        /*
        * 左右以及中央
        * 索引，总长度，子长度，方向
        * */
        GameOverLayer.prototype.getIndex = function (index, length, subLength, direction) {
            if (subLength === void 0) { subLength = 0; }
            if (direction === void 0) { direction = true; }
            var center;
            if (subLength == 0) {
                center = Math.floor((length - 1) / 2);
                return index - center;
            }
            else {
                // if (direction) {
                //     return index % subLength;
                // } else {
                if (length > subLength) {
                    if (index >= subLength) {
                        var remain = length - subLength;
                        // return (index - subLength + 1) - remain;
                        var center_1 = Math.floor((remain / 2)) - 1;
                        return index - subLength - center_1;
                    }
                    else {
                        var center_2 = Math.floor((subLength / 2)) - 1;
                        // return index % subLength - (subLength - 1);
                        return index - center_2;
                    }
                }
                else {
                    // return index - length + 1;
                    var center_3 = Math.floor((subLength / 2)) - 1;
                    return index - center_3;
                }
                // return index % subLength - (subLength - 1);
                // }
            }
        };
        /**==========================按钮事件============================*/
        GameOverLayer.prototype.onClose = function () {
            game.GameEngine.getInstance().onCloseResult();
        };
        GameOverLayer.prototype.onAgain = function () {
            game.GameEngine.getInstance().onCloseResult(true);
        };
        /**======================================================*/
        /**
         * 游戏结束调用接口
         * */
        GameOverLayer.prototype.onGameOver = function (data, user, lastCards, callBackFun) {
            if (user === undefined || user.length != cmd.GAME_PLAYER) {
                console.log("传入错误玩家数据:", user);
                if (user.length > cmd.GAME_PLAYER) {
                    user = user.slice(0, 3);
                }
                else if (user.length < cmd.GAME_PLAYER) {
                    var num = cmd.GAME_PLAYER - user.length;
                    for (var n = 0; n < num; n++) {
                        //模拟用户填充用户
                        var model = new models.UserItem();
                        model.szNickName = "未获取到昵称";
                        if (user.length == 0) {
                            model.ChairID = 0;
                        }
                        else {
                            model.ChairID = (user[0].ChairID + n) % 3;
                        }
                        user.push(model);
                    }
                }
                // return;
            }
            var user_0 = {};
            var user_1 = {};
            var user_2 = {};
            // let [user_0,user_1,user_2] = [{}, {}, {}];
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                var chairId = user[n].ChairID;
                switch (chairId) {
                    case 0: {
                        user_0.userItem = user[n];
                        break;
                    }
                    case 1: {
                        user_1.userItem = user[n];
                        break;
                    }
                    case 2: {
                        user_2.userItem = user[n];
                        break;
                    }
                    default: {
                        if (user[n].dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                            user_0.userItem = user[n];
                        }
                        else {
                            console.log("GameOvenScene:错误的玩家座位", chairId);
                        }
                        // return;
                    }
                }
            }
            var userList = [user_0, user_1, user_2];
            // let cardLeft : number[] = [];
            var off = 0;
            data.cbCardCount.forEach(function (count, index) {
                userList[index].cbCardCount = count;
                // cardLeft.push(Number(count));
            });
            for (var n = 0; n < userList.length; n++) {
                userList[n].cbHandCardData = data.cbHandCardData.slice(off, off + userList[n].cbCardCount);
                if (userList[n].cbHandCardData.length == 0) {
                    userList[n].cbHandCardData = lastCards;
                }
                off += userList[n].cbCardCount;
            }
            var cellScore = data.lCellScore;
            data.lGameScore.forEach(function (score, index) {
                userList[index].lGameScore = score;
            });
            for (var n = 0; n < userList.length - 1; n++) {
                for (var m = n + 1; m < userList.length; m++) {
                    var chairID_0 = this._gameEngine.switchViewChairID(userList[n].userItem.ChairID);
                    var chairID_1 = this._gameEngine.switchViewChairID(userList[m].userItem.ChairID);
                    if (chairID_0 > chairID_1) {
                        var temp = userList[n];
                        userList[n] = userList[m];
                        userList[m] = temp;
                    }
                }
            }
            // console.log("%c转换后游戏结束数据", "color: red;font-size: 1.5em");
            // console.log(userList);
            this.drawSceneByData(userList, cellScore, callBackFun);
        };
        GameOverLayer.prototype.queryMyInfo = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var params = game.GameEngine.getInstance().getCheckInfoParams();
                params = "?" + params;
                var httpURL = game.CHECK_IN_HOST + game.USER_SCORE_RANK;
                var httpRequest = new utils.HttpRequest(); //egret.HttpResponseType.ARRAY_BUFFER
                var callBack = function (evt) {
                    if (evt) {
                        var request = evt.currentTarget;
                        var data = JSON.parse(request.response);
                        if (data.codeID == 0) {
                            var my_1 = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
                            var ifCheck_1 = true;
                            data.payload.forEach(function (user) {
                                if (my_1 == user.userID) {
                                    resolve(user);
                                    // return;
                                    ifCheck_1 = false;
                                }
                            });
                            if (ifCheck_1) {
                                reject();
                            }
                        }
                        else if (data.codeID == 1005) {
                            reject();
                        }
                    }
                };
                var errorBack = function (msg) {
                    if (msg) {
                        console.log(msg);
                    }
                    reject(msg);
                };
                httpRequest.initHttpRequest(_this, httpURL, params, egret.HttpMethod.GET, callBack, errorBack);
            });
        };
        GameOverLayer.prototype.drawSceneByData = function (userList, cellScore, callBackFun) {
            var _this = this;
            //判断第一个玩家是否赢
            if (userList[0].cbCardCount == 0) {
                this._continueWinCount++;
                this.queryMyInfo().then(function (data) {
                    console.log(data);
                    platform.openDataContext.postMessage({
                        command: "add",
                        nickName: game.GameEngine.getInstance().userInfo.nickName,
                        continue_count: _this._continueWinCount,
                        gold: data.score,
                        userId: data.userID,
                        count: data.rankValue
                    });
                });
            }
            else {
                this.queryMyInfo().then(function (data) {
                    console.log(data);
                    platform.openDataContext.postMessage({
                        command: "lose",
                        nickName: game.GameEngine.getInstance().userInfo.nickName,
                        gold: data.score,
                        userId: data.userID,
                        count: data.rankValue
                    });
                });
                this._continueWinCount = 0;
            }
            // utils.GameConst.colorConsole("输赢：");
            // console.log(userList[0]);
            var self = this;
            var callBack = function () {
                var cardLength = 0;
                for (var n = 0; n < userList.length; n++) {
                    cardLength += userList[n].cbCardCount;
                }
                for (var n = 0; n < userList.length; n++) {
                    self.drawUser(n, userList[n], cardLength);
                }
                // self.cell_score.text = cellScore + "";//设置底分
                // utils.setAnchorCenter(this.cell_score);
                callBackFun();
            };
            if (this._onComplete) {
                callBack();
            }
            else {
                this._actionQueue.push(callBack);
            }
        };
        GameOverLayer.prototype.drawUser = function (index, user, winCards) {
            var win = user.cbCardCount == 0 ? true : false;
            var front = "";
            if (index == 0) {
                if (win) {
                    this.border_bg.source = RES.getRes("over_win_bg_png");
                    this.bg_top.source = RES.getRes("over_win_top_png");
                    this.img_shuying.source = RES.getRes("over_text_yingpai_png");
                    this.fnt_win_con.visible = true;
                    this.fnt_win_con.text = this._continueWinCount + "";
                    this.img_win_top_con.visible = true;
                    this.img_lose_top.visible = false;
                    // this.img_current_win.visible = true;
                    this.fnt_zhang_0.text = winCards + "";
                    utils.setAnchorCenter(this.fnt_zhang_0);
                }
                else {
                    this.border_bg.source = RES.getRes("over_lose_bg_png");
                    this.bg_top.source = RES.getRes("over_lose_top_png");
                    this.img_shuying.source = RES.getRes("over_text_shupai_png");
                    this.fnt_win_con.visible = false;
                    this.img_win_top_con.visible = false;
                    this.img_lose_top.visible = true;
                    // this.img_current_win.visible = false;
                    this.fnt_zhang_0.text = user.cbCardCount + "";
                    utils.setAnchorCenter(this.fnt_zhang_0);
                }
                if (user.lGameScore > 0) {
                    // (<eui.Label>this["result_score_" + index]).textColor = YELLOW;
                    this.fnt_result_score_0.font = RES.getRes("fnt_over_win_fnt");
                    front = "+";
                }
                else {
                    // (<eui.Label>this["result_score_" + index]).textColor = GREEN;
                    this.fnt_result_score_0.font = RES.getRes("fnt_over_lose_fnt");
                }
                //=================================转化为千分制
                this.fnt_result_score_0.text = front + user.lGameScore;
            }
            else {
                var resource = win ? "over_text_ying_png" : "over_text_shu_png";
                var bg = win ? "over_win_player_" + index + "_png" : "over_lose_player_" + index + "_png";
                this["img_user_bg_" + index].source = RES.getRes(bg);
                this["img_shuying_" + index].source = RES.getRes(resource);
                if (user.lGameScore > 0) {
                    this["result_score_" + index].textColor = YELLOW;
                    front = "+";
                }
                else {
                    this["result_score_" + index].textColor = GREEN;
                }
                this["result_score_" + index].text = front + user.lGameScore;
                utils.setAnchorLeftMid(this["result_score_" + index]);
            }
            var nickName = user.userItem.szNickName; //nick_name_1
            this["nick_name_" + index].text = user.userItem.szNickName;
            // let front = "";
            if (index != 0) {
                if ((this["nick_name_" + index]).width >= 216) {
                    nickName = nickName.slice(0, 4) + "...";
                    (this["nick_name_" + index]).text = nickName;
                }
            }
            utils.setAnchorCenter(this["nick_name_" + index]);
            var appearUser = {
                index: index
            };
            this.appearCards(appearUser, user.cbHandCardData, win);
        };
        GameOverLayer.prototype.showUser = function (index, user) {
            this["user_head_" + index].source = user.userItem.szHeadURL;
            var name = user.userItem.szNickName;
            this["nick_name_" + index].text = user.userItem.szNickName;
            if (this["nick_name_" + index].width >= 84) {
                var nickName = user.userItem.szNickName.slice(0, 3) + "...";
                this["nick_name_" + index].text = nickName;
            }
            this["left_cards_" + index].text = user.cbCardCount;
            utils.setAnchorCenter(this["left_cards_" + index]);
            this["bomb_count_" + index].text = user.wBombCount;
            utils.setAnchorCenter(this["bomb_count_" + index]);
            this["bomb_fail_" + index].text = user.wBombLose;
            utils.setAnchorCenter(this["bomb_count_" + index]);
            var front = "";
            if (user.lGameScore > 0) {
                this["result_score_" + index].textColor = YELLOW;
                front = "+";
            }
            else {
                this["result_score_" + index].textColor = GREEN;
            }
            this["result_score_" + index].text = front + user.lGameScore;
            var win = user.cbCardCount == 0 ? true : false;
            var appearUser = {
                index: index
            };
            this.appearCards(appearUser, user.cbHandCardData, win);
        };
        return GameOverLayer;
    }(eui.Component));
    game.GameOverLayer = GameOverLayer;
    __reflect(GameOverLayer.prototype, "game.GameOverLayer");
})(game || (game = {}));
