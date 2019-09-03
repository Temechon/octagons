module OCT {


    export class LevelManager {

        private _levels: Array<Level> = [];

        public currentLevel: number = 0;

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
        }

        public nextLevel(): Level {
            let level: Level;
            if (this.currentLevel >= this._levels.length) {
                level = new Level(this.game, {
                    row: 10, col: 10, shapes: 10
                })
                level.build();
            } else {
                level = this._levels[this.currentLevel];
                level.build();
            }
            return level;
        }
    }
}