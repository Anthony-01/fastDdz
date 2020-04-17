namespace game {
    export const CHECK_IN_HOST = "https://minigame.foxuc.com/"; //请求主机名
    export const GET_SHARE_INFO_URL = "v1/Applet/GetGameShareItem"; //get路径一

    export const POST_SHARE_URL = "v1/Applet/UserGameShare"; //post路径二

    export const GET_CHECK_IN_INFO_URL = "v1/Applet/GetCheckInItem"; //GET路径三

    export const POST_CHECK_IN_URL = "v1/Applet/UserCheckIn"; //post路径四

    export const CANT_ANIMATION_POSITION = {
        x: 135,
        y: 224,
        upX: 135,
        upY: 214,
        size: 25,
        color: 0xffc369
    };

    export class GoldPopup extends eui.Component {

        public btn_group:eui.Group;
        public btn_sign_in:eui.Button;
        public btn_share:eui.Button;
        public btn_details:eui.Button;
        public btn_close:eui.Button;
        public give_times:eui.BitmapLabel;

        private _main: GameScenesLayer;



        constructor(main: GameScenesLayer) {
            super();
            this._main = main;
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);


        }

        private _onComplete: boolean = false;
        private _actionQueue: any[] = [];
        private onComplete() {
            this._onComplete = true;
            console.log("领取金币弹窗组件初始化完毕");
            this.showShareTimers(0);
            this.initBtn();
            this.activeBtn();
            this.beginAction();
            this.getCheckInfo()
        }

        private beginAction() {
            let callBack = this._actionQueue[0] as Function;
            if (callBack != null) {
                callBack();
                this._actionQueue.splice(0, 1);
                this.beginAction();
            }
        }

        private initBtn() {
            this.btn_sign_in.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSignIn, this);
            this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
            this.btn_details.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDetails, this);
            this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);

            this.addBtnChange(this.btn_sign_in);
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

        showShareTimers(time: number) {
            let self = this;
            let callBack = () => {
                self.give_times.text = `${time}_3`;
            };
            if (this._onComplete) {
                callBack();
            } else {
                this._actionQueue.push(callBack);
            }
        }

        /**
         * 签到
         * */
        private onSignIn() {
            //做游戏状态的处理，如果是游戏
            // if (this.testQuery()) {return}
            // return;

            //播放签到动画
            // this._main.playSignIn(0);
            // let baseEnsure = new frame.BaseEnsureFrame(this);
            // baseEnsure.sendFlushBaseEnsure();
            let self = this;
            self.btn_sign_in.enabled = false;
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
                        this._main.addGold(data.payload.presentGold);
                        self.btn_sign_in.enabled = false;
                        this.testQuery();
                    } else if (data.codeID == 1005) {
                        //显示message
                        self.btn_sign_in.enabled = true;
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

        private testQuery():boolean {
            GameEngine.getInstance()._gameFrame.queryUserScore();
            return true;
        }



        private _detailPopup: DetailsPopup;
        private onDetails() {
            let self = this;
            if (null == this._detailPopup) {
                managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
                RES.loadGroup("details").then(() => {
                    managers.FrameManager.getInstance().dismissPopWait();
                    self._detailPopup = new DetailsPopup(this._main);
                    self._detailPopup.horizontalCenter = 0;
                    self._detailPopup.y = 202;
                    self._main.adjustComponent(this._detailPopup, true);
                    self._main.addPopup(self._detailPopup);
                }).catch((err) => {
                    managers.FrameManager.getInstance().dismissPopWait();
                    GameEngine.getInstance().showMessage(err);
                });

            } else {
                this._main.addPopup(this._detailPopup);
            }
            // this._detailPopup.setDays(7);
        }

        private onShare() {
            platform.getGold().then(() => {
                console.log("领取金币成功");
            });
        }

        private onClose() {
            utils.GameConst.removeChild(this);
            this._main.removeMask();
            //如何移除父组件的全屏遮罩
        }

        private onRemove() {
            this.disabledBtn();
        }

        private _request: egret.HttpRequest;


        private onStage() {
            let self = this;
            let callBack = () => {
                self.activeBtn();
                self.getCheckInfo();
            };
            if (this._onComplete) {
                callBack()
            } else {
                this._actionQueue.push(callBack);
            }
        }

        private activeBtn() {
            // this.btn_sign_in.enabled = true;
            this.btn_share.enabled = true;
            this.btn_details.enabled = true;
            this.btn_close.enabled = true;
        }

        private disabledBtn() {
            this.btn_sign_in.enabled = false;
            this.btn_share.enabled = false;
            this.btn_details.enabled = false;
            this.btn_close.enabled = false;
        }

        /**
         * 低保领取
         * */
        public connectComplete() {
            console.log("BaseEnsure: complete!")
        }

        private baseTime: number = 0;

        public addBaseTime() {
            let self = this;
            let callBack = () => {
                self.baseTime += 1;
                self.give_times.text = `${this.baseTime}_3`;
            };
            if (this._onComplete) {
                callBack();
            } else {
                this._actionQueue.push(callBack);
            }
        }
        public updateBaseEnsureInformation(msg: any) {
            this.baseTime = msg.times;
            let self = this;
            let callBack = () => {
                self.give_times.text = `${msg.times}_3`;
            };
            if (this._onComplete) {
                callBack();
            } else {
                this._actionQueue.push(callBack);
            }
        }

        private getCheckInfo() {
            // let status = GameEngine.getInstance().getGameStatus();
            // if (status == cmd.GAME_SCENE_PLAY) { //游戏状态按钮为灰色
            //     this.btn_sign_in.enabled = false;
            //     return;
            // }

            // this.testQuery();

            let self = this;
            let params = GameEngine.getInstance().getCheckInfoParams();
            params = "?" + params;
            let httpURL: string = CHECK_IN_HOST + GET_CHECK_IN_INFO_URL;
            let httpRequest = new utils.HttpRequest();//egret.HttpResponseType.ARRAY_BUFFER
            let callBack = (evt?) => {
                console.log("正常返回");
                if (evt) {
                    let request = <egret.HttpRequest>evt.currentTarget;
                    let data = JSON.parse(request.response);
                    console.log("get data : ",data);
                    console.log(data.payload);

                    if (data.codeID == 0) { //签到成功
                        // console.log("获取签到消息");
                        // console.log(data);
                        let checkEnabled = !self.isCheckIn(data.payload.collectDate);
                        // console.log(checkEnabled);
                        self.btn_sign_in.enabled = checkEnabled;
                    } else if (data.codeID == 1005) { //签到失败
                        // console.log("打印签到失败消息");
                        console.log(data.message);
                        self.btn_sign_in.enabled = true;
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

        private isCheckIn(old: string): boolean {
            console.log(old);
            old = old.replace(/-/g, "/");
            if (old == "") return false;
            let oldTime = new Date(old);
            let nowTime = new Date();

            // utils.GameConst.colorConsole("判断是否签到");
            // console.log("oldTime", oldTime);
            // console.log("newTime", nowTime);

            let [nowYear, oldYear] = [nowTime.getFullYear(), oldTime.getFullYear()];
            let [nowMonth, oldMonth] = [nowTime.getMonth(), oldTime.getMonth()];
            let [nowDay, oldDay] = [nowTime.getDay(), oldTime.getDay()];
            console.log(nowYear, oldYear);

            if (nowYear - oldYear != 0) return false;
            if (nowMonth - oldMonth != 0) return false;
            return nowDay == oldDay;
        }
    }
}