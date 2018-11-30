var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var utils;
(function (utils) {
    var GameConst = (function () {
        function GameConst() {
        }
        GameConst.createBitmapByName = function (name) {
            var texture = RES.getRes(name);
            if (null == texture) {
                console.log("%c创建纹理失败：", "color: green;font-size: 4em");
                console.error(name);
                return;
            }
            var bitmap = new egret.Bitmap(texture);
            return bitmap;
        };
        GameConst.createBitmapFromSheet = function (name, sheet) {
            var texture = RES.getRes(sheet + "_json." + name);
            if (null == texture) {
                console.log("%c创建纹理失败：", "color: green;font-size: 5em");
                console.error(sheet + "_json." + name);
                return;
            }
            var bitmap = new egret.Bitmap(texture);
            return bitmap;
        };
        GameConst.removeChild = function (child) {
            if (child && child.parent) {
                if (child.parent.removeElement) {
                    child.parent.removeElement(child);
                }
                else {
                    child.parent.removeChild(child);
                }
            }
        };
        GameConst.setAnchorCenter = function (object) {
            if ((null != object) && (object.width >= 0 && (object.height >= 0))) {
                object.anchorOffsetX == object.width / 2;
                object.anchorOffsetY == object.height / 2;
                return object;
            }
            return;
        };
        GameConst.stageW = 640;
        GameConst.stageH = 1134;
        return GameConst;
    }());
    utils.GameConst = GameConst;
    __reflect(GameConst.prototype, "utils.GameConst");
    /**构造对象
     * 泛型
     */
    function createInstance(c) {
        return new c();
    }
    utils.createInstance = createInstance;
    /**构造泛型数组
     * 一维数组
     */
    function allocArray(dimension, instance) {
        var arr = new Array();
        for (var i = 0; i < dimension; i++) {
            arr[i] = utils.createInstance(instance);
        }
        return arr;
    }
    utils.allocArray = allocArray;
    /**
     * 构造泛型数组
     * 二维数组
     * eg: alloc2Array<Number>(2,4,Number)  [2][4]
     * alloc2Array<tagWeaveItem>(2,4,tagWeaveItem) [2][4]
     */
    function alloc2Array(dimension, count, instance) {
        //let arr: T[] = [];
        var arr = new Array();
        for (var i = 0; i < dimension; i++) {
            arr[i] = [];
            for (var j = 0; j < count; j++) {
                arr[i][j] = utils.createInstance(instance);
            }
        }
        return arr;
    }
    utils.alloc2Array = alloc2Array;
    /**
     * 构造数组
     * 三维数组
     * eg: alloc2Array<number>(2,4,4)  [2][4][4]
     */
    function alloc3Array(dimension, count, count1, instance) {
        var arr = [];
        for (var i = 0; i < dimension; i++) {
            arr[i] = [];
            for (var j = 0; j < count; j++) {
                arr[i][j] = [];
                for (var k = 0; k < count1; k++) {
                    arr[i][j][k] = utils.createInstance(instance);
                }
            }
        }
        return arr;
    }
    utils.alloc3Array = alloc3Array;
})(utils || (utils = {}));
