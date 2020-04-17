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
var base;
(function (base) {
    var BaseComponent = (function (_super) {
        __extends(BaseComponent, _super);
        function BaseComponent() {
            var _this = _super.call(this) || this;
            _this._actionList = [];
            _this.m_ifComplete = false;
            _this._adjustComponent = [];
            _this._scaleComponent = [];
            _this._touchButton = null;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            return _this;
        }
        BaseComponent.prototype.onComplete = function () {
            console.log("组件初始化完毕");
            this.adjustComponent();
            this.m_ifComplete = true;
            this.initBtn();
            this.beginComponentAction();
        };
        BaseComponent.prototype.beginComponentAction = function () {
            var callBack = this._actionList[0];
            if (callBack != null) {
                callBack();
                this._actionList.splice(0, 1);
                this.beginComponentAction();
            }
        };
        /**
         * 子类重写按钮初始化
         * */
        BaseComponent.prototype.initBtn = function () {
        };
        BaseComponent.prototype.adjustComponent = function () {
        };
        BaseComponent.prototype.addBtnChange = function (button) {
            button.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        };
        BaseComponent.prototype.removeBrnChange = function (button) {
            button.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        };
        BaseComponent.prototype.onTouchBeginChange = function (e) {
            this._touchButton = e.currentTarget;
            var scale = this._touchButton.scaleX - 0.1;
            this._touchButton.scaleX = this._touchButton.scaleY = scale;
        };
        BaseComponent.prototype.onTouchMoveChange = function (e) {
            if (e.currentTarget != this._touchButton) {
            }
        };
        BaseComponent.prototype.onTouchEndChange = function (e) {
            if (e.currentTarget != this._touchButton) {
            }
            if (null != this._touchButton) {
                var scale = this._touchButton.scaleX + 0.1;
                this._touchButton.scaleX = this._touchButton.scaleY = scale;
            }
            this._touchButton = null;
        };
        return BaseComponent;
    }(eui.Component));
    base.BaseComponent = BaseComponent;
    __reflect(BaseComponent.prototype, "base.BaseComponent");
})(base || (base = {}));
