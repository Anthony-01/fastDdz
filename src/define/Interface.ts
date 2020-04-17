namespace df {

    /*df
   *接口定义
   */
    export interface IController {
        /**
         * 控制器名称
         */
        name: string;

        /**
         * 视图切换
         */
        _treeWalker?: TreeWalker;

        /** controller生命周期*/

        /**
         * 场景将要切入
         */
        viewWillAppear(animated: boolean): void;

        /**
         * 场景切入 
         */
        viewDidAppear(animated: boolean): void;

        /**
         * 场景将要退出
         */
        viewWillDisappear(animated: boolean): void;

        /**
         * 场景退出
         */
        viewDidDisappear(animated: boolean): void;

        /**
         * 回收资源
         */
        dealloc(): void;

        /**
         * 进入前台
         */
        applicationDidBecomeActive(event: any): void;

        /**
         * 进入后台
         */
        applicationWillEnterForeground(event: any): void;

    }


    /**
     * 游戏接口
     */
    export interface IGameMessage {
        /**
         * 游戏场景
         */
        onGameScene(status: number,buffer: any): void;

        /**
         * 游戏协议
         */
        onGameMessage(buffer: any): void;

        /**
         * 系统消息
         */
        onGameSystemMessage(buffer: any): void;
    }

    /**
     * 用户服务
     */
    export interface IUserService {
        /**
        * 用户进入
        */
        onUserEnter(buffer: any): void;

        /**
         * 用户状态
         */
        onUserStatus(buffer: any): void;

        /**
         * 用户聊天
         */
        onUserChat(buffer: any): void;

        /**
         * 用户分数
         */
        onUserScore(buffer: any): void;

        /**
         * 发送聊天
         */
        onSendChat(type:number,data: any);
    }

    /**
     * socket绑定
     */
    export interface IConnectSocket {
        /**
         * 绑定成功
         */
        socketConnectSuccess();

        /**
         * 绑定失败
         */
        socketConnectFailure?();
    }

    /**socket 服务
     * 关闭socket
     * 重连机制
     */
    export interface ISocketService {

        /***
         * 重连次数
         */
        m_ReConnectCount: number;

        /**
         * 最大连接
         */
        m_ReConnectMax: number;

        /**
         * 连接超时
         */
        m_ReConnectTimeOut: number;

        /**
        * 关闭服务
        */
        closeService();

        /**
         * 重连机制
         */
        onReconnect(szTips?: string);

        /**
         * 重连超时
         */
        onReconnectTimeOut();

        /**
         * 重连失败
         */
        onReconnectFailure();

    }

    /**
    * 对话框接口
    */
    export interface IDialog {
        /**
         * 确定事件
         */
        onSure(): void;

        /**
         * 取消事件
         */
        onCancell(): void
    }

    /**
     * 阻断触摸
     */
    export interface IPopWait {
        /**
         * 超时处理
         */
        onTimeOut(): void;

        /**
         * 关闭
         */
        onClose?(): void;
    }
}