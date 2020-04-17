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
var game;
(function (game) {
    var loadingWeight = 436;
    var loadingHeight = 10;
    var process_x = 0; //0-278
    var dot_x = 353; //75
    var LoadingUI = (function (_super) {
        __extends(LoadingUI, _super);
        function LoadingUI() {
            var _this = _super.call(this) || this;
            _this._textMsg = "";
            _this._components = [];
            _this._scaleComponent = [];
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            console.log("游戏加载界面");
            return _this;
        }
        LoadingUI.prototype.setText = function (str) {
            this._textMsg = str;
        };
        LoadingUI.prototype.onComplete = function () {
            this.adjustScreen();
            console.log("游戏加载界面组件初始化完毕");
            this.process.mask = this.process_mask;
            this._text.text = "正在加载 0%";
        };
        LoadingUI.prototype.adjustScreen = function () {
            // this._components.push(this.img_bg);
            this._components.push(this.img_logo);
            this._components.push(this.img_female);
            this._components.push(this.loading_group);
            // this._components.push(this.process_mask);
            // this._components.push(this.process);
            // this._components.push(this._text);
            // this._components.push(this._dot);
            this._components.push(this.img_loading_logo);
            this._components.forEach(function (component) {
                component.y = component.y * game.RATE;
            });
            this._scaleComponent.push(this.img_logo);
            this._scaleComponent.push(this.img_female);
            // this._scaleComponent.push(this.loading_group);
            this._scaleComponent.forEach(function (component) {
                component.scaleX = component.scaleY = component.scaleX * game.RATE;
            });
        };
        LoadingUI.prototype.onProgress = function (current, total, resItem) {
            var rate = Math.ceil((current / total) * 100) / 100;
            if (this._text) {
                this._text.text = "\u6B63\u5728\u52A0\u8F7D " + Math.ceil((current / total) * 100) + "%";
                this.process.x = process_x + rate * loadingWeight;
                this._dot.x = dot_x + rate * loadingWeight;
            }
            // if (rate * 100 >= 34) {
            // }
            // console.log(resItem);
            // console.log("loading:", resItem);
        };
        return LoadingUI;
    }(eui.Component));
    game.LoadingUI = LoadingUI;
    __reflect(LoadingUI.prototype, "game.LoadingUI", ["RES.PromiseTaskReporter"]);
})(game || (game = {}));
