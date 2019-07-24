module OCT {

    /**
     * A set of octagons and diamonds.
     * If N is the number of octagons on a line, n-1 is the number of square on the same line
     */
    export class Grid extends Phaser.Group {

        /**
         * 
         * 0  1  2  3  4 (cols) = width
         * 1
         * 2
         * 3
         * 4
         * (rows)
         * height
         * 
         * _cells[row][col]
         */
        private octagons: Array<Array<Octagon>> = [];
        private diamonds: Array<Array<Diamond>> = [];

        private _diamSize: number = 0;

        constructor(
            game: Phaser.Game,
            public row: number,
            public col: number,
            public size: number) {
            super(game);

            this._diamSize = this.size / (1 + Math.sqrt(2)) + 1;

            for (let i = 0; i < this.row; i++) {
                this.octagons[i] = [];
            }

            for (let i = 0; i < this.row - 1; i++) {
                this.diamonds[i] = [];
            }


            let toShape = [];
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {

                    let oct = new Octagon(
                        this.game,
                        i * this.size,
                        j * this.size,
                        this.size,
                        0xff0000);
                    this.octagons[i][j] = oct;
                    this.add(oct);
                    toShape.push(oct);
                }
            }
            for (let i = 0; i < this.row - 1; i++) {
                for (let j = 0; j < this.col - 1; j++) {

                    let diams = new Diamond(
                        this.game,
                        i * this.size + this.size / 2,
                        j * this.size + this.size / 2,
                        this._diamSize,
                        0x000000);
                    this.diamonds[i][j] = diams;
                    this.add(diams);
                }
            }

            console.log(this.widthPx, this.scale)
            // Center all cell in the center of the group
            this.forEach((c: Phaser.Sprite) => {
                c.x -= this.widthPx / 2;
                c.y -= this.heightPx / 2;
            });

            // create shapes
            let nbShape = 5;

            let shapes: Array<Array<Octagon>> = [];
            toShape = chance.shuffle(toShape);
            // To create shapes, get random octagon and expand it until there is no octagon left
            for (let i = 0; i < nbShape; i++) {
                if (!shapes[i]) {
                    shapes[i] = [];
                    let base = toShape.pop();
                    shapes[i].push(base);
                }
            }

            for (let shape of shapes) {
                let color = Phaser.Color.getRandomColor();
                for (let oct of shape) {
                    oct.updateColor(color);
                }
            }


        }

        public get widthPx(): number {
            return this.scale.x * this.col * this.size;
        }

        public get heightPx(): number {
            return this.scale.y * this.row * this.size;
        }


    }

}