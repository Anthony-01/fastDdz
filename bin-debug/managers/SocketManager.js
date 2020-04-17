var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SocketMrg;
(function (SocketMrg) {
    var SocketManager = (function () {
        function SocketManager() {
        }
        SocketManager.getInstance = function () {
            if (SocketManager.m_instance == null) {
                SocketManager.m_instance = new SocketManager();
                SocketManager.m_instance.init();
            }
            return SocketManager.m_instance;
        };
        SocketManager.prototype.init = function () {
            this._pool = {};
            this._socketList = [];
        };
        SocketManager.prototype.pushSocket = function (soc, key) {
            this._socketList.push(soc);
            if (key) {
                this._pool[key] = soc;
            }
        };
        SocketManager.prototype.popSocket = function (key) {
            if (this._pool[key]) {
                var index = void 0;
                for (var n = 0; n < this._socketList.length; n++) {
                    if (this._socketList[n] == this._pool[key]) {
                        index = n;
                        break;
                    }
                }
                this._socketList.splice(index, 1);
                this._pool[key] = null;
                utils.GameConst.colorConsole("清除Socket成功!");
            }
            else {
                utils.GameConst.colorConsole("未找到目标keySocket!");
            }
        };
        SocketManager.prototype.closeAllSocket = function () {
            utils.GameConst.colorConsole("清除所有socket");
            this._socketList.forEach(function (item) {
                console.log(item);
                item.close();
            });
            this._socketList = [];
            for (var item in this._pool) {
                this._pool[item] = null;
            }
        };
        return SocketManager;
    }());
    SocketMrg.SocketManager = SocketManager;
    __reflect(SocketManager.prototype, "SocketMrg.SocketManager");
})(SocketMrg || (SocketMrg = {}));
