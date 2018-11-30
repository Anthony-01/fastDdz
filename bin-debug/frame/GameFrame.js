var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var frame;
(function (frame) {
    var GameFrame = (function () {
        function GameFrame() {
        }
        return GameFrame;
    }());
    frame.GameFrame = GameFrame;
    __reflect(GameFrame.prototype, "frame.GameFrame");
})(frame || (frame = {}));
