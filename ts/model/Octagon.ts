module OCT {

    export class Octagon extends Geometry {

        constructor(
            game: Phaser.Game,
            x: number,
            y: number,
            size: number,
            color: number) {
            super(game, x, y, size, color);
        }

        /**
         * Returns an array of point to draw an octagon
         */
        protected _shape(x, y, width) {
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

    }
}