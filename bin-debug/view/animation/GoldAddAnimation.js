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
    game.GOLD_POSITION = [{
            x: 549,
            y: 605
        }, {
            x: 93,
            y: 367
        }, {
            x: 241,
            y: 367
        }, {
            x: 398,
            y: 367
        }, {
            x: 93,
            y: 555
        }, {
            x: 241,
            y: 555
        }, {
            x: 398,
            y: 555
        }, {
            x: 586,
            y: 463
        }];
    var GoldAddAnimation = (function (_super) {
        __extends(GoldAddAnimation, _super);
        function GoldAddAnimation(position) {
            var _this = _super.call(this) || this;
            _this._position = null;
            _this._position = position;
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemove, _this);
            return _this;
        }
        GoldAddAnimation.prototype.onComplete = function () {
            console.log("金币增长动画组件初始化完毕");
            // console.log(this["animation_group"]);
            if (this._position) {
                for (var n = 0; n <= 10; n++) {
                    this["gold_" + n].x = game.GOLD_POSITION[this._position].x;
                    this["gold_" + n].y = game.GOLD_POSITION[this._position].y;
                }
            }
        };
        GoldAddAnimation.prototype.setPosition = function (position) {
            this._position = position;
            console.log("金币位置:", position);
            for (var n = 0; n <= 10; n++) {
                this["gold_" + n].x = game.GOLD_POSITION[position].x;
                this["gold_" + n].y = game.GOLD_POSITION[position].y;
            }
        };
        GoldAddAnimation.prototype.onStage = function () {
        };
        GoldAddAnimation.prototype.onRemove = function () {
        };
        return GoldAddAnimation;
    }(eui.Component));
    game.GoldAddAnimation = GoldAddAnimation;
    __reflect(GoldAddAnimation.prototype, "game.GoldAddAnimation");
})(game || (game = {}));
