var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var cmd;
(function (cmd) {
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
    cmd.MY_VIEW = 0; //自己视图
    cmd.RIGHT_VIEW = 1;
    cmd.LEFT_VIEW = 2;
    cmd.SUB_S_GAME_START = 100; //游戏函数=SUB_S_CALL_SCORE			101									//用户叫分= //游戏开始
    cmd.SUB_S_OUT_CARD = 101; //用户出牌			101									//用户叫分= //游戏开始
    cmd.SUB_S_PASS_CARD = 102; //用户放弃
    cmd.SUB_S_GAME_END = 103; //游戏结束
    cmd.SUB_S_PHRASE = 104; //玩家发言
    cmd.SUB_S_TRUSTEE = 105; //用户托管
    cmd.SUB_S_TURN_CACULATE = 106; //每轮结算
    //关于游戏状态的定义？
    cmd.GAME_SCENE_FREE = 0; //空闲状态
    cmd.GAME_SCENE_PLAY = 101; //空闲状态+1 游戏状态
    //客户端命令定义
    cmd.SUB_C_OUT_CARD = 1; //用户出牌
    cmd.SUB_C_PASS_CARD = 2; //用户放弃
    cmd.SUB_C_PHRASE = 3; //用户发言
    cmd.SUB_C_TRUSTEE = 4; //用户托管
    //游戏常量定义
    cmd.NORMAL_COUNT = 18; //玩家手牌数量
    cmd.GAME_PLAYER = 3; //玩家数量
    cmd.FULL_COUNT = 54; //扑克总数量
    var CARD_TYPE;
    (function (CARD_TYPE) {
        CARD_TYPE[CARD_TYPE["CT_ERROR"] = 0] = "CT_ERROR";
        CARD_TYPE[CARD_TYPE["CT_SINGLE"] = 1] = "CT_SINGLE";
        CARD_TYPE[CARD_TYPE["CT_DOUBLE"] = 2] = "CT_DOUBLE";
        CARD_TYPE[CARD_TYPE["CT_THREE"] = 3] = "CT_THREE";
        CARD_TYPE[CARD_TYPE["CT_SINGLE_LINE"] = 4] = "CT_SINGLE_LINE";
        CARD_TYPE[CARD_TYPE["CT_DOUBLE_LINE"] = 5] = "CT_DOUBLE_LINE";
        CARD_TYPE[CARD_TYPE["CT_THREE_LINE"] = 6] = "CT_THREE_LINE";
        CARD_TYPE[CARD_TYPE["CT_THREE_LINE_TAKE_ONE"] = 7] = "CT_THREE_LINE_TAKE_ONE";
        CARD_TYPE[CARD_TYPE["CT_THREE_LINE_TAKE_TWO"] = 8] = "CT_THREE_LINE_TAKE_TWO";
        CARD_TYPE[CARD_TYPE["CT_FOUR_LINE_TAKE_ONE"] = 9] = "CT_FOUR_LINE_TAKE_ONE";
        CARD_TYPE[CARD_TYPE["CT_FOUR_LINE_TAKE_TWO"] = 10] = "CT_FOUR_LINE_TAKE_TWO";
        CARD_TYPE[CARD_TYPE["CT_BOMB_CARD"] = 11] = "CT_BOMB_CARD";
        CARD_TYPE[CARD_TYPE["CT_MISSILE_CARD"] = 12] = "CT_MISSILE_CARD"; //火箭类型
    })(CARD_TYPE = cmd.CARD_TYPE || (cmd.CARD_TYPE = {}));
    var CMD_S_StatusFree = (function () {
        function CMD_S_StatusFree(buffer) {
            this.lTurnScore = [0, 0, 0];
            this.lCollectScore = [0, 0, 0];
            this.lCellScore = buffer.Pop_LONG();
            for (var i = 0; i < cmd.GAME_PLAYER; i++) {
                this.lTurnScore[i] = buffer.Pop_SCORE();
            }
            for (var i = 0; i < cmd.GAME_PLAYER; i++) {
                this.lCollectScore[i] = buffer.Pop_SCORE();
            }
        }
        CMD_S_StatusFree.prototype.onInit = function (buffer) {
            this.lCellScore = buffer.Pop_LONG();
            for (var i = 0; i < cmd.GAME_PLAYER; i++) {
                this.lTurnScore[i] = buffer.Pop_SCORE();
            }
            for (var i = 0; i < cmd.GAME_PLAYER; i++) {
                this.lCollectScore[i] = buffer.Pop_SCORE();
            }
        };
        return CMD_S_StatusFree;
    }());
    cmd.CMD_S_StatusFree = CMD_S_StatusFree;
    __reflect(CMD_S_StatusFree.prototype, "cmd.CMD_S_StatusFree");
    var CMD_S_StatusPlay = (function () {
        function CMD_S_StatusPlay(buffer) {
            this.cbTurnCardData = utils.allocArray(cmd.NORMAL_COUNT, Number); //出牌数据
            this.cbHandCardData = utils.allocArray(cmd.NORMAL_COUNT, Number); //手上扑克
            this.cbHandCardCount = utils.allocArray(cmd.GAME_PLAYER, Number); //扑克数目
            this.lTurnScore = utils.allocArray(cmd.GAME_PLAYER, Number); //积分信息
            this.lCollectScore = utils.allocArray(cmd.GAME_PLAYER, Number); //积分信息
            this.lCellScore = buffer.Pop_LONG();
            this.wBombCount = buffer.Pop_WORD();
            this.wCurrentUser = buffer.Pop_WORD();
            this.cbRemainTime = buffer.Pop_Byte();
            this.bTrustee = buffer.Pop_BOOL();
            this.wTurnWiner = buffer.Pop_WORD();
            this.cbTurnCardCount = buffer.Pop_Byte();
            for (var n = 0; n < cmd.NORMAL_COUNT; n++) {
                this.cbTurnCardData[n] = buffer.Pop_Byte();
            }
            for (var n = 0; n < cmd.NORMAL_COUNT; n++) {
                this.cbHandCardData[n] = buffer.Pop_Byte();
            }
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                this.cbHandCardCount[n] = buffer.Pop_Byte();
            }
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                this.lTurnScore[n] = buffer.Pop_LONGLONG();
            }
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                this.lCollectScore[n] = buffer.Pop_LONGLONG();
            }
        }
        return CMD_S_StatusPlay;
    }());
    cmd.CMD_S_StatusPlay = CMD_S_StatusPlay;
    __reflect(CMD_S_StatusPlay.prototype, "cmd.CMD_S_StatusPlay");
    //发送扑克
    var CMD_S_GameStart = (function () {
        function CMD_S_GameStart() {
            this.cbCardData = utils.allocArray(cmd.NORMAL_COUNT, Number); //扑克列表
        }
        CMD_S_GameStart.prototype.onInit = function (buffer) {
            this.wCurrentUser = buffer.Pop_WORD();
            this.wStartChairId = buffer.Pop_WORD();
            this.cbValidCardData = buffer.Pop_Byte();
            this.cbValidCardIndex = buffer.Pop_Byte();
            for (var n = 0; n < cmd.NORMAL_COUNT; n++) {
                this.cbCardData[n] = buffer.Pop_Byte();
            }
        };
        return CMD_S_GameStart;
    }());
    cmd.CMD_S_GameStart = CMD_S_GameStart;
    __reflect(CMD_S_GameStart.prototype, "cmd.CMD_S_GameStart");
    //用户出牌
    var CMD_S_OutCard = (function () {
        function CMD_S_OutCard(buffer) {
            this.cbCardData = utils.allocArray(cmd.NORMAL_COUNT, Number); //扑克列表
            this.cbCardCount = buffer.Pop_Byte();
            this.wCurrentUser = buffer.Pop_WORD();
            this.wOutCardUser = buffer.Pop_WORD();
            for (var n = 0; n < this.cbCardCount; n++) {
                this.cbCardData[n] = buffer.Pop_Byte();
            }
        }
        return CMD_S_OutCard;
    }());
    cmd.CMD_S_OutCard = CMD_S_OutCard;
    __reflect(CMD_S_OutCard.prototype, "cmd.CMD_S_OutCard");
    //放弃出牌
    var CMD_S_PassCard = (function () {
        function CMD_S_PassCard() {
            this.cbUserScore = utils.allocArray(cmd.GAME_PLAYER, Number); //分数变化
            // this.cbTurnOver = buffer.Pop_Byte();
            // this.wCurrentUser = buffer.Pop_WORD();
            // this.wPassCardUser = buffer.Pop_WORD();
            // this.cbBoomCount = buffer.
        }
        CMD_S_PassCard.prototype.onInit = function (buffer) {
            this.cbTurnOver = buffer.Pop_Byte();
            this.wCurrentUser = buffer.Pop_WORD();
            this.wPassCardUser = buffer.Pop_WORD();
        };
        return CMD_S_PassCard;
    }());
    cmd.CMD_S_PassCard = CMD_S_PassCard;
    __reflect(CMD_S_PassCard.prototype, "cmd.CMD_S_PassCard");
    //游戏结束
    var CMD_S_GameEnd = (function () {
        function CMD_S_GameEnd(buffer) {
            //游戏信息
            this.cbBombCount = utils.allocArray(cmd.GAME_PLAYER, Number); //出炸弹个数
            this.cbBombWin = utils.allocArray(cmd.GAME_PLAYER, Number); //炸赢的数目
            this.cbBombLose = utils.allocArray(cmd.GAME_PLAYER, Number);
            // wBombCount = utils.allocArray<Number>(GAME_PLAYER, Number);			//炸弹个数
            this.cbCardCount = utils.allocArray(cmd.GAME_PLAYER, Number); //扑克数目
            this.cbHandCardData = utils.allocArray(cmd.FULL_COUNT, Number); //扑克列表
            this.lGameScore = utils.allocArray(cmd.GAME_PLAYER, Number); //游戏积分
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                this.cbBombCount[n] = buffer.Pop_Byte();
            }
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                this.cbBombWin[n] = buffer.Pop_Byte();
            }
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                this.cbBombLose[n] = buffer.Pop_Byte();
            }
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                this.cbCardCount[n] = buffer.Pop_Byte();
            }
            for (var n = 0; n < cmd.FULL_COUNT; n++) {
                this.cbHandCardData[n] = buffer.Pop_Byte();
            }
            this.lCellScore = buffer.Pop_LONG();
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                this.lGameScore[n] = buffer.Pop_LONGLONG();
            }
        }
        return CMD_S_GameEnd;
    }());
    cmd.CMD_S_GameEnd = CMD_S_GameEnd;
    __reflect(CMD_S_GameEnd.prototype, "cmd.CMD_S_GameEnd");
    //玩家发言
    var CMD_S_Phrase = (function () {
        function CMD_S_Phrase() {
        }
        return CMD_S_Phrase;
    }());
    cmd.CMD_S_Phrase = CMD_S_Phrase;
    __reflect(CMD_S_Phrase.prototype, "cmd.CMD_S_Phrase");
    var CMD_S_Trustee = (function () {
        function CMD_S_Trustee(buffer) {
            this.bTrustee = buffer.Pop_BOOL();
        }
        return CMD_S_Trustee;
    }());
    cmd.CMD_S_Trustee = CMD_S_Trustee;
    __reflect(CMD_S_Trustee.prototype, "cmd.CMD_S_Trustee");
    var CMD_S_Turn_Caculate = (function () {
        function CMD_S_Turn_Caculate() {
            this.lTurnScore = utils.allocArray(cmd.GAME_PLAYER, Number);
        }
        CMD_S_Turn_Caculate.prototype.onInit = function (buffer) {
            utils.GameConst.colorConsole(cmd.GAME_PLAYER + "");
            for (var n = 0; n < cmd.GAME_PLAYER; n++) {
                this.lTurnScore[n] = buffer.Pop_LONGLONG();
            }
        };
        return CMD_S_Turn_Caculate;
    }());
    cmd.CMD_S_Turn_Caculate = CMD_S_Turn_Caculate;
    __reflect(CMD_S_Turn_Caculate.prototype, "cmd.CMD_S_Turn_Caculate");
})(cmd || (cmd = {}));
