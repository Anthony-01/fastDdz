/**低保领取 */
namespace frame {
    export class BaseEnsureFrame extends BaseFrame {
        //领取信息
        public _cbTakedTimes= 0;
        //低保配置
        public _lTakeGold = 0;
        public _lTakeCondition = 0;
        public _cbTakeTimesPerAccounts = 0;
        public _operateCode = 0;
        private _szValidateCode = "";
        constructor(delegate?: any) {
            super(delegate);
        }

        public onFlushBaseEnsure() {
            this._operateCode = 0;
            // managers.ServiceCtrl.getInstance().onConnectPlaza();
            managers.ServiceCtrl.getInstance().setDelegate(this);

            // managers.FrameManager.getInstance().showPopWait();
        }

        public onGetBaseEnsure() {
            this._operateCode = 1;
            // managers.ServiceCtrl.getInstance().onConnectPlaza();
            managers.ServiceCtrl.getInstance().setDelegate(this);
            // managers.FrameManager.getInstance().showPopWait();
        }

        public connectComplete() {
            if (this._operateCode == 0) {
                this.sendFlushBaseEnsure(); //刷新
            } else if (this._operateCode == 1) {
                this.sendFlushValidateCode();//领取
            } else {
                this.sendGetBaseEnsure();
            }
        }

        //刷新低保
        public sendFlushBaseEnsure() {
            managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = df.eServerModule.SERVICE_MODULE_LOGON; //切换成低保服务模块
            let flush = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            flush.Append_DWORD(managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID);
            flush.Append_DWORD(managers.FrameManager.getInstance().m_GlobalUserItem.dwStationID);
            flush.Append_DWORD(df.STATION_ID);
            flush.Append_UTF16(managers.FrameManager.getInstance().m_GlobalUserItem.szMachine,df.LEN_MACHINE_SERIAL);
            managers.ServiceCtrl.getInstance().getTcpService().SendSocketData(5,df.SUB_GP_BASEENSURE_QUERY,flush,flush.getLength());
            managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = df.eServerModule.SERVICE_MODULE_SERVER;
        }



        //验证码
        private sendFlushValidateCode() {
            let ValidateCode = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            ValidateCode.Append_DWORD(managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID);
            managers.ServiceCtrl.getInstance().getTcpService().SendSocketData(df.MDM_GP_USER_SERVICE,df.SUB_GP_GET_VALIDATECDOE,ValidateCode,ValidateCode.getLength());
        }

        //领取低保
        private sendGetBaseEnsure() {
            let takeEnsure = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            takeEnsure.Append_DWORD(managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID);
            takeEnsure.Append_DWORD(df.STATION_ID);
            takeEnsure.Append_UTF16(managers.FrameManager.getInstance().m_GlobalUserItem.szLogonPass,df.LEN_PASSWORD);
            takeEnsure.Append_UTF16(this._szValidateCode,df.LEN_MACHINE_SERIAL);
            takeEnsure.Append_UTF16(managers.FrameManager.getInstance().m_GlobalUserItem.szMachine,df.LEN_MACHINE_SERIAL);
            managers.ServiceCtrl.getInstance().getTcpService().SendSocketData(df.MDM_GP_USER_SERVICE,df.SUB_GP_BASEENSURE_TAKE,takeEnsure,takeEnsure.getLength());
        }

        //领取失败
        private onSubBaseEnsureFailure(buffer: utils.ByteArray) {
            let msg = buffer.Pop_UTF16(buffer.getByteArray().bytesAvailable/2);
            managers.FrameManager.getInstance().showToast(msg);

            if (this._delegate && this._delegate.onTakeBaseEnsureFailure) {
                this._delegate.onTakeBaseEnsureFailure();
            }
        }

        //领取结果
        private onSubBaseEnsureResult(buffer: utils.ByteArray) {
            this._cbTakedTimes = buffer.Pop_Byte();						                                        //领取次数
            managers.FrameManager.getInstance().m_GlobalUserItem.lUserScore = buffer.Pop_SCORE();				//当前金币

            let msg = buffer.Pop_UTF16(buffer.getByteArray().bytesAvailable/2);
            managers.FrameManager.getInstance().showToast(msg);

            //刷新界面
            if (this._delegate && this._delegate.onBaseEnsureResult) {
                this._delegate.onBaseEnsureResult(this._cbTakedTimes);
            }
        }

        //低保配置
        private onSubBaseEnsureInfo(buffer: utils.ByteArray) {
            //领取信息
            this._cbTakedTimes = buffer.Pop_Byte();
            //低保配置
            this._lTakeGold = buffer.Pop_SCORE();
            this._lTakeCondition = buffer.Pop_SCORE();
            this._cbTakeTimesPerAccounts = buffer.Pop_Byte();

            //财富信息
            managers.FrameManager.getInstance().m_GlobalUserItem.lUserScore = buffer.Pop_SCORE();
            managers.FrameManager.getInstance().m_GlobalUserItem.lUserInsure = buffer.Pop_SCORE();

            if (this._delegate && this._delegate.onRefreshBaseEnsureInfo) {
                this._delegate.onRefreshBaseEnsureInfo(this._cbTakedTimes,this._lTakeGold,this._lTakeCondition,this._cbTakeTimesPerAccounts);
            }
        }

        private onValidateCodeEvent(buffer: utils.ByteArray) {
            let dwValidateCode = buffer.Pop_DWORD();
            const a = (dwValidateCode&0xff000000)>>24;
            const b = (dwValidateCode&0x00ff0000)>>16;
            const c = (dwValidateCode&0x0000ff00)>>8;
            const d = dwValidateCode&0x000000ff;

            let result: string = String.fromCharCode(d) + "-" + String.fromCharCode(c) + "-" + String.fromCharCode(b) + "-" + String.fromCharCode(a);
            result = result.toUpperCase();
            this._szValidateCode = utils.MD5.MD5_HEX("Validate:"+result).toUpperCase();
            this.sendGetBaseEnsure();
        }

        /**
         * 网络消息
         */
        public onMessage(e: egret.Event): void {
            managers.FrameManager.getInstance().dismissPopWait();

            let msg = e.data as network.Message;
            const wMainCmd = msg.wMainCmd;
            const wSubCmd = msg.wSubCmd;
            switch (wMainCmd) {
                case df.MDM_GP_USER_SERVICE:
                {
                    if (wSubCmd == df.SUB_GP_BASEENSURE_INFO) {
                        this.onSubBaseEnsureInfo(msg.cbBuffer);
                        managers.ServiceCtrl.getInstance().closeService();
                    } else if (wSubCmd == df.SUB_GP_BASEENSURE_RESULT) {
                        this.onSubBaseEnsureResult(msg.cbBuffer);
                        managers.ServiceCtrl.getInstance().closeService();
                    } else if (wSubCmd == df.SUB_GP_BASEENSURE_FAILED) {
                        this.onSubBaseEnsureFailure(msg.cbBuffer);
                        managers.ServiceCtrl.getInstance().closeService();
                    } else if (wSubCmd == df.SUB_GP_VALIDATECDOE_INFO) {
                        this.onValidateCodeEvent(msg.cbBuffer)
                    }
                }
                    break;
                default:
                {
                    egret.assert(false);
                    console.log("未知命令码");

                }
            }
        }
    }
}