// namespace df {
//     /**
//      * df  常量定义
//      */
//     export const INVALID_BYTE = 0xFF;
//     export const INVALID_WORD = 0xFFFF;
//     export const INVALID_DWORD = 0xFFFFFFFF
//     export const Len_Tcp_Head = 8;  //包头固定长度
//     export const Len_Tcp_Info = 4;  //数据信息长度
//     export const SOCKET_TCP_BUFFER = 16384;//网络缓冲
//
//     /**
//      * 消息处理单元
//      */
//     export const MAX_UNIT: number = 100;
//
//     /**
//      * 默认时间
//      */
//     export const Default_Time_Out = 20000;
//     //////////////////////////////////////////////////////////////////////////////////////////////
//     //内核命令
//     export const MDM_KN_COMMAND = 0;									    //内核命令
//
//     //内核命令
//     export const SUB_KN_DETECT_SOCKET = 1;									    //检测命令
//     export const SUB_KN_SHUT_DOWN_SOCKET = 2;									    //关闭命令
//
//     /**
//      * 连接状态
//      */
//     export const enum eSocketStatus {
//         soc_unConnect = 0,
//         soc_connecting = 1,
//         soc_connected = 2,
//         soc_error = 3
//     }
//
//     /**
//      * 服务器类型
//      * */
//     export const enum eServerKind {
//         //未知类型
//         DEFAULT = 0,
//         //广场类型
//         PLAZA = 1,
//         //约战类型
//         GATEWAY = 2,
//         //游戏类型
//         SERVER = 4
//     }
// }