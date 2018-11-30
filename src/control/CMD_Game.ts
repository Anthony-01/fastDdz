namespace cmd {
    export namespace game {
//游戏属性
        export const KIND_ID = 76;
        export const GAME_NAME = "跑得快";

        export const GAME_PLAYER = 4;
        export const MY_VIEW = 0;                    //自己视图
        export const RIGHT_VIEW = 1;
        export const TOP_VIEW = 2;
        export const LEFT_VIEW = 3;

        //手牌参数
        export const FULL_COUNT = 40;
        export const HAND_COUNT = 10;
        export const MAX_CARD_VALUE = 14;//手牌最大权重

        //首出牌
        export const FIRST_OUT_CARD = 0x35;

        //关于游戏状态的定义？
        export const GAME_SCENE_FREE = 0;     //空闲状态
        export const GAME_SCENE_PLAY = 103;   //游戏状态

        //玩家状态
        export const USEX_NULL = 0;
        export const USEX_PLAYING = 1;
        export const USEX_DYNAMIC_JOIN = 2;

        //操作定义
        export const OPERATE_NULL = 0xFF;

        //服务端命令定义
        export const SUB_S_GAME_START = 100;   //游戏开始
        export const SUB_S_OUT_CARD = 101;     //出牌
        export const SUB_S_PASS_CARD = 102;    //过牌
        export const SUB_S_SHUT_CARD = 103;    //关牌
        export const SUB_S_START_CARD = 104;   //开始出牌
        export const SUB_S_GAME_END = 105;     //游戏结束
        export const SUB_S_PHRASE = 106;       //玩家发言
        export const SUB_S_TRUSTEE = 107;      //托管消息
        export const SUB_S_TOTAL_SCORE = 108;  //游戏结算

        //客户端命令定义
        export const SUB_C_OUT_CARD = 1;//出牌
        export const SUB_C_SHUT_CARD = 2;//关牌
        export const SUB_C_TRUSTEE = 3;//托管
        export const SUB_C_PHRASE = 4;//发言
        export const SUB_C_ALLOT_CARD_DATA = 5;//配牌数据

        export const TIME_GAME_START   	= 30;
        export const TIME_GAME_OPERATE =  20;

        //服务端牌型
        export enum SUB_S_POKER_KIND {
            CT_ERROR				=	0,//错误类型
            CT_SINGLE				=	1,//单牌类型
            CT_SINGLE_LINE          =   2,//单连类型
            CT_DOUBLE				=	3,//对牌类型
            CT_DOUBLE_LINE          =   4,//对连类型
            CT_THREE				=	5,//三条类型
            CT_THREE_LINE			=	6,//三连类型
            CT_BOMB				    =   10//炸弹类型
        }


    }
}