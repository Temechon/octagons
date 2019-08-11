module OCT {

    export var chance;
    declare var Chance;


    export class Game extends Phaser.State {

        public static INSTANCE: Game;

        constructor() {
            super();
            chance = new Chance(new Date().getTime());
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


            // * Debug Bounds
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0xFFFF0B);
            graphics.fillAlpha = 0.25;
            graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
            graphics.endFill();

            let g = new Grid(this.game, 10, 10, 12);
            g.x = this.game.world.centerX;
            g.y = this.game.world.centerY;

            for (let shape of g.shapes) {
                shape.x = g.x;
                shape.y = g.y;
            }

            this.game.input.addMoveCallback((pi) => {
                for (let shape of g.shapes) {
                    shape.move(pi);
                }
            }, this);





            // this.game.add.tween(g).to({ angle: 360 }, 5000, null, true, 0, -1);

            console.log('width', g.widthPx, 'size', g.size)
            console.log('total', bounds.width);



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