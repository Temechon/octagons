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

            style.fill = "#BABABA";
            style.font = Helpers.font(40, 'KeepCalm')
            let bestTime = this.game.add.text(this.game.width / 2, hardestbutton.y + hardestbutton.height / 2 + 150 * ratio, "Best time", style);
            bestTime.anchor.set(0.5);

            style.fill = "#A1A1A1";
            style.font = Helpers.font(40, 'KeepCalm');
            let easy = this.game.add.text(this.game.world.centerX - 450 * ratio, bestTime.y + bestTime.height / 2 + 40 * ratio, "Easy", style);
            easy.anchor.set(0.5);
            let medium = this.game.add.text(this.game.world.centerX - 150 * ratio, easy.y, "Medium", style);
            medium.anchor.set(0.5);
            let hard = this.game.add.text(this.game.world.centerX + 150 * ratio, easy.y, "Hard", style);
            hard.anchor.set(0.5);
            let hardest = this.game.add.text(this.game.world.centerX + 450 * ratio, easy.y, "Hardest", style);
            hardest.anchor.set(0.5);

            style.font = Helpers.font(50, 'KeepCalm');
            style.fill = "#FFBC67";
            let easyTime = this.game.add.text(this.game.world.centerX - 450 * ratio, easy.y + 70 * ratio, "00:00", style);
            easyTime.anchor.set(0.5);
            style.fill = "#6DBCDB"
            let mediumTime = this.game.add.text(this.game.world.centerX - 150 * ratio, easyTime.y, "00:00", style);
            mediumTime.anchor.set(0.5);
            style.fill = "#FC4349"
            let hardTime = this.game.add.text(this.game.world.centerX + 150 * ratio, easyTime.y, "00:00", style);
            hardTime.anchor.set(0.5);
            style.fill = "#2C3E50"
            let hardestTime = this.game.add.text(this.game.world.centerX + 450 * ratio, easyTime.y, "00:00", style);
            hardestTime.anchor.set(0.5);





        }
    }
}