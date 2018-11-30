namespace game {

    export interface IUserInfo {
        nickName: string,
        gender: number, //0-未知,1-男，2-女
    }

    const CARDS_CONFIG = {
        x: 347,//375
        y: 1962,
        off: 4,
        r: 800,
    };

    export class GameScenesLayer extends eui.Component {

        public preview_bg: eui.Image;
        public group_btn: eui.Group;
        public btn_share_cards: eui.Button;
        public btn_get_gold: eui.Button;
        public btn_pass: eui.Button;
        public btn_out_cards: eui.Button;

        constructor() {
            super();
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            console.log("游戏开始界面");
        }

        private onComplete() {
            console.log("游戏场景界面组件初始化完毕");
            this.initCards([1]);
            this.initBtn();
        }

        private _cards: any = [];

        /**=========================初始化各类组件逻辑=============================*/
        private initCards(cards: number[]) {
            for (let n = 0; n < 14; n++) {
                let cards = new Poker(0x01);//0x01
                let index = this.getIndex(n, 14);
                let angle = 90 - index * CARDS_CONFIG.off;
                cards.x = CARDS_CONFIG.x + Math.cos(((2 * Math.PI) / 360) * angle) * CARDS_CONFIG.r;
                cards.y = CARDS_CONFIG.y - Math.sin(((2 * Math.PI) / 360) * angle) * CARDS_CONFIG.r;
                let rotation = Math.abs(90 - angle);
                if (angle > 90) {
                    cards.rotation = -rotation;
                } else {
                    cards.rotation = rotation;
                }
                this.addChild(cards);
                this._cards.push(cards);
                // console.log("初始化",cards.status);
            }
        }

        /**
         * 添加各类按钮事件
         * */
        private initBtn() {
            this.btn_out_cards.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOutCards, this);
        }

        /**==========================按钮事件============================*/
        private onOutCards() {
            this._cards.forEach(poker => {
                console.log(poker.status);
            });
            for (let n = 0; n < this._cards.length;) {
                if (this._cards[n].status == true) {
                    let card = this._cards.splice(n, 1)[0];
                    this.removeChild(card);
                } else {
                    n++;
                }
            }
            this.moveCards();
        }

        /**======================================================*/

        /**==========================数据处理============================*/
        private getIndex(index: number, length: number): number {
            //center = 8;
            let center = (length % 2) ? Math.floor(length / 2) : length / 2;
            return index - center;
        }

        private moveCards() {
            //生成新位置的配置
            let config: any[] = [];
            for (let n = 0; n < this._cards.length; n++) {
                let index = this.getIndex(n, this._cards.length);
                let angle = 90 - index * CARDS_CONFIG.off;
                let rotation = Math.abs(90 - angle);
                let last;
                if (angle > 90) {
                    last = -rotation;
                } else {
                    last = rotation;
                }
                let item = {
                    x: CARDS_CONFIG.x + Math.cos(((2 * Math.PI) / 360) * angle) * CARDS_CONFIG.r,
                    y: CARDS_CONFIG.y - Math.sin(((2 * Math.PI) / 360) * angle) * CARDS_CONFIG.r,
                    rotation: last
                };
                config.push(item);

            }
            this.moveCardsByConfig(config);
        }

        /**
         * 通过配置移动手牌
         * */
        private moveCardsByConfig(config: any[]) {
            for (let n = 0; n < this._cards.length; n++) {
                egret.Tween.get(this._cards[n]).to(config[n], 100);
            }
        }
        /**======================================================*/


        /**=========================服务端消息=============================*/
        /**
         * 更新用户信息
         * */
        onUpdateUser(user: IUserInfo) {
            console.log("更新用户信息:", user);
        }
    }
}