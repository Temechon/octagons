module OCT {


    export class LevelManager {

        private _levels: Array<Level> = [];

        public currentLevel: number = 0;

        private _difficulty: {
            row: number,
            col: number,
            shapes: number
        };

        constructor(private game: Phaser.Game) {

            // Load the levels file and create all levels
            let gridAsTxt = this.game.cache.getText('levels');

            let levels = gridAsTxt.split("-");
            let level: Level;

            for (let levelStr of levels) {
                // Get the first line of the level
                let parts = Helpers.clean(levelStr);

                level = new Level(this.game, JSON.parse(parts));

                this._levels.push(level);
            }

            this._difficulty = {
                row: 3,
                col: 3,
                shapes: 20
            }
        }

        public nextLevel(): Level {
            let level: Level;

            // Increase difficulty
            this._difficulty.row = 7;
            this._difficulty.col = 7;
            this._difficulty.shapes = 9;
            // TODO


            level = new Level(this.game, this._difficulty)
            level.build();

            level.grid.shapes[0].blink(level.grid.shapes[0].octagons[0]);


            // if (this.currentLevel >= this._levels.length) {
            //     level.build();
            // } else {
            //     level = this._levels[this.currentLevel];
            //     level.build();
            // }
            return level;
        }
    }
}