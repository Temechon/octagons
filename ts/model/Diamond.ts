module OCT {

    export class Diamond extends Geometry {

        constructor(
            game: Phaser.Game,
            x: number,
            y: number,
            size: number,
            color: number) {
            super(game, x, y, size, color);
        }

        /**
         * Returns an array of point to draw a diamond
         */

        protected _shape(x, y, width) {

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