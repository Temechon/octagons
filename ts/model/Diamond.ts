module OCT {

    export class Diamond extends Geometry {

        constructor(
            game: Phaser.Game,
            x: number,
            y: number,
            row: number,
            col: number,
            size: number,
            color: number) {
            super(game, x, y, row, col, size, color);
        }

        /**
         * Returns an array of point to draw a diamond
         */

        protected _shape(x, y, width) {

            let d2 = width * Math.sqrt(2) / 2;


            let pt = [];
            let d = 0.7;
            pt[0] = new Phaser.Point(x, y - d2 - d);
            pt[1] = new Phaser.Point(x + d2 + d, y)
            pt[2] = new Phaser.Point(x, y + d2 + d)
            pt[3] = new Phaser.Point(x - d2 - d, y)

            return pt;

        }

        public clone(): Diamond {

            let diams = new Diamond(this.game, this.x, this.y, this.row, this.col, this.size, this.color);
            diams.name = this.name;
            return diams;
        }
    }
}