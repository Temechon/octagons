module OCT {

    export class Octagon extends Geometry {

        constructor(
            game: Phaser.Game,
            x: number,
            y: number,
            row: number,
            col: number,
            size: number,
            color: number,
            alpha?: number) {
            super(game, x, y, row, col, size, color, alpha);
        }

        /**
         * Returns an array of point to draw an octagon
         * 
         *        0    1
         *    7            2
         *             
         *    6            3
         *        5    4
         *  
         */
        protected _shape(x, y, width) {
            let s2 = width / (2 + 2 * Math.sqrt(2));
            let w2 = width / 2;

            let d = 0.7;
            let pt = [];
            pt[0] = new Phaser.Point(x - s2 - d, y - w2 - d);
            pt[1] = new Phaser.Point(x + s2 + d, y - w2 - d)
            pt[2] = new Phaser.Point(x + w2 + d, y - s2 - d)
            pt[3] = new Phaser.Point(x + w2 + d, y + s2 + d)
            pt[4] = new Phaser.Point(x + s2 + d, y + w2 + d)
            pt[5] = new Phaser.Point(x - s2 - d, y + w2 + d);
            pt[6] = new Phaser.Point(x - w2 - d, y + s2 + d)
            pt[7] = new Phaser.Point(x - w2 - d, y - s2 - d)

            return pt;
        }

        public clone(): Octagon {

            let oct = new Octagon(this.game, this.x, this.y, this.row, this.col, this.size, this.color);
            oct.name = this.name;
            return oct;
        }

        public blink() {
            this._blinker = new Octagon(this.game, this.x, this.y, this.row, this.col, this.size, 0xff0000, 1);
            this.shape.addChild(this._blinker);
            this._blinker.inputEnabled = true;
            this._blinker.events.onInputDown.add(() => {
                console.log("coucou")
            })
            this._blinkerTween = this.game.add.tween(this._blinker).to({ alpha: 0 }, 750, Phaser.Easing.Linear.None, true, 0, -1);
            this.game.world.bringToTop(this._blinker);
        }

    }
}