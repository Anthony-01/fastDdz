namespace utils {
    export class GameConst {

        public static stageW: number = 750;

        public static stageH: number = 1624;

        public static GAME_PLAYER = 3;

        public static createBitmapByName(name: string) : egret.Bitmap {
            let texture: egret.Texture = RES.getRes(name);
            if (null == texture) {
                console.log("%c创建纹理失败：", "color: green;font-size: 4em");
                console.error(name);
                return;
            }
            let bitmap: egret.Bitmap = new egret.Bitmap(texture);
            return bitmap;
        }

        public static getStrLen (str: string) {
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                let c = str.charCodeAt(i);
                //单字节加1
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    len++;
                }
                else {
                    len += 2;
                }
            }
            return len;
        }

        public static createBitmapFromSheet(name: string, sheet: string) : egret.Bitmap {
            let texture: egret.Texture = RES.getRes(`${sheet}_json.${name}`);
            if (null == texture) {
                console.log("%c创建纹理失败：", "color: green;font-size: 5em");
                console.error(`${sheet}_json.${name}`);
                return;
            }
            let bitmap: egret.Bitmap = new egret.Bitmap(texture);
            return bitmap;
        }

        public static removeChild(child: egret.DisplayObject) {
            if (child && child.parent) {
                if ((<any>child.parent).removeElement) {
                    (<any>child.parent).removeElement(child);
                } else {
                    child.parent.removeChild(child);
                }
            }
        }

        public static removeFatherMask(child: egret.DisplayObject) {
            if (child && child.parent) {
                if (<any>child.parent["_rulerMaster"]) {
                    child.parent.removeChild(child.parent["_rulerMaster"]);
                }
            }
        }


        public static setAnchorCenter(object: egret.DisplayObject): egret.DisplayObject {
            if ((null != object) && (object.width >= 0 && (object.height >= 0))) {
                object.anchorOffsetX = object.width / 2;
                object.anchorOffsetY = object.height / 2;
                return object;
            }
            return
        }

        /**
         * 转化金币数量为显示
         * 金币显示总共四位
         * */
        public static transformScore(score: number): string {
            let back = "";
            if (score >= 10000) {
                let front = Math.floor(score / 10000).toString();
                if (front.length < 4) {
                    back += front + ".";
                    let behindLength = 4 - front.length;//后面的位数
                    let behindCount = (Math.floor(score % 10000) / 10000);
                    for (let n = 0; n < behindLength; n++) {
                        back += Math.floor(behindCount * 10);
                        behindCount = behindCount * 10 - Math.floor(behindCount * 10);
                    }
                    back = back + "万";
                } else {
                    back = front + "万";
                }
                // let behind = Math.floor(score % 10000);
                // let tansScore = front + behind / 10000;
                // back += tansScore + "万";
            } else {
                back += Math.floor(score);
            }
            return back;
        }

        public static colorConsole(msg: string) {
            console.log(`%c${msg}`, "color: red;font-size: 1.5em");
        }

        public logPoker(cards: number[]) {
            let back = [];
            cards.forEach( value => {
                back.push(this.getWeight(value));
            });
            GameConst.colorConsole("发送扑克：");
            console.log(back);
        }

        public getWeight(value: number) {
            let logicValue = value & 0x0F;
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

        public static m_Ins: GameConst;

        public static getInstance() {
            if (null == this.m_Ins) {
                this.m_Ins = new GameConst;
            }
            return this.m_Ins;
        }

        public static getCell(apart: number): number {
            let back;
            apart >= 0 ? back = 1 : back = -1;
            let abs = Math.abs(apart);
            back *= Math.ceil(abs / 100);
            return back;
        }

    }

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
    export class ByteArray {
        private bytearray: egret.ByteArray;

        public constructor(buffer?: ArrayBuffer) {
            if (buffer) {
                this.bytearray = new egret.ByteArray(buffer);
            } else {
                this.bytearray = new egret.ByteArray();
            }
            this.bytearray.endian = egret.Endian.LITTLE_ENDIAN;//数据的字节顺序
        }

        public getLength(): number {
            return this.bytearray ? this.bytearray.length : 0;
        }
        public Append_DOUBLE(value: number): void {
            if (this.bytearray)
                this.bytearray.writeDouble(value);
        }
        public Append_BOOL(value: boolean): void {
            if (this.bytearray)
                this.bytearray.writeBoolean(value);
        }
        public Append_WORD(value: number): void {
            if (this.bytearray)
                this.bytearray.writeUnsignedShort(value);
        }

        public Append_Byte(value: number): void {
            if (this.bytearray)
                this.bytearray.writeByte(value);
        }

        public Append_Bytes(value: egret.ByteArray, offset: number = 0, len: number = 0): void {
            if (this.bytearray)
                this.bytearray.writeBytes(value, offset, len);
        }

        public Append_DWORD(value: number): void {
            if (this.bytearray)
                this.bytearray.writeUnsignedInt(value);
        }
        //strLength 字符数组长度，根据服务端给的头文件定义赋值
        //TCHAR 和 WCHAR 都是宽字节
        public Append_UTF16(value: string, strLength: number): void {
            var buf = new ArrayBuffer(value.length * 2);
            var bufView = new Uint16Array(buf);
            for (var i = 0, strLen = value.length; i < strLen; i++) {
                bufView[i] = value.charCodeAt(i);
            }

            var newByte: egret.ByteArray = new egret.ByteArray(bufView.buffer);
            this.Append_Bytes(newByte);
            for (var i = 0; i < (strLength - value.length) * 2; i++) {
                this.Append_Byte(0);
            }
        }
        // SCORE 和 LONGLONG 都是int64
        public Append_SCORE(value: number): void {

            let list: number[] = this.numberToInt64(value);
            for (let i: number = list.length - 1; i >= 0; i--) {
                if (this.bytearray)
                    this.bytearray.writeByte(list[i]);
            }
        }
        public Append_LONGLONG(value: number): void {

            let list: number[] = this.numberToInt64(value);
            for (let i: number = list.length - 1; i >= 0; i--) {
                if (this.bytearray)
                    this.bytearray.writeByte(list[i]);
            }
        }

        public Append_LONG(value: number): void {
            if (this.bytearray)
                this.bytearray.writeInt(value);
        }

        public Append_INT(value: number): void {
            if (this.bytearray)
                this.bytearray.writeInt(value);
        }

        public getByteArray(): egret.ByteArray {
            return this.bytearray;
        }
        public setByteArray(byte: ArrayBuffer) {
            this.bytearray.setArrayBuffer(byte);
        }
        public Pop_DOUBLE(): number {
            return this.bytearray ? this.bytearray.readDouble() : 0;
        }
        public Pop_BOOL(): boolean {
            return this.bytearray ? this.bytearray.readBoolean() : false;
        }
        public Pop_WORD(): number {
            return this.bytearray ? this.bytearray.readUnsignedShort() : 0;
        }

        public Pop_Byte(): number {
            return this.bytearray ? this.bytearray.readByte() : 0;
        }

        public Pop_Bytes(value: egret.ByteArray, offset: number = 0, len: number = 0): void {
            this.bytearray ? this.bytearray.readBytes(value, offset, len) : 0;
        }
        public Pop_DWORD(): number {
            return this.bytearray ? this.bytearray.readUnsignedInt() : 0;
        }
        //strLength 字符数组长度，根据服务端给的头文件定义赋值
        //TCHAR 和 WCHAR 宽字节
        public Pop_UTF16(strLength: number): string {
            if (this.bytearray) {
                var newbuffer: ByteArray = Memory.newLitteEndianByteArray();
                Memory.CopyMemory(newbuffer, this, strLength * 2, 0, this.bytearray.position);
                this.bytearray.position += strLength * 2;
                var byteArr = newbuffer.getByteArray();
                var str = String.fromCharCode.apply(null, new Uint16Array(byteArr.buffer));
                var strByte: ByteArray = Memory.newLitteEndianByteArray();
                strByte.Append_Byte(0);
                strByte.Append_Byte(0);
                var strk = String.fromCharCode.apply(null, new Uint16Array(strByte.getByteArray().buffer));
                var strlength = str.length * 2;
                str = str.split(strk)[0];
                return str;
            }
            return "";
        }

        public Pop_SCORE(): number {
            if (this.bytearray) {
                var low: number = this.bytearray.readInt();
                var high: number = this.bytearray.readInt();
                var num: number = high * TWO_PWR_32_DBL + low;
                if (num < 0) {
                    var div: number = 4294967296;
                    num = (div + num);
                }
                return num;
            }

            return 0;
        }
        public Pop_LONGLONG(): number {
            if (this.bytearray) {
                var low: number = this.bytearray.readInt();
                var high: number = this.bytearray.readInt();
                var num: number = high * TWO_PWR_32_DBL + low;
                if (num < 0) {
                    var div: number = 4294967296;
                    num = (div + num);
                }
                return num;
            }

            return 0;
        }
        public Pop_LONG(): number {
            return this.bytearray ? this.bytearray.readInt() : 0;
        }

        public Pop_INT(): number {
            return this.bytearray ? this.bytearray.readInt() : 0;
        }

        public clear() {
            if (this.bytearray) {
                this.bytearray.clear();
            }
        }

        public position(offst: number) {
            if (this.bytearray) {
                this.bytearray.position = offst;
            }
        }

        public getPosition(): number {
            return this.bytearray.position;
        }

        private int64toNumber(bytes) {
            let sign = bytes[0] >> 7;
            let sum = 0;
            let digits = 1;
            for (let i = 0; i < 8; i++) {
                let value = bytes[7 - i];
                sum += (sign ? value ^ 0xFF : value) * digits;
                digits *= 0x100;
            }
            return sign ? -1 - sum : sum;
        }

        private numberToInt64(number) {
            let result = [];
            let sign = number < 0;
            if (sign) number = -1 - number;
            for (let i = 0; i < 8; i++) {
                let mod = number % 0x100;
                number = (number - mod) / 0x100;
                result[7 - i] = sign ? mod ^ 0xFF : mod;
            }
            return result;
        }
    }

    export function getUnsignedByte(byte): number {
        //防止溢出 0-0xFF
        if (byte > 0xFF) {
            byte = byte % 0x0100
        }
        if (byte < 0) {
            //负数转换成无符号BYTE 0-0xFF
            byte = (byte + 0x0100) % 0x0100;
        }
        return byte
    }

    /**
     * 取主命令
     */
    export function LOCMDID(s) {
        s = getUnsignedWORD(s);
        return getUnsignedWORD(s & 0x0fff)
    }

    export function getUnsignedWORD(word): number {
        //防止溢出 0-0xFFFF
        if (word > 0xFFFF) {
            word = word % 0x00010000
        }
        if (word < 0) {
            // 0-0xFFFF
            word = (word + 0x00010000) % 0x00010000;
        }
        return word;
    }

    /**
     * 取服务标识码
     */
    export function HICMDID(s) {
        s = getUnsignedWORD(s);
        return getUnsignedByte(s >> 12);
    }

    /**生成命令
     * @param a 主命令码
     * @param b 服务标识
     */
    export function MAKECMDID(a, b) {
        a = getUnsignedWORD(a);
        b = getUnsignedByte(b);
        return getUnsignedWORD((getUnsignedWORD(a &0x0fff)) | (getUnsignedWORD(b & 0x0f)) << 12);
    }

    export function getUnsignedDWORD(dword): number {
        //防止溢出 0-0xFFFFFFFF
        if (dword > 0xFFFFFFFF) {
            dword = dword % 0x100000000
        }
        if (dword < 0) {
            // 0-0xFFFFFFFF
            dword = (dword + 0x100000000) % 0x100000000;
        }
        return dword;
    }
}