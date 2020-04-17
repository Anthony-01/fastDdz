var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var CB_CARD_DATA = [
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D,
        0x4E, 0x4F
    ];
    /**
     * 出牌牌型枚举
     * */
    var ECardType;
    (function (ECardType) {
        ECardType[ECardType["CT_ERROR"] = 0] = "CT_ERROR";
        ECardType[ECardType["CT_SINGLE"] = 1] = "CT_SINGLE";
        ECardType[ECardType["CT_DOUBLE"] = 2] = "CT_DOUBLE";
        ECardType[ECardType["CT_THREE"] = 3] = "CT_THREE";
        ECardType[ECardType["CT_SINGLE_LINE"] = 4] = "CT_SINGLE_LINE";
        ECardType[ECardType["CT_DOUBLE_LINE"] = 5] = "CT_DOUBLE_LINE";
        ECardType[ECardType["CT_THREE_LINE"] = 6] = "CT_THREE_LINE";
        ECardType[ECardType["CT_THREE_LINE_TAKE_ONE"] = 7] = "CT_THREE_LINE_TAKE_ONE";
        ECardType[ECardType["CT_THREE_LINE_TAKE_TWO"] = 8] = "CT_THREE_LINE_TAKE_TWO";
        ECardType[ECardType["CT_FOUR_LINE_TAKE_ONE"] = 9] = "CT_FOUR_LINE_TAKE_ONE";
        ECardType[ECardType["CT_FOUR_LINE_TAKE_TWO"] = 10] = "CT_FOUR_LINE_TAKE_TWO";
        ECardType[ECardType["CT_BOMB_CARD"] = 11] = "CT_BOMB_CARD";
        ECardType[ECardType["CT_MISSILE_CARD"] = 12] = "CT_MISSILE_CARD"; //火箭类型
    })(ECardType = game.ECardType || (game.ECardType = {}));
    var GameLogic = (function () {
        function GameLogic() {
        }
        /**
         * 出牌验证
         * */
        GameLogic.prototype.assertPresent = function (toAssert, lastPresent) {
            if (lastPresent === undefined || lastPresent.cards.length == 0) {
                //第一个出牌
                if (!toAssert.cardType) {
                    this.analyseCardKind(toAssert);
                }
                return toAssert.cardType != ECardType.CT_ERROR;
            }
            //出牌比较
            return this.comparePresent(lastPresent, toAssert);
        };
        /**
         * 搜索
         * 搜索所有可出的牌组合
         * 根据上一个出的牌型，检测自己的手牌，返回能出的牌组
         * */
        GameLogic.prototype.searchForPresent = function (cards, lastPresent) {
            var _this = this;
            cards.sort(function (a, b) { return _this.getWeight(b) - _this.getWeight(a); }); //排序，
            //
            if (lastPresent === undefined) {
                //第一个出牌
                return this.searchFirstPresent(cards);
            }
            //以前一个出牌为参照做提示
            return this.searchFollowOut(lastPresent, cards);
        };
        /**
         * 出牌排序
         * */
        GameLogic.prototype.sortOutCards = function (cards) {
            var _this = this;
            var cbCardDataTemp = cards.concat().sort(function (a, b) { return _this.getWeight(b) - _this.getWeight(a); });
            var cbType = this.analyseCardKind({ cards: cbCardDataTemp.concat() });
            var analyseResult = {
                cards: cbCardDataTemp.concat()
            };
            this.analyseCardKind(analyseResult);
            var cbCardData = cbCardDataTemp.concat();
            if (analyseResult.cbBlockCount[3] > 0 && cards.length <= 8) {
                var cbIndex = 0;
                for (var i = 0; i < analyseResult.cbBlockCount[3]; i++) {
                    cbCardData[cbIndex] = analyseResult.cbCardData[3][4 * i];
                    cbCardData[cbIndex + 1] = analyseResult.cbCardData[3][4 * i + 1];
                    cbCardData[cbIndex + 2] = analyseResult.cbCardData[3][4 * i + 2];
                    cbCardData[cbIndex + 3] = analyseResult.cbCardData[3][4 * i + 3];
                    cbIndex += 4;
                }
                if (analyseResult.cbBlockCount[3] == 1) {
                    var cbLogicValue = this.getWeight(analyseResult.cbCardData[3][0]);
                    for (var i = 0; i < cards.length; i++) {
                        // cbCardData[cbIndex++] =
                        if (cbLogicValue == this.getWeight(cbCardDataTemp[i]))
                            continue;
                        cbCardData[cbIndex++] = cbCardDataTemp[i];
                    }
                }
            }
            if (analyseResult.cbBlockCount[2] > 0) {
                //let cbLogicCount[LOGIC_COUNT]   LOGIC_COUNT常量？
                var cbLogicCount = {};
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < analyseResult.cbBlockCount[i]; j++) {
                        cbLogicCount[this.getWeight(analyseResult.cbCardData[i][j * (i + 1)])] = i + 1;
                    }
                }
                var cbMostLength = 0;
                var cbLogicRecord = 0;
                var cbLogicCountAssit = 4;
                if (cbCardDataTemp.length % 5 == 0)
                    cbLogicCountAssit = 0x0F;
                for (var i = 3; i < 15; i++) {
                    if (cbLogicCount[i] == 3 || cbLogicCount[i] == cbLogicCountAssit) {
                        var cbTempCount = 1;
                        for (var j = i + 1; j < 15; j++) {
                            if (cbLogicCount[j] == 3 || cbLogicCount[j] == cbLogicCountAssit)
                                cbTempCount++;
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
                var cbPlaneIndex = 0;
                var cbWingIndex = 3 * cbMostLength;
                for (var i = 0; i < cbCardDataTemp.length;) {
                    var cbLogicValue = this.getWeight(cbCardDataTemp[i]);
                    if (cbLogicValue >= cbLogicRecord && cbLogicValue <= cbLogicRecord + cbMostLength - 1) {
                        cbCardData[cbPlaneIndex] = cbCardDataTemp[i];
                        cbCardData[cbPlaneIndex + 1] = cbCardDataTemp[i + 1];
                        cbCardData[cbPlaneIndex + 2] = cbCardDataTemp[i + 2];
                        cbPlaneIndex += 3;
                        i += 3;
                        if (cbLogicCount[cbLogicValue] == 4)
                            cbCardData[cbWingIndex++] = cbCardDataTemp[i++];
                    }
                    else {
                        cbCardData[cbWingIndex++] = cbCardDataTemp[i++];
                    }
                }
            }
            return cbCardData;
        };
        GameLogic.prototype.comparePresent = function (last, current) {
            if (!last) {
                return false;
            }
            if (!last.cardType) {
                this.analyseCardKind(last); //牌型
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
            if (current.cardType == ECardType.CT_MISSILE_CARD)
                return true;
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
            switch (current.cardType) {
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
        };
        GameLogic.prototype.analyseCardKind = function (analyseResult) {
            //基础分析
            this.analyseBase(analyseResult);
            //牌列表
            var cards = analyseResult.cards;
            //牌长度
            var cbCardCount = cards.length;
            //简单牌型
            switch (cbCardCount) {
                case 0: {
                    return analyseResult.cardType = ECardType.CT_ERROR;
                }
                case 1: {
                    analyseResult.startWeight = this.getWeight(cards[0]);
                    return analyseResult.cardType = ECardType.CT_SINGLE;
                }
                case 2: {
                    var firstWeight = this.getWeight(cards[0]);
                    var secondWeight = this.getWeight(cards[1]);
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
                if ((analyseResult.cbBlockCount[3] == 1) && (cbCardCount == 4))
                    return analyseResult.cardType = ECardType.CT_BOMB_CARD;
                if ((analyseResult.cbBlockCount[3] == 1) && (cbCardCount == 6))
                    return analyseResult.cardType = ECardType.CT_FOUR_LINE_TAKE_ONE;
                if (cbCardCount == 8 && (analyseResult.cbBlockCount[3] == 2 && this.getWeight(analyseResult.cards[2]) != this.getWeight(analyseResult.cards[3])))
                    return analyseResult.cardType = ECardType.CT_THREE_LINE_TAKE_ONE;
                if (cbCardCount == 8 && (analyseResult.cbBlockCount[3] == 2 || (analyseResult.cbBlockCount[3] == 1 && analyseResult.cbBlockCount[1] == 2)))
                    return analyseResult.cardType = ECardType.CT_FOUR_LINE_TAKE_TWO;
                // return analyseResult.cardType = ECardType.CT_ERROR;
            }
            //三牌判断
            if (analyseResult.cbBlockCount[2] > 0 || analyseResult.cbBlockCount[3] > 2) {
                analyseResult.startWeight = this.getWeight(analyseResult.cbCardData[2][0]);
                //错误类型
                if (cbCardCount % 3 != 0 && cbCardCount % 4 != 0 && cbCardCount % 5 != 0)
                    return analyseResult.cardType = ECardType.CT_ERROR;
                //3张
                if (cbCardCount == 3)
                    return analyseResult.cardType = ECardType.CT_THREE;
                var cbWeightCount = {};
                for (var n = 0; n < 4; n++) {
                    for (var j = 0; j < analyseResult.cbBlockCount[n]; j++) {
                        cbWeightCount[this.getWeight(analyseResult.cbCardData[n][j * (n + 1)])] = n + 1;
                    }
                }
                var cbMostLength = 0;
                for (var i = 3; i < 15; i++) {
                    if (cbWeightCount[i] >= 3) {
                        var cbTempCount = 1;
                        for (var j = i + 1; j < cmd.NORMAL_COUNT; j++) {
                            if (cbWeightCount[j] >= 3) {
                                cbTempCount++;
                            }
                            else {
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
                if (cbCardCount % 3 == 0 && cbCardCount / 3 == cbMostLength)
                    return analyseResult.cardType = ECardType.CT_THREE_LINE;
                //三带一
                if (cbCardCount % 4 == 0 && cbCardCount / 4 <= cbMostLength)
                    return analyseResult.cardType = ECardType.CT_THREE_LINE_TAKE_ONE;
                //3带2
                if (cbCardCount % 5 == 0 && cbCardCount / 5 <= cbMostLength) {
                    //统计只由3牌组成的连长
                    var cbCardData = analyseResult.cbCardData[2][0];
                    var cbFirstLogicValue = this.getWeight(cbCardData);
                    var cbTripleLineCount = 0;
                    for (var i = 0; i < analyseResult.cbBlockCount[2]; i++) {
                        var cbCardData_1 = analyseResult.cbCardData[2][i * 3];
                        cbTripleLineCount++;
                        if (cbFirstLogicValue != (this.getWeight(cbCardData_1) + i))
                            return analyseResult.cardType = ECardType.CT_ERROR;
                    }
                    var cbPairCount = analyseResult.cbBlockCount[1] + analyseResult.cbBlockCount[3] * 2;
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
                var cbCardData = analyseResult.cbCardData[1][0];
                analyseResult.startWeight = this.getWeight(cbCardData);
                var cbFirstLogicValue = this.getWeight(cbCardData);
                if (cbFirstLogicValue > 15)
                    return analyseResult.cardType = ECardType.CT_ERROR;
                //连牌判断
                for (var i = 1; i < analyseResult.cbBlockCount[1]; i++) {
                    var cbCardData_2 = analyseResult.cbCardData[1][i * 2];
                    if (cbFirstLogicValue != (this.getWeight(cbCardData_2) + i))
                        return analyseResult.cardType = ECardType.CT_ERROR;
                }
                if (analyseResult.cbBlockCount[1] * 2 == cbCardCount)
                    return analyseResult.cardType = ECardType.CT_DOUBLE_LINE;
            }
            //单张判断
            if (analyseResult.cbBlockCount[0] >= 5 && analyseResult.cbBlockCount[0] == cbCardCount) {
                var cbCardData = analyseResult.cbCardData[0][0];
                analyseResult.startWeight = this.getWeight(cbCardData);
                var cbFirstWeight = this.getWeight(cbCardData);
                if (cbFirstWeight > 15)
                    return analyseResult.cardType = ECardType.CT_ERROR;
                //连牌判断
                for (var i = 0; i < analyseResult.cbBlockCount[0]; i++) {
                    var cbCardData_3 = analyseResult.cbCardData[0][i];
                    if (cbFirstWeight != (this.getWeight(cbCardData_3) + i))
                        return analyseResult.cardType = ECardType.CT_ERROR;
                }
                return analyseResult.cardType = ECardType.CT_SINGLE_LINE;
            }
            return analyseResult.cardType = ECardType.CT_ERROR;
        };
        /**
         * 判断连对
         * */
        GameLogic.prototype.adjustDoubleLine = function (result) {
            for (var n = 0; n < result.cbBlockCount.length; n++) {
                if (result.cbBlockCount[n] != 0 && n != 1)
                    return false;
            }
            var cards = result.cards;
            var firstWeight = this.getWeight(cards[0]);
            for (var i = 1; i < result.cbBlockCount[1]; i++) {
                var card = result.cbCardData[1][i * 2];
                if (firstWeight != (this.getWeight(card) + i)) {
                    return false;
                }
            }
            return true;
        };
        /**
         * 判断各种顺子的情况
         * */
        GameLogic.prototype.adjustLine = function (result, mainLength) {
            for (var n = 0; n < result.cbBlockCount.length; n++) {
                if (result.cbBlockCount[n] != 0 && n != mainLength)
                    return false;
            }
            var cards = result.cards;
            var firstWeight = this.getWeight(cards[0]);
            for (var i = 1; i < result.cbBlockCount[1]; i++) {
                var card = result.cbCardData[mainLength][i * 2];
                if (firstWeight != (this.getWeight(card) + i)) {
                    return false;
                }
            }
            return true;
        };
        /**
         * 权重
         * */
        GameLogic.prototype.getWeight = function (value) {
            var logicValue = this.getLogicValue(value);
            // Jock
            if (logicValue > 13) {
                logicValue += 4;
            }
            else if (logicValue == 1) {
                logicValue = 14;
            }
            else if (logicValue == 2) {
                logicValue = 16; //【A,2分离，避免成顺子或连对】
            }
            return logicValue;
        };
        /**
         * 逻辑值
         * */
        GameLogic.prototype.getLogicValue = function (value) {
            return value & 0x0F;
        };
        /**
         *
         * */
        GameLogic.prototype.searchFollowOut = function (lastPresent, cards) {
            //PriorityQueue.push，result.push(PriorityQueue.pop())
            if (!lastPresent) {
                console.error("\u8FD8\u6CA1\u6709\u8BBE\u7F6E\u5F85\u8DDF\u7684\u724C");
                return null;
            }
            if (!lastPresent.cardType) {
                this.analyseCardKind(lastPresent);
            }
            var result = [];
            var analyseResult = {
                cards: cards,
                cardType: null
            };
            this.analyseBase(analyseResult);
            var priorityQueue = new PriorityQueue();
            //检测炸弹
            var boomVec = this.searchBooms(analyseResult); //所有炸弹类型的跟牌
            //是否检测过王炸
            //待跟牌首张
            var toFollowWeight = lastPresent.startWeight;
            //类型区分
            switch (lastPresent.cardType) {
                case ECardType.CT_ERROR: {
                    console.error("\u5F85\u8DDF\u7684\u724C\u578B\u9519\u8BEF");
                    // console.assert
                    return null;
                }
                case ECardType.CT_SINGLE:
                    {
                        boomVec.concat(this.searchLines(analyseResult, 1, 1, toFollowWeight)).forEach(function (value) {
                            priorityQueue.push(value);
                        });
                        while (priorityQueue.heap.length > 0) {
                            result.push(priorityQueue.pop());
                        }
                    }
                    break;
                case ECardType.CT_DOUBLE:
                    {
                        boomVec.concat(this.searchLines(analyseResult, 2, 1, toFollowWeight)).forEach(function (value) {
                            priorityQueue.push(value);
                        });
                        while (priorityQueue.heap.length > 0) {
                            result.push(priorityQueue.pop());
                        }
                    }
                    break;
                case ECardType.CT_THREE:
                    {
                        boomVec.concat(this.searchLines(analyseResult, 3, 1, toFollowWeight)).forEach(function (value) {
                            priorityQueue.push(value);
                        });
                        while (priorityQueue.heap.length > 0) {
                            result.push(priorityQueue.pop());
                        }
                    }
                    break;
                case ECardType.CT_SINGLE_LINE:
                    {
                        boomVec.concat(this.searchLines(analyseResult, 1, lastPresent.cards.length, toFollowWeight)).forEach(function (value) {
                            priorityQueue.push(value);
                        });
                        while (priorityQueue.heap.length > 0) {
                            result.push(priorityQueue.pop());
                        }
                    }
                    break;
                case ECardType.CT_DOUBLE_LINE:
                    {
                        boomVec.concat(this.searchLines(analyseResult, 2, lastPresent.cards.length / 2, toFollowWeight)).forEach(function (value) {
                            priorityQueue.push(value);
                        });
                        while (priorityQueue.heap.length > 0) {
                            result.push(priorityQueue.pop());
                        }
                    }
                    break;
                case ECardType.CT_THREE_LINE:
                    {
                        boomVec.concat(this.searchLines(analyseResult, 3, lastPresent.cards.length / 3, toFollowWeight)).forEach(function (value) {
                            priorityQueue.push(value);
                        });
                        while (priorityQueue.heap.length > 0) {
                            result.push(priorityQueue.pop());
                        }
                    }
                    break;
                case ECardType.CT_THREE_LINE_TAKE_ONE:
                    {
                        boomVec.concat(this.searchTake(analyseResult, 3, 1, toFollowWeight)).forEach(function (value) {
                            priorityQueue.push(value);
                        });
                        while (priorityQueue.heap.length > 0) {
                            result.push(priorityQueue.pop());
                        }
                    }
                    break;
                case ECardType.CT_THREE_LINE_TAKE_TWO:
                    {
                        //
                        boomVec.concat(this.searchTake(analyseResult, 3, 2, toFollowWeight)).forEach(function (value) {
                            priorityQueue.push(value);
                        });
                        while (priorityQueue.heap.length > 0) {
                            result.push(priorityQueue.pop());
                        }
                    }
                    break;
                case ECardType.CT_FOUR_LINE_TAKE_ONE:
                    {
                        boomVec.concat(this.searchTake(analyseResult, 4, 1, toFollowWeight)).forEach(function (value) {
                            priorityQueue.push(value);
                        });
                        while (priorityQueue.heap.length > 0) {
                            result.push(priorityQueue.pop());
                        }
                    }
                    break;
                case ECardType.CT_FOUR_LINE_TAKE_TWO:
                    {
                        boomVec.concat(this.searchTake(analyseResult, 4, 2, toFollowWeight)).forEach(function (value) {
                            priorityQueue.push(value);
                        });
                        while (priorityQueue.heap.length > 0) {
                            result.push(priorityQueue.pop());
                        }
                    }
                    break;
                case ECardType.CT_BOMB_CARD:
                    {
                        for (var i = 0; i < boomVec.length; i++) {
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
        };
        GameLogic.prototype.searchMissile = function (analyseResult) {
            var back = [];
            if (analyseResult.cards[0] == 0x4F && analyseResult.cards[1] == 0x4E) {
                var missile = {
                    cards: [],
                    startWeight: 0,
                    cardType: ECardType.CT_MISSILE_CARD
                };
                missile.cards = analyseResult.cards.concat().splice(0, 2);
                back.push(missile);
            }
            return back;
        };
        /**
         * 带牌类型搜索
         * @param myHold 手牌
         * @param cbSameCount 主顺长度
         * @param cbTakeCardCount 单元副牌长度
         * */
        GameLogic.prototype.searchTake = function (myHold, cbSameCount, cbTakeCardCount, startWeight) {
            if (startWeight === void 0) { startWeight = 0; }
            var cbHandCardData = myHold.cards; //手牌
            var cbResult = []; //返回的牌型
            //校验
            if (cbSameCount != 3 && cbSameCount != 4)
                return cbResult;
            if (cbTakeCardCount != 1 && cbTakeCardCount != 2)
                return cbResult;
            //长度判断
            if (cbSameCount == 4 && cbHandCardData.length < cbSameCount + cbTakeCardCount * 2 || cbHandCardData.length < cbSameCount + cbTakeCardCount)
                return cbResult;
            //复制一个长度为手牌的数组=>cbHandCardData
            var cbCardData = cbHandCardData.concat();
            //搜索同张
            var cbSameCardResult = this.getSameLogicVec(cbCardData, cbSameCount); //
            var cbSameCardResultCount = [];
            for (var n = 0; n < cbSameCardResult.length; n++) {
                if (this.getWeight(cbSameCardResult[n].cards[0]) > startWeight) {
                    cbSameCardResultCount.push(cbSameCardResult[n]);
                }
            }
            if (cbSameCardResultCount.length > 0) {
                var AnalyseResult = {
                    cards: cbCardData.concat()
                };
                this.analyseBase(AnalyseResult);
                var cbNeedCount = cbSameCount + cbTakeCardCount;
                if (cbSameCount == 4)
                    cbNeedCount += cbTakeCardCount;
                //提取带牌
                for (var i = 0; i < cbSameCardResultCount.length; i++) {
                    var bMerge = false;
                    var item = {
                        cards: []
                    };
                    //提取同张
                    item.cards = item.cards.concat(cbSameCardResultCount[i].cards.concat().splice(0, 3));
                    for (var j = cbTakeCardCount - 1; j < AnalyseResult.cbBlockCount.length; j++) {
                        for (var k = 0; k < myHold.cbBlockCount[j]; k++) {
                            var cbIndex = (myHold.cbBlockCount[j] - k - 1) * (j + 1);
                            //过滤相同的牌
                            if (this.getLogicValue(cbSameCardResultCount[i].cards[0]) == AnalyseResult.cbCardData[j][cbIndex])
                                continue;
                            for (var m = 0; m < cbTakeCardCount; m++) {
                                var cbCount = AnalyseResult.cbCardData[j][cbIndex + m];
                                item.cards.push(cbCount);
                            }
                            if (item.cards.length < cbNeedCount)
                                continue;
                            if (item.cards.length == cbNeedCount) {
                                cbResult.push(item);
                            }
                            bMerge = true;
                            break;
                        }
                        if (bMerge)
                            break;
                    }
                }
            }
            return cbResult;
        };
        /**
         * 搜索顺子
         * @param myHold 手牌
         * @param sameCount 同逻辑值张数
         * @param lineLength 顺子长度
         * @param startWeight 起始逻辑值
         * */
        GameLogic.prototype.searchLines = function (myHold, sameCount, lineLength, startWeight) {
            if (startWeight === void 0) { startWeight = 0; }
            //myHold已经经过analyseBase()
            var hands = myHold.cards;
            //按逻辑值分组,已经将sameCount处理好
            var analyseResult = this.getSameLogicVec(hands, sameCount); //张数大于等于sameCount值的IPresentData[]，包括cards: number[]以及startWeight
            //定最小宽查找不定长顺子lines 包括起始权重以及长度values：IPresentData[]相同逻辑值的牌集合
            //处理好lineLength，所有的顺子已经处理好，就是将顺子化作单张以后的值全部找出，将长度大于等于lineLength的值全部找出
            var lines = this.toLines(analyseResult, lineLength); //顺子
            //遍历顺子，查找首发值大于startValue的顺子
            var back = [];
            //顺子列表长度
            var totalLines = lines.length;
            //遍历不定长顺子
            for (var lineID = 0; lineID < totalLines; lineID++) {
                //当前顺子
                var line = lines[lineID];
                //需要在总长【line.length】的顺子中便利长度为【lineLength】的顺子的次数
                //如果顺子的长度大于minLength，则进行搜索
                var totalSearchTimes = line.length - lineLength;
                //不定长顺子内便利查找定长顺子
                for (var searchTime = 0; searchTime <= totalSearchTimes; searchTime++) {
                    //判断顺子头值是否符合要求
                    if (line.startWeight - searchTime > startWeight) {
                        //出牌列表
                        var outCards = [];
                        //遍历装载卡牌
                        for (var i = 0; i < lineLength; i++) {
                            var valueIndex = searchTime + i;
                            var cardsVec = line.values[valueIndex].cards;
                            for (var cardIndex = 0; cardIndex < sameCount; cardIndex++) {
                                outCards.push(cardsVec[cardIndex]);
                            }
                        }
                        back.push({ cards: outCards, cardType: ECardType.CT_ERROR });
                    }
                }
            }
            return back;
        };
        /**
         * 查找定最小宽不定长顺子，找出长度大于等于MinSame的所有顺子组合
         * @param analyseResult 手牌，已经做好处理，为键名为逻辑值键值为牌值的数组的数组
         * @param minSame 同逻辑值牌最小数量
         * */
        GameLogic.prototype.toLines = function (analyseResult, minSame) {
            var length = analyseResult.length;
            var lines = [];
            var index = 0;
            //遍历查找顺子
            while (index < length) {
                var firstWeight = analyseResult[index].startWeight;
                //2连以上需要开头在A以下
                if (firstWeight < 15) {
                    var line = {
                        startWeight: firstWeight,
                        values: [analyseResult[index]],
                        length: 1
                    };
                    var offSet = 1;
                    index++; //
                    for (var i = index; i < length; i++) {
                        index = i; //
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
                else if (minSame == 1) {
                    var line = {
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
        };
        GameLogic.prototype.searchBooms = function (analyseResult) {
            var hands = analyseResult.cards;
            var back = [];
            var boomVecLen = analyseResult.cbBlockCount[3];
            //炸弹
            if (boomVecLen) {
                for (var i = 0; i < boomVecLen; i++) {
                    var boom = {
                        cards: [],
                        startWeight: 0,
                        cardType: ECardType.CT_BOMB_CARD
                    };
                    var cards = [];
                    for (var j = 0; j < 4; j++) {
                        cards.push(analyseResult.cbCardData[3][i * 4 + j]);
                    }
                    boom.cards = cards;
                    boom.startWeight = this.getWeight(cards[0]);
                    back.push(boom);
                }
            }
            return back;
        };
        GameLogic.prototype.searchFirstPresent = function (cards) {
            return this.getSameLogicVec(cards, 1); //单牌
        };
        /**
         * 获取张数至少为minSame同逻辑卡牌数组
         * */
        GameLogic.prototype.getSameLogicVec = function (hands, minSame) {
            var back = [];
            var length = hands.length;
            //扑克分析
            for (var i = 0; i < length; i++) {
                var sameCount = 1; //相同逻辑值的牌的数量
                var weight = this.getWeight(hands[i]);
                //搜索同牌
                for (var j = i + 1; j < length; j++) {
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
                    var sameLogic = {
                        cards: [],
                        startWeight: weight
                    };
                    for (var j = 0; j < sameCount; j++) {
                        sameLogic.cards.push(hands[i + j]);
                    }
                    back.push(sameLogic);
                }
                //设置索引
                i += sameCount - 1;
            }
            return back;
        };
        GameLogic.prototype.analyseBase = function (result) {
            //清空数据
            this.clearAnalyse(result);
            //扑克列表
            var cards = result.cards;
            //扑克数量
            var totalCards = cards.length;
            for (var front = 0; front < cards.length; front++) {
                var _a = [1, this.getLogicValue(cards[front]), this.getWeight(cards[front])], sameCount = _a[0], logicValue = _a[1], weight = _a[2];
                for (var back = front + 1; back < totalCards; back++) {
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
                var index = result.cbBlockCount[sameCount - 1]++; //某一类型的牌+1，index是原来的数量
                for (var j = 0; j < sameCount; j++) {
                    result.cbCardData[sameCount - 1][index * sameCount + j] = cards[front + j];
                }
                //设置索引
                front += sameCount - 1;
            }
        };
        //清空分析数据
        GameLogic.prototype.clearAnalyse = function (analyse) {
            analyse.startWeight = 0;
            analyse.cbBlockCount = [];
            analyse.cbCardData = [];
            for (var i = 0; i < 4; i++) {
                analyse.cbBlockCount.push(0);
                analyse.cbCardData.push(this.zeroArray(cmd.NORMAL_COUNT));
            }
        };
        GameLogic.prototype.zeroArray = function (length) {
            var back = [];
            for (var i = 0; i < length; i++) {
                back.push(0);
            }
            return back;
        };
        return GameLogic;
    }());
    game.GameLogic = GameLogic;
    __reflect(GameLogic.prototype, "game.GameLogic");
    //优先队列
    var PriorityQueue = (function () {
        function PriorityQueue() {
            this.heap = [];
            this.gameLogic = new GameLogic();
        }
        PriorityQueue.prototype.push = function (value) {
            var i = this.heap.length;
            while (i > 0) {
                var father = Math.floor((i - 1) / 2);
                if (this.gameLogic.comparePresent(this.heap[father], value))
                    break;
                //将父节点下放
                this.heap[i] = this.heap[father];
                i = father;
            }
            this.heap[i] = value;
        };
        PriorityQueue.prototype.pop = function () {
            var value = this.heap[0]; //最小值
            var node = this.heap.pop();
            var i = 0;
            while (i * 2 + 1 < this.heap.length) {
                var a = i * 2 + 1, b = i * 2 + 2;
                if (this.gameLogic.comparePresent(this.heap[b], this.heap[a]))
                    a = b;
                if (this.gameLogic.comparePresent(node, this.heap[a]))
                    break;
                this.heap[i] = this.heap[a];
                i = a;
            }
            if (this.heap.length != 0) {
                this.heap[i] = node;
            }
            return value;
        };
        return PriorityQueue;
    }());
    game.PriorityQueue = PriorityQueue;
    __reflect(PriorityQueue.prototype, "game.PriorityQueue");
})(game || (game = {}));
