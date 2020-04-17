/**
 * customEvent 自定义事件
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var customEvent;
(function (customEvent) {
    var CustomEvent = (function (_super) {
        __extends(CustomEvent, _super);
        /**
         * 构造方法
         */
        function CustomEvent(type, bubbles, cancelable, data) {
            return _super.call(this, type, bubbles, cancelable, data) || this;
        }
        /**
        * 进入后台
        */
        CustomEvent.EVENT_ENTER_BACKGROUND = "enterBackGround";
        /**
        * 进入前台
        */
        CustomEvent.EVENT_BECOME_ACTIVE = "becomeActive";
        /**
         * 验证成功
         */
        CustomEvent.EVENT_VALIDATE_SUCCESS = "validateSuccess";
        /**
         * 连接完成
         */
        CustomEvent.EVENT_CONNECT_COMPLETE = "connectComplete";
        /**
         * 消息分发
         */
        CustomEvent.EVENT_MESSAGE_DISPATCH = "messageDispatch";
        /**
         * 连接失败
         */
        CustomEvent.EVENT_CONNECT_FAIlURE = "connectFailure";
        /**
         * 大厅刷新
         */
        CustomEvent.EVENT_PLAZA_REFRESH = "plazaFresh";
        /**
         * 房间刷新
         */
        CustomEvent.EVENT_ROOM_REFRESH = "roomRefresh";
        /**
         * 商城刷新
         */
        CustomEvent.EVENT_SHOP_REFRESH = "shopRefresh";
        /**
         * 约战个人信息刷新
         */
        CustomEvent.EVENT_BATTLE_INFO_REFRESH = "battleInfoRefresh";
        /**
         * 约战消耗刷新
         */
        CustomEvent.EVENT_BATTLE_REFRESH = "battleFresh";
        /**
         * 用戶进入
         */
        CustomEvent.EVENT_USER_ENTER = "userEnter";
        /**
         * 用户状态
         */
        CustomEvent.EVENT_USER_STATUS = "userStatus";
        /**用户分数 */
        CustomEvent.EVENT_USER_SCORE = "userScore";
        /**
         * 用户重连
         * */
        CustomEvent.EVENT_RE_CONNECT = "reConnect";
        return CustomEvent;
    }(egret.Event));
    customEvent.CustomEvent = CustomEvent;
    __reflect(CustomEvent.prototype, "customEvent.CustomEvent");
})(customEvent || (customEvent = {}));
