namespace component {
    export class BasePage extends eui.Component {

        constructor() {
            super();
        }

        /**
         * 页面初始化完毕
         */
        protected createChildren() {
            this.init();
        }

        /**
         * 各个子模块进行初始化
         */
        protected init() {

        }
    }
}