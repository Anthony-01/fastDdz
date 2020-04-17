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
    // import GameConst = utils.GameConst;
    var Tween = egret.Tween;
    var USER_INFO_CONFIG = [
        {
            x: 22,
            y: 669
        }, {
            x: 236,
            y: 52
        }, {
            x: 25,
            y: 53
        }
    ];
    var CARDS_CONFIG = {
        x: 375,
        y: 800,
        off: 4,
        r: 800 - 112,
        r2: 700 - 112,
        offA: 0,
        dealX: 375,
        dealY: -226,
        dealOff: 1,
        oriX: 375,
        oriY: 65
    };
    var PRIORITY_POSITION = {
        x: 375,
        y: 0,
        time: 2000
    };
    var USER_POSITION = [{
            x: 375,
            y: 350
        }, {
            x: 770,
            y: -258
        }, {
            x: 80,
            y: -258
        }];
    //翻牌动画总时间
    var FLOP_TIME = 600;
    var OUT_CARD_CONFIG = [{
            x: 375 - 35,
            y: 106,
            off: 35,
            offY: 0
        }, {
            x: 4 * 30 + 80,
            y: 0,
            off: 30,
            offY: 45
        }, {
            x: 4 * 30,
            y: 0,
            off: 30,
            offY: 45
        }];
    var GameScenesLayer = (function (_super) {
        __extends(GameScenesLayer, _super);
        function GameScenesLayer(engine) {
            var _this = _super.call(this) || this;
            _this.initFlag = false;
            _this._womanAnimation = null;
            _this._isLock = false; //界面是否在播放动画；
            _this._components = [];
            _this._scaleComponent = [];
            _this._cards = [];
            _this.actionQueue = [];
            _this._touchButton = null;
            _this._lock = false;
            _this._myOutCards = [];
            _this._readyUser = [];
            //准备状态的断线重连标识
            _this._currentReady = false;
            _this._tipLock = false;
            _this._bgm_open = true;
            _this._configCount = 0;
            _this.flopQueue = [];
            _this._actionIndex = 0;
            _this._itemLength = 0;
            _this._comCount = 0;
            /**==========================页面表现============================*/
            _this._outCards = [];
            _this._warningFlag_0 = false;
            _this._warningFlag_1 = false;
            _this._warningFlag_2 = false;
            /**=========================服务端消息=============================*/
            _this.updateQueue = [];
            _this.inUpdate = false;
            _this._userScore1 = 0;
            _this._userScore2 = 0;
            _this._userCardCount_1 = cmd.NORMAL_COUNT;
            _this._userCardCount_2 = cmd.NORMAL_COUNT;
            _this._lastCards = [];
            _this.m_overFlag = false;
            _this._onMyOpera = false;
            _this._passTimer = null;
            _this._ifTrustee = false;
            _this.userName_0 = "";
            _this.userName_1 = "";
            _this.userName_2 = "";
            _this._userList = [];
            _this.firstUser = 0;
            _this._showAnimation = true;
            _this.position_0 = new egret.Point(200.5, (806 + 761) * game.RATE);
            _this.position_1 = new egret.Point(750 - (375 - 288.5) * game.RATE, 678 * game.RATE);
            _this.position_2 = new egret.Point(77.5 * game.RATE, 678 * game.RATE);
            _this._gameEngine = engine;
            _this._gameLogic = new game.GameLogic();
            // console.log("%c游戏界面开始初始化:", "color: red;font-size: 2em" );
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            return _this;
            // this.addEventListener(egret.Event.ADDED_TO_STAGE, this.start, this);
            // console.log("游戏开始界面");
        }
        GameScenesLayer.prototype.onComplete = function () {
            //适配问题
            this.adjustScreen();
            // console.log("%c游戏场景界面组件初始化完毕:", "color: red;font-size: 2em" );
            // console.log("游戏场景界面组件初始化完毕");
            this.initFlag = true;
            // console.log("是否初始化完成:", this.initFlag);
            console.log(this.user_0);
            // this.initCards([1]);
            this.updateAnimation();
            this.playDragonBones();
            this.initComponents();
            this.initBtn();
            this.beginAction();
        };
        GameScenesLayer.prototype.playMatchAnimation = function () {
            this.matching_animation.visible = true;
            animation.AnimationManager.getIns().playAnimationLoop(this.matching_animation["matchingAnimation"]);
            // this.matching_animation["matchingAnimation"];
        };
        GameScenesLayer.prototype.playDragonBones = function () {
            var dragonbonesData = RES.getRes("landLordGirl_ske_json");
            var textureData = RES.getRes("landLordGirl_tex_json");
            var texture = RES.getRes("landLordGirl_tex_png");
            var egretFactory = dragonBones.EgretFactory.factory;
            egretFactory.parseDragonBonesData(dragonbonesData);
            egretFactory.parseTextureAtlasData(textureData, texture);
            this._womanAnimation = egretFactory.buildArmatureDisplay("Armature");
            // this._womanAnimation.armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.onFrameEvent,this);
            utils.setAnchorCenter(this._womanAnimation);
            this._womanAnimation.x = 369 + 322 / 2; //设置为舞台中央
            this._womanAnimation.y = 401 + 722 / 2; //根据位置
            this.group_show.addChild(this._womanAnimation);
            this.group_show.swapChildren(this._womanAnimation, this.img_female);
            // this._womanAnimation.animation.play("Animation_1");
            animation.AnimationManager.getIns().playDragonLoop(this._womanAnimation, "Animation_1", this.onFrameEvent, this);
            // animation.AnimationManager.getIns().playDragonBone("Animation_2");
            this.adjustComponent(this._womanAnimation, true);
        };
        GameScenesLayer.prototype.onFrameEvent = function (event) {
            var eventName = event.frameLabel;
            switch (eventName) {
                case 'EVENT_LOVE': {
                    this.onPlayLove();
                    break;
                }
                case 'EVENT_KISS': {
                    this.onPlayKiss();
                    break;
                }
            }
        };
        GameScenesLayer.prototype.onPlayLove = function () {
            var _this = this;
            this.img_love.visible = true;
            this.img_love.alpha = 1;
            egret.Tween.get(this.img_love).to({ scaleX: 5, scaleY: 5, alpha: 0 }, 1500)
                .call(function () {
                _this.img_love.visible = false;
                _this.img_love.scaleX = _this.img_love.scaleY = 0.5;
            });
        };
        GameScenesLayer.prototype.onPlayKiss = function () {
            var _this = this;
            this.img_kiss.visible = true;
            this.img_kiss.alpha = 1;
            egret.Tween.get(this.img_kiss).to({ scaleX: 3.5, scaleY: 3.5, alpha: 0 }, 1500)
                .call(function () {
                _this.img_kiss.visible = false;
                _this.img_kiss.scaleX = _this.img_kiss.scaleY = 0.5;
            });
        };
        GameScenesLayer.prototype.initComponents = function () {
            this._userComponent_0 = new game.UserComponent(this.user_0, 0);
            var user = this._gameEngine.getMeUserItem();
            if (user == null)
                return;
            this.showUser(user, true);
        };
        /**
         * 适配屏幕
         * */
        GameScenesLayer.prototype.adjustScreen = function () {
            var _this = this;
            this._heightRate = this.stage.stageHeight / utils.GameConst.stageH;
            this.preview_bg.scaleY = this._heightRate;
            this._components.push(this.preview_bg);
            this._components.push(this.img_desk);
            this._components.push(this.group_animation);
            this._components.push(this.sequence_animation);
            this._components.push(this.plane_animation);
            this._components.push(this.bomb_animation);
            this._components.push(this.rocket_animation);
            this._components.push(this.no_card_animation);
            this._components.push(this.user_2);
            // this._components.push(this.container_out_cards_2);
            // this._components.push(this.head_2);
            // this._components.push(this.nickname_2);
            // this._components.push(this.gold_2);
            // this._components.push(this.left_cards);
            // this._components.push(this.warn_animation_2);
            this._components.push(this.user_1);
            // this._components.push(this.container_out_cards_1);
            // this._components.push(this.head_1);
            // this._components.push(this.nickname_1);
            // this._components.push(this.gold_1);
            // this._components.push(this.left_cards0);
            // this._components.push(this.warn_animation_1);
            this._components.push(this.user_0);
            this._components.push(this.container_out_cards_0);
            this._components.push(this.border_name);
            this._components.push(this.border_score);
            this._components.push(this.head_0);
            this._components.push(this.nickname_0);
            this._components.push(this.gold_0);
            this._components.push(this.img_cell_score);
            this._components.push(this.cell_score);
            this._components.push(this.warn_animation_0);
            this._components.push(this.animation_pass);
            this._components.push(this.text_pass_0);
            this._components.push(this.gold_flash_animation);
            this._components.push(this.group_btn);
            this._components.push(this.btn_share_cards);
            this._components.push(this.btn_get_gold);
            this._components.push(this.btn_cards_in);
            this._components.push(this.btn_no_cards);
            this._components.push(this.btn_pass);
            this._components.push(this.btn_out_cards);
            this._components.push(this.btn_back);
            this._components.push(this.btn_sound);
            this._components.push(this.btn_bgm);
            this._components.push(this.btn_ruler);
            this._components.push(this.btn_trustee);
            this._components.push(this._cantTips);
            this._components.push(this.hold_container_0);
            this._components.push(this.img_trustee);
            this._components.push(this.btn_cancel_trustee);
            // img_trustee
            // btn_cancel_trustee
            this._components.forEach(function (component) {
                component.y = component.y * _this._heightRate;
            });
            this._scaleComponent.push(this.user_1);
            this._scaleComponent.push(this.user_2);
            if (game.RATE <= 0.9) {
                this.hold_container_0.scaleX = this.hold_container_0.scaleY = game.RATE + 0.1;
            }
            else {
                this._scaleComponent.push(this.hold_container_0);
            }
            this._scaleComponent.push(this.container_out_cards_0);
            this._scaleComponent.push(this.btn_out_cards);
            this._scaleComponent.push(this.btn_pass);
            this._scaleComponent.push(this.btn_back);
            this._scaleComponent.push(this.btn_bgm);
            this._scaleComponent.push(this.btn_get_gold);
            this._scaleComponent.push(this.btn_share_cards);
            this._scaleComponent.push(this.btn_ruler);
            // this._scaleComponent.push(this.img_trustee);
            this._scaleComponent.push(this.btn_cancel_trustee);
            // this._scaleComponent.push(this.btn_again);
            this._scaleComponent.forEach(function (component) {
                component.scaleX = component.scaleY = _this._heightRate;
            });
        };
        GameScenesLayer.prototype.adjustComponent = function (component, scale) {
            if (scale) {
                component.scaleX = component.scaleY = this._heightRate;
            }
            component.y = component.y * this._heightRate;
        };
        GameScenesLayer.prototype.start = function () {
            //播放游戏开始音效
            sound.SoundManager.getIns().playSoundAsync("GAME_START_mp3");
            //首先清理
            this.btnDisable();
            this.btn_again.visible = false;
            this.hold_container_0.touchChildren = false;
        };
        /**=========================初始化各类组件逻辑=============================*/
        /**
         * 发牌动画前
         * */
        GameScenesLayer.prototype.initCards = function (cards) {
            this.btn_pass.visible = false;
            this.btn_out_cards.visible = false;
            for (var n = 0; n < this._cards.length; n++) {
                this.hold_container_0.removeChild(this._cards[n]);
            }
            this._cards = [];
            for (var n = cmd.NORMAL_COUNT - 1; n >= 0; n--) {
                var card = new game.Poker(cards[n]); //0x01
                card.x = CARDS_CONFIG.oriX + n * CARDS_CONFIG.dealOff;
                card.y = CARDS_CONFIG.oriY - n * CARDS_CONFIG.dealOff;
                this.container_out_cards_0.addChild(card);
                this._cards.push(card);
            }
            var origin = this.getConfigs().reverse(); //得到所有手牌目标位置
            this.dealCards(origin);
        };
        /*
        * 清理游戏桌面
        * */
        GameScenesLayer.prototype.clearDesk = function (call) {
            var _this = this;
            var self = this;
            var callBack = function () {
                //清空按钮
                self.btn_again.visible = false;
                self.warn_animation_0.visible = false;
                self.warn_animation_1.visible = false;
                self.warn_animation_2.visible = false;
                self.left_cards_1.visible = false;
                self.left_cards_2.visible = false;
                self._warningFlag_0 = false;
                self._warningFlag_1 = false;
                self._warningFlag_2 = false;
                // utils.GameConst.colorConsole("桌面清空");
                self._lastCards = [];
                self.stopHeadOperate();
                self.removeMask();
                self.btn_trustee.visible = false;
                self.btn_share_cards.visible = false;
                self.btn_out_cards.visible = false;
                self.btn_pass.visible = false;
                for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                    self["container_out_cards_" + n].removeChildren();
                    if (self["text_pass_" + n]) {
                        self["text_pass_" + n].visible = false;
                    }
                    if (n != 0) {
                        self["left_cards_" + n]["left_cards"].text = cmd.NORMAL_COUNT + "";
                        self["_userCardCount_" + n] = cmd.NORMAL_COUNT;
                    }
                }
                for (var n = 0; n < self._cards.length; n++) {
                    utils.GameConst.removeChild(self._cards[n]);
                    // self.hold_container_0.removeChild(this._cards[n]);
                }
                self._cards = [];
                // self.hold_container_0.removeChildren();
                self.btn_again.visible = true;
                if (call) {
                    call(self.btn_again);
                }
                if (self._currentReady) {
                    _this.btn_again.visible = false;
                }
                self.hold_container_0.touchChildren = true;
                self.img_trustee.visible = false;
                self.btn_cancel_trustee.visible = false;
                self._ifTrustee = false;
                self.user_0.visible = true;
            };
            if (this.initFlag) {
                callBack();
            }
        };
        Object.defineProperty(GameScenesLayer.prototype, "lastCards", {
            get: function () {
                return this._lastCards;
            },
            enumerable: true,
            configurable: true
        });
        GameScenesLayer.prototype.beginAction = function () {
            var callBack = this.actionQueue[0];
            if (callBack != null) {
                callBack();
                this.actionQueue.splice(0, 1);
                this.beginAction();
            }
        };
        /**
         * 添加各类按钮事件
         * */
        GameScenesLayer.prototype.initBtn = function () {
            this.btn_out_cards.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOutCards, this);
            this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExit, this);
            this.btn_again.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAgain, this);
            this.btn_share_cards.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareCards, this);
            this.btn_get_gold.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getGold, this);
            this.btn_ruler.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showRuler, this);
            this.group_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cardsIn, this);
            this.btn_bgm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toggleSound, this);
            this.btn_pass.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPass, this);
            this.btn_no_cards.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPass, this);
            this.btn_trustee.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTrustee, this);
            this.btn_cancel_trustee.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelTrustee, this);
            this.addBtnChange(this.btn_out_cards);
            this.addBtnChange(this.btn_back);
            this.addBtnChange(this.btn_again);
            this.addBtnChange(this.btn_share_cards);
            this.addBtnChange(this.btn_get_gold);
            this.addBtnChange(this.btn_ruler);
            this.addBtnChange(this.btn_cancel_trustee);
            this.addBtnChange(this.btn_trustee);
            this.addBtnChange(this.btn_no_cards);
            // this.addBtnChange(this.group_btn);
            // this.addBtnChange(this.btn_bgm);
            this.addBtnChange(this.btn_pass);
        };
        GameScenesLayer.prototype.addBtnChange = function (button) {
            button.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        };
        GameScenesLayer.prototype.removeBrnChange = function (button) {
            button.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        };
        GameScenesLayer.prototype.onTouchBeginChange = function (e) {
            this._touchButton = e.currentTarget;
            var scale = this._touchButton.scaleX - 0.1;
            this._touchButton.scaleX = this._touchButton.scaleY = scale;
        };
        GameScenesLayer.prototype.onTouchMoveChange = function (e) {
            if (e.currentTarget != this._touchButton) {
            }
        };
        GameScenesLayer.prototype.onTouchEndChange = function (e) {
            if (e.currentTarget != this._touchButton) {
            }
            if (null != this._touchButton) {
                var scale = this._touchButton.scaleX + 0.1;
                this._touchButton.scaleX = this._touchButton.scaleY = scale;
            }
            this._touchButton = null;
        };
        GameScenesLayer.prototype.btnDisable = function () {
            console.log("禁用按钮");
            this.btn_out_cards.enabled = false;
            this.btn_back.enabled = false;
            this.btn_again.enabled = false;
            this.btn_share_cards.enabled = false;
            this.btn_get_gold.enabled = false;
            this.btn_ruler.enabled = false;
            this.btn_bgm.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.toggleSound, this);
            // this.btn_cards_in.enabled = false;
            this.group_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.cardsIn, this, false);
            this.btn_pass.enabled = false;
            this.btn_cancel_trustee.enabled = false;
            this.btn_trustee.enabled = false;
        };
        GameScenesLayer.prototype.btnActive = function () {
            console.log("启用按钮");
            this.btn_out_cards.enabled = true;
            this.btn_back.enabled = true;
            this.btn_again.enabled = true;
            this.btn_share_cards.enabled = true;
            this.btn_get_gold.enabled = true;
            this.btn_ruler.enabled = true;
            this.btn_bgm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toggleSound, this);
            // this.btn_cards_in.enabled = true;
            this.group_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cardsIn, this, false);
            this.btn_pass.enabled = true;
            this.btn_cancel_trustee.enabled = true;
            this.btn_trustee.enabled = true;
        };
        GameScenesLayer.prototype.addEvent = function () {
            this.hold_container_0.touchChildren = false;
            this.hold_container_0.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchContainer, this);
            this.hold_container_0.addEventListener(egret.TouchEvent.TOUCH_END, this.touchContainer, this);
            this.hold_container_0.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchContainer, this);
            this.hold_container_0.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.touchContainer, this);
            this.hold_container_0.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchContainer, this);
        };
        GameScenesLayer.prototype.removeEvent = function () {
            this.hold_container_0.touchChildren = true;
            this.hold_container_0.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchContainer, this);
            this.hold_container_0.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchContainer, this);
            this.hold_container_0.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchContainer, this);
            this.hold_container_0.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.touchContainer, this);
            this.hold_container_0.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchContainer, this);
        };
        GameScenesLayer.prototype.touchContainer = function (event) {
            event.stopPropagation();
            switch (event.type) {
                case egret.TouchEvent.TOUCH_BEGIN:
                case egret.TouchEvent.TOUCH_MOVE: {
                    //获得开始的节点
                    var point = new egret.Point(event.localX, event.localY);
                    if (event.type == egret.TouchEvent.TOUCH_BEGIN) {
                        this.mTouchStart = point;
                        this._beginR = Math.sqrt(Math.pow(point.x - CARDS_CONFIG.x, 2) + Math.pow(point.y - CARDS_CONFIG.y, 2));
                        this._lock = true;
                    }
                    if (!this._lock) {
                        return;
                    }
                    var tp = this.mTouchStart.x < point.x ? this.mTouchStart : point; //保存小的节点
                    var tp2 = this.mTouchStart.x < point.x ? point : this.mTouchStart; //较大节点
                    var startIndex = void 0, endIndex = void 0;
                    var _a = [this.computeAngle(tp), this.computeAngle(tp2)], angle1 = _a[0], angle2 = _a[1];
                    var config = this.getConfigs();
                    var startSearch = void 0, endSearch = void 0;
                    //最开始的判断应该是起始点的位置
                    var last2 = Math.atan(132 / (CARDS_CONFIG.r2 - 90)) * 180 / Math.PI;
                    // console.log(last2);
                    if (config.length > 13) {
                        // && this.computeAngle(this.mTouchStart) < config[config.length - 1].rotation + last2 &&
                        // this.computeAngle(this.mTouchStart) > config[13].rotation - CARDS_CONFIG.off
                        if ((this._beginR < CARDS_CONFIG.r2 + 90 && this._beginR > CARDS_CONFIG.r2 - 90) && this.computeAngle(this.mTouchStart) < config[config.length - 1].rotation + last2 &&
                            this.computeAngle(this.mTouchStart) > config[13].rotation - CARDS_CONFIG.off) {
                            startSearch = 13;
                            endSearch = this._cards.length;
                        }
                        else if (this._beginR > CARDS_CONFIG.r - 90 && this._beginR < CARDS_CONFIG.r + 90) {
                            startSearch = 0;
                            endSearch = this._cards.length < 13 ? this._cards.length : 13;
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        if (this._beginR > CARDS_CONFIG.r - 90 && this._beginR < CARDS_CONFIG.r + 90) {
                            startSearch = 0;
                            endSearch = this._cards.length < 13 ? this._cards.length : 13;
                        }
                        else {
                            return;
                        }
                    }
                    var rp = void 0;
                    if (endSearch > 13) {
                        rp = CARDS_CONFIG.r2;
                    }
                    else {
                        rp = CARDS_CONFIG.r;
                    }
                    var lastRotation = Math.atan(132 / (rp - 90)) * 180 / Math.PI;
                    for (var n = startSearch; n < endSearch; n++) {
                        if (n == endSearch - 1) {
                            if (config[n].rotation + lastRotation - CARDS_CONFIG.off >= angle1) {
                                startIndex = n;
                                break;
                            }
                        }
                        if (config[n].rotation >= angle1) {
                            startIndex = n;
                            break;
                        }
                    }
                    //Version 1.0
                    for (var n = endSearch - 1; n >= startSearch; n--) {
                        if (config[n].rotation - CARDS_CONFIG.off <= angle2) {
                            endIndex = n;
                            break;
                        }
                    }
                    // console.log("开始节点", startIndex, endIndex);
                    if (startIndex == undefined || endIndex == undefined)
                        return;
                    this._lastEnd = new egret.Point(startIndex, endIndex);
                    for (var n = 0; n < this._cards.length; n++) {
                        this._cards[n].removeMask();
                    }
                    for (var n = startIndex; n <= endIndex; n++) {
                        this._cards[n].addMask();
                    }
                    // if (event.type)
                    break;
                }
                case egret.TouchEvent.TOUCH_END:
                case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
                case egret.TouchEvent.TOUCH_CANCEL: {
                    if (!this._lock) {
                        return;
                    }
                    if (event.type == egret.TouchEvent.TOUCH_RELEASE_OUTSIDE) {
                        // console.log("触发屏外事件！");
                        for (var n = 0; n < this._cards.length; n++) {
                            this._cards[n].removeMask();
                        }
                        if (this._lastEnd) {
                            for (var n = this._lastEnd.x; n <= this._lastEnd.y; n++) {
                                this._cards[n].removeMask();
                                this._cards[n].toggleSelected();
                            }
                        }
                        this._lock = false;
                        return;
                    }
                    //获得开始的节点
                    var point = new egret.Point(event.localX, event.localY);
                    var tp = this.mTouchStart.x < point.x ? this.mTouchStart : point; //保存小的节点
                    var tp2 = this.mTouchStart.x < point.x ? point : this.mTouchStart; //较大节点
                    var startIndex = void 0, endIndex = void 0;
                    var _b = [this.computeAngle(tp), this.computeAngle(tp2)], angle1 = _b[0], angle2 = _b[1];
                    var config = this.getConfigs();
                    var startSearch = void 0, endSearch = void 0;
                    //最开始的判断应该是起始点的位置
                    var last2 = Math.atan(132 / (CARDS_CONFIG.r2 - 90)) * 180 / Math.PI;
                    // console.log(last2);
                    // let lastRotation = Math.atan(132/rp - 90) * 180 / Math.PI;
                    if (config.length > 13) {
                        // && this.computeAngle(this.mTouchStart) < config[config.length - 1].rotation + last2 &&
                        //     this.computeAngle(this.mTouchStart) > config[13].rotation - CARDS_CONFIG.off
                        if ((this._beginR < CARDS_CONFIG.r2 + 90 && this._beginR > CARDS_CONFIG.r2 - 90) && this.computeAngle(this.mTouchStart) < config[config.length - 1].rotation + last2 &&
                            this.computeAngle(this.mTouchStart) > config[13].rotation - CARDS_CONFIG.off) {
                            startSearch = 13;
                            endSearch = this._cards.length;
                        }
                        else if (this._beginR > CARDS_CONFIG.r - 90 && this._beginR < CARDS_CONFIG.r + 90) {
                            startSearch = 0;
                            endSearch = this._cards.length < 13 ? this._cards.length : 13;
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        if (this._beginR > CARDS_CONFIG.r - 90 && this._beginR < CARDS_CONFIG.r + 90) {
                            startSearch = 0;
                            endSearch = this._cards.length < 13 ? this._cards.length : 13;
                        }
                        else {
                            return;
                        }
                    }
                    var rp = void 0;
                    if (endSearch > 13) {
                        rp = CARDS_CONFIG.r2;
                    }
                    else {
                        rp = CARDS_CONFIG.r;
                    }
                    var lastRotation = Math.atan(132 / (rp - 90)) * 180 / Math.PI;
                    //Versiton 1.0
                    for (var n = startSearch; n < endSearch; n++) {
                        if (n == endSearch - 1) {
                            if (config[n].rotation + lastRotation - CARDS_CONFIG.off >= angle1) {
                                startIndex = n;
                                break;
                            }
                        }
                        if (config[n].rotation >= angle1) {
                            startIndex = n;
                            break;
                        }
                    }
                    //Version 1.0
                    for (var n = endSearch - 1; n >= startSearch; n--) {
                        if (config[n].rotation - CARDS_CONFIG.off <= angle2) {
                            endIndex = n;
                            break;
                        }
                    }
                    // console.log("开始节点", startIndex, endIndex);
                    if (startIndex == undefined || endIndex == undefined)
                        return;
                    for (var n = startIndex; n <= endIndex; n++) {
                        this._cards[n].removeMask();
                        this._cards[n].toggleSelected();
                        this.mTouchStart = null;
                    }
                    console.log("clearCards:742");
                    this._myOutCards = [];
                    for (var n = 0; n < this._cards.length; n++) {
                        if (this._cards[n].status == true) {
                            this._myOutCards.push(this._cards[n].value);
                        }
                    }
                    var previewOutCards = {
                        cards: this._myOutCards.concat()
                    };
                    var lastOutCards = {
                        cards: this._lastCards.concat()
                    };
                    this.btn_out_cards.enabled = this._gameLogic.assertPresent(previewOutCards, lastOutCards);
                    // console.log("%c可否出牌:",  "color: blue;font-size: 1.5em");
                    // console.log(this.btn_out_cards.enabled);
                    // console.log(previewOutCards.cards);
                    this._lock = false;
                    break;
                }
            }
        };
        GameScenesLayer.prototype.computeAngle = function (point) {
            //
            var direction = point.x >= CARDS_CONFIG.x ? 1 : -1;
            var r = Math.sqrt(Math.pow(point.x - CARDS_CONFIG.x, 2) + Math.pow(point.y - CARDS_CONFIG.y, 2));
            var cosVal = Math.abs(point.y - CARDS_CONFIG.y) / r;
            return direction * Math.acos(cosVal) * (180 / Math.PI);
        };
        /**==========================按钮事件============================*/
        GameScenesLayer.prototype.onOutCards = function (e) {
            e.stopPropagation();
            for (var n = 0; n < this._cards.length; n++) {
                this._cards[n].removeMask();
            }
            var outCards = this._myOutCards.concat();
            this._gameEngine.requestOutCard(outCards);
            // utils.GameConst.getInstance().logPoker(outCards.concat());
            this._myOutCards = []; //after
        };
        GameScenesLayer.prototype.deleteCardsFormHold = function (cards) {
            while (cards.length > 0) {
                var value = cards.pop();
                for (var n = 0; n < this._cards.length; n++) {
                    if (this._cards[n].value == value) {
                        var card = this._cards.splice(n, 1)[0];
                        this.hold_container_0.removeChild(card);
                        break;
                    }
                }
            }
            this.moveCards();
        };
        /**
         * 退出游戏
         * */
        GameScenesLayer.prototype.onExit = function (e) {
            for (var n = 0; n < this._cards.length; n++) {
                this._cards[n].removeMask();
            }
            e.stopPropagation();
            var self = this;
            var status = this._gameEngine.getGameStatus() == cmd.GAME_SCENE_FREE;
            var msg = this._gameEngine.getGameStatus() == cmd.GAME_SCENE_FREE ? "是否确定退出游戏？" : "游戏已经开始，退出将由憨憨机器人代打哦！\n 是否确定退出游戏？";
            if (status == false) {
                //弹窗
                var ExitPopup = new game.ExitTip(function () {
                    self._gameEngine.onExitGame();
                }, function () {
                    self.removeCurrentPopup();
                });
                ExitPopup.y = 400;
                ExitPopup.horizontalCenter = 0;
                self.adjustComponent(game.ExitTip, true);
                self.addPopup(ExitPopup);
            }
            else {
                self._gameEngine.onExitGame();
            }
        };
        GameScenesLayer.prototype.onAgain = function (e) {
            this._showAnimation = true;
            this.btn_again.visible = false;
            for (var n = 0; n < this._cards.length; n++) {
                this._cards[n].removeMask();
            }
            if (e) {
                e.stopPropagation();
            }
            // this.start();
            if (this._readyUser.length != 2 && this.userList.length > 2) {
                this.playWaitingAnimation();
            }
            else if (this.userList.length < 3) {
                this.matching_animation.visible = true;
                animation.AnimationManager.getIns().playAnimationLoop(this.matching_animation["matchingAnimation"]);
            }
            this._gameEngine._gameFrame.onUserReady();
            this.currentReady();
            this._currentReady = true;
            //标记当前玩家进入准备状态
            this._gameEngine.clearTimer();
        };
        /*将当前玩家的状态改变为准备*/
        GameScenesLayer.prototype.currentReady = function () {
            this.userList.forEach(function (user) {
                if (user.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                    user.cbUserStatus = df.US_READY;
                }
            });
        };
        GameScenesLayer.prototype.playWaitingAnimation = function () {
            this.waiting_animation.visible = true;
            animation.AnimationManager.getIns().playAnimationLoop(this.waiting_animation["WaitingAnimation"]);
        };
        //保存当前游戏截图，并且进行转发
        GameScenesLayer.prototype.shareCards = function (e) {
            for (var n = 0; n < this._cards.length; n++) {
                this._cards[n].removeMask();
            }
            e.stopPropagation();
            platform.screenShop(game.RATE);
        };
        //领取金币
        GameScenesLayer.prototype.getGold = function (e) {
            var _this = this;
            var status = game.GameEngine.getInstance().getGameStatus();
            if (status == cmd.GAME_SCENE_PLAY) {
                this.cantSignIn().then(function () {
                });
                return;
            }
            var self = this;
            for (var n = 0; n < this._cards.length; n++) {
                this._cards[n].removeMask();
            }
            e.stopPropagation();
            if (null == this._goldPopup) {
                managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
                RES.loadGroup("goldPopup").then(function () {
                    managers.FrameManager.getInstance().dismissPopWait();
                    self._goldPopup = new game.GoldPopup(self);
                    self._goldPopup.horizontalCenter = 0;
                    self._goldPopup.y = 202;
                    self.adjustComponent(_this._goldPopup, true);
                    self.addPopup(_this._goldPopup);
                }).catch(function (err) {
                    managers.FrameManager.getInstance().dismissPopWait();
                    game.GameEngine.getInstance().showMessage(err);
                });
            }
            else {
                self.addPopup(this._goldPopup);
            }
        };
        GameScenesLayer.prototype.cantSignIn = function () {
            var _this = this;
            var self = this;
            if (this._tipLock)
                return Promise.resolve();
            return new Promise(function (resolve, reject) {
                _this._tipLock = true;
                _this._cantTips.visible = true;
                _this._cantTips.alpha = 1;
                var origin = _this._cantTips.y;
                // let label = new eui.Label();
                // label.text = "游戏过程中不能进行领金币哦！";
                // label.x = CANT_ANIMATION_POSITION.x;
                // label.y = CANT_ANIMATION_POSITION.y;
                // label.size = CANT_ANIMATION_POSITION.size;
                // label.textColor = CANT_ANIMATION_POSITION.color;
                // self.addChild(label);
                var wish = {
                    // y: origin - 150,
                    alpha: 0
                };
                egret.Tween.get(_this._cantTips).to(wish, 1000, egret.Ease.quartIn).call(function () {
                    // self.removeChild(this._cantTips);
                    // this._cantTips.y = origin;
                    _this._tipLock = false;
                    _this._cantTips.visible = false;
                    resolve();
                });
            });
        };
        GameScenesLayer.prototype.removeMask = function () {
            if (this._rulerMaster) {
                utils.GameConst.removeChild(this._rulerMaster);
            }
        };
        GameScenesLayer.prototype.showRuler = function (e) {
            for (var n = 0; n < this._cards.length; n++) {
                this._cards[n].removeMask();
            }
            e.stopPropagation();
            if (null == this._rulerGroup) {
                this._rulerGroup = new eui.Group();
                this._rulerGroup.horizontalCenter = 0;
                this._rulerGroup.y = 202;
                this.adjustComponent(this._rulerGroup, true);
            }
            if (null == this._rulerScene) {
                this._rulerScene = new eui.Image(RES.getRes("game_ruler_png"));
            }
            if (null == this._btnRulerClose) {
                this._btnRulerClose = new eui.Image(RES.getRes("btn_close_png"));
                this._btnRulerClose.top = 10;
                this._btnRulerClose.right = 15;
            }
            this._rulerGroup.addChild(this._rulerScene);
            this._rulerGroup.addChild(this._btnRulerClose);
            this.addPopup(this._rulerGroup);
            this._btnRulerClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.removeCurrentPopup, this);
        };
        GameScenesLayer.prototype.removeRuler = function (e) {
            e.stopPropagation();
            this.removeChild(this._rulerMaster);
            this._rulerGroup.removeChild(this._rulerScene);
            this._rulerGroup.removeChild(this._btnRulerClose);
            this.removeChild(this._rulerGroup);
        };
        GameScenesLayer.prototype.addPopup = function (popup) {
            if (this._currentPopup) {
                this.removePopup(this._currentPopup);
                this._currentPopup = null;
            }
            //mark
            // this.adjustComponent(popup, true);
            this._currentPopup = popup;
            if (null == this._rulerMaster) {
                this._rulerMaster = new eui.Rect(this.width, this.height, 0x000000);
                this._rulerMaster.fillAlpha = 0.5;
            }
            this.addChild(this._rulerMaster);
            this.addChild(this._currentPopup);
        };
        GameScenesLayer.prototype.removeCurrentPopup = function () {
            this.removePopup(this._currentPopup);
            this._currentPopup = null;
        };
        GameScenesLayer.prototype.removePopup = function (popup) {
            utils.GameConst.removeChild(popup);
            if (this._rulerMaster) {
                utils.GameConst.removeChild(this._rulerMaster);
            }
        };
        GameScenesLayer.prototype.cardsIn = function () {
            // console.log("949");
            this._myOutCards = [];
            this.btn_out_cards.enabled = false;
            this._cards.forEach(function (poker) {
                poker.ontOut();
            });
        };
        Object.defineProperty(GameScenesLayer.prototype, "soundIsOpen", {
            get: function () {
                return this._bgm_open;
            },
            enumerable: true,
            configurable: true
        });
        /*
        * 背景游戏开关
        * */
        GameScenesLayer.prototype.toggleSound = function () {
            //更换按钮图片的资源
            if (this._bgm_open == false) {
                this.btn_bgm.source = RES.getRes("btn_open_music_png");
                sound.SoundManager.getIns().playBG(game.BGM_SOURCE);
            }
            else {
                this.btn_bgm.source = RES.getRes("btn_mute_png");
                sound.SoundManager.getIns().stopBg();
            }
            this._bgm_open = !this._bgm_open;
        };
        GameScenesLayer.prototype.onPass = function () {
            // this.removeEvent();
            this.btn_out_cards.visible = false;
            this.btn_pass.visible = false;
            this.btn_no_cards.visible = false;
            this.text_pass_0.visible = true;
            this.stopHeadOperate();
            if (this._passTimer) {
                this._passTimer.stop();
                this._passTimer = null;
            }
            this._gameEngine.requestPass();
        };
        GameScenesLayer.prototype.onTrustee = function () {
            this._gameEngine.requestTrustee(true);
            this.addCancelBtn();
            //取消自动不出命令
            if (this._passTimer) {
                this._passTimer.stop();
                this._passTimer = null;
            }
            //等待服务器托管命令
            // this.btn_cancel_trustee.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelTrustee, this);
            if (this._onMyOpera) {
            }
        };
        GameScenesLayer.prototype.onCancelTrustee = function () {
            this._gameEngine.requestTrustee(false);
            var myTime = false;
            if (this._onMyOpera) {
                myTime = true;
            }
            this.removeCancelBtn(myTime);
            // this.btn_trustee.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTrustee, this);
        };
        GameScenesLayer.prototype.stopHeadOperate = function () {
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                if (this["user_info_" + n]) {
                    this["user_info_" + n].stopOperate();
                }
            }
        };
        /**======================================================*/
        /**==========================数据处理============================*/
        GameScenesLayer.prototype.getIndex = function (index, length, subLength) {
            var center;
            if (subLength == 0) {
                center = (length % 2) ? Math.floor(length / 2) : length / 2;
                return index - center;
            }
            if (length > subLength) {
                if (index < subLength) {
                    center = (subLength % 2) ? Math.floor(subLength / 2) : subLength / 2;
                    return index - center;
                }
                else {
                    center = (length - subLength) % 2 ? Math.floor((length - subLength) / 2) : (length - subLength) / 2;
                    return index - subLength - center;
                }
            }
            else {
                center = (length % 2) ? Math.floor(length / 2) : length / 2;
                return index - center;
            }
        };
        GameScenesLayer.prototype.moveCards = function () {
            var config = this.getConfigs();
            this._cards.forEach(function (poker) {
                poker.ontOut();
            });
            this.moveCardsByConfig(config);
        };
        /*
        * 生成配置
        * */
        GameScenesLayer.prototype.getConfigs = function () {
            var config = [];
            for (var n = 0; n < this._cards.length; n++) {
                var index = this.getIndex(n, this._cards.length, 13);
                var angle = 90 - index * CARDS_CONFIG.off + CARDS_CONFIG.offA;
                var rotation = Math.abs(90 - angle);
                var last = void 0;
                if (angle > 90) {
                    last = -rotation;
                }
                else {
                    last = rotation;
                }
                var radius = (n > 12) ? CARDS_CONFIG.r2 : CARDS_CONFIG.r;
                var item = {
                    x: CARDS_CONFIG.x + Math.cos(((2 * Math.PI) / 360) * angle) * radius,
                    y: CARDS_CONFIG.y - Math.sin(((2 * Math.PI) / 360) * angle) * radius,
                    rotation: last
                };
                config.push(item);
            }
            return config;
        };
        /**
         * 通过配置移动手牌
         * */
        GameScenesLayer.prototype.moveCardsByConfig = function (config) {
            var _this = this;
            this._configCount = 0;
            var self = this;
            return new Promise(function (resolve, reject) {
                if (config.length == 0)
                    resolve();
                for (var n = 0; n < self._cards.length; n++) {
                    egret.Tween.get(_this._cards[n]).to(config[n], 100).call(function () {
                        self._configCount++;
                        if (self._configCount == config.length)
                            resolve();
                    });
                }
            });
        };
        /*
        * 发牌动画
        * */
        GameScenesLayer.prototype.dealCards = function (config) {
            var _this = this;
            var length = this._cards.length - 1;
            var self = this;
            sound.SoundManager.getIns().playSoundAsync("GAME_SEND_CAED_mp3");
            var move = function (index) {
                if (index == 13) {
                    if (self.maxIndex) {
                        utils.GameConst.removeChild(self.maxIndex);
                        self.maxIndex = null;
                    }
                    _this.maxIndex = new egret.Sprite();
                    _this.hold_container_0.addChild(self.maxIndex);
                }
                if (_this._cards[index] == null) {
                    return;
                }
                //容器转移
                var card = _this._cards[index];
                utils.GameConst.removeChild(card);
                card.x = CARDS_CONFIG.dealX + index * CARDS_CONFIG.dealOff;
                card.y = CARDS_CONFIG.dealY + index * CARDS_CONFIG.dealOff;
                _this.hold_container_0.addChild(card);
                egret.Tween.get(_this._cards[index]).to(config[index], 100).call(function () {
                    if (index - 1 >= 0) {
                        move(index - 1);
                    }
                    else {
                        _this._cards.reverse(); //数组重新排列手牌
                        _this.changeToFront();
                    }
                });
            };
            move(length);
        };
        /**
         * 翻牌动画
         * */
        GameScenesLayer.prototype.changeToFront = function () {
            var _this = this;
            var self = this;
            var time = FLOP_TIME / this._cards.length;
            var move = function (index) {
                egret.Tween.get(self._cards[index]).to({ scaleX: 0 }, time / 2).call(function () {
                    // console.log(self.maxIndex);
                    if (null == self._cards[index])
                        return;
                    self.hold_container_0.swapChildren(self._cards[index], self.maxIndex);
                    self._cards[index].changeToFront();
                }).to({ scaleX: 1 }, time / 2).call(function () {
                    self.hold_container_0.swapChildren(self._cards[index], self.maxIndex);
                    if (index < self._cards.length - 1) {
                        move(index + 1);
                    }
                    else {
                        var user = {
                            index: _this.firstUser
                        };
                        // console.log("翻牌动画完成，此时");
                        _this.startMove(user.index);
                    }
                });
            };
            move(0);
        };
        /**
         * 优先权动画
         * */
        GameScenesLayer.prototype.startMove = function (index) {
            if (this._movePoker) {
                utils.GameConst.removeChild(this._movePoker);
            }
            this._movePoker = new egret.Sprite();
            var bitmap = new egret.Bitmap(RES.getRes("poker_03"));
            this._movePoker.addChild(bitmap);
            var logo = new eui.Image(RES.getRes("priority_logo_png"));
            this._movePoker.addChild(logo);
            logo.x = 30;
            logo.top = 0;
            utils.GameConst.setAnchorCenter(this._movePoker);
            this._movePoker.x = PRIORITY_POSITION.x;
            this._movePoker.y = PRIORITY_POSITION.y;
            this.container_out_cards_0.addChild(this._movePoker);
            this.scaleAnimation(this._movePoker, index);
        };
        GameScenesLayer.prototype.scaleAnimation = function (target, index) {
            var _this = this;
            var origin = {
                scaleX: 1,
                scaleY: 1
            };
            var destination = {
                scaleX: 2,
                scaleY: 2
            };
            var last = {
                alpha: 0,
                x: USER_POSITION[index].x,
                y: USER_POSITION[index].y
            };
            var rotation;
            switch (index) {
                case 0: {
                    rotation = 0;
                    break;
                }
                case 1: {
                    rotation = 45;
                    break;
                }
                case 2: {
                    rotation = -45;
                    break;
                }
            }
            egret.Tween.get(target).to(destination, PRIORITY_POSITION.time / 6).wait(50).to(origin, PRIORITY_POSITION.time / 6).wait(50)
                .to(destination, PRIORITY_POSITION.time / 6).wait(50).to(origin, PRIORITY_POSITION.time / 6).wait(50)
                .to({ rotation: rotation }, PRIORITY_POSITION.time / 6).wait(50).to(last, PRIORITY_POSITION.time / 6).wait(50).call(function () {
                utils.GameConst.removeChild(_this._movePoker);
                // this.btn_out_cards.visible = true;
                // this.btn_pass.visible = true;
                _this.btn_trustee.visible = true;
                _this.btn_share_cards.visible = true;
                _this.addEvent();
                _this.btnActive();
                // console.log("开始游戏动画播放完成,用户开始出牌");
                _this.onNotifyStartCards(_this.firstUser, true);
            });
        };
        GameScenesLayer.prototype.moveAnimation = function (target, destination, time) {
            return egret.Tween.get(target).to(destination, time);
        };
        /**
         * 签到动画
         * */
        GameScenesLayer.prototype.playSignIn = function (n) {
            var _this = this;
            if (null == this._goldAnimation) {
                this._goldAnimation = new game.GoldAddAnimation(n);
                this.adjustComponent(this._goldAnimation);
            }
            this.addChild(this._goldAnimation);
            this._goldAnimation.setPosition(n);
            this._itemLength = this._goldAnimation["goldAnimation"].items.length;
            this._goldAnimation["goldAnimation"].items.forEach(function (item) {
                item.addEventListener("complete", _this.itemComplete, _this);
            });
            this._goldAnimation["goldAnimation"].play(0);
        };
        GameScenesLayer.prototype.itemComplete = function () {
            this._comCount++;
            this._userComponent_0.addGolds(200, 10);
            if (this._comCount == this._itemLength) {
                this._itemLength = 0;
                this._comCount = 0;
                // console.log("%c金币增长动画播放完毕", "color: green; font-size: 1.5em");
                this._goldAnimation["goldAnimation"].stop();
                this.removeChild(this._goldAnimation);
            }
        };
        /**
         * 出牌表现
         * 需要判断用户的信息，当前客户端或者是其他客户端
         * */
        GameScenesLayer.prototype.outCard = function (user, cards, callBack) {
            // console.log("%c出牌ChairID", "color: red;font-size: 2em");
            console.log(user.index);
            this._outCards = [];
            var index = user.index;
            this.clearUser(index); //front
            var scale = index == 0 ? 0.8 : 0.6;
            for (var n = 0; n < cards.length; n++) {
                var poker = new game.Poker(cards[n], true);
                poker.changeToFront();
                poker.scaleX = poker.scaleY = scale;
                //得到牌的位置
                var subLength = index == 0 ? 0 : 8;
                var position = this.getIndex(n, cards.length, subLength);
                poker.x = OUT_CARD_CONFIG[index].x + position * OUT_CARD_CONFIG[index].off;
                if (n > 7 && subLength != 0) {
                    poker.y = OUT_CARD_CONFIG[index].y + OUT_CARD_CONFIG[index].offY;
                }
                else {
                    poker.y = OUT_CARD_CONFIG[index].y;
                }
                this._outCards.push(poker);
                this["container_out_cards_" + index].addChild(poker);
            }
            this.stopHeadOperate(); //after
            // let analyseCards: IAnalyseResult = {
            //     cards: cards.concat()
            // };
            // let cardType = this._gameLogic.analyseCardKind(analyseCards);
            // if (cardType == ECardType.CT_MISSILE_CARD) {
            //     //当前是火箭的情况，下家以及上家都需要过牌处理，然后自己继续继续开始出牌
            //     this.onMissilePass((user.index + 1) % 3, false);
            //     this.onMissilePass((user.index + 2) % 3, true);
            // }
        };
        /**
         * 异步出牌
         * */
        GameScenesLayer.prototype.asyncOutCard = function (user, cards, callBack) {
            var _this = this;
            var self = this;
            return new Promise(function (resolve, reject) {
                self._outCards = [];
                var promiseVec = [];
                var index = user.index;
                var scale = index == 0 ? 0.8 : 0.6;
                var sortCards = _this._gameLogic.sortOutCards(cards.concat());
                // if (index != 0) {
                for (var n = 0; n < sortCards.length; n++) {
                    var poker = new game.Poker(sortCards[n], true);
                    poker.changeToFront();
                    poker.scaleX = poker.scaleY = scale;
                    var subLength = index == 0 ? 0 : 8;
                    var position = _this.getIndex(n, sortCards.length, subLength);
                    poker.x = OUT_CARD_CONFIG[index].x + position * OUT_CARD_CONFIG[index].off;
                    if (n > 7 && subLength != 0) {
                        poker.y = OUT_CARD_CONFIG[index].y + OUT_CARD_CONFIG[index].offY;
                    }
                    else {
                        poker.y = OUT_CARD_CONFIG[index].y;
                    }
                    self._outCards.push(poker);
                    self["container_out_cards_" + index].addChild(poker);
                    // console.log("%c其他准备出牌:", "color: red;font-size: 2em");
                    // console.log(poker);
                }
                if (index != 0) {
                    self["left_cards_" + user.index]["left_cards"].text = self["_userCardCount_" + user.index] - cards.length + "";
                    self["_userCardCount_" + user.index] -= cards.length;
                }
                else {
                    self.deleteCardsFormHold(cards.concat()); //从手牌中移除
                }
                if (self._cards.length == 0 || self["_userCardCount_" + index] == 0) {
                    setTimeout(function () { self.clearDesk(); }, 3000);
                }
                // } else {
                //     promiseVec.push(this.outCardsAnimation(cards.concat()));
                // }
                // self.removeEvent();
                self.stopHeadOperate(); //after
                var analyseCards = {
                    cards: cards.concat()
                };
                var cardType = _this._gameLogic.analyseCardKind(analyseCards);
                if (index == 0) {
                    if (_this._cards.length != 0) {
                        _this.playFemaleAnimation(cardType, analyseCards.cards.length);
                    }
                    if (_this._cards.length <= 2 && _this._cards.length > 0 && self["_warningFlag_" + index] == false) {
                        promiseVec.push(self.playWarningAnimation(index));
                        self["_warningFlag_" + index] = true;
                    }
                }
                else if (self["_userCardCount_" + index] <= 2 && self["_userCardCount_" + index] > 0 && self["_warningFlag_" + index] == false) {
                    promiseVec.push(self.playWarningAnimation(index));
                    self["_warningFlag_" + index] = true;
                }
                if (cardType == game.ECardType.CT_MISSILE_CARD) {
                    promiseVec.push(_this.playTypeSound(cardType, analyseCards.cards.length, analyseCards.cards, user.cbGender));
                    Promise.all(promiseVec).then(function () {
                        if (self._cards.length == 0 || self["_userCardCount_" + index] == 0) {
                            self.clearDesk();
                        }
                        resolve();
                    }).catch(function (err) {
                        console.log(err);
                        resolve();
                    });
                }
                else {
                    promiseVec.push(_this.playTypeSound(cardType, analyseCards.cards.length, analyseCards.cards, user.cbGender));
                    Promise.all(promiseVec).then(function () {
                        resolve();
                    }).catch(function (err) {
                        console.log(err);
                        resolve();
                    });
                }
            });
        };
        /*
        * 扑克从手牌容器到出牌容器
        * 文字动画渐现之后渐隐
        * */
        GameScenesLayer.prototype.outCardsAnimation = function (cards) {
            var self = this;
            //从手牌中得到各张手牌的index
            var configs = this.getConfigs();
            var cardsConfig = [];
            for (var n = 0; n < cards.length; n++) {
                for (var m = 0; m < this._cards.length; m++) {
                    if (cards[n] == this._cards[m].value) {
                        cardsConfig.push(configs[m]);
                        break;
                    }
                }
            }
            //得到新的配置
            var newConfig = [];
            for (var n = 0; n < cardsConfig.length; n++) {
                newConfig.push(this.getNewConfig(cardsConfig[n]));
            }
            // console.log("%c新配置：", color)
            this._outCards = [];
            //getOutCardConfigs 得到所出的牌在OutCardContainer中的位置，使用动画的形式将他们移动出来
            //生成新牌
            for (var n = 0; n < newConfig.length; n++) {
                var poker = new game.Poker(cards[n], false);
                poker.changeToFront();
                // poker.scaleX = poker.scaleY = 0.8;
                poker.x = newConfig[n].x;
                poker.y = newConfig[n].y - 30;
                poker.rotation = newConfig[n].rotation;
                poker.visible = true;
                self._outCards.push(poker);
                self.container_out_cards_0.addChild(poker);
            }
            return new Promise(function (resolve, reject) {
                var outMove = function (index) {
                    var position = self.getIndex(index, cards.length, 0);
                    var toProperty = {
                        x: OUT_CARD_CONFIG[0].x + position * OUT_CARD_CONFIG[0].off + 66,
                        y: OUT_CARD_CONFIG[0].y + 90,
                        scaleX: 0.8,
                        scaleY: 0.8,
                        rotation: 0
                    };
                    egret.Tween.get(self._outCards[index]).to(toProperty, 200).call(function () {
                        if (index == newConfig.length - 1) {
                            resolve();
                        }
                    });
                };
                self.deleteCardsFormHold(cards.concat()); //从手牌中移除
                for (var n = 0; n < newConfig.length; n++) {
                    outMove(n);
                }
            });
        };
        /**
         * 排列出牌手牌
         * */
        GameScenesLayer.prototype.sortOutCards = function (cards) {
            return;
        };
        /**
         * 根据旧的配置(x、y、rotation)生成新的配置
         * */
        GameScenesLayer.prototype.getNewConfig = function (old) {
            var back = {
                x: old.x,
                y: old.y + 290,
                rotation: old.rotation
            };
            return back;
        };
        /**
         * 播放美女动画
         * */
        GameScenesLayer.prototype.playFemaleAnimation = function (type, length) {
            switch (type) {
                case game.ECardType.CT_MISSILE_CARD:
                case game.ECardType.CT_BOMB_CARD: {
                    animation.AnimationManager.getIns().playDragonBone("Animation_2");
                    break;
                }
                case game.ECardType.CT_THREE_LINE: //飞机
                case game.ECardType.CT_THREE_LINE_TAKE_ONE:
                case game.ECardType.CT_THREE_LINE_TAKE_TWO: {
                    if (length >= 6) {
                        animation.AnimationManager.getIns().playDragonBone("Animation_3");
                    }
                    break;
                }
                case game.ECardType.CT_SINGLE_LINE: // 顺子
                case game.ECardType.CT_DOUBLE_LINE: {
                    animation.AnimationManager.getIns().playDragonBone("Animation_4");
                    break;
                }
            }
        };
        /**
         * 异步播放动画
         * @param kind :牌型
         * @param cards : 手牌
         * */
        GameScenesLayer.prototype.playAnimationAsync = function (kind, cards) {
            var self = this;
            return new Promise(function (resolve, reject) {
                switch (kind) {
                    case game.ECardType.CT_MISSILE_CARD: {
                        self.rocket_animation.visible = true;
                        animation.AnimationManager.getIns().playAnimationAsync(self.rocket_animation["rocketAnimation"]).then(function () {
                            resolve();
                        });
                        break;
                    }
                    case game.ECardType.CT_BOMB_CARD: {
                        animation.AnimationManager.getIns().playAnimationAsync(self.bomb_animation["bombAnimation"]).then(function () {
                            resolve();
                        });
                        break;
                    }
                    case game.ECardType.CT_THREE_LINE:
                    case game.ECardType.CT_THREE_LINE_TAKE_ONE:
                    case game.ECardType.CT_THREE_LINE_TAKE_TWO: {
                        if (cards.length >= 6) {
                            animation.AnimationManager.getIns().playAnimationAsync(self.plane_animation["airAnimation"]).then(function () {
                                resolve();
                            });
                        }
                        else {
                            resolve();
                        }
                        break;
                    }
                    case game.ECardType.CT_SINGLE_LINE: {
                        animation.AnimationManager.getIns().playAnimationAsync(self.sequence_animation["requenceAnimation"]).then(function () {
                            resolve();
                        });
                        break;
                    }
                    default: {
                        resolve();
                    }
                }
            });
        };
        /**
         * 异步播放音效
         * @param kind: 牌型
         * @param count: 牌数
         * @param cards: 牌
         * @param cbGender: 性别 0-女 1-男
         * */
        GameScenesLayer.prototype.playTypeSound = function (kind, count, cards, cbGender) {
            var _this = this;
            var gender = cbGender == 2 ? "Woman_" : "Man_";
            return new Promise(function (resolve, reject) {
                var lastCard = {
                    cards: _this.lastCards.concat()
                };
                var cardLen = _this.lastCards.length;
                var lastKind = _this._gameLogic.analyseCardKind(lastCard);
                if (_this.lastCards.length != 0 && _this._gameLogic.analyseCardKind(lastCard) == kind) {
                    var promiseVec = [];
                    promiseVec.push(sound.SoundManager.getIns().playVoiceAsync(gender + "dani" + Math.ceil(Math.random() * 3) + "_mp3"));
                    Promise.all(promiseVec).then(function () {
                        resolve();
                    }).catch(function (err) {
                        resolve();
                    });
                    return;
                }
                switch (kind) {
                    case game.ECardType.CT_BOMB_CARD:
                    case game.ECardType.CT_MISSILE_CARD: {
                        var promiseVec = [];
                        promiseVec.push(sound.SoundManager.getIns().playSoundAsync("BOMB_mp3"));
                        if (kind == game.ECardType.CT_BOMB_CARD) {
                            promiseVec.push(sound.SoundManager.getIns().playVoiceAsync(gender + "zhadan_mp3"));
                        }
                        else {
                            promiseVec.push(sound.SoundManager.getIns().playVoiceAsync(gender + "wangzha_mp3"));
                        }
                        Promise.all(promiseVec).then(function () {
                            resolve();
                        }).catch(function (err) {
                            resolve();
                        });
                        break;
                    }
                    case game.ECardType.CT_THREE_LINE:
                    case game.ECardType.CT_THREE_LINE_TAKE_ONE:
                    case game.ECardType.CT_THREE_LINE_TAKE_TWO: {
                        var promiseVec = [];
                        if (count >= 6) {
                            promiseVec.push(sound.SoundManager.getIns().playSoundAsync("PLANE_mp3"));
                            promiseVec.push(sound.SoundManager.getIns().playVoiceAsync(gender + "feiji_mp3"));
                        }
                        else if (count == 5) {
                            promiseVec.push(sound.SoundManager.getIns().playVoiceAsync(gender + "sandaiyidui_mp3"));
                        }
                        else {
                            promiseVec.push(sound.SoundManager.getIns().playVoiceAsync(gender + "sandaiyi_mp3"));
                        }
                        Promise.all(promiseVec).then(function () {
                            resolve();
                        }).catch(function (err) {
                            resolve();
                        });
                        break;
                    }
                    case game.ECardType.CT_SINGLE_LINE:
                    case game.ECardType.CT_DOUBLE_LINE: {
                        var promiseVec = [];
                        promiseVec.push(sound.SoundManager.getIns().playSoundAsync("SHUNZI_mp3"));
                        if (kind == game.ECardType.CT_SINGLE_LINE) {
                            promiseVec.push(sound.SoundManager.getIns().playVoiceAsync(gender + "shunzi_mp3"));
                        }
                        else {
                            promiseVec.push(sound.SoundManager.getIns().playVoiceAsync(gender + "liandui_mp3"));
                        }
                        Promise.all(promiseVec).then(function () {
                            resolve();
                        }).catch(function (err) {
                            resolve();
                        });
                        break;
                    }
                    case game.ECardType.CT_THREE: {
                        var source = gender + "tuple" + (cards[0] & 0x0F) + "_mp3";
                        sound.SoundManager.getIns().playVoiceAsync(source).then(function () {
                            resolve();
                        }).catch(function (err) {
                            resolve();
                        });
                        ;
                        break;
                    }
                    case game.ECardType.CT_DOUBLE: {
                        var source = gender + "dui" + (cards[0] & 0x0F) + "_mp3";
                        sound.SoundManager.getIns().playVoiceAsync(source).then(function () {
                            resolve();
                        }).catch(function (err) {
                            resolve();
                        });
                        ;
                        break;
                    }
                    case game.ECardType.CT_SINGLE: {
                        var source = gender + (cards[0] & 0x0F) + "_mp3";
                        sound.SoundManager.getIns().playVoiceAsync(source).then(function () {
                            resolve();
                        }).catch(function (err) {
                            resolve();
                        });
                        break;
                    }
                    case game.ECardType.CT_FOUR_LINE_TAKE_ONE: {
                        sound.SoundManager.getIns().playVoiceAsync(gender + "sidaier_mp3").then(function () {
                            resolve();
                        }).catch(function (err) {
                            resolve();
                        });
                        break;
                    }
                    case game.ECardType.CT_FOUR_LINE_TAKE_TWO: {
                        sound.SoundManager.getIns().playVoiceAsync(gender + "sidailiangdui_mp3").then(function () {
                            resolve();
                        }).catch(function (err) {
                            resolve();
                        });
                        break;
                    }
                    default: {
                        resolve();
                    }
                }
            });
        };
        /**
         * 播放报警动画以及报警音效(如果只剩两张的话，优先播放)
         * @param index: 玩家座位ID
         * */
        GameScenesLayer.prototype.playWarningAnimation = function (index) {
            var self = this;
            var promiseVec = [];
            return new Promise(function (resolve, reject) {
                self["warn_animation_" + index].visible = true;
                promiseVec.push(sound.SoundManager.getIns().playWarningAsync("ALERT_mp3"));
                promiseVec.push(animation.AnimationManager.getIns().playWarningAsync(self["warn_animation_" + index]["warnAnimation"], "warning"));
                Promise.all(promiseVec).then(function () {
                    resolve();
                }).catch(function (err) {
                    console.log(err);
                    resolve();
                });
            });
        };
        GameScenesLayer.prototype.userPassAsync = function (user, gender) {
            // if (gender) {
            //     utils.GameConst.colorConsole("用户性别：" + gender);
            // }
            var genderStr = gender == 2 ? "Woman_" : "Man_";
            var self = this;
            return new Promise(function (resolve, reject) {
                self["container_out_cards_" + user].removeChildren();
                self["text_pass_" + user].visible = true;
                if (user == 0) {
                    self.btn_pass.visible = false;
                    self.btn_no_cards.visible = false;
                    self.btn_out_cards.visible = false;
                }
                sound.SoundManager.getIns().playVoiceAsync(genderStr + "buyao" + Math.ceil(Math.random() * 4) + "_mp3").then(function () {
                    resolve();
                });
            });
        };
        /**/
        GameScenesLayer.prototype.clearUser = function (index) {
            if (index < 0 || index >= cmd.GAME_PLAYER) {
                console.log("%cClearUser:玩家座位不合理:", "color: red; font-size: 1.5em");
                return;
            }
            this["container_out_cards_" + index].removeChildren();
            this["text_pass_" + index].visible = false;
            if (index == 0) {
                this.btn_out_cards.visible = false;
                this.btn_pass.visible = false;
                this.btn_no_cards.visible = false;
            }
        };
        GameScenesLayer.prototype.pushUpdate = function (user, newStatus, oldStatus) {
            var self = this;
            var data = {
                param: user
            };
            this.updateQueue.push(data);
            this.beginUpdate();
        };
        GameScenesLayer.prototype.beginUpdate = function () {
            if (this.inUpdate)
                return;
            this.inUpdate = true;
            var data = this.updateQueue[0];
            if (data != null) {
                this.onUpdateUser(data.param);
                this.updateQueue.splice(0, 1);
                this.beginUpdate();
            }
            else {
                this.inUpdate = false;
            }
        };
        /**
         * 更新用户信息
         * */
        GameScenesLayer.prototype.onUpdateUser = function (user, newStatus, oldStatus) {
            // console.log("更新用户信息:", user);
            if (null == user)
                return;
            //获取玩家本地座位;
            if (user.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID && newStatus == null) {
                this.updateScore(0, user.lScore);
            }
            if (user.cbUserStatus >= df.US_SIT && user.cbUserStatus != df.US_LOOKON) {
                if (user.dwUserID != managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID || (user.cbUserStatus < df.US_READY)) {
                    this.showUser(user, true);
                }
                if (user.dwUserID != managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID || user.cbUserStatus == df.US_PLAYING) {
                    //更新玩家的头像以及昵称金币；
                    this.showUser(user, true);
                }
                //用户准备
                if (newStatus && newStatus.cbUserStatus == df.US_READY || user.cbUserStatus == df.US_READY) {
                    this.showUserReady(user);
                }
                //用户断线
                if (user.cbUserStatus == df.US_OFFLINE) {
                    this.showUserOffLine(user);
                }
            }
            //用户起立或离开
            if (newStatus && newStatus.cbUserStatus <= df.US_FREE || user.cbUserStatus <= df.US_FREE) {
                this.removeUser(user);
            }
        };
        Object.defineProperty(GameScenesLayer.prototype, "myScore", {
            get: function () {
                return this._currentScore;
            },
            set: function (value) {
                this._currentScore = value;
            },
            enumerable: true,
            configurable: true
        });
        //增加金币增长动画
        GameScenesLayer.prototype.updateScore = function (index, score, callBack) {
            if (index < 0 || index > 2)
                return;
            if (null == this["user_info_" + index])
                return;
            if (index == 0) {
                //     //当前客户端的score;
                //     this._userComponent_0.setOrigin(this.myScore);
                //     let apart = score - this.myScore;
                //     let cell = utils.GameConst.getCell(apart);
                //     this._userComponent_0.addGolds(apart, cell);
                //     this.myScore = score;
                //
                //
                (this["gold_" + index]).text = utils.GameConst.transformScore(score);
                utils.setAnchorCenter(this["gold_" + index]);
                this.myScore = score;
                if (callBack) {
                    callBack();
                }
            }
            else {
                (this["gold_" + index]).text = utils.GameConst.transformScore(score);
                utils.setAnchorCenter(this["gold_" + index]);
                this["_userScore" + index] = score;
                if (callBack) {
                    callBack();
                }
            }
        };
        GameScenesLayer.prototype.addGold = function (add) {
            (this["gold_0"]).text = utils.GameConst.transformScore(this.myScore + add);
            this.myScore = this.myScore + add;
            utils.setAnchorCenter(this["gold_0"]);
        };
        GameScenesLayer.prototype.addUserGold = function (add, user) {
            if (user < 0 || user > 2) {
                return;
            }
            if (user == 0) {
                (this["gold_" + user]).text = utils.GameConst.transformScore(this.myScore + add);
                //播放动画
                if (add > 0) {
                    this.gold_flash_animation.visible = true;
                    this.gold_flash_animation["goldFlashAnimation"].play(0);
                }
                this.myScore = this.myScore + add;
            }
            else {
                (this["gold_" + user]).text = utils.GameConst.transformScore(this["_userScore" + user] + add);
                this["_userScore" + user] = this["_userScore" + user] + add;
            }
            utils.setAnchorCenter(this["gold_" + user]);
        };
        GameScenesLayer.prototype.startOutCards = function (data, callBack) {
            var self = this;
            var msg = data;
            var gender = 0;
            this.userList.forEach(function (user) {
                if (user.ChairID == msg.wOutCardUser) {
                    gender = user.cbGender;
                }
            });
            var outUser = this._gameEngine.switchViewChairID(msg.wOutCardUser);
            if (outUser == 0) {
                gender = managers.FrameManager.getInstance().m_GlobalUserItem.cbGender;
            }
            this.clearUser(outUser);
            var back = [];
            for (var n = 0; n < msg.cbCardData.length; n++) {
                if (msg.cbCardData[n] != 0) {
                    back.push(msg.cbCardData[n]);
                }
                else {
                    break;
                }
            }
            // this._lastCards = back;
            var user = {
                index: outUser,
                cbGender: gender
            };
            var analyseResult = {
                cards: back.concat()
            };
            var kind = this._gameLogic.analyseCardKind(analyseResult);
            var promiseVec = [];
            promiseVec.push(this.asyncOutCard(user, back));
            // console.log("%c开始播放动画", "color: green;font-size: 1.5em");
            promiseVec.push(this.playAnimationAsync(kind, back.concat()));
            // promiseVec.push(this.testAnimation());
            Promise.all(promiseVec).then(function () {
                self.rocket_animation.visible = false;
                self._lastCards = back;
                if (callBack) {
                    callBack();
                }
            }).catch(function (err) {
                console.log(err);
                if (callBack) {
                    callBack();
                }
            });
        };
        GameScenesLayer.prototype.testAnimation = function () {
            var self = this;
            return new Promise(function (resolve) {
                var poker = new game.Poker(0x01);
                poker.x = 0;
                poker.y = 200;
                self.addChild(poker);
                egret.Tween.get(poker).to({ x: 750 }, 2000).call(function () {
                    self.removeChild(poker);
                    resolve();
                });
            });
        };
        GameScenesLayer.prototype.finishOutCards = function (data) {
            // this.removeEvent();
            var self = this;
            var msg = data;
            var back = [];
            for (var n = 0; n < msg.cbCardData.length; n++) {
                if (msg.cbCardData[n] != 0) {
                    back.push(msg.cbCardData[n]);
                }
                else {
                    break;
                }
            }
            var userIndex = this._gameEngine.switchViewChairID(msg.wOutCardUser);
            var nextIndex = this._gameEngine.switchViewChairID(msg.wCurrentUser);
            var user = {
                index: userIndex
            };
            this._lastCards = back; //after,如果是火箭的话，记得清空
            this.stopHeadOperate();
            if (user.index != 0) {
            }
            else {
                self._onMyOpera = false;
            }
            var analyseResult = {
                cards: back.concat()
            };
            var cardType = this._gameLogic.analyseCardKind(analyseResult);
            //点击出牌按钮的时候已经清空了
            // if (userIndex == 0) {
            //     this._myOutCards = [];
            // }
            //如果有当前用户的手牌数量为0，则清空桌面
            if (cardType == game.ECardType.CT_MISSILE_CARD) {
                var gender_1_1 = 0;
                var gender_2_1 = 0;
                self.userList.forEach(function (user) {
                    if (user.ChairID == (msg.wOutCardUser + 1) % 3) {
                        gender_1_1 = user.cbGender;
                    }
                    else if (user.ChairID == (msg.wOutCardUser + 2) % 3) {
                        gender_2_1 = user.cbGender;
                    }
                });
                if (!this.m_overFlag) {
                    this._gameEngine.onMissilePassAction(userIndex);
                }
            }
            else {
                this.onNotifyStartCards(nextIndex, false);
            }
        };
        GameScenesLayer.prototype.startPass = function (data, callBack) {
            var msg = data;
            var flag = msg.cbTurnOver; //一轮结束标识;
            var gender;
            this.userList.forEach(function (user) {
                if (user.ChairID == msg.wPassCardUser) {
                    gender = user.cbGender;
                }
            });
            var userIndex = this._gameEngine.switchViewChairID(data.wPassCardUser);
            var nextIndex = this._gameEngine.switchViewChairID(data.wCurrentUser);
            this.stopHeadOperate();
            if (userIndex == 0) {
                gender = managers.FrameManager.getInstance().m_GlobalUserItem.cbGender;
            }
            this.userPassAsync(userIndex, gender).then(function () {
                if (callBack) {
                    callBack();
                }
            });
        };
        GameScenesLayer.prototype.finishPass = function (data) {
            var msg = data;
            var flag = msg.cbTurnOver; //一轮结束标识
            var nextIndex = this._gameEngine.switchViewChairID(data.wCurrentUser);
            if (this._gameEngine.switchViewChairID(data.wPassCardUser) == 0) {
                this.cardsIn();
            }
            if (flag) {
                //清空上家的牌;
                if (!this.m_overFlag) {
                    this._lastCards = []; //front
                }
                for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                    this.clearUser(n);
                }
                this.onNotifyStartCards(nextIndex, true);
            }
            else {
                this.onNotifyStartCards(nextIndex);
            }
        };
        GameScenesLayer.prototype.finishGameOver = function () {
            //清空准备玩家
            this._readyUser = [];
        };
        //清空所有玩家
        GameScenesLayer.prototype.clearAllUser = function () {
            this.user_1.visible = false;
            this.user_2.visible = false;
        };
        /**
         * 标志玩家开始出牌
         * */
        GameScenesLayer.prototype.onNotifyStartCards = function (userIndex, first) {
            var _this = this;
            var self = this;
            if (this.m_overFlag)
                return;
            if (userIndex < 0 || userIndex >= cmd.GAME_PLAYER) {
                console.log("%c玩家座位不合理:", "color: red; font-size: 1.5em");
                return;
            }
            //清理用户桌面
            this.clearUser(userIndex);
            if (userIndex == 0) {
                this._onMyOpera = true;
                if (!this._ifTrustee) {
                    //如果last存在并且搜索没有大于的牌，则显示要不起
                    var hold_1 = [];
                    this._cards.forEach(function (card) {
                        hold_1.push(card.value);
                    });
                    var last = {
                        cards: this._lastCards.concat()
                    };
                    if (this._lastCards.length != 0 && this._gameLogic.searchForPresent(hold_1, last).length == 0 && this._gameLogic.analyseCardKind(last) != game.ECardType.CT_MISSILE_CARD) {
                        this.btn_no_cards.visible = true;
                        this.btn_no_cards.enabled = true;
                        //播放要不起动画
                        this.no_card_animation.visible = true;
                        animation.AnimationManager.getIns().playAnimationAsync(this.no_card_animation["noCardsAnimation"]).then(function () {
                            _this.no_card_animation.visible = false;
                        });
                        //三秒后自动发送要不起
                        this._passTimer = new egret.Timer(3000, 1);
                        this._passTimer.addEventListener(egret.TimerEvent.TIMER, this.autoPass, this);
                        this._passTimer.start();
                        this["user_info_" + userIndex].showCountDown(3);
                        //将头像设置为3秒
                    }
                    else {
                        this.btn_out_cards.visible = true;
                        this.btn_pass.visible = true;
                        this["user_info_" + userIndex].showCountDown();
                    }
                }
                var gameLogic = new game.GameLogic();
                var lastCard = {
                    cards: this._lastCards.concat()
                };
                var myCard = {
                    cards: this._myOutCards.concat()
                };
                this.btn_out_cards.enabled = gameLogic.assertPresent(myCard, lastCard);
                this.btn_pass.enabled = !first;
                this.addEvent();
            }
            else {
                this["user_info_" + userIndex].showCountDown();
            }
        };
        GameScenesLayer.prototype.autoPass = function () {
            var self = this;
            self.btn_out_cards.visible = false;
            self.btn_pass.visible = false;
            self.btn_no_cards.visible = false;
            self.text_pass_0.visible = true;
            self.stopHeadOperate();
            if (this._passTimer) {
                this._passTimer.stop();
                this._passTimer = null;
            }
            // clearTimeout(self._passTimer);
            self._gameEngine.requestPass();
        };
        GameScenesLayer.prototype.onNotifyTrustee = function (data) {
            if (data.bTrustee == true) {
                this._ifTrustee = true;
                this.btn_trustee.enabled = false;
                this.addCancelBtn();
            }
            else {
                this.removeCancelBtn();
            }
        };
        GameScenesLayer.prototype.addCancelBtn = function () {
            this.removeEvent();
            this._ifTrustee = true;
            utils.GameConst.removeChild(this.img_trustee);
            utils.GameConst.removeChild(this.btn_cancel_trustee);
            this.addChild(this.img_trustee);
            this.addChild(this.btn_cancel_trustee);
            this.img_trustee.visible = true;
            this.btn_cancel_trustee.visible = true;
            this.btn_cancel_trustee.enabled = true;
            this.btn_cancel_trustee.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelTrustee, this);
            this.addBtnChange(this.btn_cancel_trustee);
        };
        GameScenesLayer.prototype.removeCancelBtn = function (addEvent) {
            if (this._onMyOpera) {
                this.addEvent();
            }
            this._ifTrustee = false;
            this.btn_trustee.enabled = true;
            this.img_trustee.visible = false;
            this.btn_cancel_trustee.visible = false;
            this.btn_cancel_trustee.enabled = false;
            // this.btn_trustee.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTrustee, this);
        };
        /**=========================客户端消息=============================*/
        /**
         * 请求出牌
         * */
        GameScenesLayer.prototype.requestOutCards = function (cards) {
            this._gameEngine.requestOutCard(cards);
        };
        //如果当前座位玩家已经是那位玩家，则不进行更新
        GameScenesLayer.prototype.showUser = function (user, isShow) {
            var _this = this;
            var self = this;
            //如果原先已经存在此玩家，则不对该座位进行更新
            var repeat = this.adjustRepeat(user);
            //加入缓存
            if (null != user) {
                this.cacheUser(user);
            }
            if (repeat) {
                for (var i = 0; i < this._userList.length; i++) {
                    var target = this._userList[i];
                    if (target.dwUserID == user.dwUserID) {
                        if (target.szNickName == "游戏玩家") {
                            this._userList[i] = new models.UserItem(user);
                        }
                        else {
                            return;
                        }
                    }
                }
            }
            //视图索引
            var userIndex = this._gameEngine.switchViewChairID(user.ChairID);
            if (userIndex == df.INVALID_CHAIR || (userIndex < 0 || userIndex >= cmd.GAME_PLAYER))
                return;
            var callBack = function () {
                // console.log(userIndex);
                self["user_" + userIndex].visible = true;
                if (null == self["user_info_" + userIndex]) {
                    self["user_info_" + userIndex] = new game.HeadBorder();
                    self["user_info_" + userIndex].x = USER_INFO_CONFIG[userIndex].x;
                    self["user_info_" + userIndex].y = USER_INFO_CONFIG[userIndex].y;
                    self["user_" + userIndex].addChild(self["user_info_" + userIndex]);
                    if (userIndex == 0) {
                        self.adjustComponent(self["user_info_" + userIndex]);
                    }
                    self["user_" + userIndex].swapChildren(_this["user_info_" + userIndex], self["head_" + userIndex]);
                }
                //更新用户信息，包括昵称金币、头像等
                var nickName = user.szNickName;
                (self["nickname_" + userIndex]).text = user.szNickName;
                _this["userName_" + userIndex] = user.szNickName;
                if ((self["nickname_" + userIndex]).width >= 130) {
                    nickName = nickName.slice(0, 4) + "...";
                    (self["nickname_" + userIndex]).text = nickName;
                }
                utils.setAnchorCenter(self["nickname_" + userIndex]);
                if (userIndex == 0) {
                    _this.myScore = user.lScore;
                }
                else {
                    _this["_userScore" + userIndex] = user.lScore;
                }
                (self["gold_" + userIndex]).text = utils.GameConst.transformScore(user.lScore);
                utils.setAnchorCenter(self["gold_" + userIndex]);
                if (user.szHeadURL.length != 0) {
                    self["user_info_" + userIndex].setHeadUrl(user.szHeadURL);
                }
                // self.updateAnimation();
            };
            if (this.initFlag) {
                callBack();
            }
            else {
                this.actionQueue.push(callBack);
            }
        };
        GameScenesLayer.prototype.showUserHead = function () {
            for (var n = 0; n < this.userList.length; n++) {
                var userIndex = this._gameEngine.switchViewChairID(this.userList[n].ChairID);
                if (this.userList[n].szNickName != this["userName_" + userIndex])
                    break;
            }
            // if (user.szHeadURL.length != 0) {
            //     (<HeadBorder>self["user_info_" + userIndex]).setHeadUrl(user.szHeadURL);
            // }
        };
        GameScenesLayer.prototype.showUserReady = function (user) {
            if (null != user) {
                this.cacheUser(user);
            }
            var userIndex = this._gameEngine.switchViewChairID(user.ChairID);
            var callBack;
            var self = this;
            if (userIndex != 0) {
                callBack = function () {
                    self["text_ready_" + userIndex].visible = true;
                };
                this._readyUser.push(user);
            }
            if (this.initFlag) {
                if (callBack) {
                    callBack();
                }
            }
            else {
                if (callBack) {
                    this.actionQueue.push(callBack);
                }
            }
        };
        GameScenesLayer.prototype.showUserOffLine = function (user) {
            if (user.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                // managers.FrameManager.getInstance().showPopWait("断线重连中...");
            }
        };
        GameScenesLayer.prototype.removeUser = function (user) {
            console.log("准备移除用户:", user);
            var userIndex = this.removeUserCache(user);
            if (userIndex == df.INVALID_ITEM)
                return;
            this.onInitUser(userIndex, false);
            for (var n = 0; n < this._readyUser.length; n++) {
                if (this._readyUser[n].dwUserID == user.dwUserID) {
                    this._readyUser.splice(n, 1);
                }
            }
        };
        GameScenesLayer.prototype.onInitUser = function (index, isShow) {
            if (isShow === void 0) { isShow = true; }
            if (this["user_" + index]) {
                this["user_" + index].visible = isShow;
            }
        };
        Object.defineProperty(GameScenesLayer.prototype, "userList", {
            get: function () {
                return this._userList;
            },
            enumerable: true,
            configurable: true
        });
        GameScenesLayer.prototype.clearUsers = function () {
            this._userList = [];
        };
        /**加入缓存 */
        GameScenesLayer.prototype.cacheUser = function (user) {
            //判断重复
            for (var i = 0; i < this._userList.length; i++) {
                var target = this._userList[i];
                if (target.dwUserID == user.dwUserID) {
                    this._userList.splice(i, 1); //将旧的对象移除
                    break;
                }
            }
            //拷贝对象
            var copy = new models.UserItem(user);
            this._userList.push(copy);
            this.updateAnimation();
        };
        GameScenesLayer.prototype.adjustRepeat = function (user) {
            for (var i = 0; i < this._userList.length; i++) {
                var target = this._userList[i];
                if (target.dwUserID == user.dwUserID) {
                    // this._userList.splice(i, 1); //将旧的对象移除
                    return true;
                }
            }
            return false;
        };
        /**移除缓存 */
        GameScenesLayer.prototype.removeUserCache = function (user) {
            if (this._userList.length == 0)
                return df.INVALID_ITEM;
            var bSuccess = false;
            var deleteIndex = df.INVALID_ITEM;
            var deleteUser = null;
            for (var i = 0; i < this._userList.length; i++) {
                var target = this._userList[i];
                if (target.dwUserID == user.dwUserID) {
                    deleteUser = this._userList.splice(i, 1);
                    bSuccess = true;
                    deleteIndex = this._gameEngine.switchViewChairID(target.ChairID);
                    break;
                }
            }
            if (bSuccess) {
                console.log("%c移除用户：", "color: red; font-size: 1.5em");
                console.log(deleteUser);
                this.updateAnimation();
            }
            return deleteIndex;
        };
        GameScenesLayer.prototype.updateAnimation = function () {
            //如果是等待的时间，就更新动画
            if (this._showAnimation) {
                if (this.matching_animation == null || this.waiting_animation == null)
                    return;
                this.matching_animation.visible = false;
                this.waiting_animation.visible = false;
                animation.AnimationManager.getIns().stopLoopAnimation();
                var sameTable = 0;
                var meUser = this._gameEngine.getMeUserItem();
                for (var n = 0; n < this.userList.length; n++) {
                    if (this.userList[n].TableID == meUser.TableID) {
                        sameTable++;
                    }
                }
                var getReady = 0;
                for (var n = 0; n < this.userList.length; n++) {
                    if (this.userList[n].cbUserStatus == df.US_READY) {
                        getReady++;
                    }
                }
                if (sameTable < 3) {
                    this.playMatchAnimation();
                    // this.matching_animation.visible = true;
                    // animation.AnimationManager.getIns().playAnimationLoop(this.matching_animation["matchingAnimation"]);
                }
                else if (getReady < 3) {
                    this.playWaitingAnimation();
                }
                // if (this._readyUser.length != 2 && this.userList.length > 2) { //等待玩家准备
                //     this.playWaitingAnimation();
                // } else if (this.userList.length < 3) { //配桌
                //     this.matching_animation.visible = true;
                //     animation.AnimationManager.getIns().playAnimationLoop(this.matching_animation["matchingAnimation"]);
                // } //其余为不播放动画（开始游戏）
            }
        };
        GameScenesLayer.prototype.showSceneFree = function (data, rec) {
            console.log("%c场景:", "color: red;font-size: 2em");
            // console.log("场景:", data);
            //检测重复
            var dataBuffer = data;
            var sceneFree = new cmd.CMD_S_StatusFree(dataBuffer.cbBuffer);
            // console.log(sceneFree);
            this.cell_score.text = sceneFree.lCellScore + "";
            utils.setAnchorCenter(this.cell_score);
            if (!rec) {
                this._gameEngine._gameFrame.onUserReady();
                this._currentReady = true;
                this.currentReady();
            }
            else {
                utils.GameConst.colorConsole("玩家是否已经准备:");
                console.log(this._currentReady);
                if (!this._currentReady) {
                    this._gameEngine.startOverTimer();
                }
                // if (this._currentReady != true) {
                var isReady = false;
                for (var n = 0; n < this.userList.length; n++) {
                    if (this.userList[n].dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                        if (this.userList[n].cbUserStatus == df.US_READY) {
                            isReady = true;
                        }
                        ;
                        break;
                    }
                }
                this.btn_again.visible = !isReady;
                // }
            }
        };
        /**
         * 断线重连
         * */
        GameScenesLayer.prototype.showScenePlaying = function (data) {
            var _this = this;
            console.log("%c界面断线重连", "color: red; font-size: 3em");
            console.log(data);
            this._showAnimation = false;
            this._gameEngine.requestTrustee(true);
            this.addCancelBtn();
            //清理自动出牌
            if (this._passTimer) {
                this._passTimer.stop();
                this._passTimer = null;
            }
            var self = this;
            self.left_cards_1.visible = true;
            self.left_cards_2.visible = true;
            self.text_ready_1.visible = false;
            self.text_ready_2.visible = false;
            animation.AnimationManager.getIns().stopLoopAnimation();
            this.matching_animation.visible = false;
            this.waiting_animation.visible = false;
            //剩牌
            for (var n = 0; n < data.cbHandCardCount.length; n++) {
                var localChair = self._gameEngine.switchViewChairID(n);
                console.log("新的座位号:", localChair);
                if (localChair == -1)
                    continue;
                if (localChair != 0) {
                    self["left_cards_" + localChair]["left_cards"].text = data.cbHandCardCount[n] + "";
                    self["_userCardCount_" + localChair] = data.cbHandCardCount[n];
                }
            }
            //当前玩家手中剩余的牌
            var hold = [];
            for (var n = 0; n < data.cbHandCardData.length; n++) {
                if (data.cbHandCardData[n] != 0) {
                    hold.push(data.cbHandCardData[n]);
                }
                else {
                    break;
                }
            }
            //清除剩牌
            for (var n = 0; n < this._cards.length; n++) {
                this.hold_container_0.removeChild(this._cards[n]);
            }
            this._cards = [];
            for (var n = 0; n < hold.length; n++) {
                var card = new game.Poker(hold[n]); //0x01
                card.changeToFront();
                this._cards.push(card);
                // this.hold_container_0.addChild(card);
            }
            var config = this.getConfigs();
            //生成剩牌
            this._cards.forEach(function (card, index) {
                card.x = config[index].x;
                card.y = config[index].y;
                card.rotation = config[index].rotation;
                _this.hold_container_0.addChild(card);
            });
            var lastCards = [];
            for (var n = 0; n < data.cbTurnCardData.length; n++) {
                if (data.cbTurnCardData[n] != 0) {
                    lastCards.push(data.cbTurnCardData[n]);
                }
                else {
                    break;
                }
            }
            this._lastCards = lastCards;
            var lastUser = this._gameEngine.switchViewChairID(data.wTurnWiner);
            var user = {
                index: lastUser
            };
            this.outCard(user, lastCards);
            this.btn_trustee.visible = true;
            this.btn_share_cards.visible = true;
            this.onNotifyStartCards(this._gameEngine.switchViewChairID(data.wCurrentUser));
        };
        Object.defineProperty(GameScenesLayer.prototype, "showAnimation", {
            set: function (value) {
                this._showAnimation = value;
            },
            enumerable: true,
            configurable: true
        });
        GameScenesLayer.prototype.showGameStart = function (start) {
            //准备状态的断线重连标识
            this.btn_again.visible = false;
            this._currentReady = false;
            this._lastCards = [];
            this._showAnimation = false;
            console.log("%c开始游戏", "color: red;font-size: 2em");
            console.log(this.userList);
            this.firstUser = this._gameEngine.switchViewChairID(start.wCurrentUser);
            // console.log("转换的数据:", this.firstUser);
            animation.AnimationManager.getIns().stopLoopAnimation();
            //this.matching_animation["matchingAnimation"]
            // animation.AnimationManager.getIns().stopLoopAnimation();
            this.left_cards_1.visible = true;
            this.left_cards_2.visible = true;
            this.waiting_animation.visible = false;
            this.matching_animation.visible = false;
            this.text_ready_1.visible = false;
            this.text_ready_2.visible = false;
            this.m_overFlag = false;
            var cards = [];
            start.cbCardData.forEach(function (value) {
                if (value != 0) {
                    cards.push(value);
                }
            });
            this.initCards(cards);
        };
        GameScenesLayer.prototype.addBase = function () {
            if (this._goldPopup) {
                this._goldPopup.addBaseTime();
            }
        };
        GameScenesLayer.prototype.updateBaseEnsure = function (msg) {
            var _this = this;
            var self = this;
            var callBack = function () {
                // this.updateBaseEnsureInformation
                if (null == self._goldPopup) {
                    managers.FrameManager.getInstance().showPopWait("加载游戏资源中...");
                    RES.loadGroup("goldPopup").then(function () {
                        managers.FrameManager.getInstance().dismissPopWait();
                        self._goldPopup = new game.GoldPopup(_this);
                        self._goldPopup.horizontalCenter = 0;
                        self._goldPopup.y = 202;
                        self.adjustComponent(_this._goldPopup, true);
                        self._goldPopup.updateBaseEnsureInformation(msg);
                    }).catch(function (err) {
                        managers.FrameManager.getInstance().dismissPopWait();
                        game.GameEngine.getInstance().showMessage(err);
                        // throw err;
                    });
                }
                else {
                    self._goldPopup.updateBaseEnsureInformation(msg);
                }
            };
            if (this.initFlag) {
                callBack();
            }
            else {
                this.actionQueue.push(callBack);
            }
        };
        GameScenesLayer.prototype.showTurnCaculate = function (data) {
            var _this = this;
            //判断赢的玩家
            var winUserIndex;
            data.lTurnScore.forEach(function (add, index) {
                var userIndex = _this._gameEngine.switchViewChairID(index);
                if (add > 0)
                    winUserIndex = userIndex;
            });
            this.moveGoldAnimation(winUserIndex).then(function () {
                data.lTurnScore.forEach(function (add, index) {
                    var userIndex = _this._gameEngine.switchViewChairID(index);
                    _this.addUserGold(add, userIndex);
                });
            });
        };
        GameScenesLayer.prototype.moveGoldAnimation = function (index) {
            var _this = this;
            var promiseVec = [];
            var origin = [];
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                if (index != n) {
                    origin.push(n);
                }
            }
            return new Promise(function (resolve, reject) {
                for (var n = 0; n < origin.length; n++) {
                    promiseVec.push(_this.goldFromTo(origin[n], index));
                }
                Promise.all(promiseVec).then(function () {
                    resolve();
                });
            });
        };
        GameScenesLayer.prototype.goldFromTo = function (origin, destination) {
            var self = this;
            var originPotion = this["position_" + origin];
            var wishPotion = this["position_" + destination];
            return new Promise(function (resolve, reject) {
                var animation_1 = function (index) {
                    var bitmap = new egret.Bitmap(RES.getRes("over_gold_png"));
                    bitmap.x = originPotion.x;
                    bitmap.y = originPotion.y;
                    utils.setAnchorCenter(bitmap);
                    bitmap.alpha = 1;
                    self.addChild(bitmap);
                    Tween.get(bitmap).to({ x: wishPotion.x, y: wishPotion.y, alpha: 0.5 }, 400, egret.Ease.quadIn).call(function () {
                        self.removeChild(bitmap);
                        if (index == 9)
                            resolve();
                    });
                    setTimeout(function () {
                        if (index < 9) {
                            animation_1(index + 1);
                        }
                    }, 15);
                };
                animation_1(0);
            });
        };
        return GameScenesLayer;
    }(eui.Component));
    game.GameScenesLayer = GameScenesLayer;
    __reflect(GameScenesLayer.prototype, "game.GameScenesLayer");
})(game || (game = {}));
