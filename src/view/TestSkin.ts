namespace game {

    interface ISkinData {
        label: string
    }

    export class TestSkin extends eui.Component {

        public label:eui.Label;

        data: ISkinData = {
            label: "1"
        };


        constructor() {
            super();
            this.addEventListener(eui.UIEvent.COMPLETE, this.onLoadComplete, this);
        }

        protected createChildren() {
            super.createChildren();
            if (this.label) {
                console.log("组件初始化完成");
            }
        }

        private onLoadComplete() {
            if (this.label) {
                console.log("加载完成");
            }
        }
    }
}