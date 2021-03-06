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
         * Cells can be nulls
         */
        private octagons: Array<Array<Octagon>> = [];
        private diamonds: Array<Array<Diamond>> = [];

        /** The list of random shapes to be placed on this grid */
        public shapes: Array<Shape> = [];

        /**
         * Method called when all shapes are correctly displayed
         */
        public onVictory: () => void;

        private _diamSize: number = 0;

        public size: number;
        public lastColorMoved: number;

        constructor(
            game: Phaser.Game,
            public row: number,
            public col: number) {
            super(game);

            this._computeBestSize();

            this._diamSize = this.size / (1 + Math.sqrt(2));

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
                        0xcecece,
                        1);
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
                        0xcecece,
                        1);
                    this.diamonds[i][j] = diams;
                    this.add(diams);
                }
            }

            // Center all octagons and diamonds in the center of the group
            this.forEach((c: Phaser.Sprite) => {
                c.x -= this.widthPx / 2 - this.size / 2;
                c.y -= this.heightPx / 2 - this.size / 2;
            });

        }

        public get nonNullOctagons(): Array<Array<Octagon>> {
            return this.octagons.map(array => array.filter(o => o !== null))
        }

        public setGeometry(geo: Geometry, value: Geometry) {
            if (geo instanceof Octagon) {
                this.setOctagon(geo.row, geo.col, value as Octagon);
            } else {
                this.setDiamond(geo.row, geo.col, value as Diamond);
            }
        }

        public static Build(game: Phaser.Game, options: any): Grid {
            let grid = new Grid(game, options.row, options.col);

            if (options.octagons) {
                for (let i = 0; i < options.row; i++) {
                    for (let j = 0; j < options.col; j++) {
                        if (options.octagons[i][j] === 0) {
                            grid.setOctagon(i, j, null);
                        }
                    }
                }

                for (let i = 0; i < options.row - 1; i++) {
                    for (let j = 0; j < options.col - 1; j++) {
                        if (options.diamonds[i][j] === 0) {
                            grid.setDiamond(i, j, null);
                        }
                    }
                }
            }

            return grid;
        }

        /**
         * row/col&octs/diams
         */
        public toString(): string {
            let oct = [], diams = [];
            for (let i = 0; i < this.row; i++) {
                let oRow = [];
                let dRow = [];
                for (let j = 0; j < this.col; j++) {
                    let oct = this.getOctagon(i, j);
                    let diams = this.getDiamond(i, j);
                    oRow.push((oct) ? 1 : 0);
                    dRow.push((diams) ? 1 : 0);
                }
                oct.push(oRow);
                diams.push(dRow);
            }
            let res = { row: this.row, col: this.col, octagons: oct, diamonds: diams };
            return JSON.stringify(res);
        }

        /**
         * Builds shapes according to this grid
         * @param nbShapes 
         */
        public buildShapes(nbShapes: number) {

            // let colors = randomColor({
            //     count: nbShapes,
            //     luminosity: 'dark',
            //     hue: 'random'
            // });

            let colors = [
                "#2C3E50",
                "#455C7B",
                "#6DBCDB",
                "#685C79",
                "#3498DB",

                "#FC4349",
                "#AC6C82",
                "#DA727E",
                "#DF5A49",
                "#F26101",

                "#E27A3F",
                "#FFBC67",
                "#EFC94C",
                "#FFD393",

                "#42826C",
                "#45B29D",
                "#00ADA7",
                "#85DB18"
            ]

            if (localStorage.getItem(Home.COLOR_MODE) === 'dark') {
                for (let i = 0; i < colors.length; i++) {
                    colors[i] = Helpers.shadeBlendConvert(Phaser.Color.hexToColor(colors[i]).color, -0.2, true) as string;
                }
            }

            Helpers.shuffle(colors);

            // To create shapes, get random octagon and expand it until there is no octagon left
            // First, create starting point of all shapes
            for (let i = 0; i < nbShapes; i++) {
                this.shapes[i] = new Shape(this.game, this, Phaser.Color.hexToColor(colors[i]).color);
                let n: Octagon = chance.pickone(chance.pickone(this.nonNullOctagons));
                while (n.hasShape) {
                    n = chance.pickone(chance.pickone(this.nonNullOctagons));
                }
                n.shape = this.shapes[i];
                let clone = n.clone() as Octagon;
                this.shapes[i].addGeometry(clone);
            }

            // Get all non null octgons without shapes
            let singles = this.getOctagons((oct: Octagon) => !oct.hasShape);
            let didSomething = false;
            while (singles.length !== 0) {
                didSomething = false;
                for (let shape of this.shapes) {
                    let neighbours = shape.getAllNeighbours((n: Octagon) => !n.hasShape);
                    if (neighbours.length > 0) {
                        let nn = chance.pickone(neighbours) as Octagon;
                        nn.shape = shape;
                        let clone = nn.clone() as Octagon;
                        shape.addGeometry(clone);
                        didSomething = true;
                    }
                }
                if (!didSomething) {
                    // Add this single octagon to a new shape
                    let oct = singles[0];
                    let clone = oct.clone() as Octagon;
                    let s = new Shape(this.game, this, Phaser.Color.hexToColor(chance.pickone(colors)).color);
                    this.shapes.push(s);
                    oct.shape = s;
                    s.addGeometry(clone);
                }
                singles = this.getOctagons((oct: Octagon) => !oct.hasShape);
            }
            // Diamonds
            for (let i = 0; i < this.row - 1; i++) {
                for (let j = 0; j < this.col - 1; j++) {
                    let d = this.diamonds[i][j];
                    if (d && !d.hasShape) {
                        let clone = d.clone() as Diamond;
                        // Count its neighbours
                        let neighbours: Array<Octagon> = this.getOctagonsNearDiamond(d);

                        // If all its neighbours are of the same shape, add this diamond to the shapes
                        let shapes: Array<Shape> = this.getShapesOf(neighbours);

                        // If all shapes are null, remove this diamond
                        if (shapes.length === shapes.filter(s => s === null).length) {
                            // No octagons near this diamond, remove it
                            d.kill();
                            clone.kill();
                            this.diamonds[i][j] = null;
                            continue;
                        }
                        // If there is only one shape, add this diamond to it
                        if (shapes.length === 1 && shapes[0] !== null) {
                            shapes[0].addGeometry(clone);
                            continue;
                        }

                        // Otherwise, add this diamond to a random non-null shape
                        chance.pickone(shapes.filter(s => s !== null)).addGeometry(clone);

                    }
                }
            }
        }

        // Cmpute the best size for hexagons to fill the whole space
        private _computeBestSize() {
            let theoricalWidth = (bounds.width - 150 * ratio) / this.col;

            let theoricalHeight = (bounds.height / 2) / this.row;
            let maxSize = Math.min(theoricalWidth, theoricalHeight);

            if (maxSize < 60) {
                this.size = maxSize;
            } else {
                this.size = 60;
            }
        }

        public getOctagon(row: number, col: number): Octagon {
            if (this._isInGrid(row, col)) {
                return this.octagons[row][col];
            }
            return null;
        }

        public setOctagon(row: number, col: number, value: Octagon) {
            if (value === null) {
                this.octagons[row][col].destroy();
                this.octagons[row][col] = null;
            }
            else if (this._isInGrid(row, col)) {
                this.octagons[row][col] = value;
            }
        }

        public setDiamond(row: number, col: number, value: Diamond) {
            if (value === null) {
                this.diamonds[row][col].destroy();
                this.diamonds[row][col] = null;
            }
            else if (this._isDiamondInGrid(row, col)) {
                this.diamonds[row][col] = value;
            }
        }

        /**
         * Returns the octagon the nearest of the screen position given in parameter
         */
        public getNearestGeometry(pointer: { x: number, y: number }): Geometry {
            let minDist = Number.MAX_VALUE;
            let nearest = null;
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    let oct = this.getOctagon(i, j);
                    if (oct) {
                        let dist = Phaser.Math.distanceSq(oct.worldPosition.x, oct.worldPosition.y, pointer.x, pointer.y);
                        if (dist < minDist) {
                            minDist = dist;
                            nearest = oct
                        }
                    }
                }
            }
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    let diam = this.getDiamond(i, j);
                    if (diam) {
                        let dist = Phaser.Math.distanceSq(diam.worldPosition.x, diam.worldPosition.y, pointer.x, pointer.y);
                        if (dist < minDist) {
                            minDist = dist;
                            nearest = diam
                        }
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
                    if (oct && predicate(oct)) {
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

            if (!tile) {
                return null;
            }

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

        public checkVictory(): boolean {

            // Check if each shape is in the grid 
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    let oct = this.getOctagon(i, j);
                    if (oct === null) {
                        continue;
                    }

                    let count = [];
                    for (let s of this.shapes) {
                        s.updateTransform();
                        for (let os of s.octagons) {
                            os.updateTransform();
                            let dist = Phaser.Point.distance(os.worldPosition, oct.worldPosition)

                            if (dist < 0.1) {
                                count.push(os);
                            }
                        }
                    }
                    if (count.length !== 1) {
                        return false;
                    }
                }
            }
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    let diams = this.getDiamond(i, j);
                    if (diams === null) {
                        continue;
                    }

                    let count = [];
                    for (let s of this.shapes) {
                        s.updateTransform();
                        for (let ds of s.diamonds) {
                            ds.updateTransform();
                            let dist = Phaser.Point.distance(ds.worldPosition, diams.worldPosition)

                            if (dist < 0.1) {
                                count.push(ds);
                            }
                        }
                    }
                    if (count.length !== 1) {
                        return false;
                    }
                }
            }

            return true;
        }

        public checkOverlap() {
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    let oct = this.getOctagon(i, j);
                    if (oct === null) {
                        continue;
                    }

                    let count = [];
                    for (let s of this.shapes) {
                        s.updateTransform();
                        for (let os of s.octagons) {
                            os.updateTransform();
                            let dist = Phaser.Point.distance(os.worldPosition, oct.worldPosition)

                            if (dist < 0.1) {
                                count.push(os);
                            }
                        }
                        if (count.length > 1) {
                            for (let o of count) {
                                o.blink();
                            }
                        }
                    }

                }
            }
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    let diams = this.getDiamond(i, j);
                    if (diams === null) {
                        continue;
                    }

                    let count = [];
                    for (let s of this.shapes) {
                        s.updateTransform();
                        for (let ds of s.diamonds) {
                            ds.updateTransform();
                            let dist = Phaser.Point.distance(ds.worldPosition, diams.worldPosition)

                            if (dist < 0.1) {
                                count.push(ds);
                            }
                        }
                        if (count.length > 1) {
                            for (let o of count) {
                                o.blink();
                            }
                        }
                    }

                }
            }
        }

        public destroy() {
            super.destroy();
            for (let s of this.shapes) {
                s.destroy();
            }
        }
    }

}