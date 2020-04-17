/**
 * 游戏协议
 */
namespace df {
 
    //////////////////////////////////////////////////////////////////////////
    //登录命令

    export const MDM_GR_LOGON = 3									//登录信息

    //登录模式
    export const SUB_GR_LOGON_MOBILE = 1							//手机登录

    //登出
    export const SUB_GR_LOGON_LOGOUT = 10
    //登录结果
    export const SUB_GR_LOGON_SUCCESS = 100;						//登录成功
    export const SUB_GR_LOGON_FAILURE = 101;						//登录失败
    export const SUB_GR_LOGON_FINISH = 102;							//登录完成

    //升级提示
    export const SUB_GR_UPDATE_NOTIFY = 200							//升级提示

    //////////////////////////////////////////////////////////////////////////

    //I D 登录
    export class CMD_GR_LogonByUserID {

        //版本信息
        public dwPlazaVersion: number = 0;			        //广场版本
        public dwFrameVersion: number = 0;					//框架版本
        public dwProcessVersion: number = 0;				//进程版本
        public dwUserStationID: number = 0;					//玩家站点
        public dwPlazaStationID: number = 0;				//站点标识

        //登录信息
        public dwUserID: number = 0;					    //用户 I D
        public szPasspublic: string = "";				    //登录密码    
    }

    //帐号登录
    export class CMD_GR_LogonByAccounts {
        //版本信息
        public dwPlazaVersion: number = 0;				    //广场版本
        public dwFrameVersion: number = 0;					//框架版本
        public dwProcessVersion: number = 0;				//进程版本
        public dwUserStationID: number = 0;					//玩家站点
        public dwPlazaStationID: number = 0;				//站点标识

        //登录信息
        public szPasspublic: number = 0;				    //登录密码
        public szAccounts: string = "";			            //登录帐号
    }

    //手机登录
    export class CMD_GR_LogonByMobile {

        public wServerID: number = 0;

        //版本信息
        public wGameID: number = 0;					        //游戏标识
        public dwPlazaVersion: number = 0;					//大厅版本
        public dwProcessVersion: number = 0;				//进程版本

        //桌子区域
        public cbDeviceType: number = 0;                    //设备类型
        public wBehaviorFlags: number = 0;                  //行为标识
        public wPageTableCount: number = 0;                 //分页桌数

        //站点信息
        public dwUserStationID: number = 0;					//玩家站点
        public dwPlazaStationID: number = 0;			    //站点标识

        //登录信息
        public dwUserID: number = 0;					     //用户 I D
        public szAccounts: string = "";                      //用户账号
        public szPasspublic: string = "";				     //登录密码
        public szDynamicPass: string = "";                   //动态密码
        public szMachineID: string = "";		             //机器标识

        //房间信息
        public szServerpasswd: string = "";

        //位置信息
        public dGlobalPosLng: number = 0.0;				     //定位经度
        public dGlobalPosLat: number = 0.0;				     //定位纬度

        //比赛信息
        public dwMatchID: number = 0;					     //比赛标识
        public lMatchNo: number = 0;					     //比赛场次


        // public dwClientIP: number = 0;
    }

    //登录成功
    export class CMD_GR_LogonSuccess {
        public dwUserID: number = 0;					    //登陆成功
        public dwUserRight: number = 0;					    //用户权限
        public dwMasterRight: number = 0;				    //管理权限

        //系统参数
        public cbMemberOrderUseTrumpet: number = 0;	        //会员等级

        constructor(buffer: network.Message) {
            this.dwUserID = buffer.cbBuffer.Pop_DWORD();
            this.dwUserRight = buffer.cbBuffer.Pop_DWORD();
            this.dwMasterRight = buffer.cbBuffer.Pop_DWORD();

            this.cbMemberOrderUseTrumpet = buffer.cbBuffer.Pop_Byte();

        }
    }

    //登录失败
    export class CMD_GR_LogonFailure {
        public lErrorCode: number = 0;					  //错误代码
        public wLockServerID: number = 0;				  //锁定房间
        public szDescribeString: string = "";			  //错误消息

        constructor(buffer: network.Message) {
            this.lErrorCode = buffer.cbBuffer.Pop_INT();
            this.wLockServerID = buffer.cbBuffer.Pop_WORD();
            this.szDescribeString = buffer.cbBuffer.Pop_UTF16(buffer.cbBuffer.getByteArray().bytesAvailable/2);
        }
    }

    //升级提示
    export class CMD_GR_UpdateNotify {
        //升级标志
        public cbMustUpdatePlaza: number = 0;					//强行升级
        public cbMustUpdateClient: number = 0;					//强行升级
        public cbAdviceUpdateClient: number = 0;				 //建议升级

        //当前版本
        public dwCurrentPlazaVersion: number = 0;				    //当前版本
        public dwCurrentFrameVersion: number = 0;				    //当前版本
        public dwCurrentClientVersion: number = 0;				    //当前版本

        constructor(buffer: network.Message) {
            this.cbMustUpdatePlaza = buffer.cbBuffer.Pop_Byte();
            this.cbMustUpdateClient = buffer.cbBuffer.Pop_Byte();
            this.cbAdviceUpdateClient = buffer.cbBuffer.Pop_Byte();

            this.dwCurrentPlazaVersion = buffer.cbBuffer.Pop_DWORD();
            this.dwCurrentFrameVersion = buffer.cbBuffer.Pop_DWORD();
            this.dwCurrentClientVersion = buffer.cbBuffer.Pop_DWORD();
        }


    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //配置命令

    export const MDM_GR_CONFIG = 4									    //配置信息

    export const SUB_GR_CONFIG_COLUMN = 100									//列表配置
    export const SUB_GR_CONFIG_SERVER = 101									//房间配置
    export const SUB_GR_CONFIG_FINISH = 102									//配置完成
    export const SUB_GR_CONFIG_RULE = 103									//房间规则
    export const SUB_GR_CONFIG_USER_RIGHT = 104								//玩家权限

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //列表配置
    export class CMD_GR_ConfigColumn {
        public cbColumnCount: number = 0;					 //列表数目
        public ColumnItem: any[];						     //列表描述
    }

    //房间配置
    export class CMD_GR_ConfigServer {
        public wKindID: number = 0;						    //类型索引
        public wTableCount: number = 0;						//桌子数目
        public wChairCount: number = 0;						//椅子数目
        public wServerType: number = 0;						//房间类型
        public cbSegmentGame: number = 0;					//段位游戏
        public dwServerRule: number = 0;					//房间规则
        public dwGameBuglePrice: number = 0;				//喇叭价格
        public dwRoomBuglePrice: number = 0;				//喇叭价格

        constructor(buffer: network.Message) {
            this.wKindID = buffer.cbBuffer.Pop_WORD();
            this.wTableCount = buffer.cbBuffer.Pop_WORD();
            this.wChairCount = buffer.cbBuffer.Pop_WORD();
            this.wServerType = buffer.cbBuffer.Pop_WORD();
            this.cbSegmentGame = buffer.cbBuffer.Pop_Byte();
            this.dwServerRule = buffer.cbBuffer.Pop_DWORD();
            this.dwGameBuglePrice = buffer.cbBuffer.Pop_DWORD();
            this.dwRoomBuglePrice = buffer.cbBuffer.Pop_DWORD();
        }
    };

    //房间规则
    export class CMD_GR_ConfigRule {
        public dwServerRule: number = 0;					    //房间规则
    };

    //玩家权限
    export class CMD_GR_ConfigUserRight {
        public dwUserRight: number = 0;						//玩家权限
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //携带信息

    export const DTP_GR_SERVER_TITLE = 1									    //房间标题
    

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //用户命令

    export const MDM_GR_USER = 5									    //用户信息

    export const SUB_GR_USER_RULE = 1									    //用户规则
    export const SUB_GR_USER_LOOKON = 2									    //旁观请求
    export const SUB_GR_USER_SITDOWN = 3									    //坐下请求
    export const SUB_GR_USER_STANDUP = 4									    //起立请求
    export const SUB_GR_USER_APPLY = 5									    //报名请求
    export const SUB_GR_USER_FEE_QUERY = 6									    //费用查询
    export const SUB_GR_USER_REPULSE_SIT = 7									    //拒绝玩家
    export const SUB_GR_USER_INFO_REQ = 8                                     //请求用户信息
    export const SUB_GR_USER_CHAIR_REQ = 9                                     //请求更换位置
    export const SUB_GR_USER_CHAIR_INFO_REQ = 10                                    //请求椅子用户信息
    export const SUB_GR_USER_DISMISS_TABLE = 11									//解散桌子

    export const SUB_GR_USER_ENTER = 100									//用户进入
    export const SUB_GR_USER_SCORE = 101									//用户分数
    export const SUB_GR_USER_STATUS = 102									//用户状态
    export const SUB_GR_USER_SEGMENT = 103									//用户段位
    export const SUB_GR_REQUEST_FAILURE = 104								//请求失败
    export const SUB_GR_USER_WEALTH = 105									//用户财富
    export const SUB_GR_USER_WAIT_DISTRIBUTE = 106							//等待分组
    export const SUB_GR_USER_DISMISS_RESULT = 107							//解散结果
    export const SUB_GR_USER_MATCH_SHARE = 108							    //比赛分享

    export const SUB_GR_USER_CHAT = 200									//聊天消息
    export const SUB_GR_USER_WISPER = 201									//私语消息
    export const SUB_GR_USER_CONVERSATION = 202									//会话消息
    export const SUB_GR_USER_BUGLE = 203									//喇叭消息
    export const SUB_GR_WHSPER_REPLY = 204									//自动回复

    export const SUB_GR_INVITE_USER = 300									//邀请用户

    //请求失败代码
    export const RFC_PASSpublic_INCORRECT = 1								        	//密码错误
    export const RFC_TMP_PASSWD_INCORRECT = 2									        //临时密码错误

    //喇叭类型
    export const BUGLE_TYPE_ROOM = 0									        //房间喇叭
    export const BUGLE_TYPE_GAME = 1									        //同类游戏喇叭
    export const BUGLE_TYPE_PLATFORM = 2									        //平台喇叭

    //消费类型
    export const CONSUMER_ROOM_BUGLE = 0									        //房间喇叭
    export const CONSUMER_GAME_BUGLE = 1									        //游戏喇叭
    export const CONSUMER_PLATFORM_BUGLE = 2									        //平台喇叭
    export const CONSUMER_MATCH_FEE = 3								        	//比赛费用

    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    //旁观请求
    export class CMD_GR_UserLookon {
        public wTableID;							//桌子位置
        public wChairID;							//椅子位置
        public szPasspublic;			            //桌子密码
    };

    //坐下请求
    export class CMD_GR_UserSitDown {
        public wTableID;							//桌子位置
        public wChairID;							//椅子位置
        public szPasspublic;		            	//桌子密码
    };

    //起立请求
    export class CMD_GR_UserStandUp {
        public wTableID;							//桌子位置
        public wChairID;							//椅子位置
        public cbForceLeave;						//强行离开
    };

    //用户分数
    export class CMD_GR_UserScore {
        public dwUserID;							//用户标识
        public UserScore: tagUserScore;			    //积分信息
    };

    //用户分数
    export class CMD_GR_MobileUserScore {
        public dwUserID;							//用户标识
        public UserScore: tagMobileUserScore;		//积分信息

        public onInit(buffer: utils.ByteArray) {
            this.dwUserID = buffer.Pop_DWORD();
            this.UserScore = new tagMobileUserScore();
            this.UserScore.onInit(buffer);
        }
    };

    //用户段位
    export class CMD_GR_UserSegment {
        public dwUserID;							//用户标识
        public UserSegment: tagUserSegment;			//段位信息
    };

    //用户状态
    export class CMD_GR_UserStatus {
        public dwUserID;							//用户标识
        public UserStatus: tagUserStatus;		    //用户状态
    };

    //用户财富
    export class CMD_GR_UserWealth {
        public cbMask;								//更新掩码
        public lUserIngot;							//用户钻石
        public lUserMedal;							//用户奖牌
        public lUserScore;							//用户金币
        public lUserRoomCard;						//用户房卡

    };

    //请求失败
    export class CMD_GR_RequestFailure {
        public cbFailureCode;						//错误代码
        public szDescribeString;   				    //描述信息

        constructor(buffer: network.Message) {
            this.cbFailureCode = buffer.cbBuffer.Pop_Byte();
            this.szDescribeString = buffer.cbBuffer.Pop_UTF16(buffer.cbBuffer.getByteArray().bytesAvailable/2);
        }
    };

    //用户聊天
    export class CMD_GR_S_UserChat {
        public wChatLength;						//信息长度
        public dwChatColor;						//信息颜色
        public dwTargetUserID;						//目标用户
        public szChatString;		                //聊天信息
    };

    //用户聊天
    export class CMD_GR_R_UserChat {
        public wChatLength;						//信息长度
        public dwChatColor;						//信息颜色
        public dwSendUserID;						//发送用户
        public dwTargetUserID;						//目标用户
        public szChatString;		                //聊天信息
    };

    //用户私聊
    export class CMD_GR_S_UserWisper {
        public wChatLength;						//信息长度
        public dwChatColor;						//信息颜色
        public dwTargetUserID;						//目标用户
        public szChatString;		                //聊天信息
    };

    //用户私聊
    export class CMD_GR_R_UserWisper {
        public wChatLength;						//信息长度
        public dwChatColor;						//信息颜色
        public dwSendUserID;						//发送用户
        public dwTargetUserID;						//目标用户
        public szChatString;		                //聊天信息
    };

    //用户会话
    export class CMD_GR_UserConversation {
        public wChatLength;						//信息长度
        public dwChatColor;						//信息颜色
        public dwSendUserID;						//发送用户
        public dwConversationID;					//会话标识
        public dwTargetUserID;	                    //目标用户
        public szChatString;		                //聊天信息
    };

    //拒绝玩家
    export class CMD_GR_UserRepulseSit {
        public wTableID;							//桌子号码
        public wChairID;							//椅子位置
        public dwUserID;							//用户 I D
        public dwRepulseUserID;					//用户 I D
    };

    //请求用户信息
    export class CMD_GR_UserInfoReq {
        public dwUserIDReq;                       //请求用户
        public wTablePos;							//桌子位置
    };

    //请求用户信息
    export class CMD_GR_ChairUserInfoReq {
        public wTableID;							//桌子号码
        public wChairID;							//椅子位置
    };

    //解散桌子
    export class CMD_GR_DismissTable {
        public wTableID;							//桌子编号	
    };

    //解散结果
    export class CMD_GR_DismissResult {
        public cbResultCode;						//结果代码
        public szDescribeString;				    //描述信息
    };

    //比赛分享
    export class CMD_GR_UserMatchShare {
        public wShareCount;						//分享次数
        public wConfigCount;						//配置次数
        public wSignupCount;						//报名次数 	
    };

    //邀请用户
    export class CMD_GR_R_InviteUser {
        public wTableID;							//桌子号码
        public dwSendUserID;						//发送用户
    };

    //邀请用户
    export class CMD_GR_S_InviteUser {
        public dwTargetUserID;						//目标用户
    };

    //喇叭消息
    export class CMD_GR_UserBugle {
        public dwUserID;							//用户ID
        public szAccounts;			                //用户帐户
        public dwStationID;						//站点ID
        public wChatLength;						//信息长度
        public dwChatColor;						//信息颜色
        public cbBugleType;						//喇叭类型
        public szChatString;		                //聊天信息
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////

    //规则标志
    export const UR_LIMIT_SAME_IP = 0x01							//限制地址
    export const UR_LIMIT_WIN_RATE = 0x02							//限制胜率
    export const UR_LIMIT_FLEE_RATE = 0x04							//限制逃率
    export const UR_LIMIT_GAME_SCORE = 0x08							//限制积分

    //用户规则
    export class CMD_GR_UserRule {
        public cbRuleMask;							//规则掩码
        public wMaxFleeRate;						//最高逃率
        public wLessWinRate;						//最低胜率
        public lMaxGameScore;						//最高分数 
        public lLessGameScore;						//最低分数
    };

    ///////////////////////////////////////////////////////////////////////////////////////////
    //状态命令

    export const MDM_GR_STATUS = 6									    //状态信息

    export const SUB_GR_TABLE_INFO = 100								//桌子信息
    export const SUB_GR_TABLE_STATUS = 101								//桌子状态
    export const SUB_GR_TABLE_SCORE = 102								//桌子底分
    export const SUB_GR_SCORE_VARIATION = 103							//底分变更

    //////////////////////////////////////////////////////////////////////////////////////////////////////

    //桌子信息
    export class CMD_GR_TableInfo {
        public wTableCount;						        //桌子数目
        public TableStatusArray: tagTableStatus[];	        //桌子状态
    };

    //桌子状态
    export class CMD_GR_TableStatus {
        public wTableID;							        //桌子号码
        public TableStatus: tagTableStatus;		            //桌子状态
    };

    //桌子分数
    export class CMD_GR_TableScore {
        public wTableCount;						        //桌子数目
        public lTableScoreArray: number[];			        //桌子底分
    };

    //底分变更
    export class CMD_GR_ScoreVariation {
        public wTableID;							        //桌子号码
        public lBaseScore;							        //桌子底分
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //管理命令

    export const MDM_GR_MANAGE = 5									//管理命令

    export const SUB_GR_SEND_WARNING = 1									//发送警告
    export const SUB_GR_SEND_MESSAGE = 2									//发送消息
    export const SUB_GR_LOOK_USER_IP = 3									//查看地址
    export const SUB_GR_KILL_USER = 4									//踢出用户
    export const SUB_GR_LIMIT_ACCOUNS = 5									//禁用帐户
    export const SUB_GR_SET_USER_RIGHT = 6									//权限设置
    export const SUB_GR_OPTION_SERVER = 7									//房间设置
    export const SUB_GR_KICK_ALL_USER = 8									//踢出用户
    export const SUB_GR_LIMIT_USER_CHAT = 9									//限制聊天
    export const SUB_GR_TABLE_RULE = 10								//桌子规则
    export const SUB_GR_SERVER_OPTION = 11								//房间选项
    export const SUB_GR_DISMISSGAME = 12								//解散桌子
    export const SUB_GR_DISMISS_MATCH = 13								//解散比赛

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    //设置标志
    export const OSW_ROOM = 1									//大厅消息
    export const OSW_GAME = 2									//游戏消息

    //发送警告
    export class CMD_GR_SendWarning {
        public wChatLength;						    //信息长度
        public dwTargetUserID;						    //目标用户
        public szWarningMessage;	                    //警告消息
    };

    //系统消息
    export class CMD_GR_SendMessage {
        public wType;								    //消息类型
        public dwOptionFlags;						    //消息范围
        public wLength;							    //消息长度
        public szString;						        //消息内容
    };

    //查看地址
    export class CMD_GR_LookUserIP {
        public dwTargetUserID;						    //目标用户
    };

    //踢出用户
    export class CMD_GR_KillUser {
        public dwTargetUserID;						    //目标用户
    };

    //解散游戏
    export class CMD_GR_DismissGame {
        public wDismissTableNum;		                 //解散桌号
    };

    //解散比赛
    export class CMD_GR_DismissMatch {
        public dwMatchID;						    	//比赛标识
        public lMatchNo;							    //比赛场次
    };

    //禁用帐户
    export class CMD_GR_LimitAccounts {
        public dwTargetUserID;						    //目标用户
    };

    //权限设置
    export class CMD_GR_SetUserRight {
        //目标用户
        public dwTargetUserID;					    	//目标用户

        //绑定变量
        public cbGameRight;						    //帐号权限
        public cbAccountsRight;					    //帐号权限

        //权限变化
        public cbLimitRoomChat;					    //大厅聊天
        public cbLimitGameChat;					    //游戏聊天
        public cbLimitPlayGame;					    //游戏权限
        public cbLimitSendWisper;					    //发送消息
        public cbLimitLookonGame;					    //旁观权限
    };

    //房间设置
    export class CMD_GR_OptionServer {
        public cbOptionFlags;						    //设置标志
        public cbOptionValue;					    	//设置标志
    };

    //踢出所有用户
    export class CMD_GR_KickAllUser {
        public szKickMessage;		                    //踢出提示
    };

    //限制聊天
    export class CMD_GR_LimitUserChat {
        public dwTargetUserID;					    	//目标用户
        public cbLimitFlags;						    //限制标志
        public cbLimitValue;						    //限制与否
    };

    //房间选项
    export class CMD_GR_ManageServerOption {
        public dwRevenueType;						    //税收类型
        public lRevenue;							    //税收比例
        public wKindID;							    //名称索引
        public wNodeID;							    //节点索引
        public wSortID;							    //排序索引
        public szServerName;			                //房间名称
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //会员命令

    export const MDM_GR_MEMBER = 8									//会员命令

    export const SUB_GR_KICK_USER = 1									//踢走用户

    ///////////////////////////////////////////////////////////////////////////////////////////////

    //踢走用户
    export class CMD_GR_KickUser {
        public dwTargetUserID;						//目标用户
    };

    //////////////////////////////////////////////////////////////////////////

    //设置标志
    export const OSF_ROOM_CHAT = 1									//大厅聊天
    export const OSF_GAME_CHAT = 2									//游戏聊天
    export const OSF_ROOM_WISPER = 3									//大厅私聊
    export const OSF_ENTER_ROOM = 4									//进入房间
    export const OSF_ENTER_GAME = 5									//进入游戏
    export const OSF_PLAY_CHAT = 6									//同桌游戏私聊
    export const OSF_REMOTE_SEARCH = 7									//远程搜索
    export const OSF_ANDROID_ATTEND = 8									//机器人陪打
    export const OSF_ANDROID_SIMULATE = 9									//机器人占座
    export const OSF_CLOSE_NOPLAYER = 10								//自动关闭房间
    export const OSF_MEMBER_CAN_CHAT = 11								//会员可聊天
    export const OSF_LOOK_ON = 12								//禁止旁观
    export const OSF_SEND_BUGLE = 13								//发送喇叭
    export const OSF_LOOK_ON_CHAT = 14								//旁观聊天

    //////////////////////////////////////////////////////////////////////////
    //查询命令

    export const MDM_GR_QUERY = 7									//查询命令

    export const SUB_GR_QUERY_BY_GAMEID = 1									//查询用户
    export const SUB_GR_QUERY_BY_ACCOUNTS = 2									//查询用户

    export const SUB_GR_QUERY_USER_RESULT = 200								//查询结果
    export const SUB_GR_QUERY_NOT_FOUND = 201								//查询不到

    //////////////////////////////////////////////////////////////////////////

    //查询用户
    export class CMD_GR_QueryByGameID {
        public dwGameID;							//游戏ID
    };

    //查询用户
    export class CMD_GR_QueryByAccounts {
        public szAccounts;			                //用户帐户
    };

    //查找不到
    export class CMD_GR_QueryNotFound {
        public nResultCode;						//返回代码
        public szDescribeString;			    	//返回消息
    };

    //返回代码
    export const QUERY_NOT_FOUND = 1								//未找到
    export const QUERY_FORBID_USE = 2								//禁止使用查找


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //比赛命令

    export const MDM_GR_MATCH = 8								//比赛命令

    //请求命令
    export const SUB_GR_MATCH_SIGNUP = 1								//比赛报名
    export const SUB_GR_MATCH_UNSIGNUP = 2								//取消报名
    export const SUB_GR_MATCH_REVIVE = 3								//复活比赛
    export const SUB_GR_SHARE_MATCH = 4								//分享比赛

    //应答命令
    export const SUB_GR_MATCH_NUMBER = 10							//等待人数
    export const SUB_GR_MATCH_STATUS = 11							//比赛状态
    export const SUB_GR_MATCH_USTATUS = 12							//比赛状态
    export const SUB_GR_SHARE_RESULT = 13							//分享结果
    export const SUB_GR_SIGNUP_SUCCESS = 14							//报名成功


    //比赛信息
    export class CMD_GR_MatchRequest {
        public dwMatchID;							//比赛标识
        public lMatchNo;							//比赛场次
    };


    //
    //定时赛数据
    export class tagLockTimeMatchData {
        //复活配置	
        public cbFeeType;							//费用类型
        public lReviveFee;							//复活费用
        public cbReviveTimes;						//复活次数	
    };

    //即时赛数据
    export class tagImmediateMatchData {
    };

    //比赛人数
    export class CMD_GR_MatchNumber {
        public wTotalCount;						//开赛人数
        public wSignupCount;						//报名人数
    };

    //分享结果
    export class CMD_GR_ShareResult {
        public wShareCount;						//分享次数
        public wSignupCount;						//报名次数
        public szDescribeString;				    //描述消息
    };

    ///////////////////////////////////////////////////////////////////////////////////////
    //框架命令

    export const MDM_GF_FRAME = 100							//框架命令

    //////////////////////////////////////////////////////////////////////////////////////
    //框架命令

    //用户命令
    export const SUB_GF_GAME_OPTION = 1								//游戏配置
    export const SUB_GF_USER_READY = 2								//用户准备
    export const SUB_GF_USER_CHAT = 3								//用户聊天
    export const SUB_GF_LOOKON_CONFIG = 4							//旁观配置
    export const SUB_GF_USER_LOOK2SIT = 5							//旁观坐下
    export const SUB_GF_USER_SIT2LOOK = 6							//坐下旁观
    export const SUB_GF_JOIN_GAME = 7								//请求加入游戏
    export const SUB_GF_USER_BUGLE = 8								//喇叭消息
    export const SUB_GF_USER_VOICE = 9								//用户语音
    export const SUB_GF_LAUNCH_DISMISS = 10							//发起解散
    export const SUB_GF_BALLOT_DISMISS = 11							//投票解散

    //比赛信息
    export const SUB_GF_MATCH_DATA = 20							//比赛数据
    export const SUB_GF_MATCH_RANK = 21							//比赛排名
    export const SUB_GF_MATCH_SCORE = 22							//比赛分数	
    export const SUB_GF_MATCH_WAIT = 23							//比赛等待
    export const SUB_GF_MATCH_PROMOTE = 24							//比赛晋级
    export const SUB_GF_MATCH_ELIMINATE = 25							//比赛淘汰
    export const SUB_GF_MATCH_ROUND_SWITCH = 26							//比赛轮次
    export const SUB_GF_MATCH_RESULT = 30							//比赛结果

    //游戏信息
    export const SUB_GF_GAME_STATUS = 100							//游戏状态
    export const SUB_GF_GAME_SCENE = 101							//游戏场景
    export const SUB_GF_LOOKON_STATUS = 102							//旁观状态

    //约战信息
    export const SUB_GF_TABLE_PARAM = 150							//桌子参数	
    export const SUB_GF_TABLE_BATTLE = 151							//桌子战况
    export const SUB_GF_TABLE_GRADE = 152							//桌子成绩
    export const SUB_GF_TABLE_PARAMEX = 153							//桌子参数
    export const SUB_GF_VIDEO_PARAM = 154							//视频参数	

    //协议解散
    export const SUB_GF_DISMISS_NOTIFY = 160							//解散提醒
    export const SUB_GF_DISMISS_BALLOT = 161							//解散投票
    export const SUB_GF_DISMISS_SUCCESS = 162							//解散成功	

    //系统消息
    export const SUB_GF_SYSTEM_MESSAGE = 200							//系统消息
    export const SUB_GF_ACTION_MESSAGE = 201							//动作消息

    /////////////////////////////////////////////////////////////////////////////////////////////

    //游戏配置
    export class CMD_GF_GameOption {
        public cbAllowLookon;						//旁观标志
        public dwFrameVersion;						//框架版本
        public dwClientVersion;					    //游戏版本
    };

    //游戏环境
    export class CMD_GF_GameStatus {
        public cbGameStatus;						//游戏状态
        public cbAllowLookon;						//旁观标志
    };

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
    export class CMD_GF_SendVoice {
        public dwTargetUserID;						//目标用户
    };

    //用户语音
    export class CMD_GF_UserVoice {
        public dwSendUserID;						//发送用户
    };

    //旁观配置
    export class CMD_GF_LookonConfig {
        public dwUserID;							//用户标识
        public bAllowLookon;						//允许旁观
    };

    //旁观状态
    export class CMD_GF_LookonStatus {
        public bAllowLookon;						//允许旁观
    };

    //旁观坐下
    export class CMD_GF_Look2Sit {
        public wChairID;							//椅子位置
    };

    //坐下旁观
    export class CMD_GF_Sit2Look {
        public wChairID;							//椅子位置
    };

    //比赛分数
    export class CMD_GF_MatchScore {
        public wPlayCount;							//游戏局数
        public lBaseScore;							//游戏底分
        public lEliminateScore;					    //淘汰分数
    };

    //比赛数据
    export class CMD_GF_MatchData {
        //比赛信息
        public dwMatchID;							//比赛标识
        public lMatchNo;							//比赛场次
        public cbMatchType;						    //比赛类型	

        //比赛轮次
        public wRoundID;							//轮次标识
        public wRoundCount;						    //轮次数目
        public MatchRoundItem: tagMatchRoundItem[];	//轮次信息

        //比赛数据
        public cbMatchData: number[];				//比赛数据
    };

    //比赛等待
    export class CMD_GF_MatchWait {
        public wWaitMask;							//等待掩码	
        public wWaitTableCount;				    	//等待桌数
        public szWaitMessage;					    //等待消息
    };

    //比赛晋级
    export class CMD_GF_MatchPromote {
        public wRankID;							//当前名词
        public wPromoteCount;					//晋级人数
        public lMatchScore;						//比赛分数
        public szNotifyContent;			    	//提示内容
    };

    //比赛淘汰
    export class CMD_GF_MatchEliminate {
        //名次信息
        public wRankID;							//当前名次	
        public wMatchUserCount;					//用户人数

        //复活信息
        public bEnableRevive;					//复活标识
        public cbReviveTimes;					//复活次数

        //提示内容
        public szNotifyContent;				    //提示内容
    };

    //轮次切换
    export class CMD_GF_MatchRoundSwitch {
        public wCurrRoundID;					//轮次标识
    };

    //比赛结果
    export class CMD_GF_MatchResult {
        //用户信息
        public wRankID;							//比赛名次	
        public szNickName;			            //玩家昵称

        //奖励信息
        public lRewardGold;						//奖励金币
        public lRewardMedal;					//奖励奖牌
        public lRewardIngot;					//奖励钻石
        public szRewardEntity;					//实物奖励	

        //比赛信息
        public szMatchName;					    //比赛名称	
        public MatchFinishTime;					//结束时间	
    };

    //桌子参数
    export class CMD_GF_TableParam {
        //桌子信息	
        public dwOwnerID;						//桌主标识
        public dwMappedNum;						//映射编号

        //结算信息
        public cbSettleKind;					//结算方式
        public wPlayCount;						//游戏局数
        public wFinishCount;					//完成局数
        public dwPlayTime;						//游戏时长
        public dwElapsedTime;					//逝去时间	

        constructor(buffer: network.Message) {
            this.onInit(buffer);
        }

        public onInit(buffer: network.Message) {
            this.dwOwnerID = buffer.cbBuffer.Pop_DWORD();
            this.dwMappedNum = buffer.cbBuffer.Pop_DWORD();
            this.cbSettleKind = buffer.cbBuffer.Pop_Byte();
            this.wPlayCount = buffer.cbBuffer.Pop_WORD();
            this.wFinishCount = buffer.cbBuffer.Pop_WORD();
            this.dwPlayTime = buffer.cbBuffer.Pop_DWORD();
            this.dwElapsedTime = buffer.cbBuffer.Pop_DWORD();
        }
    };

    //视频参数
    export class CMD_GF_VideoParam {
        public szVideoKey;		                	//视频秘钥
        public szVideoChannel;	                    //视频频道
    };

    //投票解散
    export class CMD_GF_BallotDismiss {
        public bAgreeDismiss;						//同意解散
    };

    //解散提醒
    export class CMD_GF_DismissNotify {
        public dwUserID;							//发起用户
        public wResidueTime;						//剩余时间
        public wNeedAgreeCount;					    //同意人数	

        constructor(buffer: network.Message) {
            this.onInit(buffer);
        }

        public onInit(buffer: network.Message) {
            this.dwUserID = buffer.cbBuffer.Pop_DWORD();
            this.wResidueTime = buffer.cbBuffer.Pop_WORD();
            this.wNeedAgreeCount = buffer.cbBuffer.Pop_WORD();
        }
    };

    //解散投票
    export class CMD_GF_DismissBallot {
        public dwUserID;							//用户标识
        public bAgreeDismiss;						//同意解散

        constructor(buffer: network.Message) {
            this.onInit(buffer);
        }

        public onInit(buffer: network.Message) {
            this.dwUserID = buffer.cbBuffer.Pop_DWORD();
            this.bAgreeDismiss = buffer.cbBuffer.Pop_BOOL();
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    //游戏命令

    export const MDM_GF_GAME = 200								//游戏命令

    /////////////////////////////////////////////////////////////////////////////////////////////
    //携带信息

    //其他信息
    export const DTP_GR_COMPUTER_ID = 1									//机器标识
    export const DTP_GR_TABLE_PASSpublic = 2							//桌子密码
    export const DTP_GR_VERIFY_COMPUTER_ID = 3							//机器标识

    //用户属性
    export const DTP_GR_USER_ACCOUNTS = 9								//用户帐号
    export const DTP_GR_USER_NICKNAME = 10								//用户昵称
    export const DTP_GR_USER_EXTERNUID = 11							    //社团名字
    export const DTP_GR_USER_AVATARURL = 12							//个性签名

    //地区信息
    export const DTP_GR_AREA = 20								//地区信息
    export const DTP_GR_CITY = 21								//城市信息
    export const DTP_GR_PROVINCE = 22							//省份信息
    export const DTP_GR_CUSTOM_FACE = 23						//自定头像

    //附加信息
    export const DTP_GR_USER_NOTE = 30							//用户备注

    //玩家位置
    export const DTP_GR_SERVER_INFO = 40						//玩家位置

    /////////////////////////////////////////////////////////////////////////////////////////////

    //请求错误
    export const REQUEST_FAILURE_NORMAL = 0									//常规原因
    export const REQUEST_FAILURE_NOGOLD = 1									//金币不足
    export const REQUEST_FAILURE_NOSCORE = 2								//积分不足
    export const REQUEST_FAILURE_PASSpublic = 3								//密码错误

    ////////////////////////////////////////////////////////////////////////////////////////////

    export const MDM_CM_SYSTEM = 1000			        //系统命令

    export const SUB_CM_SYSTEM_MESSAGE = 1				//系统消息
    export const SUB_CM_ACTION_MESSAGE = 2				//动作消息

    export const SMT_CHAT = 0x0001		                //聊天消息
    export const SMT_EJECT = 0x0002		                //弹出消息
    export const SMT_GLOBAL = 0x0004		            //全局消息
    export const SMT_PROMPT = 0x0008		            //提示消息
    export const SMT_TABLE_ROLL = 0x0010		        //滚动消息

    export const SMT_CLOSE_ROOM = 0x0100		        //关闭房间
    export const SMT_CLOSE_GAME = 0x0200		        //关闭游戏
    export const SMT_CLOSE_LINK = 0x0400		        //中断连接

    export const SMT_SHOW_MOBILE = 0x1000 		        //手机显示


}