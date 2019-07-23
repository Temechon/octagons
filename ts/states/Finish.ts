module OCT {

    export class Finish extends Phaser.State {

        private _title: string;

        private _isGameOver: boolean = false;

        init(params: any) {
            if (params) {
                if (params.message) {
                    this._title = params.message;
                }
                if (params.isGameOver) {
                    this._isGameOver = params.isGameOver;
                }
            }

        }

        create() {

            let overlay = this.game.add.graphics(0, 0);
            overlay.beginFill(0x000000);
            overlay.fillAlpha = 0.6;
            overlay.drawRect(0, 0, this.game.width, this.game.height);
            overlay.endFill();
            overlay.inputEnabled = true;
            overlay.events.onInputDown.add(() => false)

            let margin = 50 * ratio;
            let startx = bounds.x + margin;
            let background = this.game.add.graphics(0, 0);
            background.beginFill(0x2B3A42);
            let backgroundHeight = 0;
            backgroundHeight = bounds.height / 2.25;
            background.drawRoundedRect(startx, bounds.y + margin, bounds.width - margin * 2, backgroundHeight, 20 * ratio);
            background.endFill();
            background.y = this.game.height / 2 - background.height / 2;
            background.inputEnabled = true;
            background.events.onInputDown.add(() => false)


            // SYMMETRY
            let style = { font: Helpers.font(120, 'KeepCalm'), fill: "#E84A5F", align: "center" };
            let title = this.game.add.text(this.game.width / 2, bounds.y + 200 * ratio, "SYMMETRY", style);
            title.anchor.set(0.5);
            title.setShadow(-4 * ratio, -4 * ratio, "#ffffff", 3 * ratio, true, true);

            // Game over 
            style = { font: Helpers.font(80, 'KeepCalm'), fill: "#ffffff", align: "center" };
            let gameover = this.game.add.text(this.game.width / 2, background.y + 1.5 * margin, this._title.toUpperCase(), style);
            gameover.anchor.set(0.5, 0);

            // Retry button
            if (this._isGameOver) {
                let retryButton = new Button(this.game, { w: 550 * ratio, h: 120 * ratio }, 0xFF8984, "Replay", 60)
                retryButton.onInputDown = () => {
                    this.game.state.start('game', true, false);
                };
                retryButton.setAt(this.game.width / 2, background.y + background.height - 75 * ratio);

            } else {
                // Home button
                let homebutton = new Button(this.game, { w: 400 * ratio, h: 100 * ratio }, 0xFF8984, "Home", 60)
                homebutton.onInputDown = () => {
                    this.game.state.start('levellist');
                };
                homebutton.setAt(this.game.width / 2, background.y + background.height - 50 * ratio);

            }
        }
    }
}