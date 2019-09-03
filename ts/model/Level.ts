module OCT {


    export class Level {

        /** The level design */
        public grid: Grid;

        constructor(private game: Phaser.Game, private _options: { row: number, col: number, shapes: number }) {

        }

        public build() {
            this.grid = Grid.Build(this.game, this._options);

            this.grid.x = this.game.world.centerX;
            this.grid.y = this.grid.heightPx / 2 + 300 * ratio;

            this.grid.buildShapes(this._options.shapes);

            this._updateShapePositions(this.grid);

            this.game.input.addMoveCallback(this._moveShape.bind(this), this);

        }

        private _moveShape(pi) {
            for (let shape of this.grid.shapes) {
                shape.move(pi);
            }
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

        // public playAnimation(isWin: boolean): Promise<void> {
        //     let checker: Checker;
        //     let delay = 500;
        //     if (isWin) {
        //         checker = new Checker('validate');
        //     } else {
        //         checker = new Checker('notcorrect');
        //         delay = 500;
        //     }

        //     return new Promise((resolve, reject) => {
        //         checker.x = phasergame.width / 2;
        //         checker.y = phasergame.height / 2;

        //         checker.blinkAndGo(delay).then(() => {
        //             resolve();
        //         })
        //     });
        // }


        /**
         * Returns the score for this level, according to its difficulty and the time to resolve it
         */
        public getScore(): number {
            // todo
            return 0;
        }
    }
}