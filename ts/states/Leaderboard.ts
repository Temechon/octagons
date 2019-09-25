module OCT {

    export class Leaderboard extends Phaser.State {


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
            let cup = this.game.add.sprite(this.game.width / 2, 300 * ratio, 'cup');

            let colors = [
                "#FFBC67",
                "#6DBCDB",
                "#FC4349",
                "#2C3E50"
            ]

            // * Play
            let color = Phaser.Color.hexToColor(colors[0]).color
            let easyButton = new HomeButton(this.game, { w: 400 * ratio, h: 300 * ratio }, color, "Easy", null, 45);
            easyButton.x = this.game.width / 2;
            easyButton.y = this.game.height / 2 - 200 * ratio;
            easyButton.onInputDown = () => {
                this.game.state.start('game', true, false, { difficulty: 0 });
            };


        }
    }
}