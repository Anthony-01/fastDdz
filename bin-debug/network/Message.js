var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 网络消息包
 */
var network;
(function (network) {
    var Message = (function () {
        /**构造
         * constructor
         */
        function Message(wMain, wSub, wServerModule, wLen, cbBuffer) {
            this.wMainCmd = wMain;
            this.wSubCmd = wSub;
            this.wLength = wLen;
            this.cbBuffer = new utils.ByteArray();
            this.wServerModule = wServerModule;
            utils.Memory.CopyMemory(this.cbBuffer, cbBuffer, wLen, 0, df.Len_Tcp_Head);
        }
        return Message;
    }());
    network.Message = Message;
    __reflect(Message.prototype, "network.Message");
})(network || (network = {}));
