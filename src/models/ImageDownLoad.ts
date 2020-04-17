/**
 * 图片下载
 */
namespace models {
    export class ImageDownLoad extends egret.URLLoader {
        private _downloadHandler: any;
        private _bLoadFinish: boolean = false;
        
        constructor(source: string,downloadHandler: any) {
            super();
            this._downloadHandler = downloadHandler;

            this.dataFormat = egret.URLLoaderDataFormat.TEXTURE;

            this.once( egret.Event.COMPLETE, this.LoadURLSuccess, this ); 
            // egret.ImageLoader.crossOrigin = "anonymous";

            let request:egret.URLRequest = new egret.URLRequest(source);

            this.load(request);
        }

        private LoadURLSuccess(evt:egret.Event ): void{
            //成功标识
            this._bLoadFinish = true;

            //位图数据
            let loader:egret.ImageLoader = evt.currentTarget;
            let bmd:egret.BitmapData = loader.data;
            
            //回调
            if (null != this._downloadHandler) {
                this._downloadHandler(bmd);
            }

            //置空引用
            this._downloadHandler = null;
            this._bLoadFinish = null;
        }
    }
}