module OCT {

    export var chance;
    declare var Chance;

    declare var MaxRectsBinPack;


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
            // var graphics = this.game.add.graphics(0, 0);
            // graphics.beginFill(0xFFFF0B);
            // graphics.fillAlpha = 0.25;
            // graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
            // graphics.endFill();

            let g = new Grid(this.game, 10, 5);
            // let g = Grid.Build(this.game, '{"row":3,"col":3,"octagons":[[1,0,0],[1,0,0],[1,1,1]],"diamonds":[[1,0,0],[1,1,0],[0,0,0]]}');
            g.x = this.game.world.centerX;
            g.y = g.heightPx / 2 + 150 * ratio;

            g.buildShapes(5);

            for (let s of g.shapes) {
                s.x = g.x;
                s.y = g.y;
                s.debug();
            }




            // const pack = new MaxRectsBinPack.MaxRectsBinPack(this.game.width, this.game.height / 2, false);
            // let rects = [];
            // let tmp = 0;
            // for (let s = 0; s < g.shapes.length; s++) {
            //     let shape = g.shapes[s];
            //     rects.push({
            //         width: shape.widthPx,
            //         height: shape.heightPx,
            //         id: (s).toString()
            //     });
            // }

            // const result = pack.insert2(rects, MaxRectsBinPack.BestShortSideFit)
            // console.log(result);

            // for (let obj of result) {
            //     let index = parseInt(obj.id);
            //     g.shapes[index].setAt(obj.x + this.game.width / 2, obj.y + this.game.height / 2);
            // }

            this.game.input.addMoveCallback((pi) => {
                for (let shape of g.shapes) {
                    shape.move(pi);
                }
            }, this);

            // this.game.input.onUp.add(() => {
            //     if (g.checkVictory()) {
            //         this.game.state.start('finish', false);
            //     }
            // })

            // this.game.add.tween(g.scale).from({ x: 1, y: 1 }, 5000, null, true, 0, -1);




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