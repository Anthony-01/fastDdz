var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var net;
(function (net) {
    var Commands;
    (function (Commands) {
        Commands[Commands["SYSTEM_MSG"] = 1] = "SYSTEM_MSG";
        Commands[Commands["REGISTER"] = 2] = "REGISTER";
        Commands[Commands["LOGIN"] = 3] = "LOGIN";
        Commands[Commands["MATCH_PLAYER"] = 4] = "MATCH_PLAYER";
        Commands[Commands["PLAY_GAME"] = 5] = "PLAY_GAME";
        Commands[Commands["ROOM_NOTIFY"] = 6] = "ROOM_NOTIFY";
        Commands[Commands["PLAYER_PLAY_CARD"] = 7] = "PLAYER_PLAY_CARD";
        Commands[Commands["PAYER_WANT_DIZHU"] = 8] = "PAYER_WANT_DIZHU";
    })(Commands = net.Commands || (net.Commands = {}));
    var NetController = (function () {
        function NetController() {
            this.callBackPool = {};
            this.sequence = 1;
        }
        NetController.prototype.connect = function () {
            if (!this.ws) {
                this.ws = new net.NetSocket();
                this.ws.connect("loaclhost", 8180);
            }
        };
        NetController.getInstance = function () {
            if (!this._instance) {
                this._instance = new NetController();
            }
            return this._instance;
        };
        NetController.prototype.readData = function (msg) {
            var seq = msg.seq;
            if (seq) {
                this.showState("收到服务器返回的消息：");
                console.log(msg);
                var callBack = this.callBackPool[seq];
                if (callBack) {
                    callBack.callBack.call(callBack.thisObj, msg);
                }
                delete this.callBackPool[seq];
            }
            else {
                this.showState("收到服务器主动发送的消息");
                this.dispatcher.dispatchEventWith(msg.command + "", false, msg);
            }
        };
        NetController.prototype.sendData = function (data, callBack, obj) {
            if (callBack === void 0) { callBack = null; }
            data.seq = this.sequence++;
            this.ws.sendData(JSON.stringify(data));
            if (callBack && obj) {
                this.callBackPool[data.seq] = {
                    callBack: callBack,
                    thisObj: obj
                };
            }
        };
        NetController.prototype.addListener = function (command, obj) {
            this.dispatcher.addEventListener(command + "", function (event) { obj.onGameMessage(event.data); }, this);
        };
        /**打印*/
        NetController.prototype.showState = function (str) {
            console.log("%cSocket:", "color: yellow; font-size: 2em");
            console.log(str);
        };
        return NetController;
    }());
    net.NetController = NetController;
    __reflect(NetController.prototype, "net.NetController");
    /**基本的消息格式*/
    var BaseMsg = (function () {
        function BaseMsg() {
        }
        return BaseMsg;
    }());
    net.BaseMsg = BaseMsg;
    __reflect(BaseMsg.prototype, "net.BaseMsg");
    /**
     * 是否需要定义服务器消息
     * */
})(net || (net = {}));
