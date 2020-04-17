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
    var WaitingScene = (function (_super) {
        __extends(WaitingScene, _super);
        function WaitingScene() {
            var _this = _super.call(this) || this;
            _this._ifComplete = false;
            _this._components = [];
            _this._scaleComponent = [];
            _this.ifContinue = false;
            _this._actionList = [];
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.start, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.remove, _this);
            return _this;
        }
        WaitingScene.prototype.onComplete = function () {
            this._ifComplete = true;
            console.log("加载界面初始化完毕!");
            this.adjustComponent();
            this.beginAction();
        };
        WaitingScene.prototype.turnAround = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                egret.Tween.get(_this.logo).to({ rotation: 360 }, 1000).call(function () {
                    _this.logo.rotation = 0;
                    resolve();
                });
            });
        };
        WaitingScene.prototype.adjustComponent = function () {
            this._components.push(this.logo);
            this._components.push(this.label);
            // this._com
            this._components.forEach(function (component) {
                component.y = component.y * game.RATE;
            });
            this._scaleComponent.push(this.logo);
            this._scaleComponent.push(this.label);
            this._scaleComponent.forEach(function (component) {
                component.scaleX = component.scaleY = game.RATE;
            });
        };
        WaitingScene.prototype.start = function () {
            var _this = this;
            var self = this;
            this.ifContinue = true;
            var callBack = function () {
                if (_this.ifContinue) {
                    self.turnAround().then(function () {
                        callBack();
                    });
                }
            };
            if (this._ifComplete) {
                callBack();
            }
            else {
                this._actionList.push(callBack);
            }
        };
        WaitingScene.prototype.remove = function () {
            this.ifContinue = false;
        };
        WaitingScene.prototype.beginAction = function () {
            var callBack = this._actionList[0];
            if (callBack != null) {
                callBack();
                this._actionList.splice(0, 1);
                this.beginAction();
            }
        };
        WaitingScene.prototype.setStr = function (str) {
            var self = this;
            var callBack = function () {
                self.label.text = str;
            };
            if (this._ifComplete) {
                callBack();
            }
            else {
                this._actionList.push(callBack);
            }
        };
        return WaitingScene;
    }(eui.Component));
    game.WaitingScene = WaitingScene;
    __reflect(WaitingScene.prototype, "game.WaitingScene");
})(game || (game = {}));
