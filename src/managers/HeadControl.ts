/**
 * 头像管理类
 * 下载第三方头像
 * 负责更新头像
 */

namespace managers {
    export class HeadControl {
        /**
        *单例实例 
        */
        private static m_sInstance: HeadControl;

        /**构建实例 */
        public static getInstance(): HeadControl {
            if (this.m_sInstance == null) {
                this.m_sInstance = new HeadControl();
                this.m_sInstance.init();
            }
            return this.m_sInstance;
        }

        /**
        * 初始化
        */
        public init(): void {

        }

        /**会员标识 */
        public getMemberRes(item: any) {

            if (item.cbMemberOrder) {
                const cbMember = item.cbMemberOrder;
                if (cbMember > 0 && cbMember < 9) {
                    return "benefit_diamond_type_6_png";
                } else if (cbMember > 8 && cbMember < 12) {
                    return "benefit_diamond_type_9_png";
                } else if (cbMember > 11 && cbMember < 15) {
                    return "benefit_diamond_type_12_png";
                } else {
                    return "benefit_diamond_type_15_png";
                }
            }
        }

        /**设置头像纹理 */
        public updateHeadTexture(head: models.HeadSprite, user: any) {
            if (user.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                //从缓存中读取
                if (null != head) {
                    let bmd: egret.BitmapData = managers.FrameManager.getInstance().m_TextureCache;
                    if (null != bmd) {
                        let texture = new egret.Texture();
                        texture.bitmapData = bmd;
                        head.getHeadTxture().texture = texture;
                        return;
                    }
                }
            }

            //请求头像地址
            let httpURL = "http://testservice.foxuc.com/CustomFace.aspx?";
            let params = "UserID=" + user.dwUserID + "&CustomID=" + user.dwCustomID + "&TypeID=1";

            let onCompleteHandler = (e: egret.Event) => {
                console.log("请求成功");
                //头像地址
                let headUrl: string = e.target.response;

                try {
                    //下载位图
                    let downLoad = new models.ImageDownLoad(headUrl, (bmd: egret.BitmapData) => {
                        if (null != head && null != head.getHeadTxture()) {
                            let texture = new egret.Texture();
                            texture.bitmapData = bmd;
                            if (texture.textureWidth == 0 || texture.textureHeight == 0) return;
                            head.getHeadTxture().texture = texture;
                        }

                        //保存数据
                        if (user.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                            managers.FrameManager.getInstance().m_TextureCache = bmd;
                        }
                    })
                } catch (error) {
                    console.log("头像下载失败");
                    
                }
            };

            let onErrorHandler = (e: egret.Event) => {
                console.log("请求失败");
            }
            
            utils.HttpRequest.createHttpRequest(this, httpURL, params, egret.HttpMethod.GET, onCompleteHandler, onErrorHandler);
        }
    }
}

