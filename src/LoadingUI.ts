//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace game {
    const loadingWeight = 436;
    const loadingHeight = 10;
    const process_x = 0;//0-278
    const dot_x = 353;//75
    export class LoadingUI extends eui.Component implements RES.PromiseTaskReporter { //implements RES.PromiseTaskReporter

        public img_bg:eui.Image;
        public img_logo:eui.Image;
        public img_female:eui.Image;
        public loading_group:eui.Group;
        public process_bg:eui.Image;
        public process_mask:eui.Image;
        public process:eui.Image;
        public _text:eui.Label;
        public _dot:eui.Image;
        public img_loading_logo:eui.Image;

        public constructor() {
            super();
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            console.log("游戏加载界面");
        }

        private _textMsg: string = "";
        public setText(str: string) {
            this._textMsg = str;
        }

        private onComplete() {
            this.adjustScreen();
            console.log("游戏加载界面组件初始化完毕");
            this.process.mask = this.process_mask;
            this._text.text = "正在加载 0%";
        }

        private _components: any[] = [];
        private _scaleComponent: any[] = [];
        private adjustScreen() {

            // this._components.push(this.img_bg);
            this._components.push(this.img_logo);
            this._components.push(this.img_female);
            this._components.push(this.loading_group);
            // this._components.push(this.process_mask);
            // this._components.push(this.process);
            // this._components.push(this._text);
            // this._components.push(this._dot);
            this._components.push(this.img_loading_logo);

            this._components.forEach(component => {
                component.y = component.y * RATE;
            });

            this._scaleComponent.push(this.img_logo);
            this._scaleComponent.push(this.img_female);
            // this._scaleComponent.push(this.loading_group);
            this._scaleComponent.forEach(component => {
                component.scaleX = component.scaleY = component.scaleX * RATE;
            })
        }

        public onProgress(current: number, total: number, resItem): void {
            let rate = Math.ceil((current/total)*100) / 100;
            if (this._text) {
                this._text.text = `正在加载 ${Math.ceil((current/total) * 100)}%`;
                this.process.x = process_x + rate * loadingWeight;
                this._dot.x = dot_x + rate * loadingWeight;
            }
            // if (rate * 100 >= 34) {
            // }
            // console.log(resItem);

            // console.log("loading:", resItem);
        }
    }
}
