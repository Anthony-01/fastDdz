/**
 * 音效管理
 */
class SoundMgr {
    private static _instance: SoundMgr;

    public bgSound: egret.Sound;
    public bgChannel: egret.SoundChannel;
    public isPlaying: boolean = false;
    private audioCache: Object = {};

    private _soundVolume: number;
    private _effectVolume: number;

    private _soundAvaliable: boolean;
    private _effectAvaliable: boolean;

    public static get instance(): SoundMgr {
        if (null == SoundMgr._instance) {
            SoundMgr._instance = new SoundMgr();
        }
        return SoundMgr._instance;
    }

    public constructor() {
        this.initVolume();
    }

    private initVolume() {
        let record: any = {};
        record = localStorage.getItem(df.LocalStorageKey.OPTION);
        if (null == record) {
            //默认参数
            record = {
                valumeSound: 0.5,
                valumeEffect: 0.5,
                valumeVoice: 0.5,
                soundSwitch: true,
                effectSwitch: true,
                voiceSwitch: true,
                language: 0
            }

            localStorage.setItem(df.LocalStorageKey.OPTION, JSON.stringify(record));
        } else {
            record = JSON.parse(record);
        }

        let soundVolume: number = parseFloat(record.valumeSound);
        this._soundVolume = soundVolume ? soundVolume : 0.5;
        this._soundAvaliable = this._soundVolume > 0 ? true : false;

        let effectVolume: number = parseFloat(record.valumeEffect);
        this._effectVolume = effectVolume ? effectVolume : 0.5;
        this._effectAvaliable = (record.effectSwitch && this._effectVolume > 0) ? true : false;

    }

    public get soundVolume(): number { //背景音量
        return this._soundVolume;
    }
    public get effectVolume(): number { //音效音量
        return this._effectVolume;
    }

    public get soundAvaliable() {
        return this._soundAvaliable;
    }

    public get effectAvaliable() {
        return this._effectAvaliable;
    }

    public get languageType() {
        let record: any = {};
        record = localStorage.getItem(df.LocalStorageKey.OPTION);
        record = JSON.parse(record);

        const language = record ? record.language : 1; 
        return language;
    }
    public setSoundVolume(value) { //背景音量
        this._soundVolume = value;

        if (this.bgChannel) {
            this.bgChannel.volume = this.soundVolume;
        }

        this._soundAvaliable = this._soundVolume > 0 ? true : false;

    }

    public setEffectVolume(value) {
        this._effectVolume = value;
        this._effectAvaliable = this._effectVolume > 0 ? true : false;
    }


    public pauseBackGround() {
        if (this.bgChannel) {
            this.bgChannel.volume = 0;
        }
    }

    public reStartBackGround() {
        if (this.bgChannel) {
            this.bgChannel.volume = this.soundVolume;
        }
    }

    /*
     *  此方法针对所有背景音乐和其他音效(背景音乐轮播 其他音效只播一次 )
     *  @param callback 播放完音乐回调
     */
    public playSound(mp3: string, isBgSound: boolean = false, play: boolean = true, callback: Function = null, thisObject: any = null): void {
        let record: any = {};
        record = localStorage.getItem(df.LocalStorageKey.OPTION);
        record = JSON.parse(record);

        let sound: egret.Sound = this.audioCache[mp3];
        if (!sound) {
            if (RES.getRes(mp3)) {
                sound = RES.getRes(mp3); //直接去缓存取数据
                sound.type = egret.Sound.MUSIC;
                this.audioCache[mp3] = sound;
            }
        }

        var channel: egret.SoundChannel;
        if (sound) {
            if (isBgSound) {
                if ((sound == this.bgSound && this.isPlaying) || (false == record.soundSwitch)) return;
                let index: number = this.bgChannel ? this.bgChannel.position : 0;

                if (this.bgChannel)
                    this.bgChannel.stop();

                channel = sound.play(index, -1);
                this.isPlaying = true;
                this.bgSound = sound;
                this.bgChannel = channel;
                channel.volume = this.soundVolume;
            }
            else {
                if (this.effectVolume == 0) {
                    return;
                }
                channel = sound.play(0, 1);
                if (null != callback) {
                    channel.removeEventListener(egret.Event.SOUND_COMPLETE, callback, thisObject);
                    channel.addEventListener(egret.Event.SOUND_COMPLETE, callback, thisObject);
                }
                channel.volume = this.effectVolume;
            }
            return;
        }

        let onLoadComplete = function (event: egret.Event) {
            sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, this);
            this.audioCache[mp3] = sound;
            var channel: egret.SoundChannel;
            if (isBgSound) {
                channel = sound.play(0, -1);
                channel.volume = this.soundVolume;
                this.bgChannel = channel;
            } else {
                channel = sound.play(0, 1);
                channel.volume = this.effectVolume;
            }
            if (null != callback) {
                channel.removeEventListener(egret.Event.SOUND_COMPLETE, callback, thisObject);
                channel.addEventListener(egret.Event.SOUND_COMPLETE, callback, thisObject);
            }
        }

        if (isBgSound) {
            if (record.soundSwitch == false) return;
        }
        else {
            if (this.effectVolume == 0) {
                return;
            }
        }

        //创建 Sound 对象
        sound = new egret.Sound();
        //添加加载完成侦听
        sound.addEventListener(egret.Event.COMPLETE, onLoadComplete, this);
        //开始加载
        sound.load(mp3);
    }
}