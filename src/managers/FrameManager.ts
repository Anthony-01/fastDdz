/*管理器 单例
1.0 SceneManager    切换场景
2.0 PopuManager     弹窗管理
3.0 EventManager    事件管理
4.0 GlobalData      全局数据
*/
namespace managers {

    export enum DGameStatus {
        LOAD   =  0,  //加载界面
        START  =  1,  //游戏开始界面
        ING    =  2,   //游戏界面
        NODE   =  4   //
    }

    export class FrameManager {
        /**
        *单例实例 
        */
        private static m_sInstance: FrameManager;

        /**
        *当前控制器
        */
        public m_RunningController: any;

        /**
        *游戏主舞台 
        */
        public m_MainStage: egret.Stage;

        /**
         * 玩家全局数据
         */
        public m_GlobalUserItem: models.UserData;

        /**
         * 自动登录
         */
        public m_IsAuto: boolean = true;

        /**微信头像缓存 */
        public m_TextureCache: egret.BitmapData;

        /**错误报告 */
        public m_Reporter: models.ErrorReporter;

        /**微信后台切换检测*/
        public m_Dispatcher: egret.EventDispatcher;

        /**
        *获取实例 
        */
        public static getInstance(): FrameManager {
            // df.SUB_GP_BASEENSURE_QUERY
            if (this.m_sInstance == null) {
                this.m_sInstance = new FrameManager();
                this.m_sInstance.onInit();
            }
            return this.m_sInstance;
        }

        getDispatcher() {
            if (null == this.m_Dispatcher) {
                this.m_Dispatcher = new egret.EventDispatcher();
                this.m_Dispatcher.addEventListener("onshow", this.onShow, this);
                this.m_Dispatcher.addEventListener("onhide", this.onHide, this);
            }
            return this.m_Dispatcher;
        }

        private onShow() { //微信后台转入前台
            //加载相对应的游戏资源
            console.log("返回前台，重新加载游戏资源:");
            switch (managers.FrameManager.getInstance().gameStatus) {
                case managers.DGameStatus.LOAD: {
                    RES.loadGroup("frontload", 1).then(() => {
                        // managers.FrameManager.getInstance().dismissPopWait();
                        GameEngine.getInstance().startGameHandler();
                    }).catch((err) => {
                        console.log(err);
                        GameEngine.getInstance().showMessage(err);
                    });
                    break;
                }
                case managers.DGameStatus.START: {
                    // managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
                    utils.GameConst.colorConsole("前台继续加载gameScene");
                    // console.log("前台继续加载gameScene");
                    managers.FrameManager.getInstance().dismissPopWait();
                    RES.loadGroup("gameScene", 1).then(() => {
                        // GameEngine.getInstance().startGameHandler();
                        utils.GameConst.colorConsole("前台加载gameScene完成");
                    }).catch((err) => {
                        console.log(err);
                        GameEngine.getInstance().showMessage(err);
                    });
                    break;
                }
                case managers.DGameStatus.ING: {
                    RES.loadGroup("resultScene", 1);
                    break;
                }
            }
        }

        private onHide() { //微信转入后台

        }

        private _gameStatus: DGameStatus;

        set gameStatus(value: DGameStatus) {
            this._gameStatus = value;
        }

        get gameStatus(): DGameStatus {
            return this._gameStatus;
        }

        /**
        * 初始化
        */
        public onInit(): void {
            // ServiceCtrl.getInstance().init();
            TimerCtrl.getInstance().init();
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this);
        }

        private onResourceLoadErr(event: RES.ResourceEvent): void {
            utils.GameConst.colorConsole("manager:资源组加载失败");
            console.log(event.groupName);
            let callBack = () => {
                RES.loadGroup(event.groupName).then(() => {
                    GameEngine.getInstance().startGameHandler();
                }).catch(() => {
                    GameEngine.getInstance().showMessage(`资源加载失败${event.groupName}，请重新打开游戏`);
                })
            };
            // GameEngine.getInstance().showMessage(`资源加载失败${event.groupName}，点击确定重新加载`,() => {
            //
            // })
        }

        /** 
        *游戏刷新  
        */
        public onUpdate(): void {
            ServiceCtrl.getInstance().onUpdate();
        }

        /**
        *当前视图
        */
        public setRunningController(controller: any): void {
            this.m_RunningController = null;
            this.m_RunningController = controller;
        }

        public getRunningController() {
            return this.m_RunningController ? this.m_RunningController : null;
        }

        public isGameController() {
            // return this.m_RunningController.name == "GameController" ? true : false;
            return true;
        }

        /**场景切换 
        *@param newController 目标视图
        *@param animation     切换过渡
        */
        public replaceScene(newController: any, animation: boolean): void {
            let curController = this.m_RunningController;
            egret.warn(curController != null);
            //egret.assert(curController.name != newController.name)

            if (null != this.m_MainStage.getChildByName("Dialog")) {
                // let dialog = this.m_MainStage.getChildByName("Dialog");
                // this.m_MainStage.removeChild(dialog);
            }

            //校验是否同一场景
            if (curController.name == newController.name)
                return;

            //保存当前视图
            this.m_RunningController = null;
            this.m_RunningController = newController;

            if (animation) {
                //添加新视图
                newController.alpha = 0;
                this.m_MainStage.addChild(newController);

                //旧视图渐变成透明
                let tw = egret.Tween.get(newController);
                let tw1 = egret.Tween.get(curController);

                tw1.call(() => { curController.viewWillDisappear(animation); }, this);
                tw1.to({ "alpha": 0 }, 1000, egret.Ease.backOut);

                //新视图渐变出现
                tw.call(() => { newController.viewWillAppear(animation); }, this);
                tw.to({ "alpha": 1.0 }, 1000, egret.Ease.backIn);
                tw.call(() => { newController.viewDidAppear(animation); }, this);

                //移除旧视图,回收资源,移除事件注册等
                tw1.call(() => { curController.viewDidDisappear(animation); }, this);
                tw1.call(() => {
                    curController.dealloc()
                    this.m_MainStage.removeChild(curController);
                    curController = null;
                }, this);

            } else {
                //添加新视图
                newController.viewWillAppear(animation);
                this.m_MainStage.addChild(newController);
                newController.viewDidAppear(animation);

                //移除旧视图
                curController.viewWillDisappear(animation)
                curController.viewDidDisappear(animation)
                curController.dealloc();
                this.m_MainStage.removeChild(curController);
            }
        }

        /**
         * 对话框
         */
        public showDailog(style: number, content: string, okCallfun: any, cancellCallfun?: any): void {
            console.log("对话框");
            GameEngine.getInstance().showMessage(content, okCallfun, 1);

            // let dialog = new models.Dialog(style, content, okCallfun, cancellCallfun);
            // this.m_MainStage.addChildAt(dialog, df.TOP_ZORDER);
        }

        /**
         * 显示Toast
         */
        public showToast(message: string, callBack?: Function): void {
            console.log("Toast message:", message);
            // let callBack = () => {
            //     // this.onExitGame();
            //     GameEngine.getInstance().startGameHandler();
            // };
            GameEngine.getInstance().showMessage(message, callBack, 1);
            // let toast = new models.Toast();
            // this.m_MainStage.addChildAt(toast, df.TOP_ZORDER);
            // toast.show(message, delaytime);
            // toast.name = "toast";
        }

        public removeToast() {
            // let child = this.m_MainStage.getChildByName("toast");
            // if (child) {
            //     this.m_MainStage.removeChild(child);
            // }
        }

        private _waitingScene: game.WaitingScene;
        /**
         * 等待
         */
        public showPopWait(content: string = "", timeout: number = df.Default_Time_Out, isClose: boolean = false, timeOutHandler?: any, closeHandler?: any): void {
            //检测重复
            console.log("等待界面");
            if (null == this._waitingScene) {
                this._waitingScene = new game.WaitingScene();
            }
            this._waitingScene.setStr(content);
            //
            // let popWait = new models.PopWait(content, timeout, isClose, timeOutHandler, closeHandler);
            this.m_MainStage.addChildAt(this._waitingScene, df.TOP_ZORDER);
        }

        /**
         * 移除等待
         */
        public dismissPopWait(): void {
            // let popWait = this.m_MainStage.getChildByName("PopWait")
            //
            if (null == this._waitingScene) {
                return;
            }
            //
            utils.GameConst.removeChild(this._waitingScene);
            // this.m_MainStage.removeChild(this._waitingScene);
        }
    }
}