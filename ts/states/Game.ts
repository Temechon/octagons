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

            let g = new Grid(this.game, 3, 3);
            // let g = Grid.Build(this.game, '{"row":3,"col":3,"octagons":[[1,0,0],[1,0,0],[1,1,1]],"diamonds":[[1,0,0],[1,1,0],[0,0,0]]}');
            g.x = this.game.world.centerX;
            g.y = g.heightPx / 2 + 150 * ratio;

            g.buildShapes(2);

            g.onVictory = () => {
                this.game.state.start('finish', false);
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

                let cpos = new Phaser.Point(
                    s.center.x - s.x + pos.x,
                    s.center.y - s.y + pos.y
                );

                let correct = false;
                let placementBounds = new Phaser.Rectangle(150, 150, this.game.width - 150, this.game.height - 150)

                while (!correct) {
                    if (cpos.x - s.widthPx / 2 > placementBounds.x &&
                        cpos.x + s.widthPx / 2 < placementBounds.x + placementBounds.width &&
                        cpos.y - s.heightPx / 2 > placementBounds.y &&
                        cpos.y + s.heightPx / 2 < placementBounds.y + placementBounds.height
                    ) {
                        correct = true;
                        break;
                    }
                    pos = this._getRandomPos(bounds);
                    cpos = new Phaser.Point(
                        s.center.x - s.x + pos.x,
                        s.center.y - s.y + pos.y
                    );
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