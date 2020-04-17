namespace game {

    const CB_CARD_DATA = [
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,  //方块 A - K
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,  //梅花 A - K
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,  //红桃 A - K
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D,  //黑桃 A - K
        0x4E, 0x4F
    ];

    interface ILogicContainer {
        [key: number]: number
    }

    /**
     * 出牌牌型枚举
     * */
    export enum ECardType {
        CT_ERROR = 0,								//错误类型
        CT_SINGLE = 1,								//单牌类型
        CT_DOUBLE = 2,								//对牌类型
        CT_THREE = 3,								//三条类型
        CT_SINGLE_LINE = 4,							//单连类型
        CT_DOUBLE_LINE = 5,							//对连类型
        CT_THREE_LINE = 6,							//三连类型（飞机）
        CT_THREE_LINE_TAKE_ONE = 7,					//三带一单
        CT_THREE_LINE_TAKE_TWO = 8,					//三带一对
        CT_FOUR_LINE_TAKE_ONE = 9,					//四带两单
        CT_FOUR_LINE_TAKE_TWO = 10,					//四带两对
        CT_BOMB_CARD = 11,							//炸弹类型
        CT_MISSILE_CARD = 12						//火箭类型
    }

    /**
     * 出牌数据
     * */
    export interface IPresentData {
        //牌列表
        cards?: number[];
        //牌型
        cardType?: ECardType;
    }

    /**
     * 牌数分析数据接口
     * */
    export interface IAnalyseResult extends IPresentData {
        /**
         * 对应cbCardData下数组的长度
         * */
        cbBlockCount?: number[];  //扑克数目 0：单牌数目、1：对牌数目、2：三条数目、3：四张数目
        /**
         * 一维对应等值数量，一维下的数组保存的是所有等值的牌值
         * */
        cbCardData?: number[][];  //扑克数据 0：单牌对应的绝对值、1：对牌对应的绝对值、2：三条对应牌的绝对值、3：四张对应的牌绝对值
        /**
         * 主起始逻辑值
         * */
        startWeight?: number;
    }

    /**
     * 顺子牌数据接口
     * */
    interface ILine {
        //起始牌值，相当于权重
        startWeight: number;
        //顺子长度
        length: number;
        //顺子元素表，每个元素是逻辑值相同的集合
        values: IPresentData[];
    }

    export class GameLogic {

        /**
         * 出牌验证
         * */
        assertPresent(toAssert: IPresentData, lastPresent?: IPresentData): boolean {
            if (lastPresent === undefined || lastPresent.cards.length == 0) {
                //第一个出牌
                if (!toAssert.cardType) {
                    this.analyseCardKind(toAssert);
                }
                return toAssert.cardType != ECardType.CT_ERROR;
            }
            //出牌比较
            return this.comparePresent(lastPresent, toAssert);
        }

        /**
         * 搜索
         * 搜索所有可出的牌组合
         * 根据上一个出的牌型，检测自己的手牌，返回能出的牌组
         * */
        searchForPresent(cards: number[], lastPresent?: IPresentData): IPresentData[] {
            cards.sort((a, b) => this.getWeight(b) - this.getWeight(a));//排序，
            //
            if (lastPresent === undefined) {
                //第一个出牌
                return this.searchFirstPresent(cards);
            }
            //以前一个出牌为参照做提示
            return this.searchFollowOut(lastPresent, cards);
        }

        /**
         * 出牌排序
         * */
        sortOutCards(cards: number[]): number[] {
            let cbCardDataTemp = cards.concat().sort((a, b) => this.getWeight(b) - this.getWeight(a));
            let cbType = this.analyseCardKind({cards: cbCardDataTemp.concat()});

            let analyseResult: IAnalyseResult = {
                cards: cbCardDataTemp.concat()
            };

            this.analyseCardKind(analyseResult);
            let cbCardData = [] = cbCardDataTemp.concat();
            if (analyseResult.cbBlockCount[3] > 0 && cards.length <= 8) {
                let cbIndex = 0;
                for (let i = 0; i < analyseResult.cbBlockCount[3]; i++) {
                    cbCardData[cbIndex] = analyseResult.cbCardData[3][4 * i];
                    cbCardData[cbIndex + 1] = analyseResult.cbCardData[3][4 * i + 1];
                    cbCardData[cbIndex + 2] = analyseResult.cbCardData[3][4 * i + 2];
                    cbCardData[cbIndex + 3] = analyseResult.cbCardData[3][4 * i + 3];
                    cbIndex += 4;
                }
                if (analyseResult.cbBlockCount[3] == 1) {
                    let cbLogicValue = this.getWeight(analyseResult.cbCardData[3][0]);
                    for (let i = 0; i < cards.length; i++) {
                        // cbCardData[cbIndex++] =
                        if (cbLogicValue == this.getWeight(cbCardDataTemp[i])) continue;
                        cbCardData[cbIndex ++] = cbCardDataTemp[i]
                    }
                }
            }

            if (analyseResult.cbBlockCount[2] > 0) {
                //let cbLogicCount[LOGIC_COUNT]   LOGIC_COUNT常量？
                let cbLogicCount: ILogicContainer = {};
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < analyseResult.cbBlockCount[i]; j++) {
                        cbLogicCount[this.getWeight(analyseResult.cbCardData[i][j * (i + 1)])] = i + 1;
                    }
                }

                let cbMostLength = 0;
                let cbLogicRecord = 0;

                let cbLogicCountAssit = 4;
                if (cbCardDataTemp.length % 5 == 0) cbLogicCountAssit = 0x0F;
                for (let i = 3; i < 15; i++) {
                    if (cbLogicCount[i] == 3 || cbLogicCount[i] == cbLogicCountAssit) {
                        let cbTempCount = 1;
                        for (let j = i + 1; j < 15; j++) {
                            if (cbLogicCount[j] == 3 || cbLogicCount[j] == cbLogicCountAssit)
                                cbTempCount ++;
                            else
                                break;
                        }
                        if (cbTempCount > cbMostLength) {
                            cbMostLength = cbTempCount;
                            cbLogicRecord = i;
                        }
                    }
                }

                if (cbLogicCount[15] >= 3 && cbMostLength == 0) {
                    cbMostLength = 1;
                    cbLogicRecord = 15;
                }

                let cbPlaneIndex = 0;
                let cbWingIndex = 3 * cbMostLength;

                for (let i =0; i < cbCardDataTemp.length;) {
                    let cbLogicValue = this.getWeight(cbCardDataTemp[i]);
                    if (cbLogicValue >= cbLogicRecord && cbLogicValue <= cbLogicRecord + cbMostLength - 1) {
                        cbCardData[cbPlaneIndex] = cbCardDataTemp[i];
                        cbCardData[cbPlaneIndex + 1] = cbCardDataTemp[i + 1];
                        cbCardData[cbPlaneIndex + 2] = cbCardDataTemp[i + 2];
                        cbPlaneIndex +=3;
                        i +=3;
                        if (cbLogicCount[cbLogicValue] == 4)
                            cbCardData[cbWingIndex++] = cbCardDataTemp[i++];
                    } else {
                        cbCardData[cbWingIndex++] = cbCardDataTemp[i++];
                    }
                }

            }

            return cbCardData;
        }


        public comparePresent(last: IAnalyseResult, current: IAnalyseResult): boolean {
            if (!last) {
                return false;
            }
            if (!last.cardType) {
                this.analyseCardKind(last);//牌型
            }
            if (last.cardType == ECardType.CT_ERROR) {
                throw new Error();
            }
            if (!current.cardType) {
                this.analyseCardKind(current);
            }
            //类型判断
            if (current.cardType == ECardType.CT_ERROR) {
                return false;
            }
            if (current.cardType == ECardType.CT_MISSILE_CARD) return true;
            //炸弹判断
            if ((last.cardType != ECardType.CT_BOMB_CARD) && (current.cardType == ECardType.CT_BOMB_CARD)) {
                return true;
            }
            if ((last.cardType == ECardType.CT_BOMB_CARD) && (current.cardType != ECardType.CT_BOMB_CARD)) {
                return false;
            }
            //类型对比+长度对比
            if ((last.cardType != current.cardType) || (last.cards.length != current.cards.length)) {
                return false;
            }
            //开始对比
            switch (current.cardType) { //长度相等、类型相同的情况下 比较startWeight;
                case ECardType.CT_SINGLE:
                case ECardType.CT_DOUBLE:
                case ECardType.CT_THREE:
                case ECardType.CT_SINGLE_LINE:
                case ECardType.CT_DOUBLE_LINE:
                case ECardType.CT_THREE_LINE:
                case ECardType.CT_THREE_LINE_TAKE_ONE:
                case ECardType.CT_THREE_LINE_TAKE_TWO:
                case ECardType.CT_FOUR_LINE_TAKE_ONE:
                case ECardType.CT_FOUR_LINE_TAKE_TWO:
                case ECardType.CT_BOMB_CARD: {
                    return current.startWeight > last.startWeight;
                }
            }
            return false;
        }

        public analyseCardKind(analyseResult: IAnalyseResult): ECardType {
            //基础分析
            this.analyseBase(analyseResult);
            //牌列表
            let cards = analyseResult.cards;
            //牌长度
            let cbCardCount = cards.length;
            //简单牌型
            switch (cbCardCount) {
                case 0: { //空牌
                    return analyseResult.cardType = ECardType.CT_ERROR;
                }
                case 1: { //单牌
                    analyseResult.startWeight = this.getWeight(cards[0]);
                    return analyseResult.cardType = ECardType.CT_SINGLE;
                }
                case 2: {
                    let firstWeight = this.getWeight(cards[0]);
                    let secondWeight = this.getWeight(cards[1]);
                    if (cards[0] == 0x4F && cards[1] == 0x4E) {
                        return analyseResult.cardType = ECardType.CT_MISSILE_CARD;
                    }
                    if (firstWeight == secondWeight) {
                        analyseResult.startWeight = firstWeight;
                        return analyseResult.cardType = ECardType.CT_DOUBLE;
                    }
                    return analyseResult.cardType = ECardType.CT_ERROR;
                }
            }
            //四牌判断
            if (analyseResult.cbBlockCount[3] > 0) {
                //牌型判断
                analyseResult.startWeight = this.getWeight(analyseResult.cbCardData[3][0]);
                if ((analyseResult.cbBlockCount[3] == 1) && (cbCardCount == 4)) return analyseResult.cardType = ECardType.CT_BOMB_CARD;
                if ((analyseResult.cbBlockCount[3] == 1) && (cbCardCount == 6)) return analyseResult.cardType = ECardType.CT_FOUR_LINE_TAKE_ONE;
                if(cbCardCount == 8 && (analyseResult.cbBlockCount[3] == 2&& this.getWeight(analyseResult.cards[2])!= this.getWeight(analyseResult.cards[3])))
                    return  analyseResult.cardType = ECardType.CT_THREE_LINE_TAKE_ONE;
                if (cbCardCount == 8 && (analyseResult.cbBlockCount[3] == 2 || (analyseResult.cbBlockCount[3] == 1 && analyseResult.cbBlockCount[1] == 2)))
                    return analyseResult.cardType = ECardType.CT_FOUR_LINE_TAKE_TWO;
                // return analyseResult.cardType = ECardType.CT_ERROR;
            }
            //三牌判断
            if (analyseResult.cbBlockCount[2] > 0 || analyseResult.cbBlockCount[3]>2) {
                analyseResult.startWeight = this.getWeight(analyseResult.cbCardData[2][0]);
                //错误类型
                if (cbCardCount % 3 != 0 && cbCardCount % 4 != 0 && cbCardCount % 5 != 0)
                    return analyseResult.cardType = ECardType.CT_ERROR;
                //3张
                if (cbCardCount == 3) return analyseResult.cardType = ECardType.CT_THREE;
                let cbWeightCount: { [key: number]: number } = {};
                for (let n = 0; n < 4; n++) {
                    for (let j = 0; j < analyseResult.cbBlockCount[n]; j++) {
                        cbWeightCount[this.getWeight(analyseResult.cbCardData[n][j * (n + 1)])] = n + 1;
                    }
                }
                let cbMostLength = 0;
                for (let i = 3; i < 15; i++) {
                    if (cbWeightCount[i] >= 3) {
                        let cbTempCount = 1;
                        for (let j = i + 1; j < cmd.NORMAL_COUNT; j++) {
                            if (cbWeightCount[j] >= 3) {
                                cbTempCount++;
                            } else {
                                break;
                            }
                        }
                        if (cbTempCount > cbMostLength) {
                            cbMostLength = cbTempCount;
                        }
                    }
                }

                if (cbWeightCount[16] >= 3 && cbMostLength == 0)
                    cbMostLength = 1;
                //三连
                if (cbCardCount % 3 == 0 && cbCardCount / 3 == cbMostLength) return analyseResult.cardType = ECardType.CT_THREE_LINE;
                //三带一
                if (cbCardCount % 4 == 0 && cbCardCount / 4 <= cbMostLength) return analyseResult.cardType = ECardType.CT_THREE_LINE_TAKE_ONE;
                //3带2
                if (cbCardCount % 5 == 0 && cbCardCount / 5 <= cbMostLength) {
                    //统计只由3牌组成的连长
                    let cbCardData = analyseResult.cbCardData[2][0];
                    let cbFirstLogicValue = this.getWeight(cbCardData);
                    let cbTripleLineCount = 0;
                    for (let i = 0; i < analyseResult.cbBlockCount[2]; i++) {
                        let cbCardData = analyseResult.cbCardData[2][i * 3];
                        cbTripleLineCount++;
                        if (cbFirstLogicValue != (this.getWeight(cbCardData) + i)) return analyseResult.cardType = ECardType.CT_ERROR;
                    }
                    let cbPairCount = analyseResult.cbBlockCount[1] + analyseResult.cbBlockCount[3] * 2;
                    if (cbCardCount / 5 == cbTripleLineCount && cbCardCount / 5 == cbPairCount)
                        return analyseResult.cardType = ECardType.CT_THREE_LINE_TAKE_TWO;
                }
                return analyseResult.cardType = ECardType.CT_ERROR;

                // if (analyseResult.cbBlockCount[2] > 1) {
                //     let cbCardData = analyseResult.cbCardData[2][0];
                //     let cbFirstWeight = this.getWeight(cbCardData);
                //     if (cbFirstWeight >= 15) return analyseResult.cardType = ECardType.CT_ERROR;
                //     //连牌判断
                //     for (let i = 1; i < analyseResult.cbBlockCount[2]; i++) {
                //         let cbCardData = analyseResult.cbCardData[2][i * 3];
                //         if (cbFirstWeight != (this.getWeight(cbCardData) + i)) return analyseResult.cardType = ECardType.CT_ERROR;
                //     }
                // } else if (cbCardCount == 3) {
                //     analyseResult.cardType = analyseResult.cardType = ECardType.CT_THREE;
                // }
                // //牌形判断
                // if (analyseResult.cbBlockCount[2] * 3 == cbCardCount) return analyseResult.cardType = ECardType.CT_THREE_LINE;
                // if (analyseResult.cbBlockCount[2] * 4 == cbCardCount) return analyseResult.cardType = ECardType.CT_THREE_LINE_TAKE_ONE;
                // if ((analyseResult.cbBlockCount[2] * 5 == cbCardCount) && (analyseResult.cbBlockCount[1] == analyseResult.cbBlockCount[2])) return analyseResult.cardType = ECardType.CT_THREE_LINE_TAKE_TWO;
                // return analyseResult.cardType = ECardType.CT_ERROR;
            }
            //两张类型
            if (analyseResult.cbBlockCount[1] >= 3) {
                let cbCardData = analyseResult.cbCardData[1][0];
                analyseResult.startWeight = this.getWeight(cbCardData);
                let cbFirstLogicValue = this.getWeight(cbCardData);

                if (cbFirstLogicValue > 15) return analyseResult.cardType = ECardType.CT_ERROR;

                //连牌判断
                for (let i = 1; i < analyseResult.cbBlockCount[1]; i++) {
                    let cbCardData = analyseResult.cbCardData[1][i*2];
                    if (cbFirstLogicValue!=(this.getWeight(cbCardData) + i)) return analyseResult.cardType = ECardType.CT_ERROR;
                }
                if (analyseResult.cbBlockCount[1] * 2 ==cbCardCount) return analyseResult.cardType = ECardType.CT_DOUBLE_LINE;

            }
            //单张判断
            if (analyseResult.cbBlockCount[0] >= 5 && analyseResult.cbBlockCount[0] == cbCardCount) {
                let cbCardData = analyseResult.cbCardData[0][0];
                analyseResult.startWeight = this.getWeight(cbCardData);
                let cbFirstWeight = this.getWeight(cbCardData);

                if(cbFirstWeight > 15) return analyseResult.cardType = ECardType.CT_ERROR;
                //连牌判断
                for (let i = 0; i < analyseResult.cbBlockCount[0]; i++) {
                    let cbCardData = analyseResult.cbCardData[0][i];
                    if (cbFirstWeight != (this.getWeight(cbCardData) + i)) return analyseResult.cardType = ECardType.CT_ERROR;
                }
                return analyseResult.cardType = ECardType.CT_SINGLE_LINE;
            }
            return analyseResult.cardType = ECardType.CT_ERROR;
        }

        /**
         * 判断连对
         * */
        private adjustDoubleLine(result: IAnalyseResult): boolean {
            for (let n = 0; n < result.cbBlockCount.length; n++) {
                if (result.cbBlockCount[n] != 0 && n != 1) return false;
            }
            let cards = result.cards;
            let firstWeight = this.getWeight(cards[0]);
            for (let i = 1; i < result.cbBlockCount[1]; i++) {
                let card = result.cbCardData[1][i * 2];
                if (firstWeight != (this.getWeight(card) + i)) {
                    return false;
                }
            }
            return true;
        }

        /**
         * 判断各种顺子的情况
         * */
        private adjustLine(result: IAnalyseResult, mainLength: number): boolean {
            for (let n = 0; n < result.cbBlockCount.length; n++) {
                if (result.cbBlockCount[n] != 0 && n != mainLength) return false;
            }
            let cards = result.cards;
            let firstWeight = this.getWeight(cards[0]);
            for (let i = 1; i < result.cbBlockCount[1]; i++) {
                let card = result.cbCardData[mainLength][i * 2];
                if (firstWeight != (this.getWeight(card) + i)) {
                    return false;
                }
            }
            return true;
        }

        /**
         * 权重
         * */
        private getWeight(value: number): number {
            let logicValue = this.getLogicValue(value);
            // Jock
            if (logicValue > 13) {
                logicValue += 4;
            }
            // A
            else if (logicValue == 1) {
                logicValue = 14;
            }
            // 2
            else if (logicValue == 2) {
                logicValue = 16;//【A,2分离，避免成顺子或连对】
            }
            return logicValue;
        }

        /**
         * 逻辑值
         * */
        private getLogicValue(value: number): number {
            return value & 0x0F;
        }

        /**
         *
         * */
        private searchFollowOut(lastPresent: IAnalyseResult, cards: number[]): IPresentData[] {
            //PriorityQueue.push，result.push(PriorityQueue.pop())
            if (!lastPresent) {
                console.error(`还没有设置待跟的牌`);
                return null;
            }
            if (!lastPresent.cardType) {
                this.analyseCardKind(lastPresent);
            }
            let result: IPresentData[] = [];
            let analyseResult: IAnalyseResult = {
                cards: cards,
                cardType: null
            };
            this.analyseBase(analyseResult);

            let priorityQueue = new PriorityQueue();
            //检测炸弹
            let boomVec: IAnalyseResult[] = this.searchBooms(analyseResult);//所有炸弹类型的跟牌
            //是否检测过王炸
            //待跟牌首张
            let toFollowWeight = lastPresent.startWeight;
            //类型区分
            switch (lastPresent.cardType) {
                case ECardType.CT_ERROR: {
                    console.error(`待跟的牌型错误`);
                    // console.assert
                    return null;
                }
                case ECardType.CT_SINGLE: {
                    boomVec.concat(this.searchLines(analyseResult, 1, 1, toFollowWeight)).forEach(value => {
                        priorityQueue.push(value);
                    });
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
                case ECardType.CT_DOUBLE: {
                    boomVec.concat(this.searchLines(analyseResult, 2, 1, toFollowWeight)).forEach(value => {
                        priorityQueue.push(value);
                    });
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
                case ECardType.CT_THREE: {
                    boomVec.concat(this.searchLines(analyseResult, 3, 1, toFollowWeight)).forEach(value => {
                        priorityQueue.push(value);
                    });
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
                case ECardType.CT_SINGLE_LINE: {
                    boomVec.concat(this.searchLines(analyseResult, 1, lastPresent.cards.length, toFollowWeight)).forEach(value => {
                        priorityQueue.push(value);
                    });
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
                case ECardType.CT_DOUBLE_LINE: {
                    boomVec.concat(this.searchLines(analyseResult, 2, lastPresent.cards.length / 2, toFollowWeight)).forEach(value => {
                        priorityQueue.push(value);
                    });
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
                case ECardType.CT_THREE_LINE: {
                    boomVec.concat(this.searchLines(analyseResult, 3, lastPresent.cards.length / 3, toFollowWeight)).forEach(value => {
                        priorityQueue.push(value);
                    });
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
                case ECardType.CT_THREE_LINE_TAKE_ONE: { //三带一
                    boomVec.concat(this.searchTake(analyseResult, 3, 1, toFollowWeight)).forEach(value => {
                        priorityQueue.push(value);
                    });
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
                case ECardType.CT_THREE_LINE_TAKE_TWO: {
                    //
                    boomVec.concat(this.searchTake(analyseResult, 3, 2, toFollowWeight)).forEach(value => {
                        priorityQueue.push(value);
                    });
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
                case ECardType.CT_FOUR_LINE_TAKE_ONE: {
                    boomVec.concat(this.searchTake(analyseResult, 4, 1, toFollowWeight)).forEach(value => {
                        priorityQueue.push(value);
                    });
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
                case ECardType.CT_FOUR_LINE_TAKE_TWO: {
                    boomVec.concat(this.searchTake(analyseResult, 4, 2, toFollowWeight)).forEach(value => {
                        priorityQueue.push(value);
                    });
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
                case ECardType.CT_BOMB_CARD: {
                    for (let i = 0; i < boomVec.length; i++) {
                        if (boomVec[i].startWeight > toFollowWeight) {
                            priorityQueue.push(boomVec[i]);
                        }
                    }
                    while (priorityQueue.heap.length > 0) {
                        result.push(priorityQueue.pop());
                    }
                }
                    break;
            }
            //检测火箭
            result = result.concat(this.searchMissile(analyseResult));
            return result;
        }

        private searchMissile(analyseResult: IAnalyseResult): IPresentData[] {
            let back = [];
            if (analyseResult.cards[0] == 0x4F && analyseResult.cards[1] == 0x4E) {
                let missile: IAnalyseResult = {
                    cards: [],
                    startWeight: 0,
                    cardType: ECardType.CT_MISSILE_CARD
                };
                missile.cards = analyseResult.cards.concat().splice(0, 2);
                back.push(missile);
            }
            return back;
        }

        /**
         * 带牌类型搜索
         * @param myHold 手牌
         * @param cbSameCount 主顺长度
         * @param cbTakeCardCount 单元副牌长度
         * */
        private searchTake(myHold: IAnalyseResult,cbSameCount: number,cbTakeCardCount: number,startWeight: number = 0): IPresentData[] {
            let cbHandCardData = myHold.cards;//手牌

            let cbResult: IPresentData[] = [];//返回的牌型
            //校验
            if (cbSameCount !=3 && cbSameCount != 4) return cbResult;
            if (cbTakeCardCount != 1 && cbTakeCardCount != 2) return cbResult;
            //长度判断
            if (cbSameCount == 4 && cbHandCardData.length < cbSameCount + cbTakeCardCount * 2 || cbHandCardData.length < cbSameCount + cbTakeCardCount) return cbResult;
            //复制一个长度为手牌的数组=>cbHandCardData
            let cbCardData = cbHandCardData.concat();
            //搜索同张
            let cbSameCardResult = this.getSameLogicVec(cbCardData, cbSameCount);//
            let cbSameCardResultCount = [];
            for (let n = 0; n < cbSameCardResult.length; n++) { //逻辑值过滤
                if (this.getWeight(cbSameCardResult[n].cards[0]) > startWeight) {
                    cbSameCardResultCount.push(cbSameCardResult[n]);
                }
            }
            if (cbSameCardResultCount.length > 0) {
                let AnalyseResult : IAnalyseResult = { //是否浅复制
                    cards: cbCardData.concat()
                };
                this.analyseBase(AnalyseResult);

                let cbNeedCount = cbSameCount + cbTakeCardCount;
                if (cbSameCount == 4) cbNeedCount += cbTakeCardCount;
                //提取带牌
                for (let i = 0; i < cbSameCardResultCount.length; i++) {
                    let bMerge = false;
                    let item: IPresentData = {
                        cards:[]
                    };
                    //提取同张
                    item.cards = item.cards.concat(cbSameCardResultCount[i].cards.concat().splice(0, 3));
                    for (let j = cbTakeCardCount - 1; j < AnalyseResult.cbBlockCount.length; j++) { //取一张带牌,如何取两张
                        for (let k = 0; k < myHold.cbBlockCount[j]; k++) {
                            let cbIndex = (myHold.cbBlockCount[j] - k - 1) * (j + 1);
                            //过滤相同的牌
                            if (this.getLogicValue(cbSameCardResultCount[i].cards[0]) == AnalyseResult.cbCardData[j][cbIndex]) continue;

                            for (let m = 0; m < cbTakeCardCount; m++) {
                                let cbCount = AnalyseResult.cbCardData[j][cbIndex + m];
                                item.cards.push(cbCount);
                            }
                            if (item.cards.length < cbNeedCount) continue;

                            if (item.cards.length == cbNeedCount) {
                                cbResult.push(item);
                            }
                            bMerge = true;
                            break;
                        }
                        if (bMerge) break;
                    }
                }
            }

            return cbResult;
        }

        /**
         * 搜索顺子
         * @param myHold 手牌
         * @param sameCount 同逻辑值张数
         * @param lineLength 顺子长度
         * @param startWeight 起始逻辑值
         * */
        private searchLines(myHold: IAnalyseResult, sameCount: number, lineLength: number, startWeight: number = 0): IAnalyseResult[] {
            //myHold已经经过analyseBase()
            let hands = myHold.cards;
            //按逻辑值分组,已经将sameCount处理好
            let analyseResult = this.getSameLogicVec(hands, sameCount);//张数大于等于sameCount值的IPresentData[]，包括cards: number[]以及startWeight
            //定最小宽查找不定长顺子lines 包括起始权重以及长度values：IPresentData[]相同逻辑值的牌集合
            //处理好lineLength，所有的顺子已经处理好，就是将顺子化作单张以后的值全部找出，将长度大于等于lineLength的值全部找出
            let lines: ILine[] = this.toLines(analyseResult, lineLength);//顺子

            //遍历顺子，查找首发值大于startValue的顺子
            let back: IPresentData[] = [];
            //顺子列表长度
            let totalLines = lines.length;
            //遍历不定长顺子
            for (let lineID = 0; lineID < totalLines; lineID++) {
                //当前顺子
                let line = lines[lineID];
                //需要在总长【line.length】的顺子中便利长度为【lineLength】的顺子的次数
                //如果顺子的长度大于minLength，则进行搜索
                let totalSearchTimes = line.length - lineLength;
                //不定长顺子内便利查找定长顺子
                for (let searchTime = 0; searchTime <= totalSearchTimes; searchTime++) {
                    //判断顺子头值是否符合要求
                    if (line.startWeight - searchTime > startWeight) {
                        //出牌列表
                        let outCards: number[] = [];
                        //遍历装载卡牌
                        for (let i = 0; i < lineLength; i++) {
                            let valueIndex = searchTime + i;
                            let cardsVec = line.values[valueIndex].cards;
                            for (let cardIndex = 0; cardIndex < sameCount; cardIndex++) {
                                outCards.push(cardsVec[cardIndex]);
                            }
                        }
                        back.push({cards: outCards, cardType: ECardType.CT_ERROR});
                    }
                }
            }
            return back;
        }

        /**
         * 查找定最小宽不定长顺子，找出长度大于等于MinSame的所有顺子组合
         * @param analyseResult 手牌，已经做好处理，为键名为逻辑值键值为牌值的数组的数组
         * @param minSame 同逻辑值牌最小数量
         * */
        private toLines(analyseResult: IAnalyseResult[], minSame: number): ILine[] {
            let length = analyseResult.length;
            let lines: ILine[] = [];
            let index: number = 0;
            //遍历查找顺子
            while (index < length) {
                let firstWeight = analyseResult[index].startWeight;
                //2连以上需要开头在A以下
                if (firstWeight < 15) {
                    let line: ILine = {
                        startWeight: firstWeight,
                        values: [analyseResult[index]],
                        length: 1
                    };
                    let offSet: number = 1;
                    index++;//
                    for (let i = index; i < length; i++) {
                        index = i;//
                        if (analyseResult[i].startWeight == (firstWeight - offSet)) {
                            line.values.push(analyseResult[i]);
                            line.length++;
                            offSet++;
                        }
                        else {
                            break;
                        }
                    }
                    if (line.length >= minSame) {
                        lines.push(line);
                    }
                }
                //单个无限制
                else if (minSame == 1) {
                    let line: ILine = {
                        startWeight: firstWeight,
                        values: [analyseResult[index]],
                        length: 1
                    };
                    lines.push(line);
                    index++;
                }
                else {
                    index++;
                }
            }
            return lines;
        }

        private searchBooms(analyseResult: IAnalyseResult): IAnalyseResult[] {
            let hands = analyseResult.cards;
            let back: IAnalyseResult[] = [];

            let boomVecLen: number = analyseResult.cbBlockCount[3];
            //炸弹
            if (boomVecLen) {
                for (let i = 0; i < boomVecLen; i++) {
                    let boom: IAnalyseResult = {
                        cards: [],
                        startWeight: 0,
                        cardType: ECardType.CT_BOMB_CARD
                    };
                    let cards = [];
                    for (let j = 0; j < 4; j++) {
                        cards.push(analyseResult.cbCardData[3][i * 4 + j]);
                    }
                    boom.cards = cards;
                    boom.startWeight = this.getWeight(cards[0]);
                    back.push(boom);
                }
            }
            return back;
        }



        private searchFirstPresent(cards: number[]): IPresentData[] {
            return this.getSameLogicVec(cards, 1);//单牌
        }

        /**
         * 获取张数至少为minSame同逻辑卡牌数组
         * */
        private getSameLogicVec(hands: number[], minSame: number): IPresentData[] {
            let back: IPresentData[] = [];
            let length = hands.length;
            //扑克分析
            for (let i = 0; i < length; i++) {
                let sameCount: number = 1;//相同逻辑值的牌的数量
                let weight = this.getWeight(hands[i]);
                //搜索同牌
                for (let j = i + 1; j < length; j++) {
                    //获取扑克
                    if (this.getWeight(hands[j]) == weight) {
                        sameCount++;
                    }
                    else {
                        break;
                    }
                }
                //错误过滤
                if (sameCount > 4) {
                    egret.warn(false);
                    return;
                }
                //设置结果
                if (sameCount >= minSame) {
                    let sameLogic = {
                        cards: [],
                        startWeight: weight
                    };
                    for (let j = 0; j < sameCount; j++) {
                        sameLogic.cards.push(hands[i + j]);
                    }
                    back.push(sameLogic);
                }
                //设置索引
                i += sameCount - 1;
            }
            return back;
        }

        private analyseBase(result: IAnalyseResult): void {
            //清空数据
            this.clearAnalyse(result);
            //扑克列表
            let cards = result.cards;
            //扑克数量
            let totalCards = cards.length;

            for (let front = 0; front < cards.length; front++) {
                let [sameCount, logicValue, weight] = [1, this.getLogicValue(cards[front]), this.getWeight(cards[front])];

                for (let back = front + 1; back < totalCards; back++) { //搜索往后的牌的逻辑值，如果相同，那就count++，一旦遇到不同的数值，跳出循环
                    //获取扑克
                    if (this.getLogicValue(cards[back]) == logicValue) {
                        sameCount++;
                    }
                    else {
                        break;
                    }
                }
                //错误过滤，直接跳出函数
                if (sameCount > 4) {
                    egret.warn(false);
                    return;
                }
                let index = result.cbBlockCount[sameCount - 1]++;//某一类型的牌+1，index是原来的数量
                for (let j = 0; j < sameCount; j++) {
                    result.cbCardData[sameCount - 1][index * sameCount + j] = cards[front + j];
                }
                //设置索引
                front += sameCount - 1;
            }

        }

        //清空分析数据
        private clearAnalyse(analyse: IAnalyseResult): void {
            analyse.startWeight = 0;
            analyse.cbBlockCount = [];
            analyse.cbCardData = [];
            for (let i = 0; i < 4; i++) {
                analyse.cbBlockCount.push(0);
                analyse.cbCardData.push(this.zeroArray(cmd.NORMAL_COUNT));
            }

        }

        private zeroArray(length: number): number[] {
            let back = [];
            for (let i = 0; i < length; i++) {
                back.push(0);
            }
            return back;
        }


    }

    //优先队列
    export class PriorityQueue {
        public heap: IPresentData[] = [];
        private gameLogic: GameLogic = new GameLogic();

        push(value: IPresentData) {
            let i = this.heap.length;
            while (i > 0) { //存在父节点的情况下
                let father = Math.floor((i - 1) / 2);
                if (this.gameLogic.comparePresent(this.heap[father], value)) break;
                //将父节点下放
                this.heap[i] = this.heap[father];
                i = father;
            }
            this.heap[i] = value;
        }

        pop(): IPresentData {
            let value = this.heap[0];//最小值
            let node = this.heap.pop();
            let i = 0;
            while (i * 2 + 1 < this.heap.length) {
                let a = i * 2 + 1,
                    b = i * 2 + 2;
                if (this.gameLogic.comparePresent(this.heap[b], this.heap[a])) a = b;
                if (this.gameLogic.comparePresent(node, this.heap[a])) break;
                this.heap[i] = this.heap[a];
                i = a;
            }
            if (this.heap.length != 0) {
                this.heap[i] = node;
            }
            return value;
        }
    }


}