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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var StartGameLayer = game.StartGameLayer;
var GameEngine = game.GameEngine;
var LoadingUI = game.LoadingUI;
var RATE = game.RATE;
var DGameStatus = managers.DGameStatus;
var GameConst = utils.GameConst;
var game;
(function (game) {
})(game || (game = {}));
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.countGroupError = 0;
        return _this;
    }
    Main.prototype.createChildren = function () {
        game.RATE = this.stage.stageHeight / utils.GameConst.stageH;
        // console.log("当前舞台高：", this.stage.stageWidth,this.stage.stageHeight);
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            var onUpdate = function () {
                // console.log("Ctrl:刷新");
                // managers.ServiceCtrl.getInstance().onUpdate();
            };
            context.onUpdate = onUpdate;
        });
        egret.lifecycle.onPause = function () {
            // utils.GameConst.colorConsole("egret:后台");
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            // utils.GameConst.colorConsole("egret:前台");
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this);
        RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigLoadErr, this);
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.onResourceLoadErr = function (event) {
        var _this = this;
        //如果加载失败超过三次，打印失败原因
        utils.GameConst.colorConsole("资源加载失败:");
        console.log(event);
        var self = this;
        if (++this.countGroupError < 3) {
            RES.loadGroup(event.groupName).then(function () {
                managers.FrameManager.getInstance().m_MainStage = _this.stage;
                self.addChild(GameEngine.getInstance());
            });
        }
        else {
            if (null == this.errSprite) {
                this.errSprite = new egret.Sprite();
            }
            var label = new egret.TextField();
            this.errSprite.addChild(label);
            this.errSprite.x = (this.stage.stageWidth - this.errSprite.width) / 2;
            this.errSprite.y = (this.stage.stageHeight - this.errSprite.height) / 2;
            this.addChild(this.errSprite);
        }
    };
    Main.prototype.onConfigLoadErr = function (err) {
        if (null == this.errSprite) {
            this.errSprite = new egret.Sprite();
        }
        var label = new egret.TextField();
        label.text = "加载游戏资源配置失败";
        this.errSprite.addChild(label);
        this.errSprite.x = (this.stage.stageWidth - this.errSprite.width) / 2;
        this.errSprite.y = (this.stage.stageHeight - this.errSprite.height) / 2;
        this.addChild(this.errSprite);
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, platform.openDataContext.postMessage({
                            command: "loadRes",
                            rate: game.RATE
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, platform.shop()];
                    case 2:
                        _a.sent();
                        ////防加载卡死
                        RES.setMaxLoadingThread(1);
                        // platform.createGameClubButton();
                        return [4 /*yield*/, this.loadResource()];
                    case 3:
                        // platform.createGameClubButton();
                        _a.sent();
                        return [4 /*yield*/, platform.login().then(function (data) {
                                // console.log("%c登陆所需信息:", "color: red;font-size: 2em");
                                // console.log(data);
                                GameEngine.getInstance().userInfo = data;
                                _this.createGameScene();
                            }, function () {
                                var self = _this;
                                self.createGameScene();
                                GameEngine.getInstance().StartScenes.rankDisable();
                                platform.getAuthSetting(game.RATE).then(function (data) {
                                    console.log(data);
                                    GameEngine.getInstance().userInfo = data;
                                    GameEngine.getInstance().StartScenes.rankActive();
                                });
                            }).catch(function (err) {
                                console.log(err);
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        // await RES.loadConfig("default.res.json", df.RESOURCE_URL);
                        managers.FrameManager.getInstance().gameStatus = DGameStatus.LOAD;
                        // platform.addWXOnHide(managers.FrameManager.getInstance().getDispatcher());
                        return [4 /*yield*/, RES.loadGroup("loading")];
                    case 2:
                        // platform.addWXOnHide(managers.FrameManager.getInstance().getDispatcher());
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 3:
                        _a.sent();
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadGroup("frontload", 1, loadingView).catch(function () {
                                console.log("Main:网络加载错误");
                            })];
                    case 4:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        RES.destroyRes("loading");
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    /**
     * 创建场景界面
     * Create scene interface
*/
    Main.prototype.createGameScene = function () {
        // console.log("创建场景界面");
        //如何床底  GameFrame
        //开始界面的使用
        managers.FrameManager.getInstance().m_MainStage = this.stage;
        this.addChild(GameEngine.getInstance());
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
