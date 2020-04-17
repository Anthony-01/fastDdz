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
/**
 * 图片下载
 */
var models;
(function (models) {
    var ImageDownLoad = (function (_super) {
        __extends(ImageDownLoad, _super);
        function ImageDownLoad(source, downloadHandler) {
            var _this = _super.call(this) || this;
            _this._bLoadFinish = false;
            _this._downloadHandler = downloadHandler;
            _this.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
            _this.once(egret.Event.COMPLETE, _this.LoadURLSuccess, _this);
            // egret.ImageLoader.crossOrigin = "anonymous";
            var request = new egret.URLRequest(source);
            _this.load(request);
            return _this;
        }
        ImageDownLoad.prototype.LoadURLSuccess = function (evt) {
            //成功标识
            this._bLoadFinish = true;
            //位图数据
            var loader = evt.currentTarget;
            var bmd = loader.data;
            //回调
            if (null != this._downloadHandler) {
                this._downloadHandler(bmd);
            }
            //置空引用
            this._downloadHandler = null;
            this._bLoadFinish = null;
        };
        return ImageDownLoad;
    }(egret.URLLoader));
    models.ImageDownLoad = ImageDownLoad;
    __reflect(ImageDownLoad.prototype, "models.ImageDownLoad");
})(models || (models = {}));
