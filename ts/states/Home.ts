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
            // SYMMETRY
            let style = { font: Helpers.font(120, 'KeepCalm'), fill: "#E84A5F", align: "center" };
            let title = this.game.add.text(this.game.width / 2, bounds.y + 300 * ratio, "OCTAGONS", style);
            title.anchor.set(0.5);
            title.setShadow(-8 * ratio, -8 * ratio, "#ffffff", 5 * ratio, true, true);

            let colors = [
                "#FFBC67",
                "#45B29D",
                "#FC4349",
                "#2C3E50"
            ]

            // * Play
            let color = Phaser.Color.hexToColor(colors[0]).color
            let easyButton = new HomeButton(this.game, { w: 700 * ratio, h: 150 * ratio }, color, "Easy", "button.easy");
            easyButton.x = this.game.width / 2;
            easyButton.y = this.game.height / 2 - 150 * ratio;
            easyButton.onInputDown = () => {
                this.game.state.start('game', true, false, { difficulty: 0 });
            };

            // Puzzle
            color = Phaser.Color.hexToColor(colors[1]).color
            let mediumButton = new HomeButton(this.game, { w: 700 * ratio, h: 150 * ratio }, color, "Medium", "button.medium");
            mediumButton.x = this.game.width / 2;
            mediumButton.y = easyButton.y + 200 * ratio;
            mediumButton.onInputDown = () => {
                this.game.state.start('game', true, false, { difficulty: 1 });
            };

            color = Phaser.Color.hexToColor(colors[2]).color
            let hardbutton = new HomeButton(this.game, { w: 700 * ratio, h: 150 * ratio }, color, "Hard", "button.hard");
            hardbutton.x = this.game.width / 2;
            hardbutton.y = mediumButton.y + 200 * ratio;
            hardbutton.onInputDown = () => {
                this.game.state.start('game', true, false, { difficulty: 2 });
            };

            color = Phaser.Color.hexToColor(colors[3]).color
            let hardestbutton = new HomeButton(this.game, { w: 700 * ratio, h: 150 * ratio }, color, "Hardest", "button.hardest");
            hardestbutton.x = this.game.width / 2;
            hardestbutton.y = hardbutton.y + 200 * ratio;
            hardestbutton.onInputDown = () => {
                this.game.state.start('game', true, false, { difficulty: 3 });
            };


        }
    }
}