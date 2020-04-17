var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var models;
(function (models) {
    var ErrorReporter = (function () {
        function ErrorReporter() {
            this.wMainCmd = 0;
            this.wSubCmd = 0;
        }
        Object.defineProperty(ErrorReporter.prototype, "MainCmd", {
            get: function () {
                return this.wMainCmd;
            },
            set: function (cmd) {
                this.wMainCmd = cmd;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorReporter.prototype, "SubCmd", {
            get: function () {
                return this.wSubCmd;
            },
            set: function (cmd) {
                this.wSubCmd = cmd;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ErrorReporter.prototype, "Buffer", {
            get: function () {
                return this.pBuffer;
            },
            set: function (buffer) {
                this.pBuffer = buffer;
            },
            enumerable: true,
            configurable: true
        });
        ErrorReporter.prototype.Report = function () {
            var str = "" + this.MainCmd + "" + this.SubCmd;
            managers.FrameManager.getInstance().showDailog(1 /* OK_CANCELL */, str, function () {
                GameEngine.getInstance().startGameHandler();
                console.log("日志追踪" + str);
            });
        };
        return ErrorReporter;
    }());
    models.ErrorReporter = ErrorReporter;
    __reflect(ErrorReporter.prototype, "models.ErrorReporter");
})(models || (models = {}));
