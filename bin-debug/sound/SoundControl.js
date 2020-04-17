var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var sound;
(function (sound_1) {
    //有静音按钮
    //能够根据名字播放音效以及音乐；
    var SOUND_ROOT = "https://h5demo.foxuc.com/DownLoad/fastDDZ_wxgame_remote/resource/assets/sound/effect";
    var SoundManager = (function () {
        function SoundManager() {
            //以游戏音效名字作为key播放
            this._nowBg = "";
            // playEffect(name: string) { //服务器通知出牌时候，播放随机音效
            //     let sound = RES.getRes(name);
            //     sound.play(0, 1);
            // }
            /**
             * 循环播放音效
             * @param {string} mp3 xxx_mp3
             * @param {number=1} toV
             */
            this.loopEffectPool = {}; //循环音效播放池
            this.effectPool = {};
            this._soundPromise = null;
            this._warningResolve = null;
            this.audioCache = {}; //声音缓存
            /**
             * 播放人声
             * */
            this.voicePool = {};
            this._voiceResolve = null;
            //音效池，保存已加载的音效
            this._soundPool = {};
        }
        SoundManager.getIns = function () {
            if (SoundManager._ins == null)
                SoundManager._ins = new SoundManager();
            return SoundManager._ins;
        };
        SoundManager.prototype.playBG = function (mp3, times) {
            if (times === void 0) { times = 0; }
            if (this._nowBg == mp3) {
                console.log("重复播放");
                if (this._bgC) {
                    this._bgC.stop();
                }
                else {
                    return;
                }
            }
            ; //避免重复播放以及不能播放时宜播放
            this._nowBg = mp3;
            if (this._bgC) {
                console.log("尝试停止bg");
                egret.Tween.removeTweens(this._bgC); //停止正在播放的BGM
                try {
                    this._bgC.stop();
                }
                catch (e) {
                    console.log(e);
                }
            }
            var sd = RES.getRes(mp3);
            if (!sd)
                return; //背景音乐不存在
            sd.type = egret.Sound.MUSIC;
            sd.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            sd.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
            // console.log(sd);
            this._bgC = sd.play(0, times);
            if (this._bgC == null)
                return;
            this._bgC.volume = 0;
            egret.Tween.get(this._bgC).to({ volume: 0.5 }, 3000); //逐渐提高音量
        };
        SoundManager.prototype.onError = function (e) {
            console.log("音频加载失败: ", e);
        };
        SoundManager.prototype.onComplete = function (e) {
            console.log("背景音乐加载完成: ", e);
        };
        SoundManager.prototype.stopBg = function () {
            if (this._bgC) {
                egret.Tween.removeTweens(this._bgC); //停止正在播放的BGM
                this._bgC.stop();
                this._nowBg = null;
                this._bgC = null;
            }
        };
        SoundManager.prototype.playSoundLoop = function (mp3, toV) {
            if (toV === void 0) { toV = 1; }
            if (this.loopEffectPool[mp3] != null)
                return;
            var sd = RES.getRes(mp3);
            if (!sd)
                return;
            var cc = sd.play(0, 0);
            if (cc == null)
                return;
            cc.volume = toV;
            this.loopEffectPool[mp3] = cc; //将此音效存放进数据结构中
        };
        SoundManager.prototype.stopSoundLoop = function (mp3) {
            if (this.loopEffectPool[mp3] == null)
                return;
            var cc = this.loopEffectPool[mp3];
            cc.stop();
            delete this.loopEffectPool[mp3]; //删除
        };
        /**
         * 播放音效
         * @param {string} mp3 音效名称 xxx_mp3
         * @param {number=1} toV 音效大小
         * @param {number=0} durT 多长时间以内不能再次播放次音效
         */
        SoundManager.prototype.playSound = function (mp3, toV, durT) {
            if (toV === void 0) { toV = 1; }
            if (durT === void 0) { durT = 0; }
            if (durT > 0) {
                if (this.effectPool[mp3] == null)
                    this.effectPool[mp3] = 0;
                var t = new Date().getTime();
                if (t - this.effectPool[mp3] < durT)
                    return;
                this.effectPool[mp3] = t;
            }
            var sd = RES.getRes(mp3);
            if (!sd)
                return;
            var cc = sd.play(0, 1);
            cc.addEventListener(egret.Event.SOUND_COMPLETE, this.onPlayComplete, this);
            if (cc == null)
                return;
            cc.volume = toV;
        };
        SoundManager.prototype.playSoundAsync = function (mp3, toV, durT) {
            var _this = this;
            if (toV === void 0) { toV = 1; }
            if (durT === void 0) { durT = 0; }
            var self = this;
            if (durT > 0) {
                if (this.effectPool[mp3] == null)
                    this.effectPool[mp3] = 0;
                var t = new Date().getTime();
                if (t - this.effectPool[mp3] < durT)
                    return Promise.resolve();
                this.effectPool[mp3] = t;
            }
            var sound = this.audioCache[mp3];
            if (!sound) {
                if (RES.getRes(mp3)) {
                    sound = RES.getRes(mp3); //直接去缓存取数据
                    sound.type = egret.Sound.EFFECT;
                    this.audioCache[mp3] = sound;
                }
                // console.log("声音:", sound);
            }
            return new Promise(function (resolve, reject) {
                if (sound) {
                    var cc = sound.play(0, 1);
                    cc.addEventListener(egret.Event.SOUND_COMPLETE, _this.onPlayComplete, _this);
                    if (cc == null) {
                        resolve();
                        return;
                    }
                    ;
                    cc.volume = toV;
                    self._soundPromise = resolve;
                    return;
                }
                var onLoadComplete = function (event) {
                    utils.GameConst.colorConsole("SoundAsyncLoaded");
                    sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, _this);
                    sound.type = egret.Sound.EFFECT;
                    _this.audioCache[mp3] = sound;
                    var channel;
                    channel = sound.play(0, 1);
                    channel.addEventListener(egret.Event.SOUND_COMPLETE, _this.onPlayComplete, _this);
                    channel.volume = toV;
                    self._soundPromise = resolve;
                };
                //创建 Sound 对象
                sound = new egret.Sound();
                //添加加载完成侦听
                sound.addEventListener(egret.Event.COMPLETE, onLoadComplete, _this);
                sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event) {
                    console.log("loaded error!");
                    resolve();
                }, _this);
                //开始加载ALERT_mp3
                var name = mp3.replace("_mp3", ".mp3");
                var where = SOUND_ROOT + "/back/" + name;
                sound.load(where);
            });
            // let sd:egret.Sound = RES.getRes(mp3);
            // if(!sd) {
            //     console.log("没有找到该音效:", mp3);
            //     return Promise.resolve();
            // }
            // let cc: egret.SoundChannel = sd.play(0, 1);
            // cc.addEventListener(egret.Event.SOUND_COMPLETE, this.onPlayComplete, this);
            // if (cc == null) return;
            // cc.volume = toV;
            // return new Promise((resolve, reject) =>{
            //     self._soundPromise = resolve;
            // })
        };
        SoundManager.prototype.onPlayComplete = function () {
            console.log("音频播放完成");
            if (this._soundPromise) {
                this._soundPromise();
                this._soundPromise = null;
            }
        };
        /**
         * 播放警报
         * */
        SoundManager.prototype.playWarningAsync = function (mp3, toV, durT) {
            var _this = this;
            if (toV === void 0) { toV = 1; }
            if (durT === void 0) { durT = 0; }
            var self = this;
            if (durT > 0) {
                if (this.effectPool[mp3] == null)
                    this.effectPool[mp3] = 0;
                var t = new Date().getTime();
                if (t - this.effectPool[mp3] < durT)
                    return Promise.resolve();
                this.effectPool[mp3] = t;
            }
            var sound = this.audioCache[mp3];
            if (!sound) {
                if (RES.getRes(mp3)) {
                    sound = RES.getRes(mp3); //直接去缓存取数据
                    sound.type = egret.Sound.EFFECT;
                    this.audioCache[mp3] = sound;
                }
                // console.log("声音:", sound);
            }
            return new Promise(function (resolve, reject) {
                if (sound) {
                    var cc = sound.play(0, 1);
                    cc.addEventListener(egret.Event.SOUND_COMPLETE, _this.onWarningComplete, _this);
                    if (cc == null) {
                        resolve();
                        return;
                    }
                    ;
                    cc.volume = toV;
                    self._warningResolve = resolve;
                    return;
                }
                var onLoadComplete = function (event) {
                    utils.GameConst.colorConsole("wainingLoaded");
                    sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, _this);
                    sound.type = egret.Sound.EFFECT;
                    _this.audioCache[mp3] = sound;
                    var channel;
                    channel = sound.play(0, 1);
                    channel.addEventListener(egret.Event.SOUND_COMPLETE, _this.onWarningComplete, _this);
                    channel.volume = toV;
                    self._warningResolve = resolve;
                };
                //创建 Sound 对象
                sound = new egret.Sound();
                //添加加载完成侦听
                sound.addEventListener(egret.Event.COMPLETE, onLoadComplete, _this);
                sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event) {
                    console.log("loaded error!");
                    resolve();
                }, _this);
                //开始加载ALERT_mp3
                var name = mp3.replace("_mp3", ".mp3");
                var where = SOUND_ROOT + "/back/" + name;
                sound.load(where);
            });
            // let sd:egret.Sound = RES.getRes(mp3);
            // if(!sd) {
            //     console.log("没有找到该音效:", mp3);
            //     return Promise.resolve();
            // }
            // let cc: egret.SoundChannel = sd.play(0, 1);
            // cc.addEventListener(egret.Event.SOUND_COMPLETE, this.onWarningComplete, this);
            // if (cc == null) return;
            // cc.volume = toV;
            // return new Promise((resolve, reject) =>{
            //     self._warningResolve = resolve;
            // })
        };
        SoundManager.prototype.onWarningComplete = function () {
            console.log("警报播放完成!");
            if (this._warningResolve) {
                this._warningResolve();
                this._warningResolve = null;
            }
        };
        SoundManager.prototype.playVoiceAsync = function (mp3, toV, durT) {
            var _this = this;
            if (toV === void 0) { toV = 1; }
            if (durT === void 0) { durT = 0; }
            var self = this;
            if (durT > 0) {
                if (this.voicePool[mp3] == null)
                    this.voicePool[mp3] = 0;
                var t = new Date().getTime();
                if (t - this.voicePool[mp3] < durT)
                    return Promise.resolve();
                this.voicePool[mp3] = t;
            }
            var sound = this.audioCache[mp3];
            if (!sound) {
                if (RES.getRes(mp3)) {
                    sound = RES.getRes(mp3); //直接去缓存取数据
                    sound.type = egret.Sound.EFFECT;
                    this.audioCache[mp3] = sound;
                }
                // console.log("声音:", sound);
            }
            return new Promise(function (resolve, reject) {
                if (sound) {
                    var cc = sound.play(0, 1);
                    cc.addEventListener(egret.Event.SOUND_COMPLETE, _this.onVoiceComplete, _this);
                    if (cc == null) {
                        resolve();
                        return;
                    }
                    ;
                    cc.volume = toV;
                    self._voiceResolve = resolve;
                    return;
                }
                var onLoadComplete = function (event) {
                    utils.GameConst.colorConsole("VoiceAsyncLoaded");
                    sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, _this);
                    sound.type = egret.Sound.EFFECT;
                    _this.audioCache[mp3] = sound;
                    var channel;
                    channel = sound.play(0, 1);
                    channel.addEventListener(egret.Event.SOUND_COMPLETE, _this.onVoiceComplete, _this);
                    channel.volume = toV;
                    self._voiceResolve = resolve;
                };
                //创建 Sound 对象
                sound = new egret.Sound();
                //添加加载完成侦听
                sound.addEventListener(egret.Event.COMPLETE, onLoadComplete, _this);
                sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event) {
                    console.log("loaded error!");
                    resolve();
                }, _this);
                //开始加载
                var dir = mp3[0] == "M" ? "/man/" : "/woman/";
                var name = mp3.replace("_mp3", ".mp3");
                var where = SOUND_ROOT + "/voice" + dir + name;
                sound.load(where);
            });
            //veision 1
            // let sd:egret.Sound = RES.getRes(mp3);
            // if(!sd) {
            //     console.log("没有找到该音效:", mp3);
            //     return Promise.resolve();
            // }
            // let cc: egret.SoundChannel = sd.play(0, 1);
            // cc.addEventListener(egret.Event.SOUND_COMPLETE, this.onVoiceComplete, this);
            // if (cc == null) return;
            // cc.volume = toV;
            // return new Promise((resolve, reject) =>{
            //     self._voiceResolve = resolve;
            // })
        };
        SoundManager.prototype.onVoiceComplete = function () {
            console.log("人声播放完成");
            if (this._voiceResolve) {
                this._voiceResolve();
                this._voiceResolve = null;
            }
        };
        /**
         * @param mp3: 音效名字
         * @param type: 音效类型 voice effect warning
         * */
        SoundManager.prototype.playEffectSoundAsync = function (mp3, type) {
            var _this = this;
            var sound = this._soundPool[mp3].mp3;
            return new Promise(function (reslove, reject) {
                var onPlayComplete = function (e) {
                    _this._soundPool[mp3] = {
                        mp3: sound,
                        type: type
                    };
                    sound.play(0, 1);
                    //sound.addEventListener(egret.Event.COMPLETE, )
                };
                if (sound) {
                    var channel = sound.play(0, 1);
                    var callBack = function () {
                        switch (type) {
                            case "voice": {
                                break;
                            }
                        }
                    };
                    sound.addEventListener(egret.Event.SOUND_COMPLETE, callBack, _this);
                }
            });
        };
        return SoundManager;
    }());
    sound_1.SoundManager = SoundManager;
    __reflect(SoundManager.prototype, "sound.SoundManager");
})(sound || (sound = {}));
