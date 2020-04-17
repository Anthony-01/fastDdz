var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var animation;
(function (animation_1) {
    var AnimationManager = (function () {
        function AnimationManager() {
            this._currentAnimation = null;
            this._animationResolve = null;
            this._itemLength = 0;
            this._comCount = 0;
            this._warningAnimation = null;
            this._warningLength = 0;
            this._warningResolve = null;
            this._warningCount = 0;
            this._currentLoopAnimation = null;
            this._loopLength = 0;
            this._loopCount = 0;
            this._dragonBoneAnimation = null;
            this._currentKey = null;
        }
        AnimationManager.getIns = function () {
            if (AnimationManager._ins == null)
                AnimationManager._ins = new AnimationManager();
            return AnimationManager._ins;
        };
        /**
         * 异步播放动画(bug:第二次播放出现问题)
         * @animation 动画
         * */
        AnimationManager.prototype.playAnimationAsync = function (animation, name) {
            var _this = this;
            var self = this;
            return new Promise(function (resolve, reject) {
                if (animation == null)
                    return Promise.resolve();
                self._currentAnimation = animation;
                self._itemLength = animation.items.length;
                animation.items.forEach(function (item) {
                    item.addEventListener("complete", _this.itemComplete, _this);
                });
                animation.play(0);
                self._animationResolve = resolve;
            });
        };
        AnimationManager.prototype.itemComplete = function (e) {
            var _this = this;
            this._comCount++;
            if (this._comCount == this._itemLength - 1) {
                this._itemLength = 0;
                this._comCount = 0;
                // this._currentAnimation.stop();
                this._currentAnimation.items.forEach(function (item) {
                    item.removeEventListener("complete", _this.itemComplete, _this);
                });
                this._currentAnimation = null;
                // console.log("异步动画播放完毕");
                if (this._animationResolve) {
                    this._animationResolve();
                    this._animationResolve = null;
                }
            }
        };
        AnimationManager.prototype.playWarningAsync = function (animation, name) {
            var _this = this;
            var self = this;
            return new Promise(function (resolve, reject) {
                if (animation == null) {
                    console.log("未找到报警动画");
                    return Promise.resolve();
                }
                self._warningAnimation = animation;
                self._warningLength = animation.items.length;
                animation.items.forEach(function (item) {
                    item.addEventListener("complete", _this.warningComplete, _this);
                });
                animation.play(0);
                self._warningResolve = resolve;
            });
        };
        AnimationManager.prototype.warningComplete = function (e) {
            var _this = this;
            this._warningCount++;
            if (this._warningCount == this._warningLength - 1) {
                console.log("报警动画播放完成");
                this._warningLength = 0;
                this._warningCount = 0;
                // this._warningAnimation.stop();
                this._warningAnimation.items.forEach(function (item) {
                    item.removeEventListener("complete", _this.warningComplete, _this);
                });
                this._warningAnimation = null;
                // console.log("异步动画播放完毕");
                if (this._warningResolve) {
                    this._warningResolve();
                    this._warningResolve = null;
                }
            }
        };
        AnimationManager.prototype.playAnimationLoop = function (animation) {
            var _this = this;
            if (this._currentLoopAnimation) {
                this._currentLoopAnimation.stop();
                this._loopCount = 0;
            }
            if (animation == null)
                return;
            this._currentLoopAnimation = animation;
            this._loopLength = animation.items.length;
            animation.items.forEach(function (item) {
                item.addEventListener("complete", _this.loopItemComplete, _this);
            });
            animation.play(0);
        };
        AnimationManager.prototype.loopItemComplete = function () {
            this._loopCount++;
            if (this._loopCount == this._loopLength) {
                this._loopCount = 0;
                this._loopLength = 0;
                if (this._currentLoopAnimation) {
                    this._currentLoopAnimation.stop();
                    this.playAnimationLoop(this._currentLoopAnimation);
                }
            }
        };
        AnimationManager.prototype.stopLoopAnimation = function () {
            if (this._currentLoopAnimation) {
                this._currentLoopAnimation.stop();
            }
            this._currentLoopAnimation = null;
        };
        /**
         * 循环播放动画龙骨动画
         * */
        AnimationManager.prototype.playDragonLoop = function (dragonBone, key, callBack, callObject) {
            this._dragonBoneAnimation = dragonBone;
            this._currentKey = key;
            dragonBone.animation.play(key, 0);
            this._dragonBoneAnimation.addEvent(dragonBones.EventObject.FRAME_EVENT, callBack, callObject);
        };
        /**
         * 播放一次龙骨动画
         * */
        AnimationManager.prototype.playDragonBone = function (key) {
            if (this._dragonBoneAnimation) {
                this._dragonBoneAnimation.animation.stop(this._currentKey);
                this._currentKey = key;
                this._dragonBoneAnimation.once(dragonBones.EventObject.COMPLETE, this.onCompleteOnce, this);
                this._dragonBoneAnimation.animation.play(key, 1);
            }
        };
        AnimationManager.prototype.onCompleteOnce = function () {
            this._currentKey = "Animation_1";
            this._dragonBoneAnimation.animation.play(this._currentKey, 0);
        };
        return AnimationManager;
    }());
    animation_1.AnimationManager = AnimationManager;
    __reflect(AnimationManager.prototype, "animation.AnimationManager");
})(animation || (animation = {}));
