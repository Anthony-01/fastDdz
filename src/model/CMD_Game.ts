namespace cmd {
    //服务端命令定义
    // export const SUB_S_GAME_START = 100;   //游戏开始
    // export const SUB_S_OUT_CARD = 101;     //出牌
    // export const SUB_S_PASS_CARD = 102;    //过牌
    // export const SUB_S_SHUT_CARD = 103;    //关牌
    // export const SUB_S_START_CARD = 104;   //开始出牌
    // export const SUB_S_GAME_END = 105;     //游戏结束
    // export const SUB_S_PHRASE = 106;       //玩家发言
    // export const SUB_S_TRUSTEE = 107;      //托管消息
    // export const SUB_S_TOTAL_SCORE = 108;  //游戏结算
    // export const GAME_PLAYER = 4;
    export const MY_VIEW = 0;                    //自己视图
    export const RIGHT_VIEW = 1;
    export const LEFT_VIEW = 2;

    export const SUB_S_GAME_START	= 100;									//游戏函数=SUB_S_CALL_SCORE			101									//用户叫分= //游戏开始
    export const SUB_S_OUT_CARD	    = 101;									//用户出牌			101									//用户叫分= //游戏开始
    export const SUB_S_PASS_CARD	= 102;									//用户放弃
    export const SUB_S_GAME_END		= 103;									//游戏结束
    export const SUB_S_PHRASE	    = 104;								    //玩家发言
    export const SUB_S_TRUSTEE		= 105;									//用户托管
    export const SUB_S_TURN_CACULATE	= 106;								    //每轮结算

    //关于游戏状态的定义？
    export const GAME_SCENE_FREE = 0;     //空闲状态
    export const GAME_SCENE_PLAY = 101;   //空闲状态+1 游戏状态

    //客户端命令定义
    export const SUB_C_OUT_CARD = 1;//用户出牌
    export const SUB_C_PASS_CARD = 2;//用户放弃
    export const SUB_C_PHRASE = 3;//用户发言
    export const SUB_C_TRUSTEE = 4;//用户托管

    //游戏常量定义
    export const NORMAL_COUNT = 18;//玩家手牌数量
    export const GAME_PLAYER = 3;//玩家数量
    export const FULL_COUNT = 54;//扑克总数量
    export enum CARD_TYPE { //牌型枚举
        CT_ERROR				= 0	,								//错误类型
        CT_SINGLE				= 1	,								//单牌类型
        CT_DOUBLE				= 2	,								//对牌类型
        CT_THREE				= 3	,								//三条类型
        CT_SINGLE_LINE			= 4	,								//单连类型
        CT_DOUBLE_LINE			= 5	,								//对连类型
        CT_THREE_LINE			= 6	,								//三连类型
        CT_THREE_LINE_TAKE_ONE	= 7	,								//三带一单
        CT_THREE_LINE_TAKE_TWO	= 8	,								//三带一对
        CT_FOUR_LINE_TAKE_ONE	= 9	,								//四带两单
        CT_FOUR_LINE_TAKE_TWO	= 10,								//四带两对
        CT_BOMB_CARD			= 11,								//炸弹类型
        CT_MISSILE_CARD			= 12								//火箭类型
    }

    export class CMD_S_StatusFree {

        public lCellScore;//底分
        public lTurnScore: number[] = [0, 0, 0];
        public lCollectScore: number[] = [0, 0, 0];

        constructor(buffer: utils.ByteArray) {
            this.lCellScore = buffer.Pop_LONG();
            for (let i = 0; i < GAME_PLAYER; i++) {
                this.lTurnScore[i] = buffer.Pop_SCORE();
            }
            for (let i = 0; i < GAME_PLAYER; i++) {
                this.lCollectScore[i] = buffer.Pop_SCORE();
            }
        }

        onInit(buffer: utils.ByteArray) {
            this.lCellScore = buffer.Pop_LONG();
            for (let i = 0; i < GAME_PLAYER; i++) {
                this.lTurnScore[i] = buffer.Pop_SCORE();
            }
            for (let i = 0; i < GAME_PLAYER; i++) {
                this.lCollectScore[i] = buffer.Pop_SCORE();
            }
        }
    }

    export class CMD_S_StatusPlay {
        lCellScore;							//单元积分
        wBombCount;							//炸弹倍数
        wCurrentUser;						//当前玩家
        cbRemainTime;                       //剩余操作时间
        bTrustee;                           //托管标识


        wTurnWiner;							//胜利玩家
        cbTurnCardCount;					//出牌数目
        cbTurnCardData = utils.allocArray<Number>(NORMAL_COUNT, Number);		//出牌数据


        cbHandCardData = utils.allocArray<Number>(NORMAL_COUNT, Number);		//手上扑克
        cbHandCardCount = utils.allocArray<Number>(GAME_PLAYER, Number);		//扑克数目


        lTurnScore = utils.allocArray<Number>(GAME_PLAYER, Number);			//积分信息
        lCollectScore = utils.allocArray<Number>(GAME_PLAYER, Number);			//积分信息

        constructor(buffer: utils.ByteArray) {
            this.lCellScore = buffer.Pop_LONG();
            this.wBombCount = buffer.Pop_WORD();
            this.wCurrentUser = buffer.Pop_WORD();
            this.cbRemainTime = buffer.Pop_Byte();
            this.bTrustee = buffer.Pop_BOOL();
            this.wTurnWiner = buffer.Pop_WORD();
            this.cbTurnCardCount = buffer.Pop_Byte();
            for (let n = 0; n < NORMAL_COUNT; n++) {
                this.cbTurnCardData[n] = buffer.Pop_Byte();
            }
            for (let n = 0; n < NORMAL_COUNT; n++) {
                this.cbHandCardData[n] = buffer.Pop_Byte();
            }
            for (let n = 0; n < GAME_PLAYER; n++) {
                this.cbHandCardCount[n] = buffer.Pop_Byte();
            }
            for (let n = 0; n < GAME_PLAYER; n++) {
                this.lTurnScore[n] = buffer.Pop_LONGLONG();
            }
            for (let n = 0; n < GAME_PLAYER; n++) {
                this.lCollectScore[n] = buffer.Pop_LONGLONG();
            }
        }

    }

    //发送扑克
    export class CMD_S_GameStart {
        wCurrentUser;						//当前玩家
        wStartChairId;						//开始发牌玩家
        cbValidCardData;					//明牌
        cbValidCardIndex;					//明牌位置
        cbCardData = utils.allocArray<Number>(NORMAL_COUNT, Number);			//扑克列表

        onInit(buffer: utils.ByteArray) {
            this.wCurrentUser = buffer.Pop_WORD();
            this.wStartChairId = buffer.Pop_WORD();
            this.cbValidCardData = buffer.Pop_Byte();
            this.cbValidCardIndex = buffer.Pop_Byte();
            for(let n = 0; n < NORMAL_COUNT; n++) {
                this.cbCardData[n] = buffer.Pop_Byte();
            }
        }
    }

    //用户出牌
    export class CMD_S_OutCard {
        cbCardCount;						//出牌数目
        wCurrentUser;						//当前玩家
        wOutCardUser;						//出牌玩家
        cbCardData = utils.allocArray<Number>(NORMAL_COUNT, Number);				//扑克列表

        constructor(buffer: utils.ByteArray) {
            this.cbCardCount = buffer.Pop_Byte();
            this.wCurrentUser = buffer.Pop_WORD();
            this.wOutCardUser = buffer.Pop_WORD();
            for (let n = 0; n < this.cbCardCount; n++) {
                this.cbCardData[n] = buffer.Pop_Byte();
            }
        }
    }

    //放弃出牌
    export class CMD_S_PassCard {
        cbTurnOver;							//一轮结束
        wCurrentUser;						//当前玩家
        wPassCardUser;						//放弃玩家
        cbBoomCount;                        //本轮炸弹数
        cbUserScore = utils.allocArray<Number>(GAME_PLAYER, Number);			//分数变化

        constructor() {
            // this.cbTurnOver = buffer.Pop_Byte();
            // this.wCurrentUser = buffer.Pop_WORD();
            // this.wPassCardUser = buffer.Pop_WORD();
            // this.cbBoomCount = buffer.
        }

        onInit(buffer: utils.ByteArray) {
            this.cbTurnOver = buffer.Pop_Byte();
            this.wCurrentUser = buffer.Pop_WORD();
            this.wPassCardUser = buffer.Pop_WORD();
        }
    }

    //游戏结束
    export class CMD_S_GameEnd {
        //游戏信息
        cbBombCount = utils.allocArray<Number>(GAME_PLAYER, Number);   //出炸弹个数
        cbBombWin = utils.allocArray<Number>(GAME_PLAYER, Number);    //炸赢的数目
        cbBombLose = utils.allocArray<Number>(GAME_PLAYER, Number);
        // wBombCount = utils.allocArray<Number>(GAME_PLAYER, Number);			//炸弹个数
        cbCardCount = utils.allocArray<Number>(GAME_PLAYER, Number);			//扑克数目
        cbHandCardData = utils.allocArray<Number>(FULL_COUNT, Number);			//扑克列表

        //积分变量
        lCellScore;							//单元积分
        lGameScore = utils.allocArray<Number>(GAME_PLAYER, Number);			//游戏积分

        constructor(buffer: utils.ByteArray) {
            for(let n = 0; n < GAME_PLAYER; n++) {
                this.cbBombCount[n] = buffer.Pop_Byte();
            }
            for(let n = 0; n < GAME_PLAYER; n++) {
                this.cbBombWin[n] = buffer.Pop_Byte();
            }
            for(let n = 0; n < GAME_PLAYER; n++) {
                this.cbBombLose[n] = buffer.Pop_Byte();
            }
            for(let n = 0; n < GAME_PLAYER; n++) {
                this.cbCardCount[n] = buffer.Pop_Byte();
            }
            for(let n = 0; n < FULL_COUNT; n++) {
                this.cbHandCardData[n] = buffer.Pop_Byte();
            }
            this.lCellScore = buffer.Pop_LONG();
            for(let n = 0; n < GAME_PLAYER; n++) {
                this.lGameScore[n] = buffer.Pop_LONGLONG();
            }
        }
    }

    //玩家发言
    export class CMD_S_Phrase {
        wPhraseUser;						//发言玩家
        nPhraseIndex;						//发言索引
    }

    export class CMD_S_Trustee {
        bTrustee;							//是否托管
        constructor(buffer: utils.ByteArray) {
            this.bTrustee = buffer.Pop_BOOL();
        }
    }

    export class CMD_S_Turn_Caculate {
        lTurnScore;

        constructor() {
            this.lTurnScore = utils.allocArray<Number>(GAME_PLAYER, Number);
        }

        onInit(buffer: utils.ByteArray) {
            utils.GameConst.colorConsole(GAME_PLAYER + "");
            for (let n = 0; n < GAME_PLAYER; n++) {
                this.lTurnScore[n] = buffer.Pop_LONGLONG();
            }
        }
    }
}