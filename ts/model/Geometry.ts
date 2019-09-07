module OCT {

    export abstract class Geometry extends Phaser.Sprite {

        constructor(
            game: Phaser.Game,
            x: number,
            y: number,
            public row: number,
            public col: number,
            public size: number,
            public color: number,
            public alphacolor: number = 1) {
            super(game, x, y);

            this._build();
            this.anchor.set(0.5);

            this.game.add.existing(this);

            this.name = chance.guid();

        }

        public abstract clone(): Geometry;

        /** The shape this geometry belongs to */
        public shape: Shape = null;
        public name: string;

        public get hasShape(): boolean {
            return this.shape !== null;
        }

        protected abstract _shape(x, y, width);


        private _build() {
            let graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(this.color, this.alphacolor);
            graphics.drawPolygon(this._shape(0, 0, this.size));
            graphics.endFill();

            let text = graphics.generateTexture();
            this.loadTexture(text);
            graphics.destroy();
        }


        public updateColor(color: number) {
            this.color = color;
            this._build();
        }

        public blink() {

            this.game.add.tween(this).to({ alpha: 0 }, 750, null, true, 0, -1, true);
        }

        public equals(other: Geometry): boolean {
            return this.name === other.name;
        }

        public drawOn(g: Phaser.Graphics, scale = 1, color = 0x000000) {
            g.beginFill(color);
            g.drawPolygon(this._shape(this.x, this.y, this.size * scale));
            g.endFill();
        }
    }
}