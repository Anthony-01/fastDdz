namespace sound {
    //有静音按钮
    //能够根据名字播放音效以及音乐；
    const SOUND_ROOT = "https://h5demo.foxuc.com/DownLoad/fastDDZ_wxgame_remote/resource/assets/sound/effect";
    export class SoundManager {

        private static _ins: SoundManager;

        constructor() {

        }

        public static getIns(): SoundManager {
            if (SoundManager._ins == null)
                SoundManager._ins = new SoundManager();
            return SoundManager._ins;

        }

        //以游戏音效名字作为key播放

        private _nowBg: string = "";

        private _bgC: egret.SoundChannel;

        playBG(mp3: string, times: number = 0) {

            if (this._nowBg == mp3) {
                console.log("重复播放");
                if (this._bgC) {
                    this._bgC.stop();
                } else {
                    return
                }
            };//避免重复播放以及不能播放时宜播放
            this._nowBg = mp3;

            if (this._bgC) {
                console.log("尝试停止bg");
                egret.Tween.removeTweens(this._bgC); //停止正在播放的BGM
                try{
                    this._bgC.stop();
                }catch(e){
                    console.log(e);
                }
            }

            let sd:egret.Sound = RES.getRes(mp3);
            if(!sd) return;//背景音乐不存在
            sd.type = egret.Sound.MUSIC;
            sd.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            sd.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
            // console.log(sd);

            this._bgC = sd.play(0, times);


            if (this._bgC == null) return;
            this._bgC.volume = 0;
            egret.Tween.get(this._bgC).to({ volume: 0.5 }, 3000);//逐渐提高音量
        }

        private onError(e: egret.Event) {
            console.log("音频加载失败: ", e);
        }

        private onComplete(e: egret.Event) {
            console.log("背景音乐加载完成: ", e)
        }

        stopBg() {
            if (this._bgC) {
                egret.Tween.removeTweens(this._bgC); //停止正在播放的BGM
                this._bgC.stop();
                this._nowBg = null;
                this._bgC = null;
            }
        }


        // playEffect(name: string) { //服务器通知出牌时候，播放随机音效
        //     let sound = RES.getRes(name);
        //     sound.play(0, 1);
        // }
        /**
         * 循环播放音效
         * @param {string} mp3 xxx_mp3
         * @param {number=1} toV
         */
        private loopEffectPool = {};//循环音效播放池

        public playSoundLoop(mp3: string, toV: number = 1): void {

            if (this.loopEffectPool[mp3] != null) return;

            let sd:egret.Sound = RES.getRes(mp3);

            if(!sd) return;

            let cc: egret.SoundChannel = sd.play(0,0);

            if (cc == null) return;

            cc.volume = toV;

            this.loopEffectPool[mp3] = cc;//将此音效存放进数据结构中

        }

        public stopSoundLoop(mp3: string): void {
            if (this.loopEffectPool[mp3] == null) return;
            let cc = this.loopEffectPool[mp3] as egret.SoundChannel;
            cc.stop();
            delete  this.loopEffectPool[mp3];//删除
        }

        private effectPool = {};
        /**
         * 播放音效
         * @param {string} mp3 音效名称 xxx_mp3
         * @param {number=1} toV 音效大小
         * @param {number=0} durT 多长时间以内不能再次播放次音效
         */
        playSound(mp3: string, toV: number = 1, durT: number = 0): void {
            if (durT > 0) {
                if (this.effectPool[mp3] == null)
                    this.effectPool[mp3] = 0;

                let t: number = new Date().getTime();
                if (t - this.effectPool[mp3] < durT)
                    return;
                this.effectPool[mp3] = t;
            }
            let sd:egret.Sound = RES.getRes(mp3);
            if(!sd) return;
            let cc: egret.SoundChannel = sd.play(0, 1);
            cc.addEventListener(egret.Event.SOUND_COMPLETE, this.onPlayComplete, this);
            if (cc == null) return;
            cc.volume = toV;
        }

        private _soundPromise: Function = null;
        playSoundAsync(mp3: string, toV: number = 1, durT: number = 0): Promise<any> {
            let self = this;
            if (durT > 0) {
                if (this.effectPool[mp3] == null)
                    this.effectPool[mp3] = 0;

                let t: number = new Date().getTime();
                if (t - this.effectPool[mp3] < durT)
                    return Promise.resolve();
                this.effectPool[mp3] = t;
            }

            let sound: egret.Sound = this.audioCache[mp3];
            if (!sound) {
                if (RES.getRes(mp3)) {
                    sound = RES.getRes(mp3); //直接去缓存取数据
                    sound.type = egret.Sound.EFFECT;
                    this.audioCache[mp3] = sound;
                }
                // console.log("声音:", sound);
            }

            return new Promise((resolve, reject) =>{

                if (sound) {
                    let cc: egret.SoundChannel = sound.play(0, 1);
                    cc.addEventListener(egret.Event.SOUND_COMPLETE, this.onPlayComplete, this);
                    if (cc == null) {
                        resolve();
                        return
                    };
                    cc.volume = toV;
                    self._soundPromise = resolve;
                    return;
                }

                let onLoadComplete = (event: egret.Event) => {
                    utils.GameConst.colorConsole("SoundAsyncLoaded");
                    sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, this);
                    sound.type = egret.Sound.EFFECT;
                    this.audioCache[mp3] = sound;
                    let channel: egret.SoundChannel;
                    channel = sound.play(0, 1);
                    channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onPlayComplete, this);
                    channel.volume = toV;
                    self._soundPromise = resolve;
                };

                //创建 Sound 对象
                sound = new egret.Sound();
                //添加加载完成侦听
                sound.addEventListener(egret.Event.COMPLETE, onLoadComplete, this);
                sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event:egret.IOErrorEvent) {
                    console.log("loaded error!");
                    resolve();
                }, this);
                //开始加载ALERT_mp3
                let name = mp3.replace("_mp3", ".mp3");
                let where = SOUND_ROOT + "/back/" + name;
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
        }

        private onPlayComplete() {
            console.log("音频播放完成");
            if (this._soundPromise) {
                this._soundPromise();
                this._soundPromise = null;
            }
        }

        private _warningResolve: Function = null;
        /**
         * 播放警报
         * */
        playWarningAsync(mp3: string, toV: number = 1, durT: number = 0) {
            let self = this;
            if (durT > 0) {
                if (this.effectPool[mp3] == null)
                    this.effectPool[mp3] = 0;

                let t: number = new Date().getTime();
                if (t - this.effectPool[mp3] < durT)
                    return Promise.resolve();
                this.effectPool[mp3] = t;
            }

            let sound: egret.Sound = this.audioCache[mp3];
            if (!sound) {
                if (RES.getRes(mp3)) {
                    sound = RES.getRes(mp3); //直接去缓存取数据
                    sound.type = egret.Sound.EFFECT;
                    this.audioCache[mp3] = sound;
                }
                // console.log("声音:", sound);
            }

            return new Promise((resolve, reject) =>{

                if (sound) {
                    let cc: egret.SoundChannel = sound.play(0, 1);
                    cc.addEventListener(egret.Event.SOUND_COMPLETE, this.onWarningComplete, this);
                    if (cc == null) {
                        resolve();
                        return
                    };
                    cc.volume = toV;
                    self._warningResolve = resolve;
                    return;
                }

                let onLoadComplete = (event: egret.Event) => {
                    utils.GameConst.colorConsole("wainingLoaded");
                    sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, this);
                    sound.type = egret.Sound.EFFECT;
                    this.audioCache[mp3] = sound;
                    let channel: egret.SoundChannel;
                    channel = sound.play(0, 1);
                    channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onWarningComplete, this);
                    channel.volume = toV;
                    self._warningResolve = resolve;
                };

                //创建 Sound 对象
                sound = new egret.Sound();
                //添加加载完成侦听
                sound.addEventListener(egret.Event.COMPLETE, onLoadComplete, this);
                sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event:egret.IOErrorEvent) {
                    console.log("loaded error!");
                    resolve();
                }, this);
                //开始加载ALERT_mp3
                let name = mp3.replace("_mp3", ".mp3");
                let where = SOUND_ROOT + "/back/" + name;
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
        }

        private onWarningComplete() {
            console.log("警报播放完成!");
            if (this._warningResolve) {
                this._warningResolve();
                this._warningResolve = null;
            }
        }

        private audioCache: Object = {}; //声音缓存
        /**
         * 播放人声
         * */
        private voicePool = {};
        private _voiceResolve: Function = null;
        public playVoiceAsync(mp3: string, toV: number = 1, durT: number = 0): Promise<any> {
            let self = this;
            if (durT > 0) {
                if (this.voicePool[mp3] == null)
                    this.voicePool[mp3] = 0;

                let t: number = new Date().getTime();
                if (t - this.voicePool[mp3] < durT)
                    return Promise.resolve();
                this.voicePool[mp3] = t;
            }

            let sound: egret.Sound = this.audioCache[mp3];
            if (!sound) {
                if (RES.getRes(mp3)) {
                    sound = RES.getRes(mp3); //直接去缓存取数据
                    sound.type = egret.Sound.EFFECT;
                    this.audioCache[mp3] = sound;
                }
                // console.log("声音:", sound);
            }

            return new Promise((resolve, reject) =>{

                if (sound) {
                    let cc: egret.SoundChannel = sound.play(0, 1);
                    cc.addEventListener(egret.Event.SOUND_COMPLETE, this.onVoiceComplete, this);
                    if (cc == null) {
                        resolve();
                        return
                    };
                    cc.volume = toV;
                    self._voiceResolve = resolve;
                    return;
                }

                let onLoadComplete = (event: egret.Event) => {
                    utils.GameConst.colorConsole("VoiceAsyncLoaded");
                    sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, this);
                    sound.type = egret.Sound.EFFECT;
                    this.audioCache[mp3] = sound;
                    let channel: egret.SoundChannel;
                    channel = sound.play(0, 1);
                    channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onVoiceComplete, this);
                    channel.volume = toV;
                    self._voiceResolve = resolve;
                };

                //创建 Sound 对象
                sound = new egret.Sound();
                //添加加载完成侦听
                sound.addEventListener(egret.Event.COMPLETE, onLoadComplete, this);
                sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event:egret.IOErrorEvent) {
                    console.log("loaded error!");
                    resolve();
                }, this);
                //开始加载
                let dir = mp3[0] == "M" ? "/man/" : "/woman/";
                let name = mp3.replace("_mp3", ".mp3");
                let where = SOUND_ROOT + "/voice" + dir + name;
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
        }

        private onVoiceComplete() {
            console.log("人声播放完成");
            if (this._voiceResolve) {
                this._voiceResolve();
                this._voiceResolve = null;
            }
        }

        //音效池，保存已加载的音效
        private _soundPool: any = {};
        /**
         * @param mp3: 音效名字
         * @param type: 音效类型 voice effect warning
         * */
        public playEffectSoundAsync(mp3: string, type: string): Promise<any> {

            let sound: egret.Sound = this._soundPool[mp3].mp3;

           return new Promise((reslove, reject) => {

               let onPlayComplete = (e: egret.Event) => {
                    this._soundPool[mp3] = {
                        mp3: sound,
                        type: type
                    };
                    sound.play(0, 1);
                    //sound.addEventListener(egret.Event.COMPLETE, )
               };

               if (sound) { //播放并且返回promise,根据type来映射resolve,根据是否已有来控制能否播放
                   let channel = sound.play(0, 1);
                   let callBack = () => {
                     switch (type) {
                         case "voice": {
                             break;
                         }
                     }
                   };
                   sound.addEventListener(egret.Event.SOUND_COMPLETE, callBack, this);

               }
           })
        }


    }
    export interface ISoundPool {
        mp3: egret.Sound,
        type: string,
        resolve: Function
    }
}
