namespace net {

    export enum Commands {
        SYSTEM_MSG = 1,
        REGISTER = 2,
        LOGIN = 3,
        MATCH_PLAYER = 4,
        PLAY_GAME = 5,
        ROOM_NOTIFY = 6,
        PLAYER_PLAY_CARD = 7,
        PAYER_WANT_DIZHU = 8
    }

    export class NetController {

        private ws: NetSocket;

        constructor() {

        }

        public connect() {
            if (!this.ws) {
                this.ws = new NetSocket();
                this.ws.connect("loaclhost", 8180);
            }
        }

        private static _instance:NetController;

        public static getInstance() {
            if(!this._instance){
                this._instance = new NetController();
            }
            return this._instance;
        }

        private callBackPool = {};

        private dispatcher: egret.EventDispatcher;

        public readData(msg: BaseMsg) {
            let seq = msg.seq;
            if (seq) { //如果存在seq，则是服务器返回过来的消息
                this.showState("收到服务器返回的消息：");
                console.log(msg);
                let callBack = this.callBackPool[seq];
                if (callBack) {
                    callBack.callBack.call(callBack.thisObj, msg);
                }
                delete this.callBackPool[seq];
            } else { //服务器主动发送过来的消息
                this.showState("收到服务器主动发送的消息");
                this.dispatcher.dispatchEventWith(msg.command + "", false, msg);
            }
        }

        private sequence = 1;

        public sendData(data: BaseMsg, callBack: Function = null, obj: any) {
            data.seq = this.sequence++;
            this.ws.sendData(JSON.stringify(data));

            if (callBack && obj) {
                this.callBackPool[data.seq] = {
                    callBack: callBack,
                    thisObj: obj
                }
            }
        }

        addListener(command: Commands, obj: any) {
            this.dispatcher.addEventListener(command + "", (event: egret.Event) => {obj.onGameMessage(event.data)}, this)
        }


        /**打印*/
        public showState(str: string):void {
            console.log("%cSocket:", "color: yellow; font-size: 2em");
            console.log(str);
        }
    }

    /**基本的消息格式*/
    export class BaseMsg {
        public command: number;//主命令?
        public code: number;
        public seq: number;
        public content: any;
    }

    /**
     * 是否需要定义服务器消息
     * */
}