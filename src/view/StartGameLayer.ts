namespace game {
    import GameConst = utils.GameConst;
    const test_one = [
        "v1/Applet/GetWeekWinCountRank",
        "v1/Applet/GetWeekWinScoreRank",
        "v1/Applet/GetUserScoreRank"
    ];

    interface IGameData {
        label: string;
    }

    interface IMain extends egret.DisplayObject {
        onSendCards(cards: number[]): void
    }

    const DESK_Y = 444;
    const LOGO_X = 134;

    export class StartGameLayer extends eui.Component {

        gameData: IGameData;

        public img_bg:eui.Image;
        public group_desk:eui.Group;
        public desk:eui.Image;
        public login_poker_0:eui.Image;
        public login_poker_1:eui.Image;
        public login_poker_2:eui.Image;
        public login_poker_3:eui.Image;
        public gameLogo:eui.Image;
        public label:eui.Label;
        public group_btn:eui.Group;
        public btnStartGame:eui.Button;
        public btnShare:eui.Button;
        public rankFriend:eui.Button;
        public rankGroup:eui.Button;
        public img_flash:eui.Image;

        private _gameEngine: GameEngine;

        //游戏开始界面初始化
        constructor(engine: GameEngine) {
            super();
            this._gameEngine = engine;
            this.skinName = StartGameSkin;
            console.log("添加初始化事件");
            this.addEventListener(eui.UIEvent.COMPLETE, this.onInitComplete, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.start, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.remove, this);
        }

        private onComplete: boolean = false;

        /**
         * 组件初始化完成
         * */
        onInitComplete() {
            console.log("开始界面初始化完毕!");
            // console.log("%c开始界面初始化完毕:", "color: red;font-size: 2em" );
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onInitComplete, this);

            this.onComplete = true;
            //适配问题
            this.initData();
            this.initButton();
            this.beginAction();
            // this.pushArray();
            // let test = new HeadBorder();
            // this.addChild(test);
        }

        private actionQueue: any[] = [];

        start() {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.start, this);
            // this.btnDisable();

            let self = this;
            let callBack = () => {
                self.startAnimation().then(() => { //动画完成以后为按钮添加事件
                    // self.group_btn.visible = true;
                    // self.initButton();
                    self.flashAnimation();
                });
            };
            // console.log(this.onComplete);
            if (this.onComplete) {
                callBack();
            } else {
                this.actionQueue.push(callBack);
            }
        }

        //移出舞台
        private remove() {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.remove, this);
            if (this.flashTimer) {
                this.flashTimer.stop();
                this.flashTimer = null;
            }
        }

        public clear() {
            if (this.onComplete) {
                this.group_btn.visible = false;
                this.gameLogo.alpha = 0;
                this.gameLogo.x = 750;
                this.group_desk.y = 1624;
                this.img_flash.visible = false;
                this.img_flash.x = 169;
            }
        }

        private beginAction() {
            let callBack = this.actionQueue[0] as Function;
            if (callBack != null) {
                callBack();
                this.actionQueue.splice(0, 1);
                this.beginAction();
            }
        }

        private flashAnimation() {
            // this.btnDisable();
            this.group_btn.visible = true;
            this.group_btn.alpha = 0;
            this.img_flash.visible = true;
            this.img_flash.alpha = 0;
            egret.Tween.get(this.group_btn).to({alpha: 1}, 300).call(() => {
                if (null == this.flashTimer) {
                    this.btnFlash();
                    this.flashTimer = new egret.Timer(5000);
                    this.flashTimer.addEventListener(egret.TimerEvent.TIMER, this.btnFlash, this);
                    this.flashTimer.start();
                }
                // egret.Tween.get(this.img_flash).to({x: 375, alpha: 1}, 500).to({alpha: 0}, 300).call(() => {
                //     this.img_flash.visible = false;
                //     this.btnActive();
                // });
            });
        }

        private flashTimer: egret.Timer;
        private btnFlash() {
            this.img_flash.x = 169;
            this.img_flash.visible = true;
            this.img_flash.alpha = 0;
            egret.Tween.get(this.img_flash).to({x: 375, alpha: 1}, 500).to({alpha: 0}, 300).call(() => {
                this.img_flash.visible = false;
                this.btnActive();
            });
        }

        private _components: any[] = [];
        private _scaleComponent: any[] = [];
        /**
         * 初始化游戏数据
         * 游戏界面适配问题
         * */
        initData() {
            this.gameData = {
                label: "初始label"
            };
            this._components.push(this.img_bg);
            this._components.push(this.group_desk);
            this._components.push(this.desk);
            this._components.push(this.login_poker_0);
            this._components.push(this.login_poker_1);
            this._components.push(this.login_poker_2);
            this._components.push(this.login_poker_3);
            this._components.push(this.gameLogo);
            this._components.push(this.label);
            this._components.push(this.group_btn);
            this._components.push(this.btnStartGame);
            this._components.push(this.btnShare);
            this._components.push(this.rankFriend);
            this._components.push(this.rankGroup);
            this._components.push(this.img_flash);

            this._components.forEach(component => {
               component.y =  component.y * RATE
            });

            this._scaleComponent.push(this.btnStartGame);
            this._scaleComponent.push(this.btnShare);
            this._scaleComponent.forEach(component => {
                component.scaleX = component.scaleY = RATE;
            })
        }

        private initButton() {
            this.btnStartGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartGame, this);
            this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
            this.rankFriend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showFriendsRank, this);
            this.rankGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareGame, this);
            // console.log(this.btnStartGame);
            // this.btnStartGame["mainImg"].src = RES.getRes("startSene_json#btn_start_game_png");

            // this.addBtnChange(this.btnStartGame);
            this.addBtnChange(this.btnShare);
            this.addBtnChange(this.rankFriend);
            this.addBtnChange(this.rankGroup);
        }

        createChildren() {
            // this.btnStartGame["mainImg"].src = RES.getRes("startSene_json#btn_start_game_png");
            console.log(this.btnStartGame);
            this.onInitComplete();
        }

        private addBtnChange(button: eui.Button) {
            button.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        }

        private removeBrnChange(button: eui.Button) {
            button.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        }

        private _touchButton: eui.Button = null;
        private onTouchBeginChange(e: egret.TouchEvent) {
            this._touchButton = e.currentTarget;
            let scale = this._touchButton.scaleX - 0.1;
            this._touchButton.scaleX = this._touchButton.scaleY = scale;
        }

        private onTouchMoveChange(e: egret.TouchEvent) {
            if (e.currentTarget != this._touchButton) {

            }
        }

        private onTouchEndChange(e: egret.TouchEvent) {
            if (e.currentTarget != this._touchButton) {
            }
            if (null != this._touchButton) {
                let scale = this._touchButton.scaleX + 0.1;
                this._touchButton.scaleX = this._touchButton.scaleY = scale;
            }
            this._touchButton = null;
        }

        btnDisable() {
            this.btnStartGame.enabled = false;
            this.btnShare.enabled = false;
            this.rankFriend.enabled = false;
            this.rankGroup.enabled = false;
        }

        rankDisable() {
            let self = this;
            let callBack = () => {
                self.rankFriend.visible  = false;
            };
            if (this.onComplete) {
                callBack();
            } else {
                this.actionQueue.push(callBack);
            }
        }

        rankActive() {
            let self = this;
            let callBack = () => {
                self.rankFriend.visible  = true;
            };
            if (this.onComplete) {
                callBack();
            } else {
                this.actionQueue.push(callBack);
            }
        }

        btnActive() {
            this.btnStartGame.enabled = true;
            this.btnShare.enabled = true;
            this.rankGroup.enabled = true;
            this.rankFriend.enabled = true;
        }

        //游戏逻辑

        onStartGame() {
            //游戏匹配机制
            //向服务器发送消息，进入排队队列
            console.log("游戏开始,切换到游戏匹配界面");//阴影加转动界面，或者。。。
            // this._gameEngine.requestMatch();
            GameEngine.getInstance().requestMatch();
        }

        private _testCount: number = 0;

        //分享按钮
        private shareGame() {
            //转发功能
            platform.shareAppMessage().then(data => {
                console.log(data);
            });
            // this.getCheckInfo();

            // GameEngine.getInstance()._gameFrame.queryUserScore();
            // this.getCheckInfo();
        }

        private onSignIn() {

            //播放签到动画
            // this._main.playSignIn(0);
            // let baseEnsure = new frame.BaseEnsureFrame(this);
            // baseEnsure.sendFlushBaseEnsure();
            let self = this;
            let params = GameEngine.getInstance().getCheckInfoParams();

            let httpURL: string = CHECK_IN_HOST + POST_CHECK_IN_URL;
            let httpRequest = new utils.HttpRequest();//egret.HttpResponseType.ARRAY_BUFFER
            let callBack = (evt?) => {
                console.log("正常返回");
                if (evt) {
                    let request = <egret.HttpRequest>evt.currentTarget;
                    console.log("get data : ",request.response);
                    let data = JSON.parse(request.response);
                    console.log(data.payload);
                    //codeID 0: 操作成功  codeID 1005 msg:
                    if (data.codeID == 0) { //签到成功->如何判断今日是否已经签到
                        //签到成功表现 -> 按钮变化 data.payload.lxGold

                    } else if (data.codeID == 1005) {
                        //显示message
                    }
                }
            };
            let errorBack = (msg?) => {
                console.log("错误返回");
                if (msg) {
                    console.log(msg);
                }
            };
            httpRequest.initHttpRequest(this, httpURL, params, egret.HttpMethod.POST, callBack, errorBack);
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

        private getCheckInfoParams(): string {
            // const userID = managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID;
            const userID = 9018;
            const serverTime = Math.floor(new Date().getTime() / 1000);
            let now = new Date();
            const TimeStamp = utils.formateDateAndTimeToString(now);
            const stationID = df.STATION_ID;
            const nonceStr = Math.floor(Math.random() * Math.pow(10, 8));//随机生成八位数

            //StationID={StationID}&UserID={UserID}&NonceStr={NonceStr}&TimeStamp={TimeStamp}&Signature={Signature}
            let params = `StationID=${stationID}&UserID=${userID}&NonceStr=${nonceStr}&TimeStamp=${TimeStamp}`;
            let signature = utils.MD5.MD5_HEX(`UserID=${userID}&NonceStr=${nonceStr}&TimeStamp=${TimeStamp}&Key=wsdeflkfignvgdhfbsgtrs`);
            signature = signature.toUpperCase();
            params = `${params}&signature=${signature}`;

            return params;
        }

        private _userInfo: IUserInfo;
        public loginFrame() {
            let testI = new df.CMiniProgramInfo();
            testI.sCode = this._userInfo.code;
            testI.sRawData = this._userInfo.rawData;
            testI.sEncryptedData = this._userInfo.encryptedData;
            testI.sIv = this._userInfo.iv;
            testI.signature = this._userInfo.signature;

            let logonFrame = new frame.LogonFrame(this);
            logonFrame.setMiniProgramInfo(testI);
            logonFrame.onMiniProgramLogon();
        }

        private testClose() {
            // if (this._gameEngine && this._gameEngine.onExitGame) {
            //     this._gameEngine.onExitGame();
            // }
            platform.login().then(data => {
                this._userInfo = data;
                this.loginFrame();
            })
            // SocketMrg.SocketManager.getInstance().closeAllSocket();
        }


        private _rankList: egret.Bitmap;
        // private _btnRankClose: eui.Button;
        private _rankListMask: egret.Shape;
        private isRankClick: boolean = false;
        private _rank_bg: RankList = null;


        private bitmap: egret.Bitmap;
        private showTest() {
            // this.closeBtn.visible = true;
            let openDataContext = wx.getOpenDataContext();

            //主要示例代码开始
            const bitmapdata1 = new egret.BitmapData(window["sharedCanvas"]);
            bitmapdata1.$deleteSource = false;
            const texture = new egret.Texture();
            texture.bitmapData = bitmapdata1;
            this.bitmap = new egret.Bitmap(texture);
            this.bitmap.width = this.stage.stageWidth;
            this.bitmap.height = this.stage.stageHeight;
            this.bitmap.anchorOffsetX = this.bitmap.width / 2;
            this.bitmap.anchorOffsetY = this.bitmap.height / 2;
            this.bitmap.x = this.stage.stageWidth / 2;
            this.bitmap.y = this.stage.stageHeight / 2;
            this.addChild(this.bitmap);
            egret.startTick((timeStarmp: number) => {
                egret.WebGLUtils.deleteWebGLTexture(bitmapdata1.webGLTexture);
                bitmapdata1.webGLTexture = null;
                return false;
            }, this);
            //主要示例代码结束
            //发送消息
            openDataContext.postMessage({
                text: "hello",
                year: (new Date()).getFullYear()
            });
            console.log("data");
            // this.addChild(this.closeBtn);
        }
        //打开排行榜
        private showFriendsRank() {
            //主屏幕遮罩
            if (null == this._rankListMask) {
                this._rankListMask = new egret.Shape();
                this._rankListMask.graphics.beginFill(0x000000, 1);
                this._rankListMask.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
                this._rankListMask.graphics.endFill();
                this._rankListMask.alpha = 0.2;
                this._rankListMask.touchEnabled = true;
            }
            this.addChild(this._rankListMask);

            if (null == this._rank_bg) {
                let self = this;
                let callBack = () => {
                    self.onCloseRank();
                    utils.GameConst.removeChild(this._rank_bg);
                };
                this._rank_bg = new RankList(this, callBack);
            }
            this.addChild(this._rank_bg);

            //打开排行榜要进行一次请求
            //要判断是处于世界排行榜还是好友排行榜
            // this._rank_bg.updateWorldData();
            //纠正当前用户的微信排行榜数据
            if (this._rank_bg.status == 0) { //好友排行榜
                this._rankList = platform.openDataContext.createDisplayObject(null, this.stage.stageWidth, this.stage.stageHeight);
                this.addChild(this._rankList);
                // this._rank_bg.postWeekWin();
                platform.openDataContext.postMessage({
                    command: "open"
                });
            } else { //世界排行榜
                this._rank_bg.closeFriendRankAndUpdate();
            }


            // this.addChild(this._btnRankClose);
        }

        private onCloseRank() {
            this.removeChild(this._rankListMask);//mask
            utils.GameConst.removeChild(this._rankList);//bg
            if (this._rank_bg.status == 0) {
                platform.openDataContext.postMessage({
                    command: "close"
                });
            }

        }

        public onCloseFriend() {
            if (this._rank_bg.status == 1) {
                utils.GameConst.removeChild(this._rankList);
                // this.pushArray();
                platform.openDataContext.postMessage({
                    command: "close"
                });
            }
        }

        public openFriendRank() {
            this.addChild(this._rankList);
            // this.pushArray();
            platform.openDataContext.postMessage({
                command: "open"
            });
        }

        private _rankScore: number = 15;

        private pushArray() {
            platform.openDataContext.postMessage({
                command: "save",
                nickName: GameEngine.getInstance().userInfo.nickName,
                score: this._rankScore
            })
        }

        public addWinning() {
            platform.openDataContext.postMessage({
                command: "add",
                nickName: GameEngine.getInstance().userInfo.nickName
            })
        }

        /**==========================动画============================*/
        private startAnimation(): Promise<any> {
            return new Promise((resolve, reject) => {
                egret.Tween.get(this.group_desk).to({y: DESK_Y}, 300).call(() => {
                    egret.Tween.get(this.gameLogo).to({x: LOGO_X, alpha: 1}, 300).call(() => {
                        resolve();
                    })
                })
            })
        }

        /**======================================================*/

        /**==========================客户端发送消息============================*/
        /**
         * 请求加入游戏队列
         * */
        private requestMatch() {

        }

        /**
         * 请求退出游戏队列
         *
         * */
        private requestCancelMatch() {

        }


        /**======================================================*/


    }
    // declare var wx: any = {}
}