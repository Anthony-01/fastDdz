var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/*管理器 单例
1.0 SceneManager    切换场景
2.0 PopuManager     弹窗管理
3.0 EventManager    事件管理
4.0 GlobalData      全局数据
*/
var managers;
(function (managers) {
    var DGameStatus;
    (function (DGameStatus) {
        DGameStatus[DGameStatus["LOAD"] = 0] = "LOAD";
        DGameStatus[DGameStatus["START"] = 1] = "START";
        DGameStatus[DGameStatus["ING"] = 2] = "ING";
        DGameStatus[DGameStatus["NODE"] = 4] = "NODE"; //
    })(DGameStatus = managers.DGameStatus || (managers.DGameStatus = {}));
    var FrameManager = (function () {
        function FrameManager() {
            /**
             * 自动登录
             */
            this.m_IsAuto = true;
        }
        /**
        *获取实例
        */
        FrameManager.getInstance = function () {
            // df.SUB_GP_BASEENSURE_QUERY
            if (this.m_sInstance == null) {
                this.m_sInstance = new FrameManager();
                this.m_sInstance.onInit();
            }
            return this.m_sInstance;
        };
        FrameManager.prototype.getDispatcher = function () {
            if (null == this.m_Dispatcher) {
                this.m_Dispatcher = new egret.EventDispatcher();
                this.m_Dispatcher.addEventListener("onshow", this.onShow, this);
                this.m_Dispatcher.addEventListener("onhide", this.onHide, this);
            }
            return this.m_Dispatcher;
        };
        FrameManager.prototype.onShow = function () {
            //加载相对应的游戏资源
            console.log("返回前台，重新加载游戏资源:");
            switch (managers.FrameManager.getInstance().gameStatus) {
                case managers.DGameStatus.LOAD: {
                    RES.loadGroup("frontload", 1).then(function () {
                        // managers.FrameManager.getInstance().dismissPopWait();
                        GameEngine.getInstance().startGameHandler();
                    }).catch(function (err) {
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
                    RES.loadGroup("gameScene", 1).then(function () {
                        // GameEngine.getInstance().startGameHandler();
                        utils.GameConst.colorConsole("前台加载gameScene完成");
                    }).catch(function (err) {
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
        };
        FrameManager.prototype.onHide = function () {
        };
        Object.defineProperty(FrameManager.prototype, "gameStatus", {
            get: function () {
                return this._gameStatus;
            },
            set: function (value) {
                this._gameStatus = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
        * 初始化
        */
        FrameManager.prototype.onInit = function () {
            // ServiceCtrl.getInstance().init();
            managers.TimerCtrl.getInstance().init();
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this);
        };
        FrameManager.prototype.onResourceLoadErr = function (event) {
            utils.GameConst.colorConsole("manager:资源组加载失败");
            console.log(event.groupName);
            var callBack = function () {
                RES.loadGroup(event.groupName).then(function () {
                    GameEngine.getInstance().startGameHandler();
                }).catch(function () {
                    GameEngine.getInstance().showMessage("\u8D44\u6E90\u52A0\u8F7D\u5931\u8D25" + event.groupName + "\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u6E38\u620F");
                });
            };
            // GameEngine.getInstance().showMessage(`资源加载失败${event.groupName}，点击确定重新加载`,() => {
            //
            // })
        };
        /**
        *游戏刷新
        */
        FrameManager.prototype.onUpdate = function () {
            managers.ServiceCtrl.getInstance().onUpdate();
        };
        /**
        *当前视图
        */
        FrameManager.prototype.setRunningController = function (controller) {
            this.m_RunningController = null;
            this.m_RunningController = controller;
        };
        FrameManager.prototype.getRunningController = function () {
            return this.m_RunningController ? this.m_RunningController : null;
        };
        FrameManager.prototype.isGameController = function () {
            // return this.m_RunningController.name == "GameController" ? true : false;
            return true;
        };
        /**场景切换
        *@param newController 目标视图
        *@param animation     切换过渡
        */
        FrameManager.prototype.replaceScene = function (newController, animation) {
            var _this = this;
            var curController = this.m_RunningController;
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
                var tw = egret.Tween.get(newController);
                var tw1 = egret.Tween.get(curController);
                tw1.call(function () { curController.viewWillDisappear(animation); }, this);
                tw1.to({ "alpha": 0 }, 1000, egret.Ease.backOut);
                //新视图渐变出现
                tw.call(function () { newController.viewWillAppear(animation); }, this);
                tw.to({ "alpha": 1.0 }, 1000, egret.Ease.backIn);
                tw.call(function () { newController.viewDidAppear(animation); }, this);
                //移除旧视图,回收资源,移除事件注册等
                tw1.call(function () { curController.viewDidDisappear(animation); }, this);
                tw1.call(function () {
                    curController.dealloc();
                    _this.m_MainStage.removeChild(curController);
                    curController = null;
                }, this);
            }
            else {
                //添加新视图
                newController.viewWillAppear(animation);
                this.m_MainStage.addChild(newController);
                newController.viewDidAppear(animation);
                //移除旧视图
                curController.viewWillDisappear(animation);
                curController.viewDidDisappear(animation);
                curController.dealloc();
                this.m_MainStage.removeChild(curController);
            }
        };
        /**
         * 对话框
         */
        FrameManager.prototype.showDailog = function (style, content, okCallfun, cancellCallfun) {
            console.log("对话框");
            GameEngine.getInstance().showMessage(content, okCallfun, 1);
            // let dialog = new models.Dialog(style, content, okCallfun, cancellCallfun);
            // this.m_MainStage.addChildAt(dialog, df.TOP_ZORDER);
        };
        /**
         * 显示Toast
         */
        FrameManager.prototype.showToast = function (message, callBack) {
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
        };
        FrameManager.prototype.removeToast = function () {
            // let child = this.m_MainStage.getChildByName("toast");
            // if (child) {
            //     this.m_MainStage.removeChild(child);
            // }
        };
        /**
         * 等待
         */
        FrameManager.prototype.showPopWait = function (content, timeout, isClose, timeOutHandler, closeHandler) {
            if (content === void 0) { content = ""; }
            if (timeout === void 0) { timeout = df.Default_Time_Out; }
            if (isClose === void 0) { isClose = false; }
            //检测重复
            console.log("等待界面");
            if (null == this._waitingScene) {
                this._waitingScene = new game.WaitingScene();
            }
            this._waitingScene.setStr(content);
            //
            // let popWait = new models.PopWait(content, timeout, isClose, timeOutHandler, closeHandler);
            this.m_MainStage.addChildAt(this._waitingScene, df.TOP_ZORDER);
        };
        /**
         * 移除等待
         */
        FrameManager.prototype.dismissPopWait = function () {
            // let popWait = this.m_MainStage.getChildByName("PopWait")
            //
            if (null == this._waitingScene) {
                return;
            }
            //
            utils.GameConst.removeChild(this._waitingScene);
            // this.m_MainStage.removeChild(this._waitingScene);
        };
        return FrameManager;
    }());
    managers.FrameManager = FrameManager;
    __reflect(FrameManager.prototype, "managers.FrameManager");
})(managers || (managers = {}));
