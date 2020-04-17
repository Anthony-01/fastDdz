/**
 * 用户数据 
 */
namespace models {
    export class UserData {

        public wLockServerID: number = df.INVALID_BYTE;

        public nPlatform: number = df.ACCOUNT_TYPE_SELF;
        public szHeadUrl: string = "";
        public szHeadUrlEx: string = "";

        public dwGameID: number = 0;
        public dwUserID: number = 0;

        public dwExperience: number = 0;
        public dwLoveLiness: number = 0;

        public szLogonPass: string = "";
        public szMachine: string = "";
        public szMobilePhone: string = "";

        public szAccounts: string = "";
        public szNickName: string = "";
        public szInsurePass: string = "";
        public szDynamicPass: string = "";

        public lUserScore: number = 0.00;
        public lUserInsure: number = 0.00;
        public lUserIngot: number = 0.00;
        public lUserMedal: number = 0.00;
        public lUserRoomCard: number = 0.00;

        public cbGender: number = 0;
        public cbMemberOrder: number = 0;

        public wFaceID: number = 0;
        public dwCustomID: number = 0;

        public dwStationID: number = 0;

        public dwPayRight: number = 0;

        //会员信息
        public MemberOverDate =
        {
            wYea: 0,
            wMonth: 0,
            wDayOfWeek: 0,
            wDay: 0,
            wHour: 0,
            wMinute: 0,
            wSecond: 0,
            wMilliseconds: 0
        }

        public bAutoLogon: boolean = false  //自动登录
        public bHasLogon: boolean = false   //已登录过

        /**
         * 构造
         */
        constructor(data: any) {
            //基本信息
            this.wFaceID = data.wFaceID;							//头像标识
            this.cbGender = data.cbGender;						    //用户性别
            this.dwCustomID = data.dwCustomID;						//自定头像
            this.dwUserID = data.dwUserID;						    //用户 I D
            this.dwGameID = data.dwGameID;							//游戏 I D
            this.dwStationID = data.dwStationID;				    //站点标识
            this.dwExperience = data.dwExperience;					//经验数值
            this.dwLoveLiness = data.dwLoveLiness;					//用户魅力
            this.szNickName = data.szNickName;			            //用户昵称
            this.szAccounts = data.szAccounts;			            //登录帐号
            this.szLogonPass = data.szLogonPass;			        //登录密码
            this.szInsurePass = data.szInsurePass;			        //银行密码
            this.szDynamicPass = data.szDynamicPass;                //动态密码

            //财富信息
            this.lUserIngot = data.lUserIngot;						//用户钻石
            this.lUserMedal = data.lUserMedal;						//用户奖牌
            this.lUserScore = data.lUserScore;						//用户游戏币	
            this.lUserInsure = data.lUserInsure						//用户银行	

            //会员资料
            this.cbMemberOrder = data.cbMemberOrder,			    //会员等级
            this.MemberOverDate = data.MemberOverDate,				//到期时间

            //附加信息
            this.wLockServerID = data.wLockServerID					//锁定房间	
        }
    }
}