module OCT {

    declare var MaxRectsBinPack;

    export class Level {

        /** The level design */
        public grid: Grid;

        public difficulty: number = 0;

        constructor(private game: Phaser.Game, private _options: { row: number, col: number, shapes?: number }) {
            this.difficulty = _options.shapes;
        }

        public build(nbShapes?: number) {
            this.grid = Grid.Build(this.game, this._options);

            this.grid.x = this.game.world.centerX;
            this.grid.y = this.game.world.centerY;

            if (nbShapes) {
                this.difficulty = nbShapes;
                this._options.shapes = nbShapes;
            }
            this.grid.buildShapes(this._options.shapes);


            this._updateShapePositions();

            this.game.input.addMoveCallback(this._moveShape.bind(this), this);

        }

        private _moveShape(pi) {
            for (let shape of this.grid.shapes) {
                shape.move(pi);
            }
        }

        private _updateShapePositions() {

            const pack = new MaxRectsBinPack.MaxRectsBinPack(this.game.width - 300 * ratio, this.game.height - 300 * ratio, false);
            let rects = [];
            let g = this.grid;
            for (let s = 0; s < g.shapes.length; s++) {
                let shape = g.shapes[s];
                rects.push({
                    width: shape.widthPx,
                    height: shape.heightPx,
                    id: (s).toString()
                });
            }

            const result = pack.insert2(rects, MaxRectsBinPack.BottomLeftRule)

            for (let obj of result) {
                let index = parseInt(obj.id);
                g.shapes[index].setAt(obj.x + 150 * ratio, obj.y + 300 * ratio);

            }
        }

        public destroy(): Promise<void> {

            this.game.input.deleteMoveCallback(this._moveShape.bind(this));

            return new Promise((resolve, reject) => {
                // Destroy grid and send them away
                let timeto = 750;

                for (let shape of this.grid.shapes) {
                    shape.forEach((e) => {
                        this.game.add.tween(e).to({ y: this.game.height }, timeto, Phaser.Easing.Back.In, true);
                        this.game.add.tween(e).to({ opacity: 0 }, timeto, Phaser.Easing.Linear.None, true);
                    })
                }

                this.game.add.tween(this.grid).to({ y: this.game.height }, timeto, Phaser.Easing.Back.In, true);
                let finaltween = this.game.add.tween(this.grid).to({ opacity: 0 }, timeto, Phaser.Easing.Linear.None, true);
                finaltween.onComplete.add(() => {
                    this.grid.destroy();
                    resolve();
                });
            })
        }
    }
}