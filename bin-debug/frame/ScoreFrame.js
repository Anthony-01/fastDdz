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
var frame;
(function (frame) {
    var ScoreFrame = (function (_super) {
        __extends(ScoreFrame, _super);
        function ScoreFrame() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ScoreFrame;
    }(frame.BaseFrame));
    frame.ScoreFrame = ScoreFrame;
    __reflect(ScoreFrame.prototype, "frame.ScoreFrame");
})(frame || (frame = {}));
