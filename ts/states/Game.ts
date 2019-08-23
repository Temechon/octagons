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

        }

        create() {


            // * Debug Bounds
            // var graphics = this.game.add.graphics(0, 0);
            // graphics.beginFill(0xFFFF0B);
            // graphics.fillAlpha = 0.25;
            // graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
            // graphics.endFill();

            let g = new Grid(this.game, 5, 5);
            // let g = Grid.Build(this.game, '{"row":3,"col":3,"octagons":[[1,0,0],[1,0,0],[1,1,1]],"diamonds":[[1,0,0],[1,1,0],[0,0,0]]}');
            g.x = this.game.world.centerX;
            g.y = g.heightPx / 2 + 150 * ratio;

            g.buildShapes(2);

            g.onVictory = () => {
                console.log("YEAH");
            }

            this._updateShapePositions(g);

            this.game.input.addMoveCallback((pi) => {
                for (let shape of g.shapes) {
                    shape.move(pi);
                }
            }, this);
        }

        private _updateShapePositions(grid: Grid) {
            for (let s of grid.shapes) {

                // Get random position inside the game area
                let pos = this._getRandomPos(bounds);
                let correct = false;
                while (!correct) {
                    if (pos.x - s.widthPx / 2 > bounds.x &&
                        pos.x + s.widthPx / 2 < bounds.x + bounds.width &&
                        pos.y - s.heightPx / 2 > bounds.y &&
                        pos.y + s.heightPx / 2 < bounds.y + bounds.height
                    ) {
                        correct = true;
                    }
                    pos = this._getRandomPos(bounds);
                }
                s.setAt(pos.x, pos.y);
            }
        }

        private _getRandomPos(bounds: Phaser.Rectangle): Phaser.Point {
            let res = new Phaser.Point();
            res.x = this.game.rnd.integerInRange(0, this.game.width);
            res.y = this.game.rnd.integerInRange(0, this.game.height);
            return res;
        }
    }
}