/**
 * 头像管理类
 * 下载第三方头像
 * 负责更新头像
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var managers;
(function (managers) {
    var HeadControl = (function () {
        function HeadControl() {
        }
        /**构建实例 */
        HeadControl.getInstance = function () {
            if (this.m_sInstance == null) {
                this.m_sInstance = new HeadControl();
                this.m_sInstance.init();
            }
            return this.m_sInstance;
        };
        /**
        * 初始化
        */
        HeadControl.prototype.init = function () {
        };
        /**会员标识 */
        HeadControl.prototype.getMemberRes = function (item) {
            if (item.cbMemberOrder) {
                var cbMember = item.cbMemberOrder;
                if (cbMember > 0 && cbMember < 9) {
                    return "benefit_diamond_type_6_png";
                }
                else if (cbMember > 8 && cbMember < 12) {
                    return "benefit_diamond_type_9_png";
                }
                else if (cbMember > 11 && cbMember < 15) {
                    return "benefit_diamond_type_12_png";
                }
                else {
                    return "benefit_diamond_type_15_png";
                }
            }
        };
        /**设置头像纹理 */
        HeadControl.prototype.updateHeadTexture = function (head, user) {
            if (user.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                //从缓存中读取
                if (null != head) {
                    var bmd = managers.FrameManager.getInstance().m_TextureCache;
                    if (null != bmd) {
                        var texture = new egret.Texture();
                        texture.bitmapData = bmd;
                        head.getHeadTxture().texture = texture;
                        return;
                    }
                }
            }
            //请求头像地址
            var httpURL = "http://testservice.foxuc.com/CustomFace.aspx?";
            var params = "UserID=" + user.dwUserID + "&CustomID=" + user.dwCustomID + "&TypeID=1";
            var onCompleteHandler = function (e) {
                console.log("请求成功");
                //头像地址
                var headUrl = e.target.response;
                try {
                    //下载位图
                    var downLoad = new models.ImageDownLoad(headUrl, function (bmd) {
                        if (null != head && null != head.getHeadTxture()) {
                            var texture = new egret.Texture();
                            texture.bitmapData = bmd;
                            if (texture.textureWidth == 0 || texture.textureHeight == 0)
                                return;
                            head.getHeadTxture().texture = texture;
                        }
                        //保存数据
                        if (user.dwUserID == managers.FrameManager.getInstance().m_GlobalUserItem.dwUserID) {
                            managers.FrameManager.getInstance().m_TextureCache = bmd;
                        }
                    });
                }
                catch (error) {
                    console.log("头像下载失败");
                }
            };
            var onErrorHandler = function (e) {
                console.log("请求失败");
            };
            utils.HttpRequest.createHttpRequest(this, httpURL, params, egret.HttpMethod.GET, onCompleteHandler, onErrorHandler);
        };
        return HeadControl;
    }());
    managers.HeadControl = HeadControl;
    __reflect(HeadControl.prototype, "managers.HeadControl");
})(managers || (managers = {}));
