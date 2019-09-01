module OCT {

    export var chance;
    declare var Chance;

    export class Game extends Phaser.State {

        public static INSTANCE: Game;
        public static _toKill = [];

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
            let level = lm.nextLevel();


            level.grid.onVictory = () => {
                this.game.state.start('finish', false);
            }

            if (lm.currentLevel === 0) {
                // Display tutorial
                this.displayTutorial(level).then(() => {
                    this.destroy()
                });
            }



        }

        private destroy() {
            for (let res of Game._toKill) {
                res.destroy();
            }
        }

        private displayTutorial(level: Level) {

            this.game.world.updateTransform();

            let start = level.grid.shapes[0].octagons[0].worldPosition;
            let end = level.grid.position

            let tap = this.game.add.sprite(start.x, start.y, 'tap');
            tap.anchor.set(0.5, 0);
            tap.scale.multiply(0.5, 0.5);
            Game._toKill.push(tap);

            let tapDown = this.game.add.sprite(start.x, start.y, 'tap_down');
            tapDown.anchor.set(0.5, 0);
            tapDown.alpha = 0;
            tapDown.scale.multiply(0.5, 0.5);
            Game._toKill.push(tapDown);


            let swipe = () => {
                return new Promise<void>((resolve, reject) => {
                    this.game.add.tween(tap).to({ alpha: 0 }, 275, Phaser.Easing.Quadratic.Out, true)
                    this.game.add.tween(tapDown).to({ alpha: 1 }, 275, Phaser.Easing.Quadratic.Out, true).onComplete.add(() => {

                        this.game.add.tween(tap).to({ x: end.x, y: end.y }, 500, Phaser.Easing.Quadratic.Out, true)
                        this.game.add.tween(tapDown).to({ x: end.x, y: end.y }, 500, Phaser.Easing.Quadratic.Out, true).onComplete.add(() => {
                            tap.alpha = 1;
                            tapDown.alpha = 0;

                            this.game.time.events.add(275, () => {
                                tap.x = start.x;
                                tap.y = start.y;
                                tapDown.x = start.x;
                                tapDown.y = start.y;
                                resolve();
                            });
                        })
                    })
                })
            }

            let list = [];
            for (let i = 0; i < 4; i++) {
                list.push(swipe);
            }
            return Helpers.pseries(list);
        }

    }
}