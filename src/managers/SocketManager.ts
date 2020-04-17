namespace SocketMrg {
    export class SocketManager {
        private static m_instance: SocketManager;

        public static getInstance() {
            if (SocketManager.m_instance == null) {
                SocketManager.m_instance = new SocketManager();
                SocketManager.m_instance.init();
            }
            return SocketManager.m_instance;
        }

        private _socketList: network.TcpSocket[];

        private _webSocket: WebSocket;

        public init() {
            this._pool = {};
            this._socketList = [];
        }

        private _pool: any;

        public pushSocket(soc: network.TcpSocket, key?: string) {
            this._socketList.push(soc);
            if (key) {
                this._pool[key] = soc;
            }
        }

        public popSocket(key: string) {
            if (this._pool[key]) {
                let index: number;
                for (let n = 0; n < this._socketList.length; n++) {
                    if (this._socketList[n] == this._pool[key]) {
                        index = n;
                        break;
                    }
                }
                this._socketList.splice(index, 1);
                this._pool[key] = null;
                utils.GameConst.colorConsole("清除Socket成功!");
            } else {
                utils.GameConst.colorConsole("未找到目标keySocket!");
            }
        }



        public closeAllSocket() {
            utils.GameConst.colorConsole("清除所有socket");
            this._socketList.forEach(item => {
                console.log(item);
                item.close();
            });
            this._socketList = [];
            for (let item in this._pool) {
                this._pool[item] = null;
            }
        }
    }
}