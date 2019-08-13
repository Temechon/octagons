module OCT {

    /**
     * A set of octagons and diamonds.
     * If N is the number of octagons on a line, n-1 is the number of square on the same line
     */
    export class Grid extends Phaser.Group {

        /** Direction where this cell neighbours are */
        public static DIRECTIONS = {
            TOP: 0,
            RIGHT: 1,
            BOT: 2,
            LEFT: 3
        }

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

        /** The list of random shapes to be placed on this grid */
        public shapes: Array<Shape> = [];

        private _diamSize: number = 0;

        public size: number;

        constructor(
            game: Phaser.Game,
            public row: number,
            public col: number,
            public nbShapes: number) {
            super(game);

            this._computeBestSize();

            this._diamSize = this.size / (1 + Math.sqrt(2)) + 1;

            // Create octagons
            for (let i = 0; i < this.row; i++) {
                this.octagons[i] = [];
                for (let j = 0; j < this.col; j++) {

                    let oct = new Octagon(
                        this.game,
                        j * this.size,
                        i * this.size,
                        i, j,
                        this.size,
                        0x333333);
                    this.octagons[i][j] = oct;
                    this.add(oct);
                }
            }

            // Create diamonds
            for (let i = 0; i < this.row - 1; i++) {
                this.diamonds[i] = [];
                for (let j = 0; j < this.col - 1; j++) {

                    let diams = new Diamond(
                        this.game,
                        j * this.size + this.size / 2,
                        i * this.size + this.size / 2,
                        i, j,
                        this._diamSize,
                        0x555555);
                    this.diamonds[i][j] = diams;
                    this.add(diams);
                }
            }

            // Center all cell in the center of the group
            this.forEach((c: Phaser.Sprite) => {
                c.x -= this.widthPx / 2 - this.size / 2;
                c.y -= this.heightPx / 2 - this.size / 2;
            });

            // create shapes
            // To create shapes, get random octagon and expand it until there is no octagon left
            // First, create starting point of all shapes
            for (let i = 0; i < this.nbShapes; i++) {
                this.shapes[i] = new Shape(this.game, this);
                let n: Octagon = chance.pickone(chance.pickone(this.octagons));
                while (n.hasShape) {
                    n = chance.pickone(chance.pickone(this.octagons));
                }
                n.shape = this.shapes[i];
                let clone = n.clone() as Octagon;
                this.shapes[i].addGeometry(clone);
                this.shapes[i].updateColor(Phaser.Color.getRandomColor());
            }

            // Get all octgons without shapes
            let singles = this.getOctagons((oct: Octagon) => !oct.hasShape);
            while (singles.length !== 0) {
                for (let shape of this.shapes) {
                    let neighbours = shape.getAllNeighbours((n: Octagon) => !n.hasShape);
                    if (neighbours.length > 0) {
                        let nn = chance.pickone(neighbours) as Octagon;
                        nn.shape = shape;
                        let clone = nn.clone() as Octagon;
                        shape.addGeometry(clone);
                    }
                }
                singles = this.getOctagons((oct: Octagon) => !oct.hasShape);
            }
            // Diamonds
            for (let i = 0; i < this.row - 1; i++) {
                for (let j = 0; j < this.col - 1; j++) {
                    let d = this.diamonds[i][j];
                    if (!d.hasShape) {
                        let clone = d.clone() as Diamond;
                        // Count its neighbours
                        let neighbours: Array<Octagon> = this.getOctagonsNearDiamond(d);

                        // If all its neighbours are of the same shape, add this diamond to the shapes
                        let shapes: Array<Shape> = this.getShapesOf(neighbours);
                        if (shapes.length === 1) {
                            shapes[0].addGeometry(clone);
                            return;
                        }
                        // Otherwise add it to a random shape
                        chance.pickone(shapes).addGeometry(clone);
                    }
                }
            }

            for (let shape of this.shapes) {
                shape.scale.multiply(1.01, 1.01);
            }
        }

        // Cmpute the best size for hexagons to fill the whole space
        private _computeBestSize() {
            let availWidth = bounds.width;
            let theoricalWidth = availWidth / this.col;

            let theoricalHeight = bounds.height / this.row;
            this.size = Math.min(theoricalWidth, theoricalHeight);
        }

        public getOctagon(row: number, col: number): Octagon {
            if (this._isInGrid(row, col)) {
                return this.octagons[row][col];
            }
            return null;
        }

        /**
         * Returns the octagon the nearest of the screen position given in parameter
         */
        public getNearestOctagon(pointer: { x: number, y: number }): Octagon {
            let minDist = Number.MAX_VALUE;
            let nearest = null;
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    let oct = this.getOctagon(i, j);
                    let dist = Phaser.Math.distanceSq(oct.worldPosition.x, oct.worldPosition.y, pointer.x, pointer.y);
                    if (dist < minDist) {
                        minDist = dist;
                        nearest = oct
                    }
                }
            }
            return nearest;
        }

        /**
         * Returns false if the pointer is not on the grid, false otherwise
         */
        public hasPointer(pi: Phaser.Pointer): boolean {
            let minx = this.x - this.widthPx / 2;
            let maxx = this.x + this.widthPx / 2;

            let miny = this.y - this.heightPx / 2;
            let maxy = this.y + this.heightPx / 2;

            return pi.x > minx && pi.x < maxx && pi.y > miny && pi.y < maxy;
        }

        public getOctagons(predicate: (oct: Octagon) => boolean): Array<Octagon> {
            let res = [];
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    let oct = this.getOctagon(i, j);
                    if (predicate(oct)) {
                        res.push(oct);
                    }
                }
            }
            return res;
        }

        public getDiamond(row: number, col: number): Diamond {
            if (this._isDiamondInGrid(row, col)) {
                return this.diamonds[row][col];
            }
            return null;
        }

        /**
         * True if the given position is in the grid, false otherwise
         * @param pos 
         */
        private _isInGrid(row, col) {
            return row >= 0 && row < this.row && col >= 0 && col < this.col;
        }
        /**
         * True if the given position is in the grid, false otherwise
         * @param pos 
         */
        private _isDiamondInGrid(row, col) {
            return row >= 0 && row < this.row - 1 && col >= 0 && col < this.col - 1;
        }

        public get widthPx(): number {
            return this.col * this.size;
        }

        public get heightPx(): number {
            return this.row * this.size;
        }

        public getOctagonsNearDiamond(d: Diamond): Array<Octagon> {
            let res = [];
            res.push(this.getOctagon(d.row, d.col));
            res.push(this.getOctagon(d.row, d.col + 1));
            res.push(this.getOctagon(d.row + 1, d.col));
            res.push(this.getOctagon(d.row + 1, d.col + 1));
            return res;
        }

        public getShapesOf(octs: Array<Octagon>): Array<Shape> {
            return octs.filter((oct: Octagon) => oct !== null).map((oct: Octagon) => oct.shape)
        }

        public getOctagonsNearOctagon(oct: Octagon): Array<Octagon> {
            let res = [];

            for (let key in Grid.DIRECTIONS) {
                let dir = Grid.DIRECTIONS[key];
                res[dir] = this.getOctagonNeighbour(oct, dir);
            }
            // add diagonals
            // res.push(this.getOctagon(oct.row - 1, oct.col - 1));
            // res.push(this.getOctagon(oct.row - 1, oct.col + 1));
            // res.push(this.getOctagon(oct.row + 1, oct.col - 1));
            // res.push(this.getOctagon(oct.row + 1, oct.col + 1));

            return res;
        }
        /**
         * Returns the tile according to the given direction. Returns null if the tile has no number
         * Returns null if the direction is unknown
         * Returns null if the neighbour cell is empty
         * @param tile The center tile
         * @param dir The direction of the neighbors
         * @param proba The probability the neigbors will be picked
         */
        public getOctagonNeighbour(tile: Octagon, dir: number): Octagon {
            let res: Octagon = null;

            switch (dir) {
                case Grid.DIRECTIONS.TOP:
                    res = this.getOctagon(tile.row - 1, tile.col);
                    break;
                case Grid.DIRECTIONS.RIGHT:
                    res = this.getOctagon(tile.row, tile.col + 1);
                    break;
                case Grid.DIRECTIONS.BOT:
                    res = this.getOctagon(tile.row + 1, tile.col);
                    break;
                case Grid.DIRECTIONS.LEFT:
                    res = this.getOctagon(tile.row, tile.col - 1);
                    break;
            }
            return res;
        }


    }

}