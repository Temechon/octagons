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

            let lm = new LevelManager(this.game);
            lm.nextLevel();
        }

    }
}