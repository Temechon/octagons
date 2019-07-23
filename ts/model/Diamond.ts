module OCT {

    export class Diamond extends Phaser.Sprite {

        constructor(
            game: Phaser.Game,
            x: number,
            y: number,
            public size: number,
            public color: number) {
            super(game, x, y);

            this._build();
            this.anchor.set(0.5);

            this.game.add.existing(this);
        }

        /**
         * Returns an array of point to draw a diamond
         */

        private _diamond(x, y, width) {

            let d2 = width * Math.sqrt(2) / 2;


            let pt = [];
            pt[0] = new Phaser.Point(x, y - d2);
            pt[1] = new Phaser.Point(x + d2, y)
            pt[2] = new Phaser.Point(x, y + d2)
            pt[3] = new Phaser.Point(x - d2, y)

            return pt;

        }

        public updateColor(color: number) {
            this.color = color;
            this._build();
        }

        private _build() {
            let graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(this.color);
            graphics.drawPolygon(this._diamond(0, 0, this.size));
            graphics.endFill();

            let text = graphics.generateTexture();
            this.loadTexture(text);
            graphics.destroy();
        }
    }
}