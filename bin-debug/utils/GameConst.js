var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var utils;
(function (utils) {
    var GameConst = (function () {
        function GameConst() {
        }
        GameConst.createBitmapByName = function (name) {
            var texture = RES.getRes(name);
            if (null == texture) {
                console.log("%c创建纹理失败：", "color: green;font-size: 4em");
                console.error(name);
                return;
            }
            var bitmap = new egret.Bitmap(texture);
            return bitmap;
        };
        GameConst.getStrLen = function (str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                //单字节加1
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    len++;
                }
                else {
                    len += 2;
                }
            }
            return len;
        };
        GameConst.createBitmapFromSheet = function (name, sheet) {
            var texture = RES.getRes(sheet + "_json." + name);
            if (null == texture) {
                console.log("%c创建纹理失败：", "color: green;font-size: 5em");
                console.error(sheet + "_json." + name);
                return;
            }
            var bitmap = new egret.Bitmap(texture);
            return bitmap;
        };
        GameConst.removeChild = function (child) {
            if (child && child.parent) {
                if (child.parent.removeElement) {
                    child.parent.removeElement(child);
                }
                else {
                    child.parent.removeChild(child);
                }
            }
        };
        GameConst.removeFatherMask = function (child) {
            if (child && child.parent) {
                if (child.parent["_rulerMaster"]) {
                    child.parent.removeChild(child.parent["_rulerMaster"]);
                }
            }
        };
        GameConst.setAnchorCenter = function (object) {
            if ((null != object) && (object.width >= 0 && (object.height >= 0))) {
                object.anchorOffsetX = object.width / 2;
                object.anchorOffsetY = object.height / 2;
                return object;
            }
            return;
        };
        /**
         * 转化金币数量为显示
         * 金币显示总共四位
         * */
        GameConst.transformScore = function (score) {
            var back = "";
            if (score >= 10000) {
                var front = Math.floor(score / 10000).toString();
                if (front.length < 4) {
                    back += front + ".";
                    var behindLength = 4 - front.length; //后面的位数
                    var behindCount = (Math.floor(score % 10000) / 10000);
                    for (var n = 0; n < behindLength; n++) {
                        back += Math.floor(behindCount * 10);
                        behindCount = behindCount * 10 - Math.floor(behindCount * 10);
                    }
                    back = back + "万";
                }
                else {
                    back = front + "万";
                }
                // let behind = Math.floor(score % 10000);
                // let tansScore = front + behind / 10000;
                // back += tansScore + "万";
            }
            else {
                back += Math.floor(score);
            }
            return back;
        };
        GameConst.colorConsole = function (msg) {
            console.log("%c" + msg, "color: red;font-size: 1.5em");
        };
        GameConst.prototype.logPoker = function (cards) {
            var _this = this;
            var back = [];
            cards.forEach(function (value) {
                back.push(_this.getWeight(value));
            });
            GameConst.colorConsole("发送扑克：");
            console.log(back);
        };
        GameConst.prototype.getWeight = function (value) {
            var logicValue = value & 0x0F;
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
        GameConst.getInstance = function () {
            if (null == this.m_Ins) {
                this.m_Ins = new GameConst;
            }
            return this.m_Ins;
        };
        GameConst.getCell = function (apart) {
            var back;
            apart >= 0 ? back = 1 : back = -1;
            var abs = Math.abs(apart);
            back *= Math.ceil(abs / 100);
            return back;
        };
        GameConst.stageW = 750;
        GameConst.stageH = 1624;
        GameConst.GAME_PLAYER = 3;
        return GameConst;
    }());
    utils.GameConst = GameConst;
    __reflect(GameConst.prototype, "utils.GameConst");
    /**构造对象
     * 泛型
     */
    // export function createInstance<T>(c: { new (): T; }): T {
    //     return new c();
    // }
    /**构造泛型数组
     * 一维数组
     */
    // export function allocArray<T>(dimension: number, instance: { new (): T; }): T[] {
    //     let arr: T[] = new Array<T>();
    //     for (let i = 0; i < dimension; i++) {
    //         arr[i] = utils.createInstance<T>(instance);
    //     }
    //     return arr;
    // }
    /**
     * 构造泛型数组
     * 二维数组
     * eg: alloc2Array<Number>(2,4,Number)  [2][4]
     * alloc2Array<tagWeaveItem>(2,4,tagWeaveItem) [2][4]
     */
    // export function alloc2Array<T>(dimension: number, count: number, instance: { new (): T; }): T[][] {
    //     //let arr: T[] = [];
    //     let arr: Array<Array<T>> = new Array<Array<T>>();
    //
    //     for (let i = 0; i < dimension; i++) {
    //         arr[i] = [];
    //         for (let j = 0; j < count; j++) {
    //             arr[i][j] = utils.createInstance<T>(instance);
    //         }
    //     }
    //
    //     return arr;
    // }
    /**
     * 构造数组
     * 三维数组
     * eg: alloc2Array<number>(2,4,4)  [2][4][4]
     */
    // export function alloc3Array<T>(dimension: number, count: number, count1: number, instance: { new (): T; }): T[][][] {
    //     let arr: T[][][] = [];
    //     for (let i = 0; i < dimension; i++) {
    //         arr[i] = [];
    //         for (let j = 0; j < count; j++) {
    //             arr[i][j] = [];
    //             for (let k = 0; k < count1; k++) {
    //                 arr[i][j][k] = utils.createInstance<T>(instance);
    //             }
    //         }
    //     }
    //
    //     return arr;
    // }
    var TWO_PWR_16_DBL = 1 << 16;
    var TWO_PWR_24_DBL = 1 << 24;
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
    /**
     * 自定义二进制数组
     * 读取和写入方法命名请根据服务器类型来
     */
    var ByteArray = (function () {
        function ByteArray(buffer) {
            if (buffer) {
                this.bytearray = new egret.ByteArray(buffer);
            }
            else {
                this.bytearray = new egret.ByteArray();
            }
            this.bytearray.endian = egret.Endian.LITTLE_ENDIAN; //数据的字节顺序
        }
        ByteArray.prototype.getLength = function () {
            return this.bytearray ? this.bytearray.length : 0;
        };
        ByteArray.prototype.Append_DOUBLE = function (value) {
            if (this.bytearray)
                this.bytearray.writeDouble(value);
        };
        ByteArray.prototype.Append_BOOL = function (value) {
            if (this.bytearray)
                this.bytearray.writeBoolean(value);
        };
        ByteArray.prototype.Append_WORD = function (value) {
            if (this.bytearray)
                this.bytearray.writeUnsignedShort(value);
        };
        ByteArray.prototype.Append_Byte = function (value) {
            if (this.bytearray)
                this.bytearray.writeByte(value);
        };
        ByteArray.prototype.Append_Bytes = function (value, offset, len) {
            if (offset === void 0) { offset = 0; }
            if (len === void 0) { len = 0; }
            if (this.bytearray)
                this.bytearray.writeBytes(value, offset, len);
        };
        ByteArray.prototype.Append_DWORD = function (value) {
            if (this.bytearray)
                this.bytearray.writeUnsignedInt(value);
        };
        //strLength 字符数组长度，根据服务端给的头文件定义赋值
        //TCHAR 和 WCHAR 都是宽字节
        ByteArray.prototype.Append_UTF16 = function (value, strLength) {
            var buf = new ArrayBuffer(value.length * 2);
            var bufView = new Uint16Array(buf);
            for (var i = 0, strLen = value.length; i < strLen; i++) {
                bufView[i] = value.charCodeAt(i);
            }
            var newByte = new egret.ByteArray(bufView.buffer);
            this.Append_Bytes(newByte);
            for (var i = 0; i < (strLength - value.length) * 2; i++) {
                this.Append_Byte(0);
            }
        };
        // SCORE 和 LONGLONG 都是int64
        ByteArray.prototype.Append_SCORE = function (value) {
            var list = this.numberToInt64(value);
            for (var i = list.length - 1; i >= 0; i--) {
                if (this.bytearray)
                    this.bytearray.writeByte(list[i]);
            }
        };
        ByteArray.prototype.Append_LONGLONG = function (value) {
            var list = this.numberToInt64(value);
            for (var i = list.length - 1; i >= 0; i--) {
                if (this.bytearray)
                    this.bytearray.writeByte(list[i]);
            }
        };
        ByteArray.prototype.Append_LONG = function (value) {
            if (this.bytearray)
                this.bytearray.writeInt(value);
        };
        ByteArray.prototype.Append_INT = function (value) {
            if (this.bytearray)
                this.bytearray.writeInt(value);
        };
        ByteArray.prototype.getByteArray = function () {
            return this.bytearray;
        };
        ByteArray.prototype.setByteArray = function (byte) {
            this.bytearray.setArrayBuffer(byte);
        };
        ByteArray.prototype.Pop_DOUBLE = function () {
            return this.bytearray ? this.bytearray.readDouble() : 0;
        };
        ByteArray.prototype.Pop_BOOL = function () {
            return this.bytearray ? this.bytearray.readBoolean() : false;
        };
        ByteArray.prototype.Pop_WORD = function () {
            return this.bytearray ? this.bytearray.readUnsignedShort() : 0;
        };
        ByteArray.prototype.Pop_Byte = function () {
            return this.bytearray ? this.bytearray.readByte() : 0;
        };
        ByteArray.prototype.Pop_Bytes = function (value, offset, len) {
            if (offset === void 0) { offset = 0; }
            if (len === void 0) { len = 0; }
            this.bytearray ? this.bytearray.readBytes(value, offset, len) : 0;
        };
        ByteArray.prototype.Pop_DWORD = function () {
            return this.bytearray ? this.bytearray.readUnsignedInt() : 0;
        };
        //strLength 字符数组长度，根据服务端给的头文件定义赋值
        //TCHAR 和 WCHAR 宽字节
        ByteArray.prototype.Pop_UTF16 = function (strLength) {
            if (this.bytearray) {
                var newbuffer = utils.Memory.newLitteEndianByteArray();
                utils.Memory.CopyMemory(newbuffer, this, strLength * 2, 0, this.bytearray.position);
                this.bytearray.position += strLength * 2;
                var byteArr = newbuffer.getByteArray();
                var str = String.fromCharCode.apply(null, new Uint16Array(byteArr.buffer));
                var strByte = utils.Memory.newLitteEndianByteArray();
                strByte.Append_Byte(0);
                strByte.Append_Byte(0);
                var strk = String.fromCharCode.apply(null, new Uint16Array(strByte.getByteArray().buffer));
                var strlength = str.length * 2;
                str = str.split(strk)[0];
                return str;
            }
            return "";
        };
        ByteArray.prototype.Pop_SCORE = function () {
            if (this.bytearray) {
                var low = this.bytearray.readInt();
                var high = this.bytearray.readInt();
                var num = high * TWO_PWR_32_DBL + low;
                if (num < 0) {
                    var div = 4294967296;
                    num = (div + num);
                }
                return num;
            }
            return 0;
        };
        ByteArray.prototype.Pop_LONGLONG = function () {
            if (this.bytearray) {
                var low = this.bytearray.readInt();
                var high = this.bytearray.readInt();
                var num = high * TWO_PWR_32_DBL + low;
                if (num < 0) {
                    var div = 4294967296;
                    num = (div + num);
                }
                return num;
            }
            return 0;
        };
        ByteArray.prototype.Pop_LONG = function () {
            return this.bytearray ? this.bytearray.readInt() : 0;
        };
        ByteArray.prototype.Pop_INT = function () {
            return this.bytearray ? this.bytearray.readInt() : 0;
        };
        ByteArray.prototype.clear = function () {
            if (this.bytearray) {
                this.bytearray.clear();
            }
        };
        ByteArray.prototype.position = function (offst) {
            if (this.bytearray) {
                this.bytearray.position = offst;
            }
        };
        ByteArray.prototype.getPosition = function () {
            return this.bytearray.position;
        };
        ByteArray.prototype.int64toNumber = function (bytes) {
            var sign = bytes[0] >> 7;
            var sum = 0;
            var digits = 1;
            for (var i = 0; i < 8; i++) {
                var value = bytes[7 - i];
                sum += (sign ? value ^ 0xFF : value) * digits;
                digits *= 0x100;
            }
            return sign ? -1 - sum : sum;
        };
        ByteArray.prototype.numberToInt64 = function (number) {
            var result = [];
            var sign = number < 0;
            if (sign)
                number = -1 - number;
            for (var i = 0; i < 8; i++) {
                var mod = number % 0x100;
                number = (number - mod) / 0x100;
                result[7 - i] = sign ? mod ^ 0xFF : mod;
            }
            return result;
        };
        return ByteArray;
    }());
    utils.ByteArray = ByteArray;
    __reflect(ByteArray.prototype, "utils.ByteArray");
    function getUnsignedByte(byte) {
        //防止溢出 0-0xFF
        if (byte > 0xFF) {
            byte = byte % 0x0100;
        }
        if (byte < 0) {
            //负数转换成无符号BYTE 0-0xFF
            byte = (byte + 0x0100) % 0x0100;
        }
        return byte;
    }
    utils.getUnsignedByte = getUnsignedByte;
    /**
     * 取主命令
     */
    function LOCMDID(s) {
        s = getUnsignedWORD(s);
        return getUnsignedWORD(s & 0x0fff);
    }
    utils.LOCMDID = LOCMDID;
    function getUnsignedWORD(word) {
        //防止溢出 0-0xFFFF
        if (word > 0xFFFF) {
            word = word % 0x00010000;
        }
        if (word < 0) {
            // 0-0xFFFF
            word = (word + 0x00010000) % 0x00010000;
        }
        return word;
    }
    utils.getUnsignedWORD = getUnsignedWORD;
    /**
     * 取服务标识码
     */
    function HICMDID(s) {
        s = getUnsignedWORD(s);
        return getUnsignedByte(s >> 12);
    }
    utils.HICMDID = HICMDID;
    /**生成命令
     * @param a 主命令码
     * @param b 服务标识
     */
    function MAKECMDID(a, b) {
        a = getUnsignedWORD(a);
        b = getUnsignedByte(b);
        return getUnsignedWORD((getUnsignedWORD(a & 0x0fff)) | (getUnsignedWORD(b & 0x0f)) << 12);
    }
    utils.MAKECMDID = MAKECMDID;
    function getUnsignedDWORD(dword) {
        //防止溢出 0-0xFFFFFFFF
        if (dword > 0xFFFFFFFF) {
            dword = dword % 0x100000000;
        }
        if (dword < 0) {
            // 0-0xFFFFFFFF
            dword = (dword + 0x100000000) % 0x100000000;
        }
        return dword;
    }
    utils.getUnsignedDWORD = getUnsignedDWORD;
})(utils || (utils = {}));
