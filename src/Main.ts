//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
import StartGameLayer = game.StartGameLayer;
import GameEngine = game.GameEngine;
import LoadingUI = game.LoadingUI;
import RATE = game.RATE;
import DGameStatus = managers.DGameStatus;
import GameConst = utils.GameConst;

namespace game {
    export var RATE;
}

class Main extends eui.UILayer {

    protected createChildren(): void {
        game.RATE = this.stage.stageHeight / utils.GameConst.stageH;
        // console.log("当前舞台高：", this.stage.stageWidth,this.stage.stageHeight);
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            let onUpdate = () => {
                // console.log("Ctrl:刷新");
                // managers.ServiceCtrl.getInstance().onUpdate();
            };
            context.onUpdate = onUpdate;
        });

        egret.lifecycle.onPause = () => {
            // utils.GameConst.colorConsole("egret:后台");
            egret.ticker.pause();
        };

        egret.lifecycle.onResume = () => {
            // utils.GameConst.colorConsole("egret:前台");
            egret.ticker.resume();
        };

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this);
        RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigLoadErr, this);

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private countGroupError = 0;

    private onResourceLoadErr(event: RES.ResourceEvent): void {
        //如果加载失败超过三次，打印失败原因
        utils.GameConst.colorConsole("资源加载失败:");
        console.log(event);
        let self = this;
        if (++this.countGroupError < 3) {
            RES.loadGroup(event.groupName).then(() => {
                managers.FrameManager.getInstance().m_MainStage = this.stage;
                self.addChild(GameEngine.getInstance());
            });
        } else {
            if (null == this.errSprite) {
                this.errSprite = new egret.Sprite();
            }
            let label = new egret.TextField();
            this.errSprite.addChild(label);
            this.errSprite.x = (this.stage.stageWidth - this.errSprite.width) / 2;
            this.errSprite.y = (this.stage.stageHeight - this.errSprite.height) / 2;
            this.addChild(this.errSprite);
        }
    }

    private onConfigLoadErr(err) {
        if (null == this.errSprite) {
            this.errSprite = new egret.Sprite();
        }
        let label = new egret.TextField();
        label.text = "加载游戏资源配置失败";
        this.errSprite.addChild(label);
        this.errSprite.x = (this.stage.stageWidth - this.errSprite.width) / 2;
        this.errSprite.y = (this.stage.stageHeight - this.errSprite.height) / 2;
        this.addChild(this.errSprite);
    }


    private async runGame() {

        await platform.openDataContext.postMessage({
            command: "loadRes",
            rate: game.RATE
        });
        await platform.shop();

        ////防加载卡死
        RES.setMaxLoadingThread(1);
        // platform.createGameClubButton();
        await this.loadResource();
        await platform.login().then(data => {
            // console.log("%c登陆所需信息:", "color: red;font-size: 2em");
            // console.log(data);
            GameEngine.getInstance().userInfo = data;
            this.createGameScene();
        }, () => {
            let self = this;
            self.createGameScene();
            GameEngine.getInstance().StartScenes.rankDisable();
            platform.getAuthSetting(game.RATE).then(data => {
                console.log(data);
                GameEngine.getInstance().userInfo = data;
                GameEngine.getInstance().StartScenes.rankActive();
            })
        }).catch(err => {
            console.log(err);
        })
    }



    private errSprite: egret.Sprite;

    private async loadResource() {
        try {
            //resource/default.res.json","resource/
            await RES.loadConfig("resource/default.res.json", "resource/");

            // await RES.loadConfig("default.res.json", df.RESOURCE_URL);

            managers.FrameManager.getInstance().gameStatus = DGameStatus.LOAD;
            // platform.addWXOnHide(managers.FrameManager.getInstance().getDispatcher());
            await RES.loadGroup("loading");
            await this.loadTheme();
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);

            await RES.loadGroup("frontload", 1, loadingView).catch(() => {
                console.log("Main:网络加载错误");
            });
            this.stage.removeChild(loadingView);
            RES.destroyRes("loading");
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);
        })
    }

    /**
     * 创建场景界面
     * Create scene interface
*/
    protected createGameScene(): void {
        // console.log("创建场景界面");
        //如何床底  GameFrame
        //开始界面的使用
        managers.FrameManager.getInstance().m_MainStage = this.stage;
        this.addChild(GameEngine.getInstance());
    }
}
