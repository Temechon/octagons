module OCT {

    export abstract class Geometry extends Phaser.Sprite {

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

        protected abstract _shape(x, y, width);


        private _build() {
            let graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(this.color);
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
    }
}