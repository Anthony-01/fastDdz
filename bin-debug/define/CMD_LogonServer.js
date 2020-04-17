var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 协议定义
 */
var df;
(function (df) {
    //////////////////////////////////////////////////////////////////////////////////
    df.MDM_MB_LOGON = 100; //广场登录
    df.SUB_MB_LOGON_ACCOUNTS_WEB = 10; //帐号登录
    df.SUB_MB_LOGON_OTHERPLATFORM_WEB = 11; //其他登录
    df.SUB_MB_LOGON_MINIPROGRAM_WEB = 12; //小程序登录
    df.SUB_MB_LOGON_SUCCESS = 100; //登录成功
    df.SUB_MB_LOGON_FAILURE = 101; //登录失败
    df.SUB_MB_LOGON_FINISH = 102; //登录完成
    df.SUB_MB_UPDATE_NOTIFY = 200; //升级提示
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //列表命令
    df.MDM_MB_SERVER_LIST = 101; //列表信息
    //获取命令
    df.SUB_MB_GET_LIST = 1; //获取列表
    df.SUB_MB_GET_SERVER = 2; //获取房间
    df.SUB_MB_GET_OPTION = 3; //获取配置
    df.SUB_MB_GET_OPTION_LUA = 4; //获取配置
    df.SUB_MB_GET_SERVER_AGENT = 5; //房间代理
    //列表信息
    df.SUB_MB_LIST_KIND = 100; //种类列表
    df.SUB_MB_LIST_SERVER = 101; //房间列表
    df.SUB_MB_LIST_MATCH = 102; //比赛列表
    df.SUB_MB_GAME_OPTION = 104; //游戏选项
    df.SUB_MB_CREATE_OPTION = 103; //开房选项
    df.SUB_MB_LIST_LOGON = 105; //登录列表
    df.SUB_MB_LIST_AGENT = 106; //代理列表
    df.SUB_MB_SERVER_AGENT = 107; //房间代理
    df.SUB_MB_LIST_ACCESS = 108; //网关服务
    df.SUB_MB_LIST_FINISH = 200; //列表完成
    df.SUB_MB_SERVER_FINISH = 201; //房间完成
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //微信小程序
    var CMiniProgramInfo = (function () {
        function CMiniProgramInfo() {
        }
        return CMiniProgramInfo;
    }());
    df.CMiniProgramInfo = CMiniProgramInfo;
    __reflect(CMiniProgramInfo.prototype, "df.CMiniProgramInfo");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //路由服务
    df.MDM_ARS_ROUTE_SERVICE = 3; //路由服务
    //请求命令
    df.SUB_AR_C_QUERY_SERVER = 100; //查询房间
    //应对命令
    df.SUB_AR_S_SERVER_INFO = 200; //房间信息
    //查询房间
    var CMD_AR_C_QueryServer = (function () {
        function CMD_AR_C_QueryServer() {
        }
        CMD_AR_C_QueryServer.prototype.onInit = function () {
            var buffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            buffer.Append_WORD(this.wKindID);
            buffer.Append_DWORD(this.dwUserID);
            return buffer;
        };
        return CMD_AR_C_QueryServer;
    }());
    df.CMD_AR_C_QueryServer = CMD_AR_C_QueryServer;
    __reflect(CMD_AR_C_QueryServer.prototype, "df.CMD_AR_C_QueryServer");
    ;
    //房间信息
    var CMD_AR_S_ServerInfo = (function () {
        function CMD_AR_S_ServerInfo() {
        }
        CMD_AR_S_ServerInfo.prototype.onRead = function (buffer) {
            this.wKindID = buffer.Pop_WORD();
            this.wServerID = buffer.Pop_WORD();
            this.szDescribeString = buffer.Pop_UTF16(buffer.getByteArray().bytesAvailable / 2);
        };
        return CMD_AR_S_ServerInfo;
    }());
    df.CMD_AR_S_ServerInfo = CMD_AR_S_ServerInfo;
    __reflect(CMD_AR_S_ServerInfo.prototype, "df.CMD_AR_S_ServerInfo");
    ;
    //////////////////////////////////////////////////////////////////////////////////
    //帐号登录
    var CMD_MB_LogonAccounts_WEB = (function () {
        function CMD_MB_LogonAccounts_WEB() {
        }
        CMD_MB_LogonAccounts_WEB.prototype.onInit = function () {
            var buffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            buffer.Append_WORD(this.wModuleID);
            buffer.Append_WORD(this.wMarketID);
            buffer.Append_Byte(this.cbDeviceType);
            buffer.Append_DWORD(this.dwAppVersion);
            buffer.Append_DWORD(this.dwPlazaVersion);
            buffer.Append_DWORD(this.dwStationID);
            buffer.Append_DWORD(this.dwMappedNum);
            buffer.Append_UTF16(this.szPassword, df.LEN_PASSWORD);
            buffer.Append_UTF16(this.szAccounts, df.LEN_ACCOUNTS);
            buffer.Append_WORD(this.wRequestMask);
            // buffer.Append_DWORD(this.dwClientIP);
            buffer.Append_UTF16(this.szMachineID, df.LEN_MACHINE_SERIAL);
            buffer.Append_UTF16(this.szMobilePhone, df.LEN_MOBILE_PHONE);
            return buffer;
        };
        return CMD_MB_LogonAccounts_WEB;
    }());
    df.CMD_MB_LogonAccounts_WEB = CMD_MB_LogonAccounts_WEB;
    __reflect(CMD_MB_LogonAccounts_WEB.prototype, "df.CMD_MB_LogonAccounts_WEB");
    ;
    /**
     * 账号注册
     */
    var CMD_MB_RegisterAccounts_WEB = (function () {
        function CMD_MB_RegisterAccounts_WEB() {
        }
        CMD_MB_RegisterAccounts_WEB.prototype.onInit = function () {
            var buffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            buffer.Append_WORD(this.wModuleID);
            buffer.Append_WORD(this.wMarketID);
            buffer.Append_Byte(this.cbDeviceType);
            buffer.Append_DWORD(this.dwAppVersion);
            buffer.Append_DWORD(this.dwPlazaVersion);
            buffer.Append_DWORD(this.dwStationID);
            buffer.Append_UTF16(this.szLogonPass, df.LEN_PASSWORD);
            buffer.Append_WORD(this.wFaceID);
            buffer.Append_Byte(this.cbGender);
            buffer.Append_UTF16(this.szAccounts, df.LEN_ACCOUNTS);
            buffer.Append_UTF16(this.szNickName, df.LEN_ACCOUNTS);
            buffer.Append_WORD(this.wRequestMask);
            // buffer.Append_DWORD(this.dwClientIP);
            buffer.Append_UTF16(this.szMachineID, df.LEN_MACHINE_SERIAL);
            buffer.Append_UTF16(this.szMobilePhone, df.LEN_MOBILE_PHONE);
            return buffer;
        };
        return CMD_MB_RegisterAccounts_WEB;
    }());
    df.CMD_MB_RegisterAccounts_WEB = CMD_MB_RegisterAccounts_WEB;
    __reflect(CMD_MB_RegisterAccounts_WEB.prototype, "df.CMD_MB_RegisterAccounts_WEB");
    ;
    //小程序登录
    var CMD_MB_LogonMiniProgram = (function () {
        function CMD_MB_LogonMiniProgram() {
        }
        CMD_MB_LogonMiniProgram.prototype.onInit = function () {
            var buffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            buffer.Append_WORD(this.wModuleID);
            buffer.Append_WORD(this.wMarketID);
            buffer.Append_Byte(this.cbDeviceType);
            buffer.Append_DWORD(this.dwStationID);
            buffer.Append_DWORD(this.dwAppVersion);
            buffer.Append_DWORD(this.dwPlazaVersion);
            buffer.Append_WORD(this.wRequestMask);
            // buffer.Append_DWORD(this.dwClientIP);
            buffer.Append_UTF16(this.szMachineID, df.LEN_MACHINE_SERIAL);
            buffer.Append_UTF16(this.szWXCode, df.LEN_WXCODE);
            buffer.Append_UTF16(this.szSignature, df.LEN_SIGNATURE);
            buffer.Append_UTF16(this.szInitVector, df.LEN_INITVECTOR);
            return buffer;
        };
        return CMD_MB_LogonMiniProgram;
    }());
    df.CMD_MB_LogonMiniProgram = CMD_MB_LogonMiniProgram;
    __reflect(CMD_MB_LogonMiniProgram.prototype, "df.CMD_MB_LogonMiniProgram");
    ;
    //叠加标识
    df.DTP_GP_RAWDATA = 1; //用户数据
    df.DTP_GP_ENCRYPTDATA = 2; //加密数据
    /***
     * 登录成功
     */
    var CMD_MB_LogonSuccess = (function () {
        function CMD_MB_LogonSuccess() {
        }
        CMD_MB_LogonSuccess.prototype.onRead = function (cbBuffer) {
            this.wFaceID = cbBuffer.Pop_WORD();
            this.cbGender = cbBuffer.Pop_Byte();
            this.dwCustomID = cbBuffer.Pop_DWORD();
            this.dwUserID = cbBuffer.Pop_DWORD();
            this.dwGameID = cbBuffer.Pop_DWORD();
            this.dwStationID = cbBuffer.Pop_DWORD();
            this.dwExperience = cbBuffer.Pop_DWORD();
            this.dwLoveLiness = cbBuffer.Pop_DWORD();
            this.szNickName = cbBuffer.Pop_UTF16(df.LEN_ACCOUNTS);
            this.szAccounts = cbBuffer.Pop_UTF16(df.LEN_ACCOUNTS);
            this.szExternUID = cbBuffer.Pop_UTF16(df.LEN_EXTERNUID);
            this.szLogonPass = cbBuffer.Pop_UTF16(df.LEN_PASSWORD);
            this.szInsurePass = cbBuffer.Pop_UTF16(df.LEN_PASSWORD);
            this.szDynamicPass = cbBuffer.Pop_UTF16(df.LEN_PASSWORD);
            this.dUserIngot = cbBuffer.Pop_DOUBLE();
            this.lUserMedal = cbBuffer.Pop_SCORE();
            this.lUserScore = cbBuffer.Pop_SCORE();
            this.lUserInsure = cbBuffer.Pop_SCORE();
            this.cbMemberOrder = cbBuffer.Pop_Byte();
            this.MemberOverDate = df.SYSTEMTIME(cbBuffer);
            this.wLockServerID = cbBuffer.Pop_WORD();
        };
        return CMD_MB_LogonSuccess;
    }());
    df.CMD_MB_LogonSuccess = CMD_MB_LogonSuccess;
    __reflect(CMD_MB_LogonSuccess.prototype, "df.CMD_MB_LogonSuccess");
    ;
    /**
     * 登录失败
     */
    function CMD_MB_LogonFailure() {
        var struct = {
            lResultCode: 0,
            szDescribeString: "" //描述消息
        };
        return struct;
    }
    df.CMD_MB_LogonFailure = CMD_MB_LogonFailure;
    ;
    ///////////////////////////////////////////////////////////////////////////////////////////
    //服务命令
    df.MDM_GP_USER_SERVICE = 3; //用户服务
    ////////////////////////////////////////////////////////////////////////////////////////////
    //账号服务
    df.SUB_GP_MODIFY_ACCOUNTS = 1; //修改帐号
    df.SUB_GP_MODIFY_LOGON_PASS = 2; //修改密码
    df.SUB_GP_MODIFY_INSURE_PASS = 3; //修改密码
    df.SUB_GP_MODIFY_INDIVIDUAL = 4; //修改资料
    df.SUB_MB_MODIFY_INDIVIDUAL = 5; //修改资料
    df.SUB_GP_BIND_MACHINE = 6; //锁定机器
    df.SUB_GP_UN_BIND_MACHINE = 7; //解锁机器
    df.SUB_GP_ACCOUNT_SECURITY = 8; //密保申请
    df.SUB_GP_MODIFY_NICKNAME = 9; //修改昵称
    //查询命令
    df.SUB_GP_QUERY_INDIVIDUAL = 10; //查询信息
    df.SUB_GP_TEST_ACCOUNTS = 11; //检查占用
    df.SUB_GP_TEST_NICKNAME = 12; //检测占用
    df.SUB_GP_QUERY_WEALTH = 13; //查询财富
    df.SUB_GP_QUERY_WEALTH_WEB = 14; //查询财富
    //低保命令
    df.SUB_GP_BASEENSURE_QUERY = 20; //查询低保
    df.SUB_GP_BASEENSURE_TAKE = 21; //领取低保	
    df.SUB_GP_GET_VALIDATECDOE = 22; //获取验证码
    var CMD_GP_QueryBaseEnsure = (function () {
        function CMD_GP_QueryBaseEnsure() {
            //连接信息WCHAR
            this.szMachine = utils.allocArray(df.LEN_MACHINE_SERIAL, Number);
            //[LEN_MACHINE_SERIAL];		//机器序列
        }
        return CMD_GP_QueryBaseEnsure;
    }());
    df.CMD_GP_QueryBaseEnsure = CMD_GP_QueryBaseEnsure;
    __reflect(CMD_GP_QueryBaseEnsure.prototype, "df.CMD_GP_QueryBaseEnsure");
    var CMD_GP_UserWealth = (function () {
        function CMD_GP_UserWealth() {
        }
        CMD_GP_UserWealth.prototype.init = function (buffer) {
            this.cbMask = buffer.Pop_Byte();
            this.lUserIngot = buffer.Pop_LONGLONG();
            this.lUserMedal = buffer.Pop_LONGLONG();
            this.lUserScore = buffer.Pop_LONGLONG();
            this.lUserRoomCard = buffer.Pop_LONGLONG();
        };
        return CMD_GP_UserWealth;
    }());
    df.CMD_GP_UserWealth = CMD_GP_UserWealth;
    __reflect(CMD_GP_UserWealth.prototype, "df.CMD_GP_UserWealth");
    //////////////////////////////////////////////////////////////////////////
    //操作结果
    df.SUB_GP_OPERATE_SUCCESS = 100; //操作成功
    df.SUB_GP_OPERATE_FAILURE = 101; //操作失败
    //查询结果
    df.SUB_GP_USER_INDIVIDUAL = 200; //个人资料
    df.SUB_GP_USER_WEALTH = 201; //用户财富
    //修改头像
    df.SUB_GP_USER_FACE_INFO = 210; //头像信息
    df.SUB_GP_SYSTEM_FACE_INFO = 211; //系统头像
    df.SUB_GP_CUSTOM_FACE_INFO = 212; //自定头像
    //低保命令
    df.SUB_GP_BASEENSURE_INFO = 300; //低保信息
    df.SUB_GP_BASEENSURE_RESULT = 301; //领取结果
    df.SUB_GP_BASEENSURE_FAILED = 302; //操作失败	
    df.SUB_GP_VALIDATECDOE_INFO = 303; //验证码信息
    //////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////
    //银行
    df.MDM_GP_BANK_OPERATE = 4; //银行操作
    //////////////////////////////////////////////////////////////////////////
    df.SUB_GP_STORAGE = 1; //银行存储
    df.SUB_GP_DRAWOUT = 2; //银行取出
    df.SUB_GP_TRANSFER = 3; //银行转帐
    df.SUB_GP_QUERY = 4; //查询用户
    df.SUB_GP_UPDATE = 5; //更新金币
    function CMD_GP_BANKOPERATE() {
        var struct = {
            dwUserID: 0,
            lOperateScore: 0,
            cbOperateCode: 0,
            dwStationID: 0,
            szInsurePass: ""
        };
        return;
    }
    df.CMD_GP_BANKOPERATE = CMD_GP_BANKOPERATE;
    ///////////////////////////////////////////////////////////////////////////////////////////
    df.DTP_GP_UI_NICKNAME = 8; //用户昵称
})(df || (df = {}));
