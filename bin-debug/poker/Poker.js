// namespace game {
//     const pokerWidth = 132;
//     const pokerHeight = 180;
//     export const SELECT_CARD = "SELECT_CARD_mp3";
//     export class Poker extends eui.Component {
//
//         private poker: egret.Bitmap = new egret.Bitmap();
//         public value : number = NaN;
//         private _pokerShadow: egret.Bitmap;
//
//         private positiveRes: string;
//         private negativeRes: string;
//         constructor(value: number, anchorOffset?: boolean) {
//             super();
//             this.value = value;
//             this.positiveRes = "poker_" + this.getColor(value) + this.getValue(value).toString(16).toUpperCase();
//             this.negativeRes = "poker_bg_0";
//             this.poker.texture = RES.getRes(this.negativeRes);
//             this.addChild(this.poker);
//             if (!anchorOffset) {
//                 this.poker.anchorOffsetX = pokerWidth / 2;
//                 this.poker.anchorOffsetY = pokerHeight / 2;
//                 if (null == this._pokerMask) {
//                     this._pokerShadow = new egret.Bitmap(RES.getRes("poker_mask_png"));
//                     this._pokerShadow.anchorOffsetX = this._pokerShadow.width / 2;
//                     this._pokerShadow.anchorOffsetY = this._pokerShadow.height / 2;
//                     this.addChild(this._pokerShadow);
//                 }
//             }
//             this.init();
//             this._pokerMask = new eui.Rect(122, 172, 0x000000);
//             this._pokerMask.x = -61;
//             this._pokerMask.y = - 86;
//             this._pokerMask.ellipseWidth = 45;
//             this._pokerMask.ellipseHeight = 60;
//             // console.log(this.width);
//             this._pokerMask.fillAlpha = 0.3;
//             //增加一张图片；
//         }
//
//         changeToBack() {
//             this.poker.texture = RES.getRes(this.negativeRes);
//         }
//
//         /**
//          * 翻牌动画
//          * */
//         changeToFront() {
//             this.poker.texture = RES.getRes(this.positiveRes);
//             // return new Promise((resolve, reject) => {
//             //     egret.Tween.get(this.poker).to({scaleX: 0}, 30).call(() => {
//             //         this.poker.texture = RES.getRes(this.positiveRes);
//             //         //层级变化
//             //     }).to({scaleX: 1}, 30).call(() => {
//             //         //层级变化
//             //         resolve();
//             //     });
//             // });
//
//         }
//
//         private init() {
//             // this.touchEnabled = true;
//             // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChosen, this);
//         }
//
//         private _pokerMask: eui.Rect;
//         private chosenStatus: boolean = false;
//         private onChosen() {
//             this.chosenStatus = !this.chosenStatus;
//             if (this.chosenStatus) {
//                 sound.SoundManager.getIns().playSound(SELECT_CARD, 1, 300);
//                 this.y -= 30;
//             } else {
//                 this.y += 30;
//             }
//         }
//
//         addMask() {
//             if (null == this._pokerMask) {
//                 this._pokerMask = new eui.Rect(this.width, this.height, 0x000000);
//                 this._pokerMask.fillAlpha = 0.6;
//             }
//             this.addChild(this._pokerMask);
//         }
//
//         removeMask() {
//             if (this._pokerMask) {
//                 utils.GameConst.removeChild(this._pokerMask);
//             }
//         }
//
//         get status(): boolean {
//             return this.chosenStatus;
//         }
//
//         toggleSelected() {
//             this.onChosen();
//         }
//
//         getColor(value: number): number {
//             return value >> 4;
//         }
//
//         getValue(value: number): number {
//             return 0x0F & value;
//         }
//
//         ontOut() {
//             if (this.chosenStatus == true) {
//                 this.onChosen();
//             }
//             this.removeMask();
//         }
//     }
// } 
