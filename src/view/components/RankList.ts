namespace game {

    export class RankList extends base.BaseComponent {

        public rank:eui.Group;
        public btn_close:eui.Button;
        public btn_preview:eui.Button;
        public btn_next:eui.Button;
        public rank_toggle: game.RankToggle;
        public rank_page: eui.Label;

        private _main: StartGameLayer;

        private _closeFunc: Function = null;
        constructor(main: StartGameLayer, close: Function) {
            super();
            this._main = main;
            this._closeFunc = close;
        }

        private btn_toggle: RankToggle;

        protected onComplete() {
            this.btn_toggle = new RankToggle(this);
            this.btn_toggle.x = 42;
            this.btn_toggle.y = 132;
            this.rank.addChild(this.btn_toggle);
            this.btn_toggle.visible = false;
            super.onComplete();
        }

        private _originScale: number;
        protected initBtn() {
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
            this.btn_preview.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPre, this);
            this.btn_next.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNext, this);

            this._originScale = this.btn_preview.scaleX;
            this.addBtnChange(this.btn_preview);
            this.addBtnChange(this.btn_next);
        }

        public onTouchBeginChange(e: egret.TouchEvent) {
            this._touchButton = e.currentTarget;
            let scale = this._originScale - 0.1;
            this._touchButton.scaleX = this._touchButton.scaleY = scale;
        }

        public onTouchEndChange(e: egret.TouchEvent) {
            if (e.currentTarget != this._touchButton) {
            }
            if (null != this._touchButton) {
                let scale = this._originScale;
                this._touchButton.scaleX = this._touchButton.scaleY = scale;
            }
            this._touchButton = null;
        }

        get status() {
            if (this.btn_toggle) {
                return this.btn_toggle.status;
            } else {
                return 0;
            }
        }

        public postWeekWin() {
            if (this._totalGroup.length > 0) { //已经请求了的情况下
                let user = managers.FrameManager.getInstance().m_GlobalUserItem;
                if (user) {
                    this.postWinMessage(user.dwUserID);
                }
            }
        }

        public closeFriendRank() {
            this._main.onCloseFriend();
            let status = this.btn_toggle.status;
            if (this._totalGroup.length > 0) {
                if (status == 1) {
                    let startId = this._page * RankList.perPageMaxNum;
                    this._currentGroup = this._totalGroup.slice(startId, startId + RankList.perPageMaxNum);
                    this.showRankByGroup(this._currentGroup);
                    if (this.rank_page) {
                        this.rank_page.visible = true;
                        this.rank_page.text = `${this._page + 1} / ${this._totalPage}`;
                    }
                }
                // this.openEuiRank();
            }
        }

        public closeFriendRankAndUpdate() {
            this._main.onCloseFriend();
            // this.btn_toggle.requestData().then(data => {
            //     //更新数据
            //     this.showByData(data);
            // })
            this.openEuiRank();

        }

        //每次打开排行榜时，进行数据请求
        //点击世界只显示上一次的排行
        public updateWorldData() {
            this.btn_toggle.requestData().then(data => {
                if (this.btn_toggle.status == 0) {
                    this._totalGroup = data;
                    this._totalPage = Math.ceil(data.length / RankList.perPageMaxNum);
                } else {
                    this.showByData(data);
                }
                this.postWeekWin();
            })
        }



        public openFriendRank() {
            this._main.openFriendRank();
            this.closeEuiRank();
        }

        private closeEuiRank() {
            for (let n = 0; n < 6; n++) {
                this["user_" + n].visible = false;
            }
            this.rank_page.visible = false;
        }

        public postWinMessage(userID: number) {
            //查询totalGroup中是否存在，否则传入0
            //要考虑如果rankValue是gold情况下吗
            let weekWin = 0;
            let weekCount = 0;
            for (let n = 0; n < this._totalGroup.length; n++) {
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
            })
        }

        private openEuiRank() {
            for (let n = 0; n < 6; n++) {
                this["user_" + n].visible = true;
            }
            this.rank_page.visible = true;
        }

        //世界排行榜
        private _page: number = 0;
        private _totalPage: number = 0;
        private static perPageMaxNum = 6;
        private _currentGroup: any[];
        private _totalGroup: any[] = [];

        public showByData(data: any[]) {
            let startId = this._page * RankList.perPageMaxNum;
            this._totalGroup = data;
            this._currentGroup = data.slice(startId, startId + RankList.perPageMaxNum);
            this._totalPage = Math.ceil(data.length / RankList.perPageMaxNum);
            this.showRankByGroup(this._currentGroup);
            //显示页数
            if (this.rank_page) {
                this.rank_page.visible = true;
                this.rank_page.text = `${this._page + 1} / ${this._totalPage}`;
            }

        }

        private showRankByGroup(data: any[]) {
            data.forEach((user, index) => {
                this.showByEachData(user, index);
            });
            if (data.length < 6) {
                for (let n = data.length; n < 6; n++) {
                    this["user_" + n].visible = false;
                }
            }
        }

        //
        //{rankID: 1, userID: 9000, nickName: "走过了人来人往", faceUrl: "", rankValue: 5, …}
        private showByEachData(data: any, index: number) {
            this["user_" + index].visible = true;
            let text = this.getKeyText(data.rankID);
            let rate = data.rankID.toString().length >= 2 ? 0.5 : 1;
            (<eui.BitmapLabel>this["rank_key_" + index]).scaleX = rate;
            (<eui.BitmapLabel>this["rank_key_" + index]).scaleY = rate;
            (<eui.BitmapLabel>this["rank_key_" + index]).text = text;
            utils.setAnchorCenter(this["rank_key_" + index]);
            (<eui.Image>this["user_head_" + index]).mask = (<eui.Rect>this["head_mask_" + index]);
            let faceUrl = "";
            if (data.faceUrl.length == 0) {
                faceUrl = RES.getRes("default_head_png");
            } else {
                faceUrl = data.faceUrl;
            }
            (<eui.Image>this["user_head_" + index]).source = faceUrl;
            // let name = data.nickName.slice(0, 4) + "...";
            // nickName = nickName.slice(0, 4) + "...";
            // name = name + "...";
            (<eui.Label>this["nick_name_" + index]).text = data.nickName;

            if ((<eui.Label>(this["nick_name_" + index])).width >= 130 ) {
                let nickName = data.nickName.slice(0, 4) + "...";
                (<eui.Label>(this["nick_name_" + index])).text = nickName;
            }

            (<eui.BitmapLabel>this["rank_win_" + index]).text = data.rankValue;
            utils.setAnchorCenter(this["rank_win_" + index]);

            let gold = this.getGoldText(data.score);
            // console.log("财富:", gold);
            (<eui.BitmapLabel>this["rank_gold_" + index]).text = gold;
            utils.setAnchorCenter(this["rank_gold_" + index]);

        }

        private getKeyText(key: number): string {
            let text = "";
            if (key < 4) {
                switch (key) {
                    case 1 : {
                        text += "f";
                        break;
                    }
                    case 2 : {
                        text += "s";
                        break;
                    }
                    case 3 : {
                        text += "t";
                        break;
                    }
                }
            } else {
                text += key;
            }
            return text;
        }

        private getGoldText(gold: number): string {
            let text = "";
            if(gold === undefined) gold = 0;
            if (gold < 0) return;
            let imgUrl = [];
            let str = this.transformFromScore(gold);
            for (let n = 0; n < str.length; n++) {
                if (str[n] == ".") {
                    text += "-";
                } else if (str[n] == "w") {
                    text += "w"
                } else {
                    text += str[n];
                }

            }
            return text;
        }

        private transformFromScore(score: number) {
            let back = "";
            if (score >= 10000) {
                let front = Math.floor(score / 10000).toString();
                if (front.length < 4) {
                    back += front + ".";
                    let behindLength = 4 - front.length;//后面的位数
                    let behindCount = (Math.floor(score % 10000) / 10000);
                    for (let n = 0; n < behindLength; n++) {
                        back += Math.floor(behindCount * 10);
                        behindCount = behindCount * 10 - Math.floor(behindCount * 10);
                    }
                    back = back + "w";
                } else {
                    back = front + "w";
                }
            } else {
                back += Math.floor(score);
            }
            return back;
        }

        private onPre() {
            let status = this.btn_toggle.status;
            if (status == 1) { //世界排行榜的翻页
                if (this._page > 0) {
                    this._page -= 1;
                    let startId = this._page * RankList.perPageMaxNum;
                    this._currentGroup = this._totalGroup.slice(startId, startId + RankList.perPageMaxNum);
                    this.showRankByGroup(this._currentGroup);
                    if (this.rank_page) {
                        this.rank_page.visible = true;
                        this.rank_page.text = `${this._page + 1} / ${this._totalPage}`;
                    }
                }
            } else {
                platform.openDataContext.postMessage({ //好友排行榜的翻页
                    command: "pre"
                })
            }
        }

        private onNext() {
            let status = this.btn_toggle.status;
            if (status == 1) {
                if (this._page < this._totalPage - 1) {
                    this._page += 1;
                    let startId = this._page * RankList.perPageMaxNum;
                    this._currentGroup = this._totalGroup.slice(startId, startId + RankList.perPageMaxNum);
                    this.showRankByGroup(this._currentGroup);
                    if (this.rank_page) {
                        this.rank_page.visible = true;
                        this.rank_page.text = `${this._page + 1} / ${this._totalPage}`;
                    }
                }
            } else {
                platform.openDataContext.postMessage({
                    command: "next"
                })
            }
        }

        private onClose() {
            if(this._closeFunc) {
                this._closeFunc();
            }
        }

        protected adjustComponent() {
            this._adjustComponent.push(this.rank);
            this._scaleComponent.push(this.rank);

            console.log("%cRANK：", "color: red; font-size: 2em");
            console.log("比率:", RATE);
            console.log("转换前:", this.rank.y, this.rank.height, this.rank.scaleX);
            console.log(this._adjustComponent);
            this._adjustComponent.forEach(component => {
                component.y =  component.y * RATE;
            });

            this._scaleComponent.forEach(component => {
                component.scaleX = component.scaleY = RATE;
            });
            console.log("转换后:", this.rank.y, this.rank.height, this.rank.scaleX, this.rank.height * this.rank.scaleX);
        }
    }
}