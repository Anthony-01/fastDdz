var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 游戏协议
 */
var df;
(function (df) {
    //////////////////////////////////////////////////////////////////////////
    //登录命令
    df.MDM_GR_LOGON = 3; //登录信息
    //登录模式
    df.SUB_GR_LOGON_MOBILE = 1; //手机登录
    //登出
    df.SUB_GR_LOGON_LOGOUT = 10;
    //登录结果
    df.SUB_GR_LOGON_SUCCESS = 100; //登录成功
    df.SUB_GR_LOGON_FAILURE = 101; //登录失败
    df.SUB_GR_LOGON_FINISH = 102; //登录完成
    //升级提示
    df.SUB_GR_UPDATE_NOTIFY = 200; //升级提示
    //////////////////////////////////////////////////////////////////////////
    //I D 登录
    var CMD_GR_LogonByUserID = (function () {
        function CMD_GR_LogonByUserID() {
            //版本信息
            this.dwPlazaVersion = 0; //广场版本
            this.dwFrameVersion = 0; //框架版本
            this.dwProcessVersion = 0; //进程版本
            this.dwUserStationID = 0; //玩家站点
            this.dwPlazaStationID = 0; //站点标识
            //登录信息
            this.dwUserID = 0; //用户 I D
            this.szPasspublic = ""; //登录密码    
        }
        return CMD_GR_LogonByUserID;
    }());
    df.CMD_GR_LogonByUserID = CMD_GR_LogonByUserID;
    __reflect(CMD_GR_LogonByUserID.prototype, "df.CMD_GR_LogonByUserID");
    //帐号登录
    var CMD_GR_LogonByAccounts = (function () {
        function CMD_GR_LogonByAccounts() {
            //版本信息
            this.dwPlazaVersion = 0; //广场版本
            this.dwFrameVersion = 0; //框架版本
            this.dwProcessVersion = 0; //进程版本
            this.dwUserStationID = 0; //玩家站点
            this.dwPlazaStationID = 0; //站点标识
            //登录信息
            this.szPasspublic = 0; //登录密码
            this.szAccounts = ""; //登录帐号
        }
        return CMD_GR_LogonByAccounts;
    }());
    df.CMD_GR_LogonByAccounts = CMD_GR_LogonByAccounts;
    __reflect(CMD_GR_LogonByAccounts.prototype, "df.CMD_GR_LogonByAccounts");
    //手机登录
    var CMD_GR_LogonByMobile = (function () {
        function CMD_GR_LogonByMobile() {
            this.wServerID = 0;
            //版本信息
            this.wGameID = 0; //游戏标识
            this.dwPlazaVersion = 0; //大厅版本
            this.dwProcessVersion = 0; //进程版本
            //桌子区域
            this.cbDeviceType = 0; //设备类型
            this.wBehaviorFlags = 0; //行为标识
            this.wPageTableCount = 0; //分页桌数
            //站点信息
            this.dwUserStationID = 0; //玩家站点
            this.dwPlazaStationID = 0; //站点标识
            //登录信息
            this.dwUserID = 0; //用户 I D
            this.szAccounts = ""; //用户账号
            this.szPasspublic = ""; //登录密码
            this.szDynamicPass = ""; //动态密码
            this.szMachineID = ""; //机器标识
            //房间信息
            this.szServerpasswd = "";
            //位置信息
            this.dGlobalPosLng = 0.0; //定位经度
            this.dGlobalPosLat = 0.0; //定位纬度
            //比赛信息
            this.dwMatchID = 0; //比赛标识
            this.lMatchNo = 0; //比赛场次
            // public dwClientIP: number = 0;
        }
        return CMD_GR_LogonByMobile;
    }());
    df.CMD_GR_LogonByMobile = CMD_GR_LogonByMobile;
    __reflect(CMD_GR_LogonByMobile.prototype, "df.CMD_GR_LogonByMobile");
    //登录成功
    var CMD_GR_LogonSuccess = (function () {
        function CMD_GR_LogonSuccess(buffer) {
            this.dwUserID = 0; //登陆成功
            this.dwUserRight = 0; //用户权限
            this.dwMasterRight = 0; //管理权限
            //系统参数
            this.cbMemberOrderUseTrumpet = 0; //会员等级
            this.dwUserID = buffer.cbBuffer.Pop_DWORD();
            this.dwUserRight = buffer.cbBuffer.Pop_DWORD();
            this.dwMasterRight = buffer.cbBuffer.Pop_DWORD();
            this.cbMemberOrderUseTrumpet = buffer.cbBuffer.Pop_Byte();
        }
        return CMD_GR_LogonSuccess;
    }());
    df.CMD_GR_LogonSuccess = CMD_GR_LogonSuccess;
    __reflect(CMD_GR_LogonSuccess.prototype, "df.CMD_GR_LogonSuccess");
    //登录失败
    var CMD_GR_LogonFailure = (function () {
        function CMD_GR_LogonFailure(buffer) {
            this.lErrorCode = 0; //错误代码
            this.wLockServerID = 0; //锁定房间
            this.szDescribeString = ""; //错误消息
            this.lErrorCode = buffer.cbBuffer.Pop_INT();
            this.wLockServerID = buffer.cbBuffer.Pop_WORD();
            this.szDescribeString = buffer.cbBuffer.Pop_UTF16(buffer.cbBuffer.getByteArray().bytesAvailable / 2);
        }
        return CMD_GR_LogonFailure;
    }());
    df.CMD_GR_LogonFailure = CMD_GR_LogonFailure;
    __reflect(CMD_GR_LogonFailure.prototype, "df.CMD_GR_LogonFailure");
    //升级提示
    var CMD_GR_UpdateNotify = (function () {
        function CMD_GR_UpdateNotify(buffer) {
            //升级标志
            this.cbMustUpdatePlaza = 0; //强行升级
            this.cbMustUpdateClient = 0; //强行升级
            this.cbAdviceUpdateClient = 0; //建议升级
            //当前版本
            this.dwCurrentPlazaVersion = 0; //当前版本
            this.dwCurrentFrameVersion = 0; //当前版本
            this.dwCurrentClientVersion = 0; //当前版本
            this.cbMustUpdatePlaza = buffer.cbBuffer.Pop_Byte();
            this.cbMustUpdateClient = buffer.cbBuffer.Pop_Byte();
            this.cbAdviceUpdateClient = buffer.cbBuffer.Pop_Byte();
            this.dwCurrentPlazaVersion = buffer.cbBuffer.Pop_DWORD();
            this.dwCurrentFrameVersion = buffer.cbBuffer.Pop_DWORD();
            this.dwCurrentClientVersion = buffer.cbBuffer.Pop_DWORD();
        }
        return CMD_GR_UpdateNotify;
    }());
    df.CMD_GR_UpdateNotify = CMD_GR_UpdateNotify;
    __reflect(CMD_GR_UpdateNotify.prototype, "df.CMD_GR_UpdateNotify");
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //配置命令
    df.MDM_GR_CONFIG = 4; //配置信息
    df.SUB_GR_CONFIG_COLUMN = 100; //列表配置
    df.SUB_GR_CONFIG_SERVER = 101; //房间配置
    df.SUB_GR_CONFIG_FINISH = 102; //配置完成
    df.SUB_GR_CONFIG_RULE = 103; //房间规则
    df.SUB_GR_CONFIG_USER_RIGHT = 104; //玩家权限
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //列表配置
    var CMD_GR_ConfigColumn = (function () {
        function CMD_GR_ConfigColumn() {
            this.cbColumnCount = 0; //列表数目
        }
        return CMD_GR_ConfigColumn;
    }());
    df.CMD_GR_ConfigColumn = CMD_GR_ConfigColumn;
    __reflect(CMD_GR_ConfigColumn.prototype, "df.CMD_GR_ConfigColumn");
    //房间配置
    var CMD_GR_ConfigServer = (function () {
        function CMD_GR_ConfigServer(buffer) {
            this.wKindID = 0; //类型索引
            this.wTableCount = 0; //桌子数目
            this.wChairCount = 0; //椅子数目
            this.wServerType = 0; //房间类型
            this.cbSegmentGame = 0; //段位游戏
            this.dwServerRule = 0; //房间规则
            this.dwGameBuglePrice = 0; //喇叭价格
            this.dwRoomBuglePrice = 0; //喇叭价格
            this.wKindID = buffer.cbBuffer.Pop_WORD();
            this.wTableCount = buffer.cbBuffer.Pop_WORD();
            this.wChairCount = buffer.cbBuffer.Pop_WORD();
            this.wServerType = buffer.cbBuffer.Pop_WORD();
            this.cbSegmentGame = buffer.cbBuffer.Pop_Byte();
            this.dwServerRule = buffer.cbBuffer.Pop_DWORD();
            this.dwGameBuglePrice = buffer.cbBuffer.Pop_DWORD();
            this.dwRoomBuglePrice = buffer.cbBuffer.Pop_DWORD();
        }
        return CMD_GR_ConfigServer;
    }());
    df.CMD_GR_ConfigServer = CMD_GR_ConfigServer;
    __reflect(CMD_GR_ConfigServer.prototype, "df.CMD_GR_ConfigServer");
    ;
    //房间规则
    var CMD_GR_ConfigRule = (function () {
        function CMD_GR_ConfigRule() {
            this.dwServerRule = 0; //房间规则
        }
        return CMD_GR_ConfigRule;
    }());
    df.CMD_GR_ConfigRule = CMD_GR_ConfigRule;
    __reflect(CMD_GR_ConfigRule.prototype, "df.CMD_GR_ConfigRule");
    ;
    //玩家权限
    var CMD_GR_ConfigUserRight = (function () {
        function CMD_GR_ConfigUserRight() {
            this.dwUserRight = 0; //玩家权限
        }
        return CMD_GR_ConfigUserRight;
    }());
    df.CMD_GR_ConfigUserRight = CMD_GR_ConfigUserRight;
    __reflect(CMD_GR_ConfigUserRight.prototype, "df.CMD_GR_ConfigUserRight");
    ;
    ////////////////////////////////////////////////////////////////////////////////////////////////
    //携带信息
    df.DTP_GR_SERVER_TITLE = 1; //房间标题
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //用户命令
    df.MDM_GR_USER = 5; //用户信息
    df.SUB_GR_USER_RULE = 1; //用户规则
    df.SUB_GR_USER_LOOKON = 2; //旁观请求
    df.SUB_GR_USER_SITDOWN = 3; //坐下请求
    df.SUB_GR_USER_STANDUP = 4; //起立请求
    df.SUB_GR_USER_APPLY = 5; //报名请求
    df.SUB_GR_USER_FEE_QUERY = 6; //费用查询
    df.SUB_GR_USER_REPULSE_SIT = 7; //拒绝玩家
    df.SUB_GR_USER_INFO_REQ = 8; //请求用户信息
    df.SUB_GR_USER_CHAIR_REQ = 9; //请求更换位置
    df.SUB_GR_USER_CHAIR_INFO_REQ = 10; //请求椅子用户信息
    df.SUB_GR_USER_DISMISS_TABLE = 11; //解散桌子
    df.SUB_GR_USER_ENTER = 100; //用户进入
    df.SUB_GR_USER_SCORE = 101; //用户分数
    df.SUB_GR_USER_STATUS = 102; //用户状态
    df.SUB_GR_USER_SEGMENT = 103; //用户段位
    df.SUB_GR_REQUEST_FAILURE = 104; //请求失败
    df.SUB_GR_USER_WEALTH = 105; //用户财富
    df.SUB_GR_USER_WAIT_DISTRIBUTE = 106; //等待分组
    df.SUB_GR_USER_DISMISS_RESULT = 107; //解散结果
    df.SUB_GR_USER_MATCH_SHARE = 108; //比赛分享
    df.SUB_GR_USER_CHAT = 200; //聊天消息
    df.SUB_GR_USER_WISPER = 201; //私语消息
    df.SUB_GR_USER_CONVERSATION = 202; //会话消息
    df.SUB_GR_USER_BUGLE = 203; //喇叭消息
    df.SUB_GR_WHSPER_REPLY = 204; //自动回复
    df.SUB_GR_INVITE_USER = 300; //邀请用户
    //请求失败代码
    df.RFC_PASSpublic_INCORRECT = 1; //密码错误
    df.RFC_TMP_PASSWD_INCORRECT = 2; //临时密码错误
    //喇叭类型
    df.BUGLE_TYPE_ROOM = 0; //房间喇叭
    df.BUGLE_TYPE_GAME = 1; //同类游戏喇叭
    df.BUGLE_TYPE_PLATFORM = 2; //平台喇叭
    //消费类型
    df.CONSUMER_ROOM_BUGLE = 0; //房间喇叭
    df.CONSUMER_GAME_BUGLE = 1; //游戏喇叭
    df.CONSUMER_PLATFORM_BUGLE = 2; //平台喇叭
    df.CONSUMER_MATCH_FEE = 3; //比赛费用
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //旁观请求
    var CMD_GR_UserLookon = (function () {
        function CMD_GR_UserLookon() {
        }
        return CMD_GR_UserLookon;
    }());
    df.CMD_GR_UserLookon = CMD_GR_UserLookon;
    __reflect(CMD_GR_UserLookon.prototype, "df.CMD_GR_UserLookon");
    ;
    //坐下请求
    var CMD_GR_UserSitDown = (function () {
        function CMD_GR_UserSitDown() {
        }
        return CMD_GR_UserSitDown;
    }());
    df.CMD_GR_UserSitDown = CMD_GR_UserSitDown;
    __reflect(CMD_GR_UserSitDown.prototype, "df.CMD_GR_UserSitDown");
    ;
    //起立请求
    var CMD_GR_UserStandUp = (function () {
        function CMD_GR_UserStandUp() {
        }
        return CMD_GR_UserStandUp;
    }());
    df.CMD_GR_UserStandUp = CMD_GR_UserStandUp;
    __reflect(CMD_GR_UserStandUp.prototype, "df.CMD_GR_UserStandUp");
    ;
    //用户分数
    var CMD_GR_UserScore = (function () {
        function CMD_GR_UserScore() {
        }
        return CMD_GR_UserScore;
    }());
    df.CMD_GR_UserScore = CMD_GR_UserScore;
    __reflect(CMD_GR_UserScore.prototype, "df.CMD_GR_UserScore");
    ;
    //用户分数
    var CMD_GR_MobileUserScore = (function () {
        function CMD_GR_MobileUserScore() {
        }
        CMD_GR_MobileUserScore.prototype.onInit = function (buffer) {
            this.dwUserID = buffer.Pop_DWORD();
            this.UserScore = new df.tagMobileUserScore();
            this.UserScore.onInit(buffer);
        };
        return CMD_GR_MobileUserScore;
    }());
    df.CMD_GR_MobileUserScore = CMD_GR_MobileUserScore;
    __reflect(CMD_GR_MobileUserScore.prototype, "df.CMD_GR_MobileUserScore");
    ;
    //用户段位
    var CMD_GR_UserSegment = (function () {
        function CMD_GR_UserSegment() {
        }
        return CMD_GR_UserSegment;
    }());
    df.CMD_GR_UserSegment = CMD_GR_UserSegment;
    __reflect(CMD_GR_UserSegment.prototype, "df.CMD_GR_UserSegment");
    ;
    //用户状态
    var CMD_GR_UserStatus = (function () {
        function CMD_GR_UserStatus() {
        }
        return CMD_GR_UserStatus;
    }());
    df.CMD_GR_UserStatus = CMD_GR_UserStatus;
    __reflect(CMD_GR_UserStatus.prototype, "df.CMD_GR_UserStatus");
    ;
    //用户财富
    var CMD_GR_UserWealth = (function () {
        function CMD_GR_UserWealth() {
        }
        return CMD_GR_UserWealth;
    }());
    df.CMD_GR_UserWealth = CMD_GR_UserWealth;
    __reflect(CMD_GR_UserWealth.prototype, "df.CMD_GR_UserWealth");
    ;
    //请求失败
    var CMD_GR_RequestFailure = (function () {
        function CMD_GR_RequestFailure(buffer) {
            this.cbFailureCode = buffer.cbBuffer.Pop_Byte();
            this.szDescribeString = buffer.cbBuffer.Pop_UTF16(buffer.cbBuffer.getByteArray().bytesAvailable / 2);
        }
        return CMD_GR_RequestFailure;
    }());
    df.CMD_GR_RequestFailure = CMD_GR_RequestFailure;
    __reflect(CMD_GR_RequestFailure.prototype, "df.CMD_GR_RequestFailure");
    ;
    //用户聊天
    var CMD_GR_S_UserChat = (function () {
        function CMD_GR_S_UserChat() {
        }
        return CMD_GR_S_UserChat;
    }());
    df.CMD_GR_S_UserChat = CMD_GR_S_UserChat;
    __reflect(CMD_GR_S_UserChat.prototype, "df.CMD_GR_S_UserChat");
    ;
    //用户聊天
    var CMD_GR_R_UserChat = (function () {
        function CMD_GR_R_UserChat() {
        }
        return CMD_GR_R_UserChat;
    }());
    df.CMD_GR_R_UserChat = CMD_GR_R_UserChat;
    __reflect(CMD_GR_R_UserChat.prototype, "df.CMD_GR_R_UserChat");
    ;
    //用户私聊
    var CMD_GR_S_UserWisper = (function () {
        function CMD_GR_S_UserWisper() {
        }
        return CMD_GR_S_UserWisper;
    }());
    df.CMD_GR_S_UserWisper = CMD_GR_S_UserWisper;
    __reflect(CMD_GR_S_UserWisper.prototype, "df.CMD_GR_S_UserWisper");
    ;
    //用户私聊
    var CMD_GR_R_UserWisper = (function () {
        function CMD_GR_R_UserWisper() {
        }
        return CMD_GR_R_UserWisper;
    }());
    df.CMD_GR_R_UserWisper = CMD_GR_R_UserWisper;
    __reflect(CMD_GR_R_UserWisper.prototype, "df.CMD_GR_R_UserWisper");
    ;
    //用户会话
    var CMD_GR_UserConversation = (function () {
        function CMD_GR_UserConversation() {
        }
        return CMD_GR_UserConversation;
    }());
    df.CMD_GR_UserConversation = CMD_GR_UserConversation;
    __reflect(CMD_GR_UserConversation.prototype, "df.CMD_GR_UserConversation");
    ;
    //拒绝玩家
    var CMD_GR_UserRepulseSit = (function () {
        function CMD_GR_UserRepulseSit() {
        }
        return CMD_GR_UserRepulseSit;
    }());
    df.CMD_GR_UserRepulseSit = CMD_GR_UserRepulseSit;
    __reflect(CMD_GR_UserRepulseSit.prototype, "df.CMD_GR_UserRepulseSit");
    ;
    //请求用户信息
    var CMD_GR_UserInfoReq = (function () {
        function CMD_GR_UserInfoReq() {
        }
        return CMD_GR_UserInfoReq;
    }());
    df.CMD_GR_UserInfoReq = CMD_GR_UserInfoReq;
    __reflect(CMD_GR_UserInfoReq.prototype, "df.CMD_GR_UserInfoReq");
    ;
    //请求用户信息
    var CMD_GR_ChairUserInfoReq = (function () {
        function CMD_GR_ChairUserInfoReq() {
        }
        return CMD_GR_ChairUserInfoReq;
    }());
    df.CMD_GR_ChairUserInfoReq = CMD_GR_ChairUserInfoReq;
    __reflect(CMD_GR_ChairUserInfoReq.prototype, "df.CMD_GR_ChairUserInfoReq");
    ;
    //解散桌子
    var CMD_GR_DismissTable = (function () {
        function CMD_GR_DismissTable() {
        }
        return CMD_GR_DismissTable;
    }());
    df.CMD_GR_DismissTable = CMD_GR_DismissTable;
    __reflect(CMD_GR_DismissTable.prototype, "df.CMD_GR_DismissTable");
    ;
    //解散结果
    var CMD_GR_DismissResult = (function () {
        function CMD_GR_DismissResult() {
        }
        return CMD_GR_DismissResult;
    }());
    df.CMD_GR_DismissResult = CMD_GR_DismissResult;
    __reflect(CMD_GR_DismissResult.prototype, "df.CMD_GR_DismissResult");
    ;
    //比赛分享
    var CMD_GR_UserMatchShare = (function () {
        function CMD_GR_UserMatchShare() {
        }
        return CMD_GR_UserMatchShare;
    }());
    df.CMD_GR_UserMatchShare = CMD_GR_UserMatchShare;
    __reflect(CMD_GR_UserMatchShare.prototype, "df.CMD_GR_UserMatchShare");
    ;
    //邀请用户
    var CMD_GR_R_InviteUser = (function () {
        function CMD_GR_R_InviteUser() {
        }
        return CMD_GR_R_InviteUser;
    }());
    df.CMD_GR_R_InviteUser = CMD_GR_R_InviteUser;
    __reflect(CMD_GR_R_InviteUser.prototype, "df.CMD_GR_R_InviteUser");
    ;
    //邀请用户
    var CMD_GR_S_InviteUser = (function () {
        function CMD_GR_S_InviteUser() {
        }
        return CMD_GR_S_InviteUser;
    }());
    df.CMD_GR_S_InviteUser = CMD_GR_S_InviteUser;
    __reflect(CMD_GR_S_InviteUser.prototype, "df.CMD_GR_S_InviteUser");
    ;
    //喇叭消息
    var CMD_GR_UserBugle = (function () {
        function CMD_GR_UserBugle() {
        }
        return CMD_GR_UserBugle;
    }());
    df.CMD_GR_UserBugle = CMD_GR_UserBugle;
    __reflect(CMD_GR_UserBugle.prototype, "df.CMD_GR_UserBugle");
    ;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //规则标志
    df.UR_LIMIT_SAME_IP = 0x01; //限制地址
    df.UR_LIMIT_WIN_RATE = 0x02; //限制胜率
    df.UR_LIMIT_FLEE_RATE = 0x04; //限制逃率
    df.UR_LIMIT_GAME_SCORE = 0x08; //限制积分
    //用户规则
    var CMD_GR_UserRule = (function () {
        function CMD_GR_UserRule() {
        }
        return CMD_GR_UserRule;
    }());
    df.CMD_GR_UserRule = CMD_GR_UserRule;
    __reflect(CMD_GR_UserRule.prototype, "df.CMD_GR_UserRule");
    ;
    ///////////////////////////////////////////////////////////////////////////////////////////
    //状态命令
    df.MDM_GR_STATUS = 6; //状态信息
    df.SUB_GR_TABLE_INFO = 100; //桌子信息
    df.SUB_GR_TABLE_STATUS = 101; //桌子状态
    df.SUB_GR_TABLE_SCORE = 102; //桌子底分
    df.SUB_GR_SCORE_VARIATION = 103; //底分变更
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //桌子信息
    var CMD_GR_TableInfo = (function () {
        function CMD_GR_TableInfo() {
        }
        return CMD_GR_TableInfo;
    }());
    df.CMD_GR_TableInfo = CMD_GR_TableInfo;
    __reflect(CMD_GR_TableInfo.prototype, "df.CMD_GR_TableInfo");
    ;
    //桌子状态
    var CMD_GR_TableStatus = (function () {
        function CMD_GR_TableStatus() {
        }
        return CMD_GR_TableStatus;
    }());
    df.CMD_GR_TableStatus = CMD_GR_TableStatus;
    __reflect(CMD_GR_TableStatus.prototype, "df.CMD_GR_TableStatus");
    ;
    //桌子分数
    var CMD_GR_TableScore = (function () {
        function CMD_GR_TableScore() {
        }
        return CMD_GR_TableScore;
    }());
    df.CMD_GR_TableScore = CMD_GR_TableScore;
    __reflect(CMD_GR_TableScore.prototype, "df.CMD_GR_TableScore");
    ;
    //底分变更
    var CMD_GR_ScoreVariation = (function () {
        function CMD_GR_ScoreVariation() {
        }
        return CMD_GR_ScoreVariation;
    }());
    df.CMD_GR_ScoreVariation = CMD_GR_ScoreVariation;
    __reflect(CMD_GR_ScoreVariation.prototype, "df.CMD_GR_ScoreVariation");
    ;
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //管理命令
    df.MDM_GR_MANAGE = 5; //管理命令
    df.SUB_GR_SEND_WARNING = 1; //发送警告
    df.SUB_GR_SEND_MESSAGE = 2; //发送消息
    df.SUB_GR_LOOK_USER_IP = 3; //查看地址
    df.SUB_GR_KILL_USER = 4; //踢出用户
    df.SUB_GR_LIMIT_ACCOUNS = 5; //禁用帐户
    df.SUB_GR_SET_USER_RIGHT = 6; //权限设置
    df.SUB_GR_OPTION_SERVER = 7; //房间设置
    df.SUB_GR_KICK_ALL_USER = 8; //踢出用户
    df.SUB_GR_LIMIT_USER_CHAT = 9; //限制聊天
    df.SUB_GR_TABLE_RULE = 10; //桌子规则
    df.SUB_GR_SERVER_OPTION = 11; //房间选项
    df.SUB_GR_DISMISSGAME = 12; //解散桌子
    df.SUB_GR_DISMISS_MATCH = 13; //解散比赛
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    //设置标志
    df.OSW_ROOM = 1; //大厅消息
    df.OSW_GAME = 2; //游戏消息
    //发送警告
    var CMD_GR_SendWarning = (function () {
        function CMD_GR_SendWarning() {
        }
        return CMD_GR_SendWarning;
    }());
    df.CMD_GR_SendWarning = CMD_GR_SendWarning;
    __reflect(CMD_GR_SendWarning.prototype, "df.CMD_GR_SendWarning");
    ;
    //系统消息
    var CMD_GR_SendMessage = (function () {
        function CMD_GR_SendMessage() {
        }
        return CMD_GR_SendMessage;
    }());
    df.CMD_GR_SendMessage = CMD_GR_SendMessage;
    __reflect(CMD_GR_SendMessage.prototype, "df.CMD_GR_SendMessage");
    ;
    //查看地址
    var CMD_GR_LookUserIP = (function () {
        function CMD_GR_LookUserIP() {
        }
        return CMD_GR_LookUserIP;
    }());
    df.CMD_GR_LookUserIP = CMD_GR_LookUserIP;
    __reflect(CMD_GR_LookUserIP.prototype, "df.CMD_GR_LookUserIP");
    ;
    //踢出用户
    var CMD_GR_KillUser = (function () {
        function CMD_GR_KillUser() {
        }
        return CMD_GR_KillUser;
    }());
    df.CMD_GR_KillUser = CMD_GR_KillUser;
    __reflect(CMD_GR_KillUser.prototype, "df.CMD_GR_KillUser");
    ;
    //解散游戏
    var CMD_GR_DismissGame = (function () {
        function CMD_GR_DismissGame() {
        }
        return CMD_GR_DismissGame;
    }());
    df.CMD_GR_DismissGame = CMD_GR_DismissGame;
    __reflect(CMD_GR_DismissGame.prototype, "df.CMD_GR_DismissGame");
    ;
    //解散比赛
    var CMD_GR_DismissMatch = (function () {
        function CMD_GR_DismissMatch() {
        }
        return CMD_GR_DismissMatch;
    }());
    df.CMD_GR_DismissMatch = CMD_GR_DismissMatch;
    __reflect(CMD_GR_DismissMatch.prototype, "df.CMD_GR_DismissMatch");
    ;
    //禁用帐户
    var CMD_GR_LimitAccounts = (function () {
        function CMD_GR_LimitAccounts() {
        }
        return CMD_GR_LimitAccounts;
    }());
    df.CMD_GR_LimitAccounts = CMD_GR_LimitAccounts;
    __reflect(CMD_GR_LimitAccounts.prototype, "df.CMD_GR_LimitAccounts");
    ;
    //权限设置
    var CMD_GR_SetUserRight = (function () {
        function CMD_GR_SetUserRight() {
        }
        return CMD_GR_SetUserRight;
    }());
    df.CMD_GR_SetUserRight = CMD_GR_SetUserRight;
    __reflect(CMD_GR_SetUserRight.prototype, "df.CMD_GR_SetUserRight");
    ;
    //房间设置
    var CMD_GR_OptionServer = (function () {
        function CMD_GR_OptionServer() {
        }
        return CMD_GR_OptionServer;
    }());
    df.CMD_GR_OptionServer = CMD_GR_OptionServer;
    __reflect(CMD_GR_OptionServer.prototype, "df.CMD_GR_OptionServer");
    ;
    //踢出所有用户
    var CMD_GR_KickAllUser = (function () {
        function CMD_GR_KickAllUser() {
        }
        return CMD_GR_KickAllUser;
    }());
    df.CMD_GR_KickAllUser = CMD_GR_KickAllUser;
    __reflect(CMD_GR_KickAllUser.prototype, "df.CMD_GR_KickAllUser");
    ;
    //限制聊天
    var CMD_GR_LimitUserChat = (function () {
        function CMD_GR_LimitUserChat() {
        }
        return CMD_GR_LimitUserChat;
    }());
    df.CMD_GR_LimitUserChat = CMD_GR_LimitUserChat;
    __reflect(CMD_GR_LimitUserChat.prototype, "df.CMD_GR_LimitUserChat");
    ;
    //房间选项
    var CMD_GR_ManageServerOption = (function () {
        function CMD_GR_ManageServerOption() {
        }
        return CMD_GR_ManageServerOption;
    }());
    df.CMD_GR_ManageServerOption = CMD_GR_ManageServerOption;
    __reflect(CMD_GR_ManageServerOption.prototype, "df.CMD_GR_ManageServerOption");
    ;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //会员命令
    df.MDM_GR_MEMBER = 8; //会员命令
    df.SUB_GR_KICK_USER = 1; //踢走用户
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //踢走用户
    var CMD_GR_KickUser = (function () {
        function CMD_GR_KickUser() {
        }
        return CMD_GR_KickUser;
    }());
    df.CMD_GR_KickUser = CMD_GR_KickUser;
    __reflect(CMD_GR_KickUser.prototype, "df.CMD_GR_KickUser");
    ;
    //////////////////////////////////////////////////////////////////////////
    //设置标志
    df.OSF_ROOM_CHAT = 1; //大厅聊天
    df.OSF_GAME_CHAT = 2; //游戏聊天
    df.OSF_ROOM_WISPER = 3; //大厅私聊
    df.OSF_ENTER_ROOM = 4; //进入房间
    df.OSF_ENTER_GAME = 5; //进入游戏
    df.OSF_PLAY_CHAT = 6; //同桌游戏私聊
    df.OSF_REMOTE_SEARCH = 7; //远程搜索
    df.OSF_ANDROID_ATTEND = 8; //机器人陪打
    df.OSF_ANDROID_SIMULATE = 9; //机器人占座
    df.OSF_CLOSE_NOPLAYER = 10; //自动关闭房间
    df.OSF_MEMBER_CAN_CHAT = 11; //会员可聊天
    df.OSF_LOOK_ON = 12; //禁止旁观
    df.OSF_SEND_BUGLE = 13; //发送喇叭
    df.OSF_LOOK_ON_CHAT = 14; //旁观聊天
    //////////////////////////////////////////////////////////////////////////
    //查询命令
    df.MDM_GR_QUERY = 7; //查询命令
    df.SUB_GR_QUERY_BY_GAMEID = 1; //查询用户
    df.SUB_GR_QUERY_BY_ACCOUNTS = 2; //查询用户
    df.SUB_GR_QUERY_USER_RESULT = 200; //查询结果
    df.SUB_GR_QUERY_NOT_FOUND = 201; //查询不到
    //////////////////////////////////////////////////////////////////////////
    //查询用户
    var CMD_GR_QueryByGameID = (function () {
        function CMD_GR_QueryByGameID() {
        }
        return CMD_GR_QueryByGameID;
    }());
    df.CMD_GR_QueryByGameID = CMD_GR_QueryByGameID;
    __reflect(CMD_GR_QueryByGameID.prototype, "df.CMD_GR_QueryByGameID");
    ;
    //查询用户
    var CMD_GR_QueryByAccounts = (function () {
        function CMD_GR_QueryByAccounts() {
        }
        return CMD_GR_QueryByAccounts;
    }());
    df.CMD_GR_QueryByAccounts = CMD_GR_QueryByAccounts;
    __reflect(CMD_GR_QueryByAccounts.prototype, "df.CMD_GR_QueryByAccounts");
    ;
    //查找不到
    var CMD_GR_QueryNotFound = (function () {
        function CMD_GR_QueryNotFound() {
        }
        return CMD_GR_QueryNotFound;
    }());
    df.CMD_GR_QueryNotFound = CMD_GR_QueryNotFound;
    __reflect(CMD_GR_QueryNotFound.prototype, "df.CMD_GR_QueryNotFound");
    ;
    //返回代码
    df.QUERY_NOT_FOUND = 1; //未找到
    df.QUERY_FORBID_USE = 2; //禁止使用查找
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //比赛命令
    df.MDM_GR_MATCH = 8; //比赛命令
    //请求命令
    df.SUB_GR_MATCH_SIGNUP = 1; //比赛报名
    df.SUB_GR_MATCH_UNSIGNUP = 2; //取消报名
    df.SUB_GR_MATCH_REVIVE = 3; //复活比赛
    df.SUB_GR_SHARE_MATCH = 4; //分享比赛
    //应答命令
    df.SUB_GR_MATCH_NUMBER = 10; //等待人数
    df.SUB_GR_MATCH_STATUS = 11; //比赛状态
    df.SUB_GR_MATCH_USTATUS = 12; //比赛状态
    df.SUB_GR_SHARE_RESULT = 13; //分享结果
    df.SUB_GR_SIGNUP_SUCCESS = 14; //报名成功
    //比赛信息
    var CMD_GR_MatchRequest = (function () {
        function CMD_GR_MatchRequest() {
        }
        return CMD_GR_MatchRequest;
    }());
    df.CMD_GR_MatchRequest = CMD_GR_MatchRequest;
    __reflect(CMD_GR_MatchRequest.prototype, "df.CMD_GR_MatchRequest");
    ;
    //
    //定时赛数据
    var tagLockTimeMatchData = (function () {
        function tagLockTimeMatchData() {
        }
        return tagLockTimeMatchData;
    }());
    df.tagLockTimeMatchData = tagLockTimeMatchData;
    __reflect(tagLockTimeMatchData.prototype, "df.tagLockTimeMatchData");
    ;
    //即时赛数据
    var tagImmediateMatchData = (function () {
        function tagImmediateMatchData() {
        }
        return tagImmediateMatchData;
    }());
    df.tagImmediateMatchData = tagImmediateMatchData;
    __reflect(tagImmediateMatchData.prototype, "df.tagImmediateMatchData");
    ;
    //比赛人数
    var CMD_GR_MatchNumber = (function () {
        function CMD_GR_MatchNumber() {
        }
        return CMD_GR_MatchNumber;
    }());
    df.CMD_GR_MatchNumber = CMD_GR_MatchNumber;
    __reflect(CMD_GR_MatchNumber.prototype, "df.CMD_GR_MatchNumber");
    ;
    //分享结果
    var CMD_GR_ShareResult = (function () {
        function CMD_GR_ShareResult() {
        }
        return CMD_GR_ShareResult;
    }());
    df.CMD_GR_ShareResult = CMD_GR_ShareResult;
    __reflect(CMD_GR_ShareResult.prototype, "df.CMD_GR_ShareResult");
    ;
    ///////////////////////////////////////////////////////////////////////////////////////
    //框架命令
    df.MDM_GF_FRAME = 100; //框架命令
    //////////////////////////////////////////////////////////////////////////////////////
    //框架命令
    //用户命令
    df.SUB_GF_GAME_OPTION = 1; //游戏配置
    df.SUB_GF_USER_READY = 2; //用户准备
    df.SUB_GF_USER_CHAT = 3; //用户聊天
    df.SUB_GF_LOOKON_CONFIG = 4; //旁观配置
    df.SUB_GF_USER_LOOK2SIT = 5; //旁观坐下
    df.SUB_GF_USER_SIT2LOOK = 6; //坐下旁观
    df.SUB_GF_JOIN_GAME = 7; //请求加入游戏
    df.SUB_GF_USER_BUGLE = 8; //喇叭消息
    df.SUB_GF_USER_VOICE = 9; //用户语音
    df.SUB_GF_LAUNCH_DISMISS = 10; //发起解散
    df.SUB_GF_BALLOT_DISMISS = 11; //投票解散
    //比赛信息
    df.SUB_GF_MATCH_DATA = 20; //比赛数据
    df.SUB_GF_MATCH_RANK = 21; //比赛排名
    df.SUB_GF_MATCH_SCORE = 22; //比赛分数	
    df.SUB_GF_MATCH_WAIT = 23; //比赛等待
    df.SUB_GF_MATCH_PROMOTE = 24; //比赛晋级
    df.SUB_GF_MATCH_ELIMINATE = 25; //比赛淘汰
    df.SUB_GF_MATCH_ROUND_SWITCH = 26; //比赛轮次
    df.SUB_GF_MATCH_RESULT = 30; //比赛结果
    //游戏信息
    df.SUB_GF_GAME_STATUS = 100; //游戏状态
    df.SUB_GF_GAME_SCENE = 101; //游戏场景
    df.SUB_GF_LOOKON_STATUS = 102; //旁观状态
    //约战信息
    df.SUB_GF_TABLE_PARAM = 150; //桌子参数	
    df.SUB_GF_TABLE_BATTLE = 151; //桌子战况
    df.SUB_GF_TABLE_GRADE = 152; //桌子成绩
    df.SUB_GF_TABLE_PARAMEX = 153; //桌子参数
    df.SUB_GF_VIDEO_PARAM = 154; //视频参数	
    //协议解散
    df.SUB_GF_DISMISS_NOTIFY = 160; //解散提醒
    df.SUB_GF_DISMISS_BALLOT = 161; //解散投票
    df.SUB_GF_DISMISS_SUCCESS = 162; //解散成功	
    //系统消息
    df.SUB_GF_SYSTEM_MESSAGE = 200; //系统消息
    df.SUB_GF_ACTION_MESSAGE = 201; //动作消息
    /////////////////////////////////////////////////////////////////////////////////////////////
    //游戏配置
    var CMD_GF_GameOption = (function () {
        function CMD_GF_GameOption() {
        }
        return CMD_GF_GameOption;
    }());
    df.CMD_GF_GameOption = CMD_GF_GameOption;
    __reflect(CMD_GF_GameOption.prototype, "df.CMD_GF_GameOption");
    ;
    //游戏环境
    var CMD_GF_GameStatus = (function () {
        function CMD_GF_GameStatus() {
        }
        return CMD_GF_GameStatus;
    }());
    df.CMD_GF_GameStatus = CMD_GF_GameStatus;
    __reflect(CMD_GF_GameStatus.prototype, "df.CMD_GF_GameStatus");
    ;
    //用户聊天
    // export class CMD_GF_UserChat
    // {
    //     public							wChatLength;						//信息长度
    //     COLORREF						    crStringColor;						//信息颜色
    //     public							dwSendUserID;						//发送用户
    //     public							dwTargetUserID;						//目标用户
    //     public							szChatString;		                //聊天信息
    // };
    //发送语音
    var CMD_GF_SendVoice = (function () {
        function CMD_GF_SendVoice() {
        }
        return CMD_GF_SendVoice;
    }());
    df.CMD_GF_SendVoice = CMD_GF_SendVoice;
    __reflect(CMD_GF_SendVoice.prototype, "df.CMD_GF_SendVoice");
    ;
    //用户语音
    var CMD_GF_UserVoice = (function () {
        function CMD_GF_UserVoice() {
        }
        return CMD_GF_UserVoice;
    }());
    df.CMD_GF_UserVoice = CMD_GF_UserVoice;
    __reflect(CMD_GF_UserVoice.prototype, "df.CMD_GF_UserVoice");
    ;
    //旁观配置
    var CMD_GF_LookonConfig = (function () {
        function CMD_GF_LookonConfig() {
        }
        return CMD_GF_LookonConfig;
    }());
    df.CMD_GF_LookonConfig = CMD_GF_LookonConfig;
    __reflect(CMD_GF_LookonConfig.prototype, "df.CMD_GF_LookonConfig");
    ;
    //旁观状态
    var CMD_GF_LookonStatus = (function () {
        function CMD_GF_LookonStatus() {
        }
        return CMD_GF_LookonStatus;
    }());
    df.CMD_GF_LookonStatus = CMD_GF_LookonStatus;
    __reflect(CMD_GF_LookonStatus.prototype, "df.CMD_GF_LookonStatus");
    ;
    //旁观坐下
    var CMD_GF_Look2Sit = (function () {
        function CMD_GF_Look2Sit() {
        }
        return CMD_GF_Look2Sit;
    }());
    df.CMD_GF_Look2Sit = CMD_GF_Look2Sit;
    __reflect(CMD_GF_Look2Sit.prototype, "df.CMD_GF_Look2Sit");
    ;
    //坐下旁观
    var CMD_GF_Sit2Look = (function () {
        function CMD_GF_Sit2Look() {
        }
        return CMD_GF_Sit2Look;
    }());
    df.CMD_GF_Sit2Look = CMD_GF_Sit2Look;
    __reflect(CMD_GF_Sit2Look.prototype, "df.CMD_GF_Sit2Look");
    ;
    //比赛分数
    var CMD_GF_MatchScore = (function () {
        function CMD_GF_MatchScore() {
        }
        return CMD_GF_MatchScore;
    }());
    df.CMD_GF_MatchScore = CMD_GF_MatchScore;
    __reflect(CMD_GF_MatchScore.prototype, "df.CMD_GF_MatchScore");
    ;
    //比赛数据
    var CMD_GF_MatchData = (function () {
        function CMD_GF_MatchData() {
        }
        return CMD_GF_MatchData;
    }());
    df.CMD_GF_MatchData = CMD_GF_MatchData;
    __reflect(CMD_GF_MatchData.prototype, "df.CMD_GF_MatchData");
    ;
    //比赛等待
    var CMD_GF_MatchWait = (function () {
        function CMD_GF_MatchWait() {
        }
        return CMD_GF_MatchWait;
    }());
    df.CMD_GF_MatchWait = CMD_GF_MatchWait;
    __reflect(CMD_GF_MatchWait.prototype, "df.CMD_GF_MatchWait");
    ;
    //比赛晋级
    var CMD_GF_MatchPromote = (function () {
        function CMD_GF_MatchPromote() {
        }
        return CMD_GF_MatchPromote;
    }());
    df.CMD_GF_MatchPromote = CMD_GF_MatchPromote;
    __reflect(CMD_GF_MatchPromote.prototype, "df.CMD_GF_MatchPromote");
    ;
    //比赛淘汰
    var CMD_GF_MatchEliminate = (function () {
        function CMD_GF_MatchEliminate() {
        }
        return CMD_GF_MatchEliminate;
    }());
    df.CMD_GF_MatchEliminate = CMD_GF_MatchEliminate;
    __reflect(CMD_GF_MatchEliminate.prototype, "df.CMD_GF_MatchEliminate");
    ;
    //轮次切换
    var CMD_GF_MatchRoundSwitch = (function () {
        function CMD_GF_MatchRoundSwitch() {
        }
        return CMD_GF_MatchRoundSwitch;
    }());
    df.CMD_GF_MatchRoundSwitch = CMD_GF_MatchRoundSwitch;
    __reflect(CMD_GF_MatchRoundSwitch.prototype, "df.CMD_GF_MatchRoundSwitch");
    ;
    //比赛结果
    var CMD_GF_MatchResult = (function () {
        function CMD_GF_MatchResult() {
        }
        return CMD_GF_MatchResult;
    }());
    df.CMD_GF_MatchResult = CMD_GF_MatchResult;
    __reflect(CMD_GF_MatchResult.prototype, "df.CMD_GF_MatchResult");
    ;
    //桌子参数
    var CMD_GF_TableParam = (function () {
        function CMD_GF_TableParam(buffer) {
            this.onInit(buffer);
        }
        CMD_GF_TableParam.prototype.onInit = function (buffer) {
            this.dwOwnerID = buffer.cbBuffer.Pop_DWORD();
            this.dwMappedNum = buffer.cbBuffer.Pop_DWORD();
            this.cbSettleKind = buffer.cbBuffer.Pop_Byte();
            this.wPlayCount = buffer.cbBuffer.Pop_WORD();
            this.wFinishCount = buffer.cbBuffer.Pop_WORD();
            this.dwPlayTime = buffer.cbBuffer.Pop_DWORD();
            this.dwElapsedTime = buffer.cbBuffer.Pop_DWORD();
        };
        return CMD_GF_TableParam;
    }());
    df.CMD_GF_TableParam = CMD_GF_TableParam;
    __reflect(CMD_GF_TableParam.prototype, "df.CMD_GF_TableParam");
    ;
    //视频参数
    var CMD_GF_VideoParam = (function () {
        function CMD_GF_VideoParam() {
        }
        return CMD_GF_VideoParam;
    }());
    df.CMD_GF_VideoParam = CMD_GF_VideoParam;
    __reflect(CMD_GF_VideoParam.prototype, "df.CMD_GF_VideoParam");
    ;
    //投票解散
    var CMD_GF_BallotDismiss = (function () {
        function CMD_GF_BallotDismiss() {
        }
        return CMD_GF_BallotDismiss;
    }());
    df.CMD_GF_BallotDismiss = CMD_GF_BallotDismiss;
    __reflect(CMD_GF_BallotDismiss.prototype, "df.CMD_GF_BallotDismiss");
    ;
    //解散提醒
    var CMD_GF_DismissNotify = (function () {
        function CMD_GF_DismissNotify(buffer) {
            this.onInit(buffer);
        }
        CMD_GF_DismissNotify.prototype.onInit = function (buffer) {
            this.dwUserID = buffer.cbBuffer.Pop_DWORD();
            this.wResidueTime = buffer.cbBuffer.Pop_WORD();
            this.wNeedAgreeCount = buffer.cbBuffer.Pop_WORD();
        };
        return CMD_GF_DismissNotify;
    }());
    df.CMD_GF_DismissNotify = CMD_GF_DismissNotify;
    __reflect(CMD_GF_DismissNotify.prototype, "df.CMD_GF_DismissNotify");
    ;
    //解散投票
    var CMD_GF_DismissBallot = (function () {
        function CMD_GF_DismissBallot(buffer) {
            this.onInit(buffer);
        }
        CMD_GF_DismissBallot.prototype.onInit = function (buffer) {
            this.dwUserID = buffer.cbBuffer.Pop_DWORD();
            this.bAgreeDismiss = buffer.cbBuffer.Pop_BOOL();
        };
        return CMD_GF_DismissBallot;
    }());
    df.CMD_GF_DismissBallot = CMD_GF_DismissBallot;
    __reflect(CMD_GF_DismissBallot.prototype, "df.CMD_GF_DismissBallot");
    ;
    /////////////////////////////////////////////////////////////////////////////////////////////
    //游戏命令
    df.MDM_GF_GAME = 200; //游戏命令
    /////////////////////////////////////////////////////////////////////////////////////////////
    //携带信息
    //其他信息
    df.DTP_GR_COMPUTER_ID = 1; //机器标识
    df.DTP_GR_TABLE_PASSpublic = 2; //桌子密码
    df.DTP_GR_VERIFY_COMPUTER_ID = 3; //机器标识
    //用户属性
    df.DTP_GR_USER_ACCOUNTS = 9; //用户帐号
    df.DTP_GR_USER_NICKNAME = 10; //用户昵称
    df.DTP_GR_USER_EXTERNUID = 11; //社团名字
    df.DTP_GR_USER_AVATARURL = 12; //个性签名
    //地区信息
    df.DTP_GR_AREA = 20; //地区信息
    df.DTP_GR_CITY = 21; //城市信息
    df.DTP_GR_PROVINCE = 22; //省份信息
    df.DTP_GR_CUSTOM_FACE = 23; //自定头像
    //附加信息
    df.DTP_GR_USER_NOTE = 30; //用户备注
    //玩家位置
    df.DTP_GR_SERVER_INFO = 40; //玩家位置
    /////////////////////////////////////////////////////////////////////////////////////////////
    //请求错误
    df.REQUEST_FAILURE_NORMAL = 0; //常规原因
    df.REQUEST_FAILURE_NOGOLD = 1; //金币不足
    df.REQUEST_FAILURE_NOSCORE = 2; //积分不足
    df.REQUEST_FAILURE_PASSpublic = 3; //密码错误
    ////////////////////////////////////////////////////////////////////////////////////////////
    df.MDM_CM_SYSTEM = 1000; //系统命令
    df.SUB_CM_SYSTEM_MESSAGE = 1; //系统消息
    df.SUB_CM_ACTION_MESSAGE = 2; //动作消息
    df.SMT_CHAT = 0x0001; //聊天消息
    df.SMT_EJECT = 0x0002; //弹出消息
    df.SMT_GLOBAL = 0x0004; //全局消息
    df.SMT_PROMPT = 0x0008; //提示消息
    df.SMT_TABLE_ROLL = 0x0010; //滚动消息
    df.SMT_CLOSE_ROOM = 0x0100; //关闭房间
    df.SMT_CLOSE_GAME = 0x0200; //关闭游戏
    df.SMT_CLOSE_LINK = 0x0400; //中断连接
    df.SMT_SHOW_MOBILE = 0x1000; //手机显示
})(df || (df = {}));
