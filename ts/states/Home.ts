module SYM {

    export class Home extends Phaser.State {


        create() {

            this.game.stage.backgroundColor = '#fee2d7';

            // * Debug Bounds
            // var graphics = this.game.add.graphics(0, 0);
            // graphics.beginFill(0xFFFF0B);
            // graphics.fillAlpha = 0.25;
            // graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
            // graphics.endFill();


            // SYMMETRY
            let style = { font: Helpers.font(120, 'KeepCalm'), fill: "#E84A5F", align: "center" };
            let title = this.game.add.text(this.game.width / 2, bounds.y + 300 * ratio, "SYMMETRY", style);
            title.anchor.set(0.5);
            title.setShadow(-8 * ratio, -8 * ratio, "#ffffff", 5 * ratio, true, true);

        }

    }
}