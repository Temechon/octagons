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


            // var graphics = this.game.add.graphics(200, 200);
            // graphics.beginFill(0xFF0000);
            // graphics.drawPolygon(this._octagon(0, 0, 200));
            // graphics.endFill();

            // graphics.beginFill(0x00FF00);
            // graphics.drawPolygon(this._octagon(0, 200, 200));
            // graphics.endFill();

            // graphics.beginFill(0x0000FF);
            // graphics.drawPolygon(this._octagon(200, 0, 200));
            // graphics.endFill();

            // graphics.beginFill(0xFF00FF);
            // graphics.drawPolygon(this._octagon(200, 200, 200));
            // graphics.endFill();

            // graphics.beginFill(0x654987);
            // let s2 = 200 / (1 + Math.sqrt(2));
            // graphics.drawPolygon(this._square(100, 100, s2));
            // graphics.endFill();

            this.game.state.start('game');

        }
    }
}