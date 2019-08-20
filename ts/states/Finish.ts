module OCT {

    export class Finish extends Phaser.State {

        private _title: string;

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
            let title = this.game.add.text(this.game.width / 2, bounds.y + 200 * ratio, "OCTAGONS", style);
            title.anchor.set(0.5);
            title.setShadow(-4 * ratio, -4 * ratio, "#ffffff", 3 * ratio, true, true);

            // Game over 
            style = { font: Helpers.font(80, 'KeepCalm'), fill: "#ffffff", align: "center" };
            let gameover = this.game.add.text(this.game.width / 2, background.y + 1.5 * margin, "Awesome !", style);
            gameover.anchor.set(0.5, 0);

            // Home button
            let homebutton = new Button(this.game, { w: 400 * ratio, h: 100 * ratio }, 0xFF8984, "Next", 60)
            homebutton.onInputDown = () => {
                this.game.state.start('levellist');
            };
            homebutton.setAt(this.game.width / 2, background.y + background.height - 50 * ratio);
        }
    }
}