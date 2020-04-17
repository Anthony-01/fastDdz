namespace animation {
    export class AnimationManager {
        private static _ins: AnimationManager;

        constructor() {

        }

        public static getIns(): AnimationManager {
            if (AnimationManager._ins == null)
                AnimationManager._ins = new AnimationManager();
            return AnimationManager._ins;

        }

        private _currentAnimation: egret.tween.TweenGroup = null;
        private _animationResolve: Function = null;
        /**
         * 异步播放动画(bug:第二次播放出现问题)
         * @animation 动画
         * */
        playAnimationAsync(animation: egret.tween.TweenGroup, name?: string): Promise<any> {
            let self = this;
            return new Promise((resolve, reject) => {
                if (animation == null) return Promise.resolve();
                self._currentAnimation = animation;
                self._itemLength = animation.items.length;
                animation.items.forEach(item => {
                    item.addEventListener("complete", this.itemComplete, this);
                });
                animation.play(0);
                self._animationResolve = resolve;
            })
        }

        private _itemLength: number = 0;
        private _comCount: number = 0;
        private itemComplete(e: egret.Event) {
            this._comCount++;
            if (this._comCount == this._itemLength - 1) {
                this._itemLength = 0;
                this._comCount = 0;
                // this._currentAnimation.stop();
                this._currentAnimation.items.forEach(item => {
                    item.removeEventListener("complete", this.itemComplete, this);
                });
                this._currentAnimation = null;
                // console.log("异步动画播放完毕");
                if (this._animationResolve) {
                    this._animationResolve();
                    this._animationResolve = null;
                }
            }
        }

        private _warningAnimation: egret.tween.TweenGroup = null;
        private _warningLength: number = 0;
        private _warningResolve: Function = null;

        playWarningAsync(animation: egret.tween.TweenGroup, name: string): Promise<any> {
            let self = this;
            return new Promise((resolve, reject) => {
                if (animation == null) {
                    console.log("未找到报警动画");
                    return Promise.resolve();
                }
                self._warningAnimation = animation;
                self._warningLength = animation.items.length;
                animation.items.forEach(item => {
                    item.addEventListener("complete", this.warningComplete, this);
                });
                animation.play(0);
                self._warningResolve = resolve;
            })
        }

        private _warningCount: number = 0;
        private warningComplete(e: egret.Event) {
            this._warningCount++;
            if (this._warningCount == this._warningLength - 1) {
                console.log("报警动画播放完成");
                this._warningLength = 0;
                this._warningCount = 0;
                // this._warningAnimation.stop();
                this._warningAnimation.items.forEach(item => {
                    item.removeEventListener("complete", this.warningComplete, this);
                });
                this._warningAnimation = null;
                // console.log("异步动画播放完毕");
                if (this._warningResolve) {
                    this._warningResolve();
                    this._warningResolve = null;
                }
            }
        }

        private _currentLoopAnimation: egret.tween.TweenGroup = null;
        private _loopLength: number = 0;
        playAnimationLoop(animation: egret.tween.TweenGroup) {
            if (this._currentLoopAnimation) {
                this._currentLoopAnimation.stop();
                this._loopCount = 0;
            }
            if (animation == null) return ;
            this._currentLoopAnimation = animation;
            this._loopLength = animation.items.length;
            animation.items.forEach(item => {
                item.addEventListener("complete", this.loopItemComplete, this);
            });
            animation.play(0);
        }

        private _loopCount = 0;
        private loopItemComplete() {
            this._loopCount++;
            if (this._loopCount == this._loopLength) {
                this._loopCount = 0;
                this._loopLength = 0;
                if (this._currentLoopAnimation) {
                    this._currentLoopAnimation.stop();
                    this.playAnimationLoop(this._currentLoopAnimation);
                }
            }
        }

        stopLoopAnimation() {
            if (this._currentLoopAnimation) {
                this._currentLoopAnimation.stop();
            }
            this._currentLoopAnimation = null;
        }

        private _dragonBoneAnimation: dragonBones.EgretArmatureDisplay = null;
        private _currentKey: string = null;
        /**
         * 循环播放动画龙骨动画
         * */
        playDragonLoop(dragonBone: dragonBones.EgretArmatureDisplay, key: string, callBack: (event: dragonBones.EgretEvent) => void, callObject: any) {
            this._dragonBoneAnimation = dragonBone;
            this._currentKey = key;
            dragonBone.animation.play(key, 0);
            this._dragonBoneAnimation.addEvent(dragonBones.EventObject.FRAME_EVENT, callBack, callObject);
        }

        /**
         * 播放一次龙骨动画
         * */
        playDragonBone(key: string) {
            if (this._dragonBoneAnimation) {
                this._dragonBoneAnimation.animation.stop(this._currentKey);
                this._currentKey = key;
                this._dragonBoneAnimation.once(dragonBones.EventObject.COMPLETE, this.onCompleteOnce, this);
                this._dragonBoneAnimation.animation.play(key, 1);
            }
        }

        private onCompleteOnce() {
            this._currentKey = "Animation_1";
            this._dragonBoneAnimation.animation.play(this._currentKey, 0);
        }
    }
}