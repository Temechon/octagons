module OCT {

    // The game screen ratio - All sprites will be scaled by this ratio
    export var ratio: number;

    // The game area
    export var bounds: Phaser.Rectangle;

    // The game music audiosprite
    export var musics: Phaser.AudioSprite;

    declare var kongregateAPI: any;
    export var kongregate: any;

    class ScalingGameObjectFactory extends Phaser.GameObjectFactory {
        sprite(x: number, y: number, key?: any, frame?: any, group?: any): Phaser.Sprite {
            let sprite = super.sprite(x, y, key, frame, group);
            sprite.scale.set(ratio);
            sprite.anchor.set(0.5);
            return sprite;
        }

        tileSprite(x: number, y: number, width: number, height: number, key?: any, frame?: any, group?: Phaser.Group): Phaser.TileSprite {
            let sprite = super.tileSprite(x, y, width, height, key, frame, group);
            sprite.scale.set(ratio, ratio);
            return sprite;
        }

        bitmapText(x: number, y: number, font: string, text?: string, size?, group?): Phaser.BitmapText {
            let btext = super.bitmapText(x, y, font, text, size, group);
            btext.scale.set(ratio, ratio);
            return btext;
        }
    }

    export class Boot extends Phaser.State {


        preload() {

            // this.load.image('validate', 'assets/validate.png');
            // this.load.image('notcorrect', 'assets/notcorrect.png');
            // this.load.image('coin', 'assets/coin.png');
            // // Buttons
            this.load.image('button.easy', 'assets/easy.png');
            this.load.image('button.medium', 'assets/medium.png');
            this.load.image('button.hard', 'assets/hard.png');
            this.load.image('button.hardest', 'assets/hardest.png');
            this.load.image('button.insane', 'assets/insane.png');

            this.load.image('button.lightmode', 'assets/lightmode.png');
            this.load.image('button.darkmode', 'assets/darkmode.png');

            this.load.image('button.back', 'assets/back.png');
            this.load.image('button.leaderboard', 'assets/leaderboard.png');

            this.load.image('logo', 'assets/logo.png');
            this.load.image('cup', 'assets/cup.png');

            // this.load.image('button.puzzle', 'assets/puzzle.png');
            // this.load.image('button.back', 'assets/back.png');
            // Tutorial
            this.load.image('tap', 'assets/hands/tap.png');
            this.load.image('tap_down', 'assets/hands/tap_down.png');
            // Levels
            this.load.text('levels', 'assets/levels.csv');
        }

        create() {

            let colorMode = localStorage.getItem(Home.COLOR_MODE);
            if (colorMode === 'light') {
                this.game.stage.backgroundColor = '#F2F2F2';
            } else {
                this.game.stage.backgroundColor = '#121212';
            }

            this.game.add = new ScalingGameObjectFactory(this.game);

            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            let baseW = 482 * 2;
            let baseH = 897 * 2;

            let ratioW = this.game.width / baseW;
            let ratioH = this.game.height / baseH;

            if (ratioW > ratioH) {
                ratio = ratioH;
            } else {
                ratio = ratioW;
            }

            bounds = new Phaser.Rectangle(
                this.game.width / 2 - baseW / 2 * ratio,
                this.game.height / 2 - baseH / 2 * ratio,
                baseW * ratio,
                baseH * ratio);

            console.log('Bounds - ', bounds.toString());
            console.log('Game width - ', this.game.width);
            console.log('Game height - ', this.game.height);
            console.log('Window - ', window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);
            console.log('ratio - ', ratio);

            // Get tutorial value in local storage
            let tutorialDone = localStorage.getItem(Game.TUTORIAL_DONE);
            let nextStage = tutorialDone ? "home" : "game";
            if (nextStage === 'home') {
                Game.INSTANCE.currentLevelNb = 1;
            }

            try {
                kongregateAPI.loadAPI(() => {
                    kongregate = window['kongregate'] = kongregateAPI.getAPI();
                    this.game.state.start(nextStage);
                });
            } catch (e) {
                console.error(e);
                this.game.state.start(nextStage);
            }

        }
    }
}