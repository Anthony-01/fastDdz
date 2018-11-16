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
        return GameConst;
    }());
    utils.GameConst = GameConst;
    __reflect(GameConst.prototype, "utils.GameConst");
})(utils || (utils = {}));
