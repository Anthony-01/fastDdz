namespace frame {
    export class BaseFrame {
        public _delegate: any;                     //业务代理
        public _dispatcher: egret.EventDispatcher; //通知实例
        
        constructor(delegate?: any) {
            this._delegate = delegate;
            this._dispatcher = new egret.EventDispatcher();
            this.addEventListener();
        }

        public getDispatcher() {
            return this._dispatcher;
        }

         /**设置业务代理*/
        public setDelegate(delegate: any) {
            this._delegate = delegate;
        }

        /**
         * 添加监听
         */
        public addEventListener() {
            //注册通知
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_CONNECT_COMPLETE, this.connectComplete, this);
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_RE_CONNECT, this.reConnect, this);
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onMessage, this);
        }

        /**
         * 移除监听
         */
        public removeEventListener() {
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_CONNECT_COMPLETE, this.connectComplete, this);
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_RE_CONNECT, this.reConnect, this);
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onMessage, this);
        }

        //连接成功
        public connectComplete(): void {
            console.log("GameBase:连接成功");
            if (this._delegate && this._delegate.connectComplete) {
                this._delegate.connectComplete();
            }
        }

        public reConnect(e: egret.Event) {
            console.log("BaseFrame:重新连接");
        }

        /**
        * 网络消息
        */
        public onMessage(e: egret.Event): void {

        }

        /**
        * 发送心跳
        */
        public sendPing(service): void {
            //构造数据
            let Ping = new utils.ByteArray();

            //设置偏移
            Ping.position(df.Len_Tcp_Head);

            //发送心跳
            service.SendSocketData(df.MDM_KN_COMMAND, df.SUB_KN_DETECT_SOCKET, Ping, Ping.getLength());
        }
    }
}