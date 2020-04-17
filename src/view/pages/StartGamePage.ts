namespace view {

    interface IGameData {
        label: string;
    }

    export class StartGamePage extends component.BasePage {
        constructor() {
            super();
            this.skinName = StartGameSkin;
        }

        gameData: IGameData;

        public img_bg:eui.Image;
        public group_desk:eui.Group;
        public desk:eui.Image;
        public login_poker_0:eui.Image;
        public login_poker_1:eui.Image;
        public login_poker_2:eui.Image;
        public login_poker_3:eui.Image;
        public gameLogo:eui.Image;
        public label:eui.Label;
        public group_btn:eui.Group;
        public btnStartGame:eui.Button;
        public btnShare:eui.Button;
        public rankFriend:eui.Button;
        public rankGroup:eui.Button;
        public img_flash:eui.Image;

        init() {

        }
    }
}