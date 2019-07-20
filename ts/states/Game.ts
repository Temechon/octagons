module SYM {

    export var chance;
    declare var Chance;


    export class Game extends Phaser.State {

        public static INSTANCE: Game;

        constructor() {
            super();
            chance = new Chance(123456);
            Game.INSTANCE = this;
        }

        public init(params: {
            levelNumber?: number
        }) {
            if (!params) {
                return;
            }

            if (params.levelNumber) {
                // console.log("Starting at level", params.levelNumber);
                // this.levelNumber = params.levelNumber;
            }
        }

        create() {


            // * Debug text
            // let overlay = this.game.add.graphics(0, 0);
            // overlay.beginFill(0x000000);
            // overlay.fillAlpha = 0.6;
            // overlay.drawRect(0, 0, this.game.width, this.game.height);
            // overlay.endFill();
            // let styleDebug = { font: Helpers.font(60, 'arial'), fill: "#ffffff" };
            // let t = this.game.add.text(bounds.x, bounds.y, "DPR : " + window.devicePixelRatio, styleDebug);
            // t = this.game.add.text(bounds.x, t.y + t.height, "RES : " + window.innerWidth + "x" + window.innerHeight, styleDebug);
            // t = this.game.add.text(bounds.x, t.y + t.height, "RATIO : " + ratio, styleDebug);
            // this.game.add.text(bounds.x, t.y + t.height, "CELL_SIZE : " + Cell.CELL_SIZE * ratio, styleDebug);
        }
    }
}