namespace utils {
    export class GameConst {

        public static stageW: number;

        public static stageH: number;

        public static createBitmapByName(name: string) : egret.Bitmap {
            let texture: egret.Texture = RES.getRes(name);
            if (null == texture) {
                console.log("%c创建纹理失败：", "color: green;font-size: 4em");
                console.error(name);
                return;
            }
            let bitmap: egret.Bitmap = new egret.Bitmap(texture);
            return bitmap;
        }

        public static createBitmapFromSheet(name: string, sheet: string) : egret.Bitmap {
            let texture: egret.Texture = RES.getRes(`${sheet}_json.${name}`);
            if (null == texture) {
                console.log("%c创建纹理失败：", "color: green;font-size: 5em");
                console.error(`${sheet}_json.${name}`);
                return;
            }
            let bitmap: egret.Bitmap = new egret.Bitmap(texture);
            return bitmap;
        }

        public static removeChild(child: egret.DisplayObject) {
            if (child && child.parent) {
                if ((<any>child.parent).removeElement) {
                    (<any>child.parent).removeElement(child);
                } else {
                    child.parent.removeChild(child);
                }
            }
        }

        public static setAnchorCenter(object: egret.DisplayObject): egret.DisplayObject {
            if ((null != object) && (object.width >= 0 && (object.height >= 0))) {
                object.anchorOffsetX == object.width/2;
                object.anchorOffsetY == object.height/2;
                return object;
            }
            return
        }
    }
}