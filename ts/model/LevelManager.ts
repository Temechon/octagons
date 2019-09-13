module OCT {


    export class LevelManager {

        /** List of templates to be used in all difficulties*/
        private _templates: Array<Level> = [];

        public currentLevel: number = 0;

        /** Number of shapes for each difficulty */
        public static DIFFICULTY = [6, 11, 13];

        constructor(private game: Phaser.Game) {

            // Load the levels file and create all levels
            let gridAsTxt = this.game.cache.getText('levels');

            let levels = gridAsTxt.split("-");
            let level: Level;

            for (let levelStr of levels) {
                // Get the first line of the level
                let parts = JSON.parse(Helpers.clean(levelStr));

                level = new Level(this.game, parts);

                this._templates.push(level);
            }
        }

        public nextLevel(): Level {
            let level: Level;
            if (this.currentLevel === 0) {
                // Display first level
                level = new Level(this.game, { row: 3, col: 3, shapes: 3 });
                level.build();
            } else {
                // Get random template among difficulty
                let difficulty = 1;
                level = chance.pickone(this._templates);
                level.build(LevelManager.DIFFICULTY[difficulty]);
            }
            return level;
        }
    }
}