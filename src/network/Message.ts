/**
 * 网络消息包
 */
namespace network {
    export class Message {
        /**
         * 主命令码
         */
        public wMainCmd: number;

        /**
         * 子命令码
         */
        public wSubCmd: number;

        /**
         * 消息包长度
         */
        public wLength: number;

        /**
         * 服务模块
         */
        public wServerModule: number;

        /**
         * 缓冲内容
         */
        public cbBuffer: utils.ByteArray;

        /**构造
         * constructor 
         */
        constructor(wMain: number, wSub: number,wServerModule: number, wLen: number, cbBuffer: utils.ByteArray) {
            this.wMainCmd = wMain;
            this.wSubCmd = wSub;
            this.wLength = wLen;
            this.cbBuffer = new utils.ByteArray();
            this.wServerModule = wServerModule;
            utils.Memory.CopyMemory(this.cbBuffer, cbBuffer, wLen, 0, df.Len_Tcp_Head);
        }
    }
}