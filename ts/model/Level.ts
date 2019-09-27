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
            this.grid.y = this.grid.heightPx / 2 + 250 * ratio;

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

            const pack = new MaxRectsBinPack.MaxRectsBinPack(this.game.width - 300 * ratio, this.game.height / 2, false);
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

            const result = pack.insert2(rects, MaxRectsBinPack.BestAreaFit)

            for (let obj of result) {
                let index = parseInt(obj.id);
                g.shapes[index].setAt(obj.x + 150 * ratio, obj.y + this.grid.y);
            }

            // Check if all shapes are visible
            for (let shape of g.shapes) {
                if (shape.top < 0 || shape.top > this.game.height - shape.heightPx) {
                    shape.top = this.game.rnd.integerInRange(0, this.game.height - shape.heightPx);
                }
                if (shape.left < 0 || shape.left > this.game.width - shape.widthPx) {
                    shape.left = this.game.rnd.integerInRange(0, this.game.width - shape.widthPx);
                }
                if (shape.right < shape.widthPx || shape.right > this.game.width) {
                    shape.right = this.game.rnd.integerInRange(shape.widthPx, this.game.width);
                }
                if (shape.bottom < shape.heightPx || shape.bottom > this.game.height) {
                    shape.bottom = this.game.rnd.integerInRange(shape.heightPx, this.game.height);
                }
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