namespace game {
    import GameConst = utils.GameConst;
    const POKER_CONFIG = [{
        x: 322,
        y: 10,
        off: 35
    },{
        x: 272 - 4 * 35,//272
        y: 0,
        off: 35
    },{
        x: 21 + 3 * 35,//21
        y: 0,
        off: 35
    }];

    const YELLOW = 0xe8b429;
    const GREEN = 0x00dd8a;

    export class GameOverLayer extends eui.Component {

        public game_scene_mask:eui.Rect;
        public result_cards_container_0:eui.Group;
        public result_cards_container_2:eui.Group;
        public poker_0:eui.Image;
        public result_cards_container_1:eui.Group;
        public poker_1:eui.Image;
        public group_result:eui.Group;
        public border_bg:eui.Image;
        public bg_top:eui.Image;
        public fnt_win_con:eui.BitmapLabel;
        public img_win_top_con:eui.Image;
        public img_lose_top:eui.Image;
        public user_0:eui.Group;
        public img_current_win:eui.Image;
        public nick_name_0:eui.Label;
        public fnt_result_score_0:eui.BitmapLabel;
        public img_shuying:eui.Image;
        public fnt_zhang_0:eui.BitmapLabel;
        public user_1:eui.Group;
        public img_user_bg_1:eui.Image;
        public nick_name_1:eui.Label;
        public result_score_1:eui.Label;
        public img_shuying_1:eui.Image;
        public user_2:eui.Group;
        public img_user_bg_2:eui.Image;
        public nick_name_2:eui.Label;
        public result_score_2:eui.Label;
        public img_shuying_2:eui.Image;
        public btn_close:eui.Button;
        public btn_again:eui.Button;



        private _gameEngine: GameEngine;
        constructor(engine: GameEngine) {
            super();
            this._gameEngine = engine;
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        }

        private _onComplete: boolean = false;
        private _actionQueue: any[] = [];
        private onComplete() {
            console.log("结算页面组件初始化完毕");
            this._onComplete = true;
            this.init();
            this.adjustScreen();
            this.beginAction();
        }

        private beginAction() {
            let callBack = this._actionQueue[0] as Function;
            if (callBack != null) {
                callBack();
                this._actionQueue.splice(0, 1);
                this.beginAction();
            }
        }

        private _components: any[] = [];
        private _scaleComponent: any[] = [];

        private adjustScreen() {
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

            this._components.forEach(component => {
                component.y = component.y * RATE;
            });

            // this.btn_again.y = 1161 * RATE + 213;

            if (game.RATE <= 0.9) {
                this.btn_again.y = 1161 * game.RATE + 213 * (game.RATE + 0.1);
                this.btn_again.scaleX = this.btn_again.scaleY = game.RATE + 0.1;
            } else {
                this.btn_again.y = this.btn_again.y * game.RATE;
                this._scaleComponent.push(this.btn_again);
            }

            this._scaleComponent.push(this.group_result);
            this._scaleComponent.push(this.result_cards_container_0);
            this._scaleComponent.push(this.result_cards_container_2);
            this._scaleComponent.push(this.result_cards_container_1);
            this._scaleComponent.forEach(component => {
                component.scaleX = component.scaleY = RATE;
            })
        }

        /**
         * version 1
         * */
        private init() {
            //设置头像遮罩
            // for (let n = 0; n < GameConst.GAME_PLAYER; n++) {
            //     this["user_head_" + n].mask = this["head_mask_" + n];
            // }
            this.initBtn();
        }

        private initBtn() {
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.btn_again.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgain, this);
        }

        /*
        * 生成各个玩家的牌,其中参数都是各自的本地坐标
        * 胜利玩家的牌的scale为0.8，其余为0.6.胜利玩家显示的牌为最后一次出的牌
        * */
        private appearCards(user: any, cards: number[], win: boolean = false) {
            let index = user.index;
            let subLength,direction;
            switch (index) {
                case 0 : {
                    subLength = 0;
                    break;
                }
                case 1 : {
                    subLength = 9;
                    direction = false;
                    break;
                }
                case 2 : {
                    subLength = 9;
                    direction = true;
                    break;
                }
            }
            let scale = 0.6;
            let off = 25;
            this["result_cards_container_" + index].removeChildren();
            if (win) {
                scale = 0.8;
                off = 35;
            }
            cards.forEach((value, index_0) => {
                let poker = new Poker(value, true);
                if (win) {
                    poker.setWinLogo();
                }
                poker.scaleX = poker.scaleY = scale;
                poker.x = POKER_CONFIG[index].x + this.getIndex(index_0, cards.length, subLength, direction) * off;
                if (index_0 >= subLength && subLength != 0) {
                    poker.y = POKER_CONFIG[index].y + 60;
                } else {
                    poker.y = POKER_CONFIG[index].y;
                }
                poker.changeToFront();
                this["result_cards_container_" + index].addChild(poker);
            })
        }

        /*
        * 左右以及中央
        * 索引，总长度，子长度，方向
        * */
        private getIndex(index: number, length: number, subLength: number = 0, direction: boolean = true): number {
            let center;
            if (subLength == 0) {
                center = Math.floor((length - 1) / 2);
                return index - center;
            } else {
                // if (direction) {
                //     return index % subLength;
                // } else {
                    if (length > subLength) {
                        if (index >= subLength) { //第二排
                            let remain = length - subLength;
                            // return (index - subLength + 1) - remain;
                            let center = Math.floor((remain / 2)) - 1;
                            return index - subLength - center;
                        } else { //第一排
                            let center = Math.floor((subLength / 2)) - 1;
                            // return index % subLength - (subLength - 1);
                            return index - center;
                        }
                    } else {
                        // return index - length + 1;
                        let center = Math.floor((subLength / 2)) - 1;
                        return index - center;
                    }
                    // return index % subLength - (subLength - 1);
                // }
            }

        }

        /**==========================按钮事件============================*/
        private onClose() {
            GameEngine.getInstance().onCloseResult();
        }

        private onAgain() {
            GameEngine.getInstance().onCloseResult(true);
        }

        /**======================================================*/

        /**
         * 游戏结束调用接口
         * */
        onGameOver(data: cmd.CMD_S_GameEnd, user: models.UserItem[], lastCards: number[], callBackFun: Function) {
            if (user === undefined || user.length != cmd.GAME_PLAYER) {
                console.log("传入错误玩家数据:", user);
                if (user.length > cmd.GAME_PLAYER) {
                    user = user.slice(0,3);
                } else if (user.length < cmd.GAME_PLAYER) {
                    let num = cmd.GAME_PLAYER - user.length;
                    for (let n = 0; n < num; n++) {
                        //模拟用户填充用户
                        let model = new models.UserItem();
                        model.szNickName = "未获取到昵称";
                        if (user.length == 0) {
                            model.ChairID = 0;
                        } else {
                            model.ChairID = (user[0].ChairID + n) % 3;
                        }
                        user.push(model);
                    }
                }
                // return;
            }

            let user_0: any = {};
            let user_1: any = {};
            let user_2: any = {};
            // let [user_0,user_1,user_2] = [{}, {}, {}];
            for (let n = 0; n < cmd.GAME_PLAYER; n++) {
                let chairId = user[n].ChairID;
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
                        } else {
                            console.log("GameOvenScene:错误的玩家座位", chairId);
                        }
                        // return;
                    }
                }
            }
            let userList: any[] = [user_0, user_1, user_2];

            // let cardLeft : number[] = [];
            let off = 0;
            data.cbCardCount.forEach((count, index) => {
                userList[index].cbCardCount = count;
                // cardLeft.push(Number(count));
            });
            for (let n = 0; n < userList.length; n++) {
                userList[n].cbHandCardData = data.cbHandCardData.slice(off, off + userList[n].cbCardCount);
                if (userList[n].cbHandCardData.length == 0) {
                    userList[n].cbHandCardData = lastCards;
                }
                off += userList[n].cbCardCount;
            }
            let cellScore = data.lCellScore;
            data.lGameScore.forEach((score, index) => {
                userList[index].lGameScore = score;
            });

            for (let n = 0; n < userList.length - 1; n++) {
                for (let m = n + 1; m < userList.length; m++) {
                    let chairID_0 = this._gameEngine.switchViewChairID(userList[n].userItem.ChairID);
                    let chairID_1 = this._gameEngine.switchViewChairID(userList[m].userItem.ChairID);
                    if (chairID_0 > chairID_1) {
                        let temp = userList[n];
                        userList[n] = userList[m];
                        userList[m] = temp;
                    }
                }
            }

            // console.log("%c转换后游戏结束数据", "color: red;font-size: 1.5em");
            // console.log(userList);

            this.drawSceneByData(userList, cellScore, callBackFun);
        }

        private _continueWinCount: number = 0;

        private queryMyInfo(): Promise<any> {
            return new Promise((resolve, reject) => {
                let params = GameEngine.getInstance().getCheckInfoParams();
                params = "?" + params;
                let httpURL: string = CHECK_IN_HOST + USER_SCORE_RANK;
                let httpRequest = new utils.HttpRequest();//egret.HttpResponseType.ARRAY_BUFFER
                let callBack = (evt?) => {
                    if (evt) {
                        let request = <egret.HttpRequest>evt.currentTarget;
                        let data = JSON.parse(request.response);
                        if (data.codeID == 0) {
                            let my = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
                            let ifCheck = true;
                            data.payload.forEach(user => {
                                if (my == user.userID) {
                                    resolve(user);
                                    // return;
                                    ifCheck = false;
                                }
                            });
                            if (ifCheck) {
                                reject()
                            }
                        } else if (data.codeID == 1005) {
                            reject();
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

        private drawSceneByData(userList: any[], cellScore: number, callBackFun: Function) {
            //判断第一个玩家是否赢
            if (userList[0].cbCardCount == 0) {
                this._continueWinCount++;
                this.queryMyInfo().then(data => {
                    console.log(data);
                    platform.openDataContext.postMessage({
                        command: "add",
                        nickName: GameEngine.getInstance().userInfo.nickName,
                        continue_count: this._continueWinCount,
                        gold: data.score,
                        userId: data.userID,
                        count: data.rankValue
                    })
                })
            } else {
                this.queryMyInfo().then(data => {
                    console.log(data);
                    platform.openDataContext.postMessage({
                        command: "lose",
                        nickName: GameEngine.getInstance().userInfo.nickName,
                        gold: data.score,
                        userId: data.userID,
                        count: data.rankValue
                    });
                });

                this._continueWinCount = 0;
            }
            // utils.GameConst.colorConsole("输赢：");
            // console.log(userList[0]);

            let self = this;
            let callBack = () => {
                let cardLength = 0;
                for (let n = 0; n < userList.length; n++) {
                    cardLength += userList[n].cbCardCount;
                }
                for (let n = 0; n < userList.length; n++) {
                    self.drawUser(n, userList[n], cardLength);
                }
                // self.cell_score.text = cellScore + "";//设置底分
                // utils.setAnchorCenter(this.cell_score);
                callBackFun();
            };
            if (this._onComplete) {
                callBack();
            } else {
                this._actionQueue.push(callBack);
            }
        }

        private drawUser(index: number, user: any, winCards?: number) {
            let win = user.cbCardCount == 0 ? true : false;
            let front = "";
            if (index == 0) {
                if (win) { //当前玩家赢 字体:fnt_over_win_fnt;
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
                } else { //当前玩家输
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
                } else {
                    // (<eui.Label>this["result_score_" + index]).textColor = GREEN;
                    this.fnt_result_score_0.font = RES.getRes("fnt_over_lose_fnt");
                }
                //=================================转化为千分制
                this.fnt_result_score_0.text = front + user.lGameScore;

            } else {
                let resource = win ? "over_text_ying_png" : "over_text_shu_png" ;
                let bg = win ? "over_win_player_" + index + "_png" : "over_lose_player_" + index + "_png";
                (<eui.Image>this["img_user_bg_" + index]).source = RES.getRes(bg);
                (<eui.Image>this["img_shuying_" + index]).source = RES.getRes(resource);
                if (user.lGameScore > 0) {
                    (<eui.Label>this["result_score_" + index]).textColor = YELLOW;
                    front = "+";
                } else {
                    (<eui.Label>this["result_score_" + index]).textColor = GREEN;
                }
                (<eui.Label>this["result_score_" + index]).text = front + user.lGameScore;
                utils.setAnchorLeftMid(this["result_score_" + index]);
            }


            let nickName = user.userItem.szNickName; //nick_name_1
            (<eui.Label>this["nick_name_" + index]).text = user.userItem.szNickName;
            // let front = "";
            if (index != 0) {
                if ((<eui.Label>(this["nick_name_" + index])).width >= 216 ) {
                    nickName = nickName.slice(0, 4) + "...";
                    (<eui.Label>(this["nick_name_" + index])).text = nickName;
                }
            }
            utils.setAnchorCenter(this["nick_name_" + index]);


            let appearUser = {
                index: index
            };
            this.appearCards(appearUser, user.cbHandCardData, win);
        }

        private showUser(index: number, user: any) {
            (<eui.Image>this["user_head_" + index]).source = user.userItem.szHeadURL;
            let name = user.userItem.szNickName;
            (<eui.Label>this["nick_name_" + index]).text = user.userItem.szNickName;
            if ((<eui.Label>this["nick_name_" + index]).width >= 84) {
                let nickName = user.userItem.szNickName.slice(0,3) + "...";
                (<eui.Label>this["nick_name_" + index]).text = nickName;
            }
            (<eui.BitmapLabel>this["left_cards_" + index]).text = user.cbCardCount;
            utils.setAnchorCenter(this["left_cards_" + index]);
            (<eui.BitmapLabel>this["bomb_count_" + index]).text = user.wBombCount;
            utils.setAnchorCenter(this["bomb_count_" + index]);
            (<eui.BitmapLabel>this["bomb_fail_" + index]).text = user.wBombLose;
            utils.setAnchorCenter(this["bomb_count_" + index]);
            let front = "";
            if (user.lGameScore > 0) {
                (<eui.Label>this["result_score_" + index]).textColor = YELLOW;
                front = "+";
            } else {
                (<eui.Label>this["result_score_" + index]).textColor = GREEN;
            }
            (<eui.Label>this["result_score_" + index]).text = front + user.lGameScore;
            let win = user.cbCardCount == 0 ? true : false;
            let appearUser = {
                index: index
            };
            this.appearCards(appearUser, user.cbHandCardData, win);
        }
    }
}