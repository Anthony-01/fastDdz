/**
 * 协议定义
 */
namespace df {
    //////////////////////////////////////////////////////////////////////////////////

    export const MDM_MB_LOGON = 100			            //广场登录

    export const SUB_MB_LOGON_ACCOUNTS_WEB = 10			//帐号登录
    export const SUB_MB_LOGON_OTHERPLATFORM_WEB = 11	//其他登录
    export const SUB_MB_LOGON_MINIPROGRAM_WEB = 12		//小程序登录

    export const SUB_MB_LOGON_SUCCESS = 100;			    //登录成功
    export const SUB_MB_LOGON_FAILURE = 101;			    //登录失败
    export const SUB_MB_LOGON_FINISH = 102;			        //登录完成
    export const SUB_MB_UPDATE_NOTIFY = 200;			    //升级提示

    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //列表命令

    export const MDM_MB_SERVER_LIST = 101							        //列表信息

    //获取命令
    export const SUB_MB_GET_LIST = 1									    //获取列表
    export const SUB_MB_GET_SERVER = 2									    //获取房间
    export const SUB_MB_GET_OPTION = 3									    //获取配置
    export const SUB_MB_GET_OPTION_LUA = 4                                  //获取配置
    export const SUB_MB_GET_SERVER_AGENT = 5                                //房间代理

    //列表信息
    export const SUB_MB_LIST_KIND = 100									    //种类列表
    export const SUB_MB_LIST_SERVER = 101									//房间列表
    export const SUB_MB_LIST_MATCH = 102									//比赛列表
    export const SUB_MB_GAME_OPTION = 104									//游戏选项
    export const SUB_MB_CREATE_OPTION = 103									//开房选项
    export const SUB_MB_LIST_LOGON = 105									//登录列表
    export const SUB_MB_LIST_AGENT = 106									//代理列表
    export const SUB_MB_SERVER_AGENT = 107									//房间代理
    export const SUB_MB_LIST_ACCESS = 108									//网关服务
    export const SUB_MB_LIST_FINISH = 200									//列表完成
    export const SUB_MB_SERVER_FINISH = 201									//房间完成
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    //微信小程序
    export class CMiniProgramInfo {
        public sCode;               //微信代码
        public sRawData;            //用戶数据
        public sEncryptedData;      //加密数据
        public sIv;                 //初始向量
        public signature;           //微信签名
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    //路由服务
    export const MDM_ARS_ROUTE_SERVICE = 3									//路由服务

    //请求命令
    export const SUB_AR_C_QUERY_SERVER = 100									//查询房间

    //应对命令
    export const SUB_AR_S_SERVER_INFO = 200									//房间信息

    //查询房间
    export class CMD_AR_C_QueryServer {
        //查询信息
        public wKindID;							//类型标识
        public dwUserID;							//用户标识	

        public onInit() {
            let buffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            buffer.Append_WORD(this.wKindID);
            buffer.Append_DWORD(this.dwUserID);
            return buffer;
        }
    };

    //房间信息
    export class CMD_AR_S_ServerInfo {
        //房间信息
        public wKindID;							    //类型标识
        public wServerID;							//房间标识	

        //错误信息
        public szDescribeString;				    //描述信息

        public onRead(buffer: utils.ByteArray) {
            this.wKindID = buffer.Pop_WORD();
            this.wServerID = buffer.Pop_WORD();
            this.szDescribeString = buffer.Pop_UTF16(buffer.getByteArray().bytesAvailable / 2);
        }
    };

    //////////////////////////////////////////////////////////////////////////////////
    //帐号登录
    export class CMD_MB_LogonAccounts_WEB {
        //系统信息
        public wModuleID;						    //模块标识
        public wMarketID;							//渠道标识
        public cbDeviceType;                        //设备类型
        public dwAppVersion;					    	//应用版本
        public dwPlazaVersion;						//广场版本		

        //登录信息
        public dwStationID;						    //站点标识
        public dwMappedNum;						    //映射编号
        public szPassword;			            	//登录密码
        public szAccounts;			                //登录帐号

        //请求掩码
        public wRequestMask;

        //连接信息
        public szMachineID;	                         //机器标识
        // public dwClientIP;
        public szMobilePhone;	                     //电话号码

        public onInit() {
            let buffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
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
        }
    };

    /**
     * 账号注册
     */
    export class CMD_MB_RegisterAccounts_WEB {
        //系统信息
        public wModuleID;							//模块标识
        public wMarketID;							//渠道标识
        public cbDeviceType;                        //设备类型
        public dwAppVersion;						//应用版本
        public dwPlazaVersion;						//广场版本

        //密码变量
        public dwStationID;					        //站点标识
        public szLogonPass;			                //登录密码

        //注册信息
        public wFaceID;						    	//头像标识
        public cbGender;						    //用户性别
        public szAccounts;		                	//登录帐号
        public szNickName;		                    //用户昵称

        //请求掩码
        public wRequestMask;

        //连接信息
        // public dwClientIP;
        public szMachineID;	                        //机器标识
        public szMobilePhone;	                    //电话号码

        public onInit() {
            let buffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
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
        }
    };

    //小程序登录
    export class CMD_MB_LogonMiniProgram {
        //系统信息
        public							wModuleID;							//模块标识
        public							wMarketID;							//渠道标识
        public                          cbDeviceType;                       //设备类型
        public							dwStationID;						//站点标识
        public							dwAppVersion;						//应用版本
        public							dwPlazaVersion;						//广场版本	

        //请求信息
        public							wRequestMask;						//请求掩码

        //连接信息
        // public							dwClientIP;							//连接地址
        public							szMachineID;		                //机器标识	

        //微信参数	
        public							szWXCode;				            //微信代码
        public							szSignature;			            //数字签名
        public							szInitVector;		                //初始向量	
        public                          rawdata;                            //用户数据   
        public                          encryptData;                        //加密数据

        public onInit() {
            let buffer = utils.Memory.newLitteEndianByteArray(df.Len_Tcp_Head);
            buffer.Append_WORD(this.wModuleID);
            buffer.Append_WORD(this.wMarketID);
            buffer.Append_Byte(this.cbDeviceType);
            buffer.Append_DWORD(this.dwStationID);
            buffer.Append_DWORD(this.dwAppVersion);
            buffer.Append_DWORD(this.dwPlazaVersion);

            buffer.Append_WORD(this.wRequestMask);
            // buffer.Append_DWORD(this.dwClientIP);
            buffer.Append_UTF16(this.szMachineID,df.LEN_MACHINE_SERIAL);

            buffer.Append_UTF16(this.szWXCode,df.LEN_WXCODE);
            buffer.Append_UTF16(this.szSignature,df.LEN_SIGNATURE);
            buffer.Append_UTF16(this.szInitVector,df.LEN_INITVECTOR);
            return buffer;
        }
    };

    //叠加标识
    export const DTP_GP_RAWDATA				= 1									//用户数据
    export const DTP_GP_ENCRYPTDATA			= 2									//加密数据


    /***
     * 登录成功
     */
    export class CMD_MB_LogonSuccess {
        public wFaceID;							//头像标识
        public cbGender;						//用户性别
        public dwCustomID;						//自定头像
        public dwUserID;						//用户 I D
        public dwGameID;					    //游戏 I D
        public dwStationID;						//站点标识
        public dwExperience;					//经验数值
        public dwLoveLiness;					//用户魅力
        public szNickName;			            //用户昵称
        public szAccounts;			            //登录帐号
        public szExternUID;			            //外部标识
        public szLogonPass;			            //登录密码
        public szInsurePass;			        //银行密码
        public szDynamicPass;		            //动态密码

        //财富信息
        public dUserIngot;						//用户钻石
        public lUserMedal;						//用户奖牌
        public lUserScore;						//用户游戏币	
        public lUserInsure;						//用户银行	

        //会员资料
        public cbMemberOrder;					//会员等级
        public MemberOverDate;					//到期时间

        //附加信息
        public wLockServerID;					//锁定房间

        public onRead(cbBuffer: utils.ByteArray) {
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
        }
    };

    /**
     * 登录失败
     */
    export function CMD_MB_LogonFailure() {
        var struct =
            {
                lResultCode: 0,					    //错误代码
                szDescribeString: ""				//描述消息
            }
        return struct;
    };

    ///////////////////////////////////////////////////////////////////////////////////////////
    //服务命令

    export const MDM_GP_USER_SERVICE = 3;							    //用户服务

    ////////////////////////////////////////////////////////////////////////////////////////////

    //账号服务
    export const SUB_GP_MODIFY_ACCOUNTS = 1;								//修改帐号
    export const SUB_GP_MODIFY_LOGON_PASS = 2;							//修改密码
    export const SUB_GP_MODIFY_INSURE_PASS = 3;							//修改密码
    export const SUB_GP_MODIFY_INDIVIDUAL = 4;							//修改资料
    export const SUB_MB_MODIFY_INDIVIDUAL = 5;							//修改资料
    export const SUB_GP_BIND_MACHINE = 6;								//锁定机器
    export const SUB_GP_UN_BIND_MACHINE = 7;								//解锁机器
    export const SUB_GP_ACCOUNT_SECURITY = 8;							//密保申请
    export const SUB_GP_MODIFY_NICKNAME = 9;								//修改昵称

    //查询命令
    export const SUB_GP_QUERY_INDIVIDUAL = 10							//查询信息
    export const SUB_GP_TEST_ACCOUNTS = 11								//检查占用
    export const SUB_GP_TEST_NICKNAME = 12								//检测占用
    export const SUB_GP_QUERY_WEALTH = 13								//查询财富
    export const SUB_GP_QUERY_WEALTH_WEB = 14							//查询财富

    //低保命令
    export const SUB_GP_BASEENSURE_QUERY = 20							//查询低保
    export const SUB_GP_BASEENSURE_TAKE = 21							//领取低保	
    export const SUB_GP_GET_VALIDATECDOE = 22							//获取验证码

    export class CMD_GP_QueryBaseEnsure {
        //用户信息DWORD
        dwUserID;							//用户ID
        //DWORD
        dwUserStationID;					//用户站点
        //DWORD
        dwPlazaStationID;					//平台站点

        //连接信息WCHAR
        szMachine = utils.allocArray<Number>(LEN_MACHINE_SERIAL, Number)
        //[LEN_MACHINE_SERIAL];		//机器序列


    }

    export class CMD_GP_UserWealth {
        cbMask;        //更新掩码
        lUserIngot;       //用户钻石
        lUserMedal;       //用户奖牌
        lUserScore;       //用户金币
        lUserRoomCard;      //用户房卡

        init(buffer: utils.ByteArray) {
            this.cbMask = buffer.Pop_Byte();
            this.lUserIngot = buffer.Pop_LONGLONG();
            this.lUserMedal = buffer.Pop_LONGLONG();
            this.lUserScore = buffer.Pop_LONGLONG();
            this.lUserRoomCard = buffer.Pop_LONGLONG();
        }
    }

    //////////////////////////////////////////////////////////////////////////

    //操作结果
    export const SUB_GP_OPERATE_SUCCESS = 100								//操作成功
    export const SUB_GP_OPERATE_FAILURE = 101								//操作失败

    //查询结果
    export const SUB_GP_USER_INDIVIDUAL = 200								//个人资料
    export const SUB_GP_USER_WEALTH = 201								    //用户财富

    //修改头像
    export const SUB_GP_USER_FACE_INFO = 210								//头像信息
    export const SUB_GP_SYSTEM_FACE_INFO = 211								//系统头像
    export const SUB_GP_CUSTOM_FACE_INFO = 212								//自定头像

    //低保命令
    export const SUB_GP_BASEENSURE_INFO = 300								//低保信息
    export const SUB_GP_BASEENSURE_RESULT = 301								//领取结果
    export const SUB_GP_BASEENSURE_FAILED = 302								//操作失败	
    export const SUB_GP_VALIDATECDOE_INFO = 303								//验证码信息

    //////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////////
    //银行

    export const MDM_GP_BANK_OPERATE = 4							//银行操作

    //////////////////////////////////////////////////////////////////////////

    export const SUB_GP_STORAGE = 1									//银行存储
    export const SUB_GP_DRAWOUT = 2									//银行取出
    export const SUB_GP_TRANSFER = 3								//银行转帐
    export const SUB_GP_QUERY = 4									//查询用户
    export const SUB_GP_UPDATE = 5									//更新金币

    export function CMD_GP_BANKOPERATE() {
        var struct = {
            dwUserID: 0,
            lOperateScore: 0,
            cbOperateCode: 0,
            dwStationID: 0,
            szInsurePass: ""
        }
        return;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////

    export const DTP_GP_UI_NICKNAME = 8				//用户昵称

}

