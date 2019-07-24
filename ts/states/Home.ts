module OCT {

    export class Home extends Phaser.State {


        create() {

            this.game.stage.backgroundColor = '#fee2d7';

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

        private _octagon(x, y, width) {
            let s2 = width / (2 + 2 * Math.sqrt(2));
            let w2 = width / 2;

            let pt = [];
            pt[0] = new Phaser.Point(x - s2, y - w2);
            pt[1] = new Phaser.Point(x + s2, y - w2)
            pt[2] = new Phaser.Point(x + w2, y - s2)
            pt[3] = new Phaser.Point(x + w2, y + s2)
            pt[4] = new Phaser.Point(x + s2, y + w2)
            pt[5] = new Phaser.Point(x - s2, y + w2);
            pt[6] = new Phaser.Point(x - w2, y + s2)
            pt[7] = new Phaser.Point(x - w2, y - s2)

            return pt;
        }

        private _square(x, y, width) {

            let d2 = width * Math.sqrt(2) / 2;


            let pt = [];
            pt[0] = new Phaser.Point(x, y - d2);
            pt[1] = new Phaser.Point(x + d2, y)
            pt[2] = new Phaser.Point(x, y + d2)
            pt[3] = new Phaser.Point(x - d2, y)

            return pt;

        }

    }
}