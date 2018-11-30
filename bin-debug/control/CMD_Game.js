var cmd;
(function (cmd) {
    var game;
    (function (game) {
        //游戏属性
        game.KIND_ID = 76;
        game.GAME_NAME = "跑得快";
        game.GAME_PLAYER = 4;
        game.MY_VIEW = 0; //自己视图
        game.RIGHT_VIEW = 1;
        game.TOP_VIEW = 2;
        game.LEFT_VIEW = 3;
        //手牌参数
        game.FULL_COUNT = 40;
        game.HAND_COUNT = 10;
        game.MAX_CARD_VALUE = 14; //手牌最大权重
        //首出牌
        game.FIRST_OUT_CARD = 0x35;
        //关于游戏状态的定义？
        game.GAME_SCENE_FREE = 0; //空闲状态
        game.GAME_SCENE_PLAY = 103; //游戏状态
        //玩家状态
        game.USEX_NULL = 0;
        game.USEX_PLAYING = 1;
        game.USEX_DYNAMIC_JOIN = 2;
        //操作定义
        game.OPERATE_NULL = 0xFF;
        //服务端命令定义
        game.SUB_S_GAME_START = 100; //游戏开始
        game.SUB_S_OUT_CARD = 101; //出牌
        game.SUB_S_PASS_CARD = 102; //过牌
        game.SUB_S_SHUT_CARD = 103; //关牌
        game.SUB_S_START_CARD = 104; //开始出牌
        game.SUB_S_GAME_END = 105; //游戏结束
        game.SUB_S_PHRASE = 106; //玩家发言
        game.SUB_S_TRUSTEE = 107; //托管消息
        game.SUB_S_TOTAL_SCORE = 108; //游戏结算
        //客户端命令定义
        game.SUB_C_OUT_CARD = 1; //出牌
        game.SUB_C_SHUT_CARD = 2; //关牌
        game.SUB_C_TRUSTEE = 3; //托管
        game.SUB_C_PHRASE = 4; //发言
        game.SUB_C_ALLOT_CARD_DATA = 5; //配牌数据
        game.TIME_GAME_START = 30;
        game.TIME_GAME_OPERATE = 20;
        //服务端牌型
        var SUB_S_POKER_KIND;
        (function (SUB_S_POKER_KIND) {
            SUB_S_POKER_KIND[SUB_S_POKER_KIND["CT_ERROR"] = 0] = "CT_ERROR";
            SUB_S_POKER_KIND[SUB_S_POKER_KIND["CT_SINGLE"] = 1] = "CT_SINGLE";
            SUB_S_POKER_KIND[SUB_S_POKER_KIND["CT_SINGLE_LINE"] = 2] = "CT_SINGLE_LINE";
            SUB_S_POKER_KIND[SUB_S_POKER_KIND["CT_DOUBLE"] = 3] = "CT_DOUBLE";
            SUB_S_POKER_KIND[SUB_S_POKER_KIND["CT_DOUBLE_LINE"] = 4] = "CT_DOUBLE_LINE";
            SUB_S_POKER_KIND[SUB_S_POKER_KIND["CT_THREE"] = 5] = "CT_THREE";
            SUB_S_POKER_KIND[SUB_S_POKER_KIND["CT_THREE_LINE"] = 6] = "CT_THREE_LINE";
            SUB_S_POKER_KIND[SUB_S_POKER_KIND["CT_BOMB"] = 10] = "CT_BOMB"; //炸弹类型
        })(SUB_S_POKER_KIND = game.SUB_S_POKER_KIND || (game.SUB_S_POKER_KIND = {}));
    })(game = cmd.game || (cmd.game = {}));
})(cmd || (cmd = {}));
