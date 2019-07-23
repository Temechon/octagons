module OCT {

    export class Octagon extends Phaser.Sprite {

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
         * Returns an array of point to draw an octagon
         */
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

        public updateColor(color: number) {
            this.color = color;
            this._build();
        }

        private _build() {
            let graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(this.color);
            graphics.drawPolygon(this._octagon(0, 0, this.size));
            graphics.endFill();

            let text = graphics.generateTexture();
            this.loadTexture(text);
            graphics.destroy();
        }
    }
}