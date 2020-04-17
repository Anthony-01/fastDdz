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
var component;
(function (component) {
    var BasePage = (function (_super) {
        __extends(BasePage, _super);
        function BasePage() {
            return _super.call(this) || this;
        }
        /**
         * 页面初始化完毕
         */
        BasePage.prototype.createChildren = function () {
            this.init();
        };
        /**
         * 各个子模块进行初始化
         */
        BasePage.prototype.init = function () {
        };
        return BasePage;
    }(eui.Component));
    component.BasePage = BasePage;
    __reflect(BasePage.prototype, "component.BasePage");
})(component || (component = {}));
