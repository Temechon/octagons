module OCT {

    export var chance;
    declare var Chance;

    export class Game extends Phaser.State {

        public static INSTANCE: Game;
        public static TUTORIAL_DONE: string = "octagon.tutorial.done";
        public static _toKill = [];
        private lm: LevelManager;
        private currentLevel: Level;
        public difficulty: number = 0;
        public currentLevelNb: number = 0;

        constructor() {
            super();
            chance = new Chance(new Date().getTime());
            Game.INSTANCE = this;
        }

        public init(params: {
            difficulty?: number
        }) {
            if (params) {
                this.difficulty = params.difficulty;
            } else {
                this.difficulty = 0;
            }

        }

        create() {


            // * Debug Bounds
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0xFFFFff);
            // graphics.fillAlpha = 0.25;
            let deltax = 100 * ratio;
            let deltay = 150 * ratio;
            graphics.drawRoundedRect(deltax, deltay, this.game.width - deltax * 2, this.game.height - deltay * 2, 50 * ratio);
            graphics.drawRoundedRect(this.game.world.centerX - 250 * ratio, deltay - 100 * ratio, 500 * ratio, 300 * ratio, 30 * ratio);
            graphics.endFill();

            let style = { font: Helpers.font(60, 'KeepCalm'), fill: "#E7E7E7", align: "center" };
            let levelsDone = this.game.add.text(this.game.world.centerX, deltay - 80 * ratio, "OCTAGONS", style);
            levelsDone.anchor.set(0.5, 0);

            // Back button
            let backButton = this.game.add.sprite(150 * ratio, 80 * ratio, 'button.back');
            backButton.inputEnabled = true;
            backButton.events.onInputDown.add(() => {
                backButton.scale.multiply(0.85, 0.85);
            });

            backButton.events.onInputUp.add(() => {
                backButton.scale.set(ratio, ratio);
                this.game.time.events.add(100, () => {
                    this.game.state.start('home');
                });
            });


            this.lm = new LevelManager(this.game);
            this.currentLevel = this.lm.nextLevel();

            this.currentLevel.grid.onVictory = () => {
                this.goToNextLevel();
            }

            if (this.currentLevelNb === 0) {
                // Display tutorial
                this.displayTutorial(this.currentLevel).then(() => {
                    this.destroyTutorial()
                });
            }


        }

        private destroyTutorial() {
            for (let res of Game._toKill) {
                res.destroy();
            }
        }

        private _displayNextButton() {
            let buttonGroup = this.game.add.group();

            let overlay = this.game.add.graphics(0, 0);
            overlay.beginFill(0x000000);
            overlay.fillAlpha = 0.6;
            overlay.drawRect(0, 0, this.game.width, this.game.height);
            overlay.endFill();
            overlay.inputEnabled = true;
            overlay.events.onInputDown.add(() => false)
            buttonGroup.add(overlay);

            let margin = 50 * ratio;
            let startx = bounds.x + margin;
            let background = this.game.add.graphics(0, 0);
            background.beginFill(0x2B3A42);
            let backgroundHeight = 0;
            backgroundHeight = 350 * ratio;
            background.drawRoundedRect(startx, bounds.y + margin, bounds.width - margin * 2, backgroundHeight, 20 * ratio);
            background.endFill();
            background.y = this.game.height / 2 - background.height / 2;
            background.inputEnabled = true;
            background.events.onInputDown.add(() => false)
            buttonGroup.add(background);


            // logo
            let logo = this.game.add.sprite(this.game.width / 2 + 25 * ratio, 300 * ratio, 'logo');
            buttonGroup.add(logo);

            // Game over 
            let style = { font: Helpers.font(80, 'KeepCalm'), fill: "#ffffff", align: "center" };
            let gameover = this.game.add.text(this.game.width / 2, background.y + 1.5 * margin, "Awesome !", style);
            gameover.anchor.set(0.5, 0);
            buttonGroup.add(gameover);

            // Home button
            let nextButton = new Button(this.game, { w: 400 * ratio, h: 100 * ratio }, 0xFF8984, "Next", 60)
            nextButton.onInputDown = () => {
                buttonGroup.destroy();
                this.currentLevel.destroy().then(() => {
                    if (this.currentLevelNb == 0) {
                        this.currentLevelNb++;
                        localStorage.setItem(Game.TUTORIAL_DONE, "ok")
                        // Forward to home page
                        this.game.state.start('home');
                        return;
                    } else {
                        this.currentLevelNb++;
                        this.currentLevel = this.lm.nextLevel();
                        this.currentLevel.grid.onVictory = () => {
                            this.goToNextLevel();
                        }
                    }
                })
            };
            nextButton.setAt(this.game.width / 2, background.y + background.height - 50 * ratio);
            buttonGroup.add(nextButton);
        }

        private goToNextLevel() {
            let i = 100;
            let index = 1;
            for (let shape of this.currentLevel.grid.shapes) {
                setTimeout(() => {
                    shape.pop(this.currentLevel.grid.lastColorMoved);
                }, i * index++);
            }
            console.log(this.currentLevel.difficulty);

            setTimeout(() => {
                this._displayNextButton();
            }, 400 + 100 * this.currentLevel.difficulty);
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