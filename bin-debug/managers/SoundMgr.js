var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 音效管理
 */
var SoundMgr = (function () {
    function SoundMgr() {
        this.isPlaying = false;
        this.audioCache = {};
        this.initVolume();
    }
    Object.defineProperty(SoundMgr, "instance", {
        get: function () {
            if (null == SoundMgr._instance) {
                SoundMgr._instance = new SoundMgr();
            }
            return SoundMgr._instance;
        },
        enumerable: true,
        configurable: true
    });
    SoundMgr.prototype.initVolume = function () {
        var record = {};
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
            };
            localStorage.setItem(df.LocalStorageKey.OPTION, JSON.stringify(record));
        }
        else {
            record = JSON.parse(record);
        }
        var soundVolume = parseFloat(record.valumeSound);
        this._soundVolume = soundVolume ? soundVolume : 0.5;
        this._soundAvaliable = this._soundVolume > 0 ? true : false;
        var effectVolume = parseFloat(record.valumeEffect);
        this._effectVolume = effectVolume ? effectVolume : 0.5;
        this._effectAvaliable = (record.effectSwitch && this._effectVolume > 0) ? true : false;
    };
    Object.defineProperty(SoundMgr.prototype, "soundVolume", {
        get: function () {
            return this._soundVolume;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundMgr.prototype, "effectVolume", {
        get: function () {
            return this._effectVolume;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundMgr.prototype, "soundAvaliable", {
        get: function () {
            return this._soundAvaliable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundMgr.prototype, "effectAvaliable", {
        get: function () {
            return this._effectAvaliable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundMgr.prototype, "languageType", {
        get: function () {
            var record = {};
            record = localStorage.getItem(df.LocalStorageKey.OPTION);
            record = JSON.parse(record);
            var language = record ? record.language : 1;
            return language;
        },
        enumerable: true,
        configurable: true
    });
    SoundMgr.prototype.setSoundVolume = function (value) {
        this._soundVolume = value;
        if (this.bgChannel) {
            this.bgChannel.volume = this.soundVolume;
        }
        this._soundAvaliable = this._soundVolume > 0 ? true : false;
    };
    SoundMgr.prototype.setEffectVolume = function (value) {
        this._effectVolume = value;
        this._effectAvaliable = this._effectVolume > 0 ? true : false;
    };
    SoundMgr.prototype.pauseBackGround = function () {
        if (this.bgChannel) {
            this.bgChannel.volume = 0;
        }
    };
    SoundMgr.prototype.reStartBackGround = function () {
        if (this.bgChannel) {
            this.bgChannel.volume = this.soundVolume;
        }
    };
    /*
     *  此方法针对所有背景音乐和其他音效(背景音乐轮播 其他音效只播一次 )
     *  @param callback 播放完音乐回调
     */
    SoundMgr.prototype.playSound = function (mp3, isBgSound, play, callback, thisObject) {
        if (isBgSound === void 0) { isBgSound = false; }
        if (play === void 0) { play = true; }
        if (callback === void 0) { callback = null; }
        if (thisObject === void 0) { thisObject = null; }
        var record = {};
        record = localStorage.getItem(df.LocalStorageKey.OPTION);
        record = JSON.parse(record);
        var sound = this.audioCache[mp3];
        if (!sound) {
            if (RES.getRes(mp3)) {
                sound = RES.getRes(mp3); //直接去缓存取数据
                sound.type = egret.Sound.MUSIC;
                this.audioCache[mp3] = sound;
            }
        }
        var channel;
        if (sound) {
            if (isBgSound) {
                if ((sound == this.bgSound && this.isPlaying) || (false == record.soundSwitch))
                    return;
                var index = this.bgChannel ? this.bgChannel.position : 0;
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
        var onLoadComplete = function (event) {
            sound.removeEventListener(egret.Event.COMPLETE, onLoadComplete, this);
            this.audioCache[mp3] = sound;
            var channel;
            if (isBgSound) {
                channel = sound.play(0, -1);
                channel.volume = this.soundVolume;
                this.bgChannel = channel;
            }
            else {
                channel = sound.play(0, 1);
                channel.volume = this.effectVolume;
            }
            if (null != callback) {
                channel.removeEventListener(egret.Event.SOUND_COMPLETE, callback, thisObject);
                channel.addEventListener(egret.Event.SOUND_COMPLETE, callback, thisObject);
            }
        };
        if (isBgSound) {
            if (record.soundSwitch == false)
                return;
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
    };
    return SoundMgr;
}());
__reflect(SoundMgr.prototype, "SoundMgr");
