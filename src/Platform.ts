/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {

    getUserInfo(): Promise<any>;

    //登录功能接口
    login(): Promise<any>
    //分享功能接口
    shop(): Promise<any>
    //主动转发
    shareAppMessage(): Promise<any>
    //游戏圈
    createGameClubButton(): Promise<any>
    //排行榜
    openDataContext: openData
    //截图分享功能
    screenShop(rate: number): Promise<any>
    //获取屏幕宽高
    getScreenWidth(): Promise<any>
    //领取金币并转发
    getGold(): Promise<any>;
    //获取授权
    getAuthSetting(rate: number): Promise<any>;
    //检测网络状态
    onNetworkStatus(): Promise<any>;
    //检测微信网络
    addWXNetStatusChange(delegate: any): void;
    //检测微信进入后台返回前台
    addWXOnHide(delegate: any): void;
    //使用微信的WebSocket接口进行通信
    connectWxSocket(url: string, obj: any): void;
}

class DebugPlatform implements Platform {
    constructor() {
        this.openDataContext = new openData();
    }

    async getUserInfo() {
        return { nickName: "username" }
    }
    async login() {
        //模拟微信获取userInfo接口
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    code: "string",
                    rawData: "string",
                    encryptedData: "string",
                    iv: "string",
                    signature: "string",
                    nickName: "string"
                })
            }, 1000)
        })
    }
    async shop() {}
    async shareAppMessage() {}
    async createGameClubButton() {}
    async screenShop(rate: number) {}
    async getScreenWidth() {}
    async getGold() {}
    async getAuthSetting(rate: number) {}
    async onNetworkStatus() {}
    addWXNetStatusChange(delegate: any) {}
    addWXOnHide(delegate: any) {}
    connectWxSocket(url: string, obj: any) {}

    openDataContext: openData
}

class openData {
    async postMessage (param: any) {
        console.log("");
    }

    createDisplayObject(param: any, param1: any, param2: any): egret.Bitmap {
        return
    }
}


if (!window.platform) {
    window.platform = new DebugPlatform();
}



declare let platform: Platform;

declare interface Window {

    platform: Platform
}





