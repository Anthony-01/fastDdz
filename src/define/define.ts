namespace df {

    /**
     * 资源地址
     * */
    export const RESOURCE_URL = "http://xm.android.uc2018.foxuc.net/static/minigame/resource/"

    /**
     * df  常量定义
     */
    export const INVALID_BYTE = 0xFF;
    export const INVALID_WORD = 0xFFFF;
    export const INVALID_DWORD = 0xFFFFFFFF
    export const Len_Tcp_Head = 10;  //包头固定长度
    export const Len_Tcp_Info = 4;  //数据信息长度
    export const SOCKET_TCP_BUFFER = 16384;//网络缓冲

    /**
     * 消息处理单元
     */
    export const MAX_UNIT: number = 100;

    //斗地主小游戏标识
    export const KINDID = 111;
    /**
     * 默认时间
     */
    export const Default_Time_Out = 20000;
    //////////////////////////////////////////////////////////////////////////////////////////////
    //内核命令
    export const MDM_KN_COMMAND = 0;									    //内核命令

    //内核命令
    export const SUB_KN_DETECT_SOCKET = 1;									    //检测命令
    export const SUB_KN_SHUT_DOWN_SOCKET = 2;									    //关闭命令


    //////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////
    //数据长度
    export const LEN_MD5 = 33								    //加密密码
    export const LEN_AREA = 16									//地区长度
    export const LEN_CITY = 16									//城市长度
    export const LEN_PROVINCE = 16								//省份长度
    export const LEN_ACCOUNTS = 33								//帐号长度
    export const LEN_PASSWORD = 33								//密码长度
    export const LEN_GROUP_NAME = 32							//社团名字
    export const LEN_UNDER_WRITE = 64							//签名长度
    export const LEN_PROTECT_QUESTION = 32						//密保问题
    export const LEN_PASSPORT_ID = 32							//证件号码
    export const LEN_EXTERNUID   = 33                           //外联标识
    export const LEN_WXCODE     = 33                            //微信代码
    export const LEN_SIGNATURE   = 64                           //数字签名 
    export const LEN_INITVECTOR   = 33                          //初始向量      

    //数据长度
    export const LEN_QQ = 16									//Q Q 号码
    export const LEN_EMAIL = 33									//电子邮件
    export const LEN_USER_UIN = 33								//UIN长度
    export const LEN_USER_NOTE = 256						    //用户备注
    export const LEN_SEAT_PHONE = 33							//固定电话
    export const LEN_MOBILE_PHONE = 16							//移动电话
    export const LEN_COMPELLATION = 16							//真实名字
    export const LEN_DWELLING_PLACE = 128					    //联系地址

    //其他数据
    export const LEN_DOMAIN = 63								//域名长度	
    export const LEN_ADDRESS = 16								//地址长度
    export const LEN_VALIDATE = 33								//验证地址
    export const LEN_ACCREDIT_ID = 33							//授权号码
    export const LEN_COMPUTER_ID = 33							//序列长度
    export const LEN_MACHINE_SERIAL = 33						//序列长度
    export const LEN_NETWORK_ID = 13							//序列长度
    export const LEN_GROUP_INTRODUCE = 128						//群组介绍

    //视频定义
    export const LEN_VIDEO_KEY = 33								//秘钥长度
    export const LEN_VIDEO_CHANNEL = 22							//频道长度

    //列表数据
    export const LEN_TYPE = 32									//种类长度
    export const LEN_KIND = 32									//类型长度
    export const LEN_NODE = 32									//节点长度
    export const LEN_SERVER = 32								//房间长度
    export const LEN_CUSTOM = 32								//定制长度
    export const LEN_PROCESS = 32								//进程长度

    ////////////////////////////////////////////////////////////////////////////////////////////////

    /**站点标示
     * 1000 网狐
     * 1008 宿迁
     * 2000 四川
     * 2004 广安
     * 2008 浙江
     */
    export const STATION_ID = 1000;

    export const SPECIAL_ID = 0;
    /**
     * 登记信息
     */
    export const GAMELIST_LV_SCORE = {
        1: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//五张
        7: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000], //庄十三张
        8: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//比十三张
        15: [0, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000], //掼蛋
        20: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//小包子
        28: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//牛牛
        40: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//德州
        46: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//五张
        52: [0, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000], //转蛋
        55: [10, 100, 500, 1000, 5000, 10000, 50000, 100000, 200000],		//四川斗地主
        57: [10, 100, 500, 1000, 5000, 10000, 50000, 100000, 200000],		//断勾卡
        60: [10, 100, 500, 1000, 5000, 10000, 50000, 100000, 200000],		//丁二红
        65: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//广安
        67: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//衡阳麻将
        68: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//衡阳鬼麻将
        71: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//泗阳麻将
        72: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//挖坑
        73: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//宿迁麻将
        74: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//泗洪麻将
        75: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//兰州麻将
        76: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//跑得快
        78: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//双扣
        79: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//牌九
        81: [10, 100, 500, 1000, 5000, 10000, 50000, 100000, 200000], 		//昏地主
        82: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//血战麻将
        86: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//斗地主
        87: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//绍兴
        88: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//红中宝
        89: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000],	//血流麻将
        90: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000], //晃晃麻将
        91: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000], //梅州红中宝
        92: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000], //一痞二癞
        93: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000], //划水麻将
        94: [10, 100, 500, 1000, 5000, 10000, 50000, 100000, 200000], 		//四人断勾卡
        95: [10, 100, 500, 1000, 5000, 10000, 50000, 100000, 200000], 		//四川长牌
        96: [10, 100, 500, 1000, 5000, 10000, 50000, 100000, 200000], 		//捉鸟麻将
        99: [10, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000], //广东麻将
    }

    export const LV_SCORE =
        [
            2000, 4000, 8000, 20000, 40000, 80000, 150000, 300000, 500000, 1000000, 2000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1000000000
        ]


    export const LV_DESC = [
        "务农", "佃户", "雇工", "作坊主", "农场主", "地主", "大地主", "财主", "富翁", "大富翁", "小财神", "大财神", "赌棍", "赌侠", "赌王", "赌圣", "赌神", "职业赌神"
    ]

    export const MEMBER_FLAG = ["", "info_level_2.png", "info_level_3.png", "info_level_4.png", "info_level_5.png"]

    export const MEMBER_DESC = ["普通玩家", "蓝钻会员", "黄钻会员", "铂钻会员", "红钻会员"];

    export function getLevelDescribe(lScore: number) {
        let desc = "务农";
        for (let i = LV_DESC.length - 1; i >= 0; i--) {
            if (lScore >= LV_SCORE[i]) {
                return LV_DESC[i]
            }
        }
        return desc;
    }

    export function getMemberLv(member?: number) {
        if (member == null) {
            return 1;
        }
        if ((member == null) || (member == 0)) {
            return 1;
        } else if (member > 0 && member > 9) {
            return 2;
        } else if (member > 8 && member < 12) {
            return 3;
        } else if (member > 11 && member < 15) {
            return 4;
        }
        return 5;
    }

    export function getMemberDescribe(member) {
        return MEMBER_DESC[getMemberLv(member) - 1];
    }

    export function getExperienceLevel(exp) {
        if (exp <= 0) return 0;

        let lIncrease = 0;
        let lLevelValue = 0;

        //等级计算
        let wUserLevel = 0;

        for (let i = 1; i < 60; i++) {
            wUserLevel = i;
            lIncrease = lIncrease + i * 30;
            lLevelValue = lLevelValue + lIncrease;
            if (exp < lLevelValue)
                break

        }
        return wUserLevel;
    }

    export function getExpImgLevel(exp, maxcount) {
        let wUserLevel = df.getExperienceLevel(exp)

        const LevelVaule: number[] = [1, 5, 10];
        let lenght: number = LevelVaule.length;
        let nLevel: number = 1;
        //设置等级
        for (let i = 0; i < maxcount; i++)
            //终止判断
            if (wUserLevel == 0)
                break

        //获取索引
        for (let j = 0; j < lenght; j++) {
            if (wUserLevel >= LevelVaule[lenght - 1 - j]) {
                wUserLevel = wUserLevel - LevelVaule[lenght - 1 - j];
                nLevel = (lenght - j + 1);
                break;
            }
        }

        return nLevel = (nLevel <= 3) ? nLevel : 1;
    }

    /**
     * 站点信息
     */
    export const STATION_INFO = {

        "PLATFORM_NAME": {
            1000: "网狐",  //网狐
            1008: "西楚",  //西楚
            1029: "恩施",  //恩施
            2000: "四川",  //四川
            2004: "广安",  //广安
            2008: "浙江",  //浙江
            2009: "梅州",  //梅州
            2010: "湖北",  //湖北
            2011: "湖南",  //湖南
        },

        //低保支持
        "BaseEnsureSupport": {
            1000: true,	 //网狐
            1008: true,  //西楚
            1029: true,  //恩施
            2000: true,  //四川
            2004: true,  //广安
            2008: true,  //浙江
            2009: true,  //梅州
            2010: true,  //湖北
            2011: true,  //湖南
        },
        //实卡支持
        "RedeemCodeSupport": {
            1000: true,	 //网狐
            1008: true,  //西楚
            1029: true,  //恩施
            2000: true,  //四川
            2004: true,  //广安
            2008: true,  //浙江
            2010: true,  //湖北
            2011: true,  //湖南
        },
        //转盘支持
        "LuckyRollSupport": {
            1000: true,	 //网狐
            2008: true,  //浙江
            2009: true,  //梅州
        },
        //微信支持
        "WechatSupport": {
            1000: true,	 //网狐
            1008: true,  //西楚
            1029: true,  //恩施
            2000: true,  //四川
            2004: true,  //广安
            2008: true,  //浙江
            2009: true,  //梅州
            2010: true,  //湖北
            2011: true,  //湖南
        },
        //注册支持
        "RegistSupport": {
            1000: true,  //网狐
            1008: true,  //西楚
            2000: true,  //四川
            2009: true,  //梅州
            2010: true,  //湖北
            2011: true,  //湖南
        },
        //账号支持
        "AccountSupport": {
            1000: true,	 //网狐
            1008: true,  //西楚
            1029: true,  //恩施
            2000: true,  //四川
            2004: true,  //广安
            2008: true,  //浙江
            2009: true,  //梅州
            2010: true,  //湖北
            2011: true,  //湖南
        },
        //实物兑换支持
        "ItemSupport": {
            1000: true,	 //网狐
            1008: true,  //西楚
            2000: true,  //四川
            2004: true,  //广安
            2008: true,  //浙江
            2009: true,  //梅州
            2010: true,  //湖北
            2011: true,  //湖南
        },
        //支付宝
        "AliPaySupport": {
            1000: true,	 //网狐
            1008: true,  //西楚
            1029: true,  //恩施
            2000: true,  //四川
            2004: true,  //广安
            2008: true,  //浙江
            2009: true,  //梅州
            2010: true,  //湖北
            2011: true,  //湖南
        },
        //微信支付
        "WechatPaySupport": {
            1000: true,	 //网狐
            1008: true,  //西楚
            1029: true,  //恩施
            2000: true,  //四川
            2004: true,  //广安
            2008: true,  //浙江
            2009: true,  //梅州
            2010: true,  //湖北
            2011: true,  //湖南
        },
        //排行榜支持
        "RankSupport": {
            1000: true,	//网狐
            1008: true,	//西楚
            2009: true,	//梅州
        },
        //查看他人回放
        "OtherVedioSupport": {
            1000: true,	 //网狐
            2009: true,  //梅州
        },
        //活动支持
        "ActiveSupport": {
            1000: true,	 //网狐
            2000: true,  //四川
        },
        //比赛支持
        "MatchSupport": {
            1000: true,	  //网狐
            1008: false,  //西楚
            1029: false,  //恩施
            2000: false,  //四川
            2004: false,  //广安
            2008: false,  //浙江
            2009: false,  //梅州
            2010: false,  //湖北
            2011: false,  //湖南
        },
        //房卡充值支持
        "RoomCardSupport": {
            1000: true,	 //网狐
            1008: true,  //西楚
            1029: true,  //恩施
            2000: true,  //四川
            2004: true,  //广安
            2008: true,  //浙江
            2009: true,  //梅州
            2010: true,  //湖北
            2011: true,  //湖南
        },
        //站点支持
        "StationSupport": {
            1000: true,	//网狐
        }
    }

    /**平台支持游戏列表
     * 客户端游戏添加在此 
     * @param id         游戏类型kindid
     * @param cn         游戏名称
     * @param name       游戏名称
     * @param path       游戏目录
     * @param module     游戏模块
     * @param logic      后续微信小游戏支持
     * @param res        后续微信小游戏支持
     * @param step       后续微信小游戏支持
     * @param md5        后续微信小游戏支持
     * @param show       是否显示
     * @param sort       排序索引
     * @param model      待定    
     * @param version    后续微信小游戏支持
     */
    export const Extern_ID = 79;
    export const GAMELISTINFO =
        [
            {
                id: "1",
                cn: "五张牌",
                name: "showhand",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "7",
                cn: "庄十三张",
                name: "thirteen",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "8",
                cn: "比十三张",
                name: "thirteenbi",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "15",
                cn: "掼蛋",
                name: "guandan",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "20",
                cn: "小包子麻将",
                name: "sparrowsy",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "28",
                cn: "拼十",
                name: "ox",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "40",
                cn: "德州扑克",
                name: "dzshowhand",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                disableNormal: true,
                disableBattle: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "46",
                cn: "五张牌",
                name: "showhandex",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "52",
                cn: "转蛋",
                name: "zhuandan",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "57",
                cn: "断勾卡血战麻将",
                name: "Sparrowsclm",
                path: "chess",
                // module: game.sparrowsclm.GameClientEngine,
                group: "Sparrowsclm",
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                video: true,
                videoname: "GameClientEngineVideo",
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "60",
                cn: "丁二红",
                name: "chexuan",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "65",
                cn: "广安麻将",
                name: "sparrowga",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "67",
                cn: "衡阳麻将",
                name: "sparrowhy",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "68",
                cn: "衡阳鬼麻将",
                name: "sparrowhyg",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "82",
                cn: "血战麻将",
                name: "sparrowxz",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "86",
                cn: "癞子斗地主",
                name: "landlord",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "87",
                cn: "绍兴麻将",
                name: "sparrowsx",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "88",
                cn: "红中宝",
                name: "sparrowhzb",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "89",
                cn: "血流麻将",
                name: "sparrowxl",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "91",
                cn: "梅州红中宝",
                name: "sparrowhzb_mz",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "90",
                cn: "晃晃麻将",
                name: "sparrowhh",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "92",
                cn: "一痞二癞麻将",
                name: "sparroweslz",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "94",
                cn: "四人断勾卡",
                name: "sparrowdgk",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "55",
                cn: "四川斗地主",
                name: "landsc",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "71",
                cn: "泗阳麻将",
                name: "sparrowsiyang",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "95",
                cn: "斗十四",
                name: "platedss",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "75",
                cn: "兰州麻将",
                name: "sparrowlz",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "93",
                cn: "划水麻将",
                name: "sparrowhs",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "96",
                cn: "捉鸟麻将",
                name: "sparrowzn",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "72",
                cn: "挖坑",
                name: "wakeng",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "73",
                cn: "宿迁麻将",
                name: "sparrowsq",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "76",
                cn: "跑得快",
                name: "runfast",
                path: "recreational",
                // module: game.runfast.GameClientEngine,
                logic: "0",
                group: "RunFast",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "78",
                cn: "双扣",
                name: "shuangkou",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "81",
                cn: "昏地主",
                name: "landsch",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "98",
                cn: "打旋",
                name: "daxuan",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                disableNormal: true,
                disableBattle: false,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "79",
                cn: "牌九",
                name: "paigow",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: true,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "99",
                cn: "广东麻将",
                name: "sparrowgd",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "74",
                cn: "泗洪麻将",
                name: "sparrowsihong",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "97",
                cn: "泸州鬼麻将",
                name: "sparrowlzg",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: true,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "77",
                cn: "泸州大贰",
                name: "platedr",
                path: "recreational",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            },
            {
                id: "100",
                cn: "二人麻将",
                name: "sparrower",
                path: "chess",
                module: null,
                logic: "0",
                res: "0",
                step: false,
                md5: false,
                show: false,
                sort: 0,
                disableNormal: true,
                disableBattle: false,
                model: true,
                video: false,
                version: utils.PROCESS_VERSION(1, 1, 0, 1)
            }
        ];

    export const STATION_GAME = {
        1000: { 57: true },  //网狐
        1008: { 20: true, 28: true, 15: true, 52: true, 71: true },  //西楚
        1029: { 86: true, 28: true, 92: true },  //恩施
        2000: { 57: true, 86: true, 94: true, 82: true, 28: true, 60: true, 40: true, 55: true, 95: true, 76: true },  //四川
        2004: { 65: true, 82: true, 28: true, 0: true, 86: true },  //广安
        2008: { 87: true, 28: true, 40: true, 8: true },  //浙江
        2009: { 88: true, 86: true, 91: true, 28: true },  //梅州
        2010: { 90: true },  //湖北
        2011: { 90: true },  //湖南
        2013: { 99: true }  //惠州
    }

    export const Phrase = [
        "不要吵不要吵专心玩游戏吧。",
        "不要走，决战到天亮!",
        "大家好，很高兴见到各位。",
        "各位真是不好意思，我得离开一会儿。",
        "和你合作实在是太愉快了。",
        "快点吧，我等的花都谢了。",
        "再见啦，我会想念大家的。",
        "怎么又断线了，网络怎么这么差啊。",
    ]

    export const enum eChatType {
        PHRASE = 0,     //短语
        EXPRESSION = 1  //表情
    }

    export const PLATFORM_NAME = STATION_INFO.PLATFORM_NAME[STATION_ID]

    //低保支持
    export const BaseEnsureSupport = STATION_INFO.BaseEnsureSupport[STATION_ID]
    //实卡支持
    export const RedeemCodeSupport = STATION_INFO.RedeemCodeSupport[STATION_ID]
    //转盘支持
    export const LuckyRollSupport = STATION_INFO.LuckyRollSupport[STATION_ID]
    //排行榜支持
    export const RankSupport = STATION_INFO.RankSupport[STATION_ID]
    //查看他人回放
    export const OtherVedioSupport = STATION_INFO.OtherVedioSupport[STATION_ID]
    //微信支持
    export const WechatSupport = true
    //注册支持
    export const RegistSupport = STATION_INFO.RegistSupport[STATION_ID]
    //账号支持
    export const AccountSupport = STATION_INFO.AccountSupport[STATION_ID]
    //实物兑换支持
    export const ItemSupport = STATION_INFO.ItemSupport[STATION_ID]
    //活动支持
    export const ActiveSupport = STATION_INFO.ActiveSupport[STATION_ID]
    //比赛支持
    export const MatchSupport = STATION_INFO.MatchSupport[STATION_ID]
    //购买房卡支持
    export const RoomCardSupport = STATION_INFO.RoomCardSupport[STATION_ID]
    export const StationSupport = STATION_INFO.StationSupport[STATION_ID]
    //充值相关
    export const AliPaySupport = true
    export const WechatPaySupport = true
    export const IAPurchaseSupport = false
    //AA约战支持
    export const AABattleSupport = true
    //更多游戏
    export const MoreGameSupport = true

    export const MODE_TH_SET = 1          //茶馆约战玩法设置
    export const MODE_TH_MODIFY = 2          //茶馆约战玩法修改
    export const MODE_TH_CREATE = 3          //茶馆约战创建

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 登录信息
     */
    export const DomainGetLogon = "androidwh.foxuc.com"
    export const PortGetLogon = 8100
    export const WebAddress = "phone.foxuc.com"
    export const GameListSpecial = 2009
    export const APP_VERSION = "1.14"


    /**
     * 测试开关
     */
    export const TEST_SERVER = true;

    /**日志开关 */
    export const CONSOLE_SWITCH = true;

    /**
     * 比赛支持
     */
    export const MatchVersion = "";

    /**广场版本 */
    export const PLAZA_VERSION = utils.PROCESS_VERSION(8, 2, 0, 1);

    /**登录行为 */
    export const BEHAVIOR_LOGON_IMMEDIATELY  = 0x1000

    /**
     * 特殊日志
     */
    export const SPECIAL_LOG = false;

    /**
     * 单游戏模式  默认大厅模式
     */
    export const SINGLE_GAME_MODE = false;

    /**
     * 1自营
     * 2用于应用宝；
     */
    export const MARKET_ID = 1

    /**
     * 设备版本号
     */
    export const DEVICE_TYPE = 0x40

    /**
     * 设备来源
     */
    export const APP_SOURCE = 0x100103E8

    export const LUA_VERSION = 1.5;

    /**
     * 平台账号
     */
    export const ACCOUNT_TYPE_SELF = 1

    /**
     * 微信账号
     */
    export const ACCOUNT_TYPE_WECHAT = 7

    ////////////////////////////////////////////////////////////////////////////////////////////////
    export const US_NULL = 0x00		    //没有状态
    export const US_FREE = 0x01		    //站立状态
    export const US_SIT = 0x02	    	//坐下状态
    export const US_READY = 0x03		//同意状态
    export const US_LOOKON = 0x04		//旁观状态
    export const US_PLAYING = 0x05		//游戏状态
    export const US_OFFLINE = 0x06		//断线状态

    export const FACE_X = 48
    export const FACE_Y = 48

    export const INVALID_TABLE = 65535              //无效桌子
    export const INVALID_CHAIR = 65535              //无效椅子
    export const INVALID_ITEM = 65535

    export const GENDER_FEMALE = 1		            //女性性别
    export const GENDER_MANKIND = 2		            //男性性别
    export const GENDER_SECRET = 0 		            //保密

    export const GAME_GENRE_GOLD = 0x0001		    //金币类型
    export const GAME_GENRE_SCORE = 0x0002		    //点值类型
    export const GAME_GENRE_MATCH = 0x0004		    //比赛类型
    export const GAME_GENRE_EDUCATE = 0x0008	    //训练类型

    export const TABLE_GENRE_NORMAL = 0X0000	    //普通房间
    export const TABLE_GENRE_CREATE = 0X1000        //创建模式
    export const TABLE_GENRE_DISTRIBUTE = 0X2000    //分配模式


    export const LEN_GAME_LIST_ITEM = 142
    export const LEN_GAME_SERVER_ITEM = 236
    export const LEN_CREATE_OPTION_ITEM = 93 + 40 + 16 + 2
    export const LEN_ACCESS_ITEM = 68
    ////////////////////////////////////////////////////////////////////////////////////////////////
    //对战

    export const RFC_NULL = 0				                //无错误
    export const RFC_PASSWORD_INCORRECT = 1				    //密码错误
    export const RFC_SCORE_UNENOUGH = 3				        //游戏币不足
    export const RFC_CREATE_TABLE_FAILURE = 4				//创建失败
    export const RFC_ENTER_TABLE_FAILURE = 5				//进入失败

    export const QUERY_KIND_NUMBER = 0 			            //编号类型
    export const QUERY_KIND_USERID = 1 			            //标识类型
    export const QUERY_KIND_GROUP = 2 			            //标识类型

    export const SETTLE_KIND_TIME = 0 			            //时间结算
    export const SETTLE_KIND_COUNT = 1 			            //局数结算
    export const SETTLE_KIND_NONE = 2

    //财富掩码
    export const WEALTH_MASK_INGOT = 0x01 			        //钻石掩码
    export const WEALTH_MASK_MEDAL = 0x02 			        //奖牌掩码
    export const WEALTH_MASK_SCORE = 0x04 			        //金币掩码
    export const WEALTH_MASK_ROOMCARD = 0x08 		        //房卡掩码

    //货币类型
    export const CURRENCY_KIND_INGOT = 0				    //货币类型
    export const CURRENCY_KIND_ROOMCARD = 1				    //货币类型

    //支付类型
    export const PAY_TYPE_OWNER = 0x01                      //房主支付
    export const PAY_TYPE_USER = 0x02                       //玩家支付

    //配置掩码
    export const OPTION_MASK_TIME = 0x01			        //时间配置
    export const OPTION_MASK_COUNT = 0x02			        //局数配置
    export const OPTION_MASK_INGOT = 0x04			        //钻石配置
    export const OPTION_MASK_ROOMCARD = 0x08		        //房卡配置

    //配置类型
    export const OPTION_TYPE_NONE = 0x00 			        //无效配置
    export const OPTION_TYPE_SINGLE = 0x01  		        //单选配置
    export const OPTION_TYPE_MULTIPLE = 0x02 		        //多选配置
    export const OPTION_TYPE_INPUT = 0x04 			        //输入配置

    export const FO_FORBID_RECHARGE = 0x00000001	        //用户权限

    //解散状态
    export const DISMISS_STATE_START = 1  			        //发起解散
    export const DISMISS_STATE_OTHER = 2 			        //解散房间
    export const DISMISS_STATE_WAIT = 3 			        //等待解散
    export const DISMISS_STATE_OVER = 4 			        //解散结果

    //用户解散标识
    export const USER_DISMISS_WAIT = 1 			            //等待
    export const USER_DISMISS_REJECT = 2 			        //拒绝
    export const USER_DISMISS_AGREE = 3 			        //同意
    /////////////////////////////////////////////////////////////////////////////////////////////////

    //授权地址
    export const AUTHOR_WEB = 'http://www.foxuc.com/WXMp/H5QrCodeLogon.aspx?RawUrl=http://h5demo.foxuc.com/index.html';
    export const AUTHOR_PHONE = 'http://phone.foxuc.com/WXMp/H5WxLogon.aspx?RawUrl=http://h5demo.foxuc.com/index.html';

    //公告
    export const NOTIFY_URL = "http://service.foxuc.com/GameNotice.aspx?StationID=" + `${df.STATION_ID}` + "&TypeID=1&KindID=0"
    //常见问题
    export const QUESTION_URL = "http://service.foxuc.com/GameNotice.aspx?StationID=" + `${df.STATION_ID}` + "&TypeID=2&KindID=1"
    //比赛规则
    export const MATCHRULE_URL = "http://service.foxuc.com/GameMatch.aspx?PlazaStation=" + `${df.STATION_ID}` + "&TypeID=1&MatchID="

    /**
     * 系统时间
     */
    export function SYSTEMTIME(buffer: utils.ByteArray) {
        var struct =
            {
                wYear: buffer.Pop_WORD(),
                wMonth: buffer.Pop_WORD(),
                wDayOfWeek: buffer.Pop_WORD(),
                wDay: buffer.Pop_WORD(),
                wHour: buffer.Pop_WORD(),
                wMinute: buffer.Pop_WORD(),
                wSecond: buffer.Pop_WORD(),
                wMilliseconds: buffer.Pop_WORD()
            }

        return struct;
    }

    /**
     * 接入子项
     */
    export function tagAccessItem(buffer: utils.ByteArray) {
        var struct = {
            wAccessID: buffer.Pop_WORD(),					    //接入标识
            wServicePort: buffer.Pop_WORD(),				    //服务端口
            szServiceAddr: buffer.Pop_UTF16(LEN_SERVER)		    //服务地址
        }
        return struct
    }

    /**
     * 服务模块
     * */
    export const enum eServerModule {
        //未知类型
        SERVICE_MODULE_DEFAULT = 0,
        //接入模块
        SERVICE_MODULE_ACCESS  = 1,
        //路由模块
        SERVICE_MODULE_ROUTE = 2,
        //登录模块
        SERVICE_MODULE_LOGON = 4, //低保模块在其中
        //游戏模块
        SERVICE_MODULE_SERVER = 6
    }

    /**
     * 连接状态
     */
    export const enum eSocketStatus {
        soc_unConnect = 0,
        soc_connecting = 1,
        soc_connected = 2,
        soc_error = 3
    };

    /**
     * 对话框类型
     * @OK_CANCELL 确定和取消
     * @OK         确定
     */
    export const enum eDialogMode {
        OK_ONLY = 0,
        OK_CANCELL = 1,
    }

    /**
     * 跑马灯滚动方向
     */
    export const enum eRollMode {
        HORIZONTAL = 0,
        VERTICAL = 1
    }

    /**
     * 视图类型
     */
    export const enum eControllerKind {
        LOGON = 0,   //登录
        PLAZA = 1,   //大厅
        GAME = 2     //游戏
    }

    export const enum eShopType {
        Ingot = 0,     //充值钻石
        Gold = 1,     //购买金币
        Bank = 2,     //金币钱包
        Exchange = 3, //兑换实物
        RoomCard = 4  //购买房卡
    }

    /**银行操作 */
    export const BankOperateCode = {
        Flush: 0,
        Save: 1,
        Take: 2
    }

    /**
     * 视图索引
     */
    export const TOP_ZORDER = 1000      //顶层索引
    export const MODE_CHOOSE = 1   		//选择登录
    export const MODE_ACCOUNT = 2 		//帐号登录
    export const MODE_REGISTER = 3      //注册帐号
    export const MODE_SERVICE = 4       //服务界面
    export const MODE_OPTION = 5        //设置界面
    export const MODE_WECHAT = 6        //微信登陆
    export const MODE_STATION = 7       //站点界面
    export const MODE_NOTICE = 8        //游戏公告
    export const MODE_AGREE = 9         //注册协议  
    export const MODE_BASEENSURE = 100   //低保领取

    export const MODE_PLAZA_OPTION = 10  //大厅设置 
    export const MODE_USER_INFO = 11     //个人信息
    export const MODE_SHOP = 12          //商城界面  
    export const MODE_RANK = 13          //排行界面 
    export const MODE_BATTLE_FIND = 14   //约战查找
    export const MODE_BATTLE_LIST = 15   //约战列表
    export const MODE_BATTLE_RECORD = 16 //约战记录
    export const MODE_BENEFIT = 17       //活动界面
    export const MODE_BATTLE_CREATE = 18 //约战创建
    export const MODE_GAME_HELP = 19     //游戏规则
    export const MODE_ROOM_LIST = 20     //房间列表
    export const MODE_TAE_HOUSE = 21     //茶馆界面
    export const MODE_BATTLE_SCORE = 22; //约战成绩


    //缓存键值
    export const LocalStorageKey = {
        LOGONACCESS: "LogonAccess",     //登录信息
        WXAUTHOR: "WXAuthor",           //微信授权
        LASTLOGIN: "LastLogin",         //最近登录
        LOGONINFO: "LogonInfo",         //登录数据                 
        WXHEADURL: "WXHeadURL",         //微信头像
        MAPPEDNUM: "MappedNum",         //约战房号
        OPTION: "Option",               //设置参数
    }

    //音效地址
    export const SoundPath = "resource/assets/";

}