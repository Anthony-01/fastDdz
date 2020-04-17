namespace models {
    export class ErrorReporter {
        private wMainCmd = 0;
        private wSubCmd = 0;
        private pBuffer: any;

        public set MainCmd(cmd) {
            this.wMainCmd = cmd;
        }

        public get MainCmd() {
            return this.wMainCmd;
        }

        public set SubCmd(cmd) {
            this.wSubCmd = cmd;
        }

        public get SubCmd() {
            return this.wSubCmd;
        }

        public set Buffer(buffer) {
            this.pBuffer = buffer;
        }

        public get Buffer() {
            return this.pBuffer;
        }

        public Report() {
            let str = "" + this.MainCmd + "" + this.SubCmd;

            managers.FrameManager.getInstance().showDailog(df.eDialogMode.OK_CANCELL,str,()=> {
                GameEngine.getInstance().startGameHandler();
                console.log("日志追踪" + str);
            });
        }
    }
}