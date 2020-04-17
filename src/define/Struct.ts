namespace df {

    //叠加信息
    export class tagDataDescribe {
        public wDataSize;   //数据长度
        public wDataDesc;   //数据描述
        public pBuffer;     //缓冲内容

        public convertBytes() {
            let bytes = new utils.ByteArray();
            bytes.Append_WORD(this.wDataSize);
            bytes.Append_WORD(this.wDataDesc);
            bytes.Append_UTF16(this.pBuffer,Math.floor(this.wDataSize/2));
            return bytes;
        }

    }
    //用户积分
    export class tagUserScore {
        //积分信息
        public lGold;							     //用户金币
        public lScore;							     //用户分数

        //输赢信息
        public lWinCount;							//胜利盘数
        public lLostCount;							//失败盘数
        public lDrawCount;							//和局盘数
        public lFleeCount;							//逃跑盘数
        public lExperience;						    //用户经验
        public lLoveLiness;						    //用户魅力
    };

    //用户积分
    export class tagMobileUserScore {
        //积分信息
        public lGold;								//用户金币
        public lScore;								//用户分数

        //输赢信息
        public lWinCount;							//胜利盘数
        public lLostCount;							//失败盘数
        public lDrawCount;							//和局盘数
        public lFleeCount;							//逃跑盘数

        //全局信息
        public lExperience;					    	//用户经验

        onInit(buffer: utils.ByteArray) {
            this.lGold = buffer.Pop_SCORE();
            this.lScore = buffer.Pop_SCORE();

            this.lWinCount = buffer.Pop_DWORD();
            this.lLostCount = buffer.Pop_DWORD();
            this.lDrawCount = buffer.Pop_DWORD();
            this.lFleeCount = buffer.Pop_DWORD();

            this.lExperience = buffer.Pop_DWORD();
        }
    };

    //用户状态
    export class tagUserStatus {
        public wTableID;				//桌子索引
        public wChairID;				//椅子位置
        public cbUserStatus;			//用户状态
    };

    //用户段位
    export class tagUserSegment {
        public cbSegmentMode;			//段位模式
        public cbGameSegment;			//业余段位
        public cbMasterSegment;		    //网管段位
    };

    //桌子状态
    export class tagTableStatus {
        public cbTableLock;			    //锁定标志
        public cbPlayStatus;			//游戏标志
    };

    //轮次子项
    export class tagMatchRoundItem {
        public							wRoundID;							//轮次标识
        public							wPlayCount;							//游戏局数
        public							wStartCount;						//开始人数		
        public							wStartMinCount;						//开始人数		
        public							wStartMaxCount;						//开始人数		

        //比赛分数
        public							cbMScoreSetType;					//赛分方式
        public							lInitMatchScore;					//初始比分
        public							wReserveRatio;						//保留比例

        //游戏底分
        public							lMaxBaseScore;						//游戏底分
        public							lInitBaseScore;						//游戏底分
        public							cbIncreaseMode;						//增长模式
        public							wStartInning;						//起始局数
        public							wIntervalInning;					//间隔局数
        public							wIntervalSecond;					//间隔秒数
        public							wIncreaseRatio;						//增长比例		

        //晋级信息
        public							wPromoteCount;						//晋级人数
        public							cbPromoteMode;						//晋级模式
        public							cbPromoteRule:number[];				//晋级规则
    };

}