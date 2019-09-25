module OCT {

    export class Home extends Phaser.State {


        create() {

            this.game.stage.backgroundColor = '#F2F2F2';

            // * Debug Bounds
            // var graphics = this.game.add.graphics(0, 0);
            // graphics.beginFill(0xFFFF0B);
            // graphics.fillAlpha = 0.25;
            // graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
            // graphics.endFill();
            // g.destroy();

            // LOGO
            let logo = this.game.add.sprite(this.game.width / 2 + 25 * ratio, 200 * ratio, 'logo');

            let style = { font: Helpers.font(30, 'KeepCalm'), fill: "#BABABA", align: "center" };
            // Levels done
            let levelsDone = this.game.add.text(this.game.width / 2, logo.y + logo.height / 2 + 100 * ratio, "Levels done", style);
            levelsDone.anchor.set(0.5);

            // Number of levels
            style.fill = "#A1A1A1";
            style.font = Helpers.font(75, 'KeepCalm')
            levelsDone = this.game.add.text(this.game.width / 2, levelsDone.y + levelsDone.height / 2 + 50 * ratio, "99", style);
            levelsDone.anchor.set(0.5);

            let colors = [
                "#FFBC67",
                "#6DBCDB",
                "#FC4349",
                "#2C3E50"
            ]

            // * Play
            let color = Phaser.Color.hexToColor(colors[0]).color
            let easyButton = new HomeButton(this.game, { w: 700 * ratio, h: 130 * ratio }, color, "Easy", "button.easy", 45);
            easyButton.x = this.game.width / 2;
            easyButton.y = this.game.height / 2 - 200 * ratio;
            easyButton.onInputDown = () => {
                this.game.state.start('game', true, false, { difficulty: 0 });
            };

            // Puzzle
            color = Phaser.Color.hexToColor(colors[1]).color
            let mediumButton = new HomeButton(this.game, { w: 700 * ratio, h: 130 * ratio }, color, "Medium", "button.medium", 45);
            mediumButton.x = this.game.width / 2;
            mediumButton.y = easyButton.y + 170 * ratio;
            mediumButton.onInputDown = () => {
                this.game.state.start('game', true, false, { difficulty: 1 });
            };

            color = Phaser.Color.hexToColor(colors[2]).color
            let hardbutton = new HomeButton(this.game, { w: 700 * ratio, h: 130 * ratio }, color, "Hard", "button.hard", 45);
            hardbutton.x = this.game.width / 2;
            hardbutton.y = mediumButton.y + 170 * ratio;
            hardbutton.onInputDown = () => {
                this.game.state.start('game', true, false, { difficulty: 2 });
            };

            color = Phaser.Color.hexToColor(colors[3]).color
            let hardestbutton = new HomeButton(this.game, { w: 700 * ratio, h: 130 * ratio }, color, "Hardest", "button.hardest", 45);
            hardestbutton.x = this.game.width / 2;
            hardestbutton.y = hardbutton.y + 170 * ratio;
            hardestbutton.onInputDown = () => {
                this.game.state.start('game', true, false, { difficulty: 3 });
            };


            // Back button
            let lbButton = this.game.add.sprite(this.game.world.centerX, this.game.height - 200 * ratio, 'button.leaderboard');
            lbButton.inputEnabled = true;
            lbButton.events.onInputDown.add(() => {
                lbButton.scale.multiply(0.85, 0.85);
            });

            lbButton.events.onInputUp.add(() => {
                lbButton.scale.set(ratio, ratio);
                this.game.time.events.add(100, () => {
                    this.game.state.start('leaderboard');
                });
            });

        }
    }
}