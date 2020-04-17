var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var frame;
(function (frame) {
    var BaseFrame = (function () {
        function BaseFrame(delegate) {
            this._delegate = delegate;
            this._dispatcher = new egret.EventDispatcher();
            this.addEventListener();
        }
        BaseFrame.prototype.getDispatcher = function () {
            return this._dispatcher;
        };
        /**设置业务代理*/
        BaseFrame.prototype.setDelegate = function (delegate) {
            this._delegate = delegate;
        };
        /**
         * 添加监听
         */
        BaseFrame.prototype.addEventListener = function () {
            //注册通知
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_CONNECT_COMPLETE, this.connectComplete, this);
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_RE_CONNECT, this.reConnect, this);
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onMessage, this);
        };
        /**
         * 移除监听
         */
        BaseFrame.prototype.removeEventListener = function () {
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_CONNECT_COMPLETE, this.connectComplete, this);
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_RE_CONNECT, this.reConnect, this);
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onMessage, this);
        };
        //连接成功
        BaseFrame.prototype.connectComplete = function () {
            console.log("GameBase:连接成功");
            if (this._delegate && this._delegate.connectComplete) {
                this._delegate.connectComplete();
            }
        };
        BaseFrame.prototype.reConnect = function (e) {
            console.log("BaseFrame:重新连接");
        };
        /**
        * 网络消息
        */
        BaseFrame.prototype.onMessage = function (e) {
        };
        /**
        * 发送心跳
        */
        BaseFrame.prototype.sendPing = function (service) {
            //构造数据
            var Ping = new utils.ByteArray();
            //设置偏移
            Ping.position(df.Len_Tcp_Head);
            //发送心跳
            service.SendSocketData(df.MDM_KN_COMMAND, df.SUB_KN_DETECT_SOCKET, Ping, Ping.getLength());
        };
        return BaseFrame;
    }());
    frame.BaseFrame = BaseFrame;
    __reflect(BaseFrame.prototype, "frame.BaseFrame");
})(frame || (frame = {}));
