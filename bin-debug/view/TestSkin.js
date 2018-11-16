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
    var TestSkin = (function (_super) {
        __extends(TestSkin, _super);
        function TestSkin() {
            var _this = _super.call(this) || this;
            _this.data = {
                label: "1"
            };
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onLoadComplete, _this);
            return _this;
        }
        TestSkin.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            if (this.label) {
                console.log("组件初始化完成");
            }
        };
        TestSkin.prototype.onLoadComplete = function () {
            if (this.label) {
                console.log("加载完成");
            }
        };
        return TestSkin;
    }(eui.Component));
    game.TestSkin = TestSkin;
    __reflect(TestSkin.prototype, "game.TestSkin");
})(game || (game = {}));
