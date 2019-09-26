module OCT {


    export class LevelManager {

        /** List of templates to be used in all difficulties*/
        private _templates: Array<Level> = [];


        /** Number of shapes for each difficulty */
        public static DIFFICULTY = [8, 11, 12, 14];

        constructor(private game: Phaser.Game) {

            // Load the levels file and create all levels
            let gridAsTxt = this.game.cache.getText('levels');

            let levels = gridAsTxt.split("-");
            let level: Level;

            for (let levelStr of levels) {
                // Get the first line of the level
                let firstline = Helpers.clean(levelStr);
                if (firstline) {
                    let parts = JSON.parse(firstline);

                    level = new Level(this.game, parts);

                    this._templates.push(level);
                }
            }
        }

        public nextLevel(): Level {
            let level: Level;
            if (Game.INSTANCE.currentLevelNb === 0) {
                // Display first level
                level = new Level(this.game, { row: 3, col: 3, shapes: 3 });
                level.build();
            } else {
                // Get random template among difficulty
                try {
                    level = chance.pickone(this._templates);
                } catch (e) {
                    console.warn(e);
                    level = new Level(this.game, { row: chance.integer({ min: 6, max: 9 }), col: chance.integer({ min: 6, max: 9 }) });
                }
                level.build(LevelManager.DIFFICULTY[Game.INSTANCE.difficulty]);
            }
            return level;
        }
    }
}