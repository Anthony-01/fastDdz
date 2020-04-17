var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**低保领取 */
var frame;
(function (frame) {
    var BaseEnsureFrame = (function (_super) {
        __extends(BaseEnsureFrame, _super);
        function BaseEnsureFrame(delegate) {
            var _this = _super.call(this, delegate) || this;
            //领取信息
            _this._cbTakedTimes = 0;
            //低保配置
            _this._lTakeGold = 0;
            _this._lTakeCondition = 0;
            _this._cbTakeTimesPerAccounts = 0;
            _this._operateCode = 0;
            _this._szValidateCode = "";
            return _this;
        }
        BaseEnsureFrame.prototype.onFlushBaseEnsure = function () {
            this._operateCode = 0;
            // managers.ServiceCtrl.getInstance().onConnectPlaza();
            managers.ServiceCtrl.getInstance().setDelegate(this);
            // managers.FrameManager.getInstance().showPopWait();
        };
        BaseEnsureFrame.prototype.onGetBaseEnsure = function () {
            this._operateCode = 1;
            // managers.ServiceCtrl.getInstance().onConnectPlaza();
            managers.ServiceCtrl.getInstance().setDelegate(this);
            // managers.FrameManager.getInstance().showPopWait();
        };
        BaseEnsureFrame.prototype.connectComplete = function () {
            if (this._operateCode == 0) {
                this.sendFlushBaseEnsure(); //刷新
            }
            else if (this._operateCode == 1) {
                this.sendFlushValidateCode(); //领取
            }
            else {
                this.sendGetBaseEnsure();
            }
        };
        //刷新低保
        BaseEnsureFrame.prototype.sendFlushBaseEnsure = function () {
            managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = 4 /* SERVICE_MODULE_LOGON */; //切换成低保服务模块
            var flush = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            flush.Append_DWORD(managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID);
            flush.Append_DWORD(managers.FrameManager.getInstance().m_GlobalUserItem.dwStationID);
            flush.Append_DWORD(df.STATION_ID);
            flush.Append_UTF16(managers.FrameManager.getInstance().m_GlobalUserItem.szMachine, df.LEN_MACHINE_SERIAL);
            managers.ServiceCtrl.getInstance().getTcpService().SendSocketData(5, df.SUB_GP_BASEENSURE_QUERY, flush, flush.getLength());
            managers.ServiceCtrl.getInstance().getTcpService().ServiceModule = 6 /* SERVICE_MODULE_SERVER */;
        };
        //验证码
        BaseEnsureFrame.prototype.sendFlushValidateCode = function () {
            var ValidateCode = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            ValidateCode.Append_DWORD(managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID);
            managers.ServiceCtrl.getInstance().getTcpService().SendSocketData(df.MDM_GP_USER_SERVICE, df.SUB_GP_GET_VALIDATECDOE, ValidateCode, ValidateCode.getLength());
        };
        //领取低保
        BaseEnsureFrame.prototype.sendGetBaseEnsure = function () {
            var takeEnsure = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            takeEnsure.Append_DWORD(managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID);
            takeEnsure.Append_DWORD(df.STATION_ID);
            takeEnsure.Append_UTF16(managers.FrameManager.getInstance().m_GlobalUserItem.szLogonPass, df.LEN_PASSWORD);
            takeEnsure.Append_UTF16(this._szValidateCode, df.LEN_MACHINE_SERIAL);
            takeEnsure.Append_UTF16(managers.FrameManager.getInstance().m_GlobalUserItem.szMachine, df.LEN_MACHINE_SERIAL);
            managers.ServiceCtrl.getInstance().getTcpService().SendSocketData(df.MDM_GP_USER_SERVICE, df.SUB_GP_BASEENSURE_TAKE, takeEnsure, takeEnsure.getLength());
        };
        //领取失败
        BaseEnsureFrame.prototype.onSubBaseEnsureFailure = function (buffer) {
            var msg = buffer.Pop_UTF16(buffer.getByteArray().bytesAvailable / 2);
            managers.FrameManager.getInstance().showToast(msg);
            if (this._delegate && this._delegate.onTakeBaseEnsureFailure) {
                this._delegate.onTakeBaseEnsureFailure();
            }
        };
        //领取结果
        BaseEnsureFrame.prototype.onSubBaseEnsureResult = function (buffer) {
            this._cbTakedTimes = buffer.Pop_Byte(); //领取次数
            managers.FrameManager.getInstance().m_GlobalUserItem.lUserScore = buffer.Pop_SCORE(); //当前金币
            var msg = buffer.Pop_UTF16(buffer.getByteArray().bytesAvailable / 2);
            managers.FrameManager.getInstance().showToast(msg);
            //刷新界面
            if (this._delegate && this._delegate.onBaseEnsureResult) {
                this._delegate.onBaseEnsureResult(this._cbTakedTimes);
            }
        };
        //低保配置
        BaseEnsureFrame.prototype.onSubBaseEnsureInfo = function (buffer) {
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
                this._delegate.onRefreshBaseEnsureInfo(this._cbTakedTimes, this._lTakeGold, this._lTakeCondition, this._cbTakeTimesPerAccounts);
            }
        };
        BaseEnsureFrame.prototype.onValidateCodeEvent = function (buffer) {
            var dwValidateCode = buffer.Pop_DWORD();
            var a = (dwValidateCode & 0xff000000) >> 24;
            var b = (dwValidateCode & 0x00ff0000) >> 16;
            var c = (dwValidateCode & 0x0000ff00) >> 8;
            var d = dwValidateCode & 0x000000ff;
            var result = String.fromCharCode(d) + "-" + String.fromCharCode(c) + "-" + String.fromCharCode(b) + "-" + String.fromCharCode(a);
            result = result.toUpperCase();
            this._szValidateCode = utils.MD5.MD5_HEX("Validate:" + result).toUpperCase();
            this.sendGetBaseEnsure();
        };
        /**
         * 网络消息
         */
        BaseEnsureFrame.prototype.onMessage = function (e) {
            managers.FrameManager.getInstance().dismissPopWait();
            var msg = e.data;
            var wMainCmd = msg.wMainCmd;
            var wSubCmd = msg.wSubCmd;
            switch (wMainCmd) {
                case df.MDM_GP_USER_SERVICE:
                    {
                        if (wSubCmd == df.SUB_GP_BASEENSURE_INFO) {
                            this.onSubBaseEnsureInfo(msg.cbBuffer);
                            managers.ServiceCtrl.getInstance().closeService();
                        }
                        else if (wSubCmd == df.SUB_GP_BASEENSURE_RESULT) {
                            this.onSubBaseEnsureResult(msg.cbBuffer);
                            managers.ServiceCtrl.getInstance().closeService();
                        }
                        else if (wSubCmd == df.SUB_GP_BASEENSURE_FAILED) {
                            this.onSubBaseEnsureFailure(msg.cbBuffer);
                            managers.ServiceCtrl.getInstance().closeService();
                        }
                        else if (wSubCmd == df.SUB_GP_VALIDATECDOE_INFO) {
                            this.onValidateCodeEvent(msg.cbBuffer);
                        }
                    }
                    break;
                default:
                    {
                        egret.assert(false);
                        console.log("未知命令码");
                    }
            }
        };
        return BaseEnsureFrame;
    }(frame.BaseFrame));
    frame.BaseEnsureFrame = BaseEnsureFrame;
    __reflect(BaseEnsureFrame.prototype, "frame.BaseEnsureFrame");
})(frame || (frame = {}));
