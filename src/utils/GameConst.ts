namespace utils {
    export class GameConst {

        public static stageW: number = 640;

        public static stageH: number = 1134;

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

    /**构造对象
     * 泛型
     */
    export function createInstance<T>(c: { new (): T; }): T {
        return new c();
    }

    /**构造泛型数组
     * 一维数组
     */
    export function allocArray<T>(dimension: number, instance: { new (): T; }): T[] {
        let arr: T[] = new Array<T>();
        for (let i = 0; i < dimension; i++) {
            arr[i] = utils.createInstance<T>(instance);
        }
        return arr;
    }

    /**
     * 构造泛型数组
     * 二维数组
     * eg: alloc2Array<Number>(2,4,Number)  [2][4]
     * alloc2Array<tagWeaveItem>(2,4,tagWeaveItem) [2][4]
     */

    export function alloc2Array<T>(dimension: number, count: number, instance: { new (): T; }): T[][] {
        //let arr: T[] = [];
        let arr: Array<Array<T>> = new Array<Array<T>>();

        for (let i = 0; i < dimension; i++) {
            arr[i] = [];
            for (let j = 0; j < count; j++) {
                arr[i][j] = utils.createInstance<T>(instance);
            }
        }

        return arr;
    }

    /**
     * 构造数组
     * 三维数组
     * eg: alloc2Array<number>(2,4,4)  [2][4][4]
     */
    export function alloc3Array<T>(dimension: number, count: number, count1: number, instance: { new (): T; }): T[][][] {
        let arr: T[][][] = [];
        for (let i = 0; i < dimension; i++) {
            arr[i] = [];
            for (let j = 0; j < count; j++) {
                arr[i][j] = [];
                for (let k = 0; k < count1; k++) {
                    arr[i][j][k] = utils.createInstance<T>(instance);
                }
            }
        }

        return arr;
    }
}