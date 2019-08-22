module OCT {

    export class Shape extends Phaser.Group {

        public octagons: Array<Octagon> = [];
        public diamonds: Array<Diamond> = [];
        private _picked = false;
        private dragStartCoords: { x: number, y: number } = { x: 0, y: 0 };

        public color: number;

        private _nbRows = 0;
        private _nbCols = 0;

        public center: Phaser.Point;

        private _center: Phaser.Graphics;

        constructor(game: Phaser.Game, public grid: Grid) {
            super(game);

            this.center = new Phaser.Point(0, 0);

            this._center = this.game.add.graphics(0, 0);
            this._center.beginFill(0xFF0000);
            this._center.drawCircle(0, 0, 25);
            this._center.endFill();
            this.addChild(this._center);

            // Activate drag n drop
            this.inputEnableChildren = true;

            let startx, starty;
            this.onChildInputDown.add((children: Phaser.Sprite, pi: Phaser.Pointer) => {
                this._picked = true;
                this.dragStartCoords.x = pi.x - this.x;
                this.dragStartCoords.y = pi.y - this.y;
                this.game.world.bringToTop(this);
            });
            this.onChildInputUp.add((sprite, pi: Phaser.Pointer) => {
                this._picked = false;

                this.updateTransform();

                // Dont auto-align if the pointer is not on the grid
                if (this.grid.hasPointer(pi)) {

                    // Try to set up its position on the grid
                    // get octagon in the grid that 
                    let octa = this.grid.getNearestOctagon({ x: pi.x, y: pi.y });
                    octa.updateTransform();

                    // selected octagon in the shape
                    let shapeOcta = this.getNearestOctagon({ x: pi.x, y: pi.y });
                    shapeOcta.updateTransform();

                    this.x += octa.worldPosition.x - shapeOcta.worldPosition.x;
                    this.y += octa.worldPosition.y - shapeOcta.worldPosition.y;
                }
            });
        }

        private _countRowsCols() {
            this._nbRows = this.octagons.map(oct => oct.row).filter(Helpers.distinct).length;
            this._nbCols = this.octagons.map(oct => oct.col).filter(Helpers.distinct).length;
        }

        private _updateCenter() {
            this.center.x = this.center.y = 0;
            for (let oct of this.octagons) {
                oct.updateTransform();
                this.center.x += oct.worldPosition.x;
                this.center.y += oct.worldPosition.y;
            }

            this.center.x /= this.octagons.length;
            this.center.y /= this.octagons.length;

            this._center.kill();
            this.removeChild(this._center);
            this._center = this.game.add.graphics(0, 0);
            this._center.beginFill(0xFF0000);
            this._center.drawCircle(this.center.x, this.center.y, 25);
            this._center.endFill();
            this.addChild(this._center);
            this.bringToTop(this._center);
        }

        public debug() {
            let rect = this.game.add.graphics(-this.widthPx / 2, -this.heightPx / 2);
            rect.lineStyle(5, 0x00ff00);
            rect.drawRect(0, 0, this.widthPx, this.heightPx);
            rect.endFill();
            this.addChild(rect)
            console.log(this.widthPx, this.heightPx)
        }

        public setAt(x: number, y: number) {
            let diff = Phaser.Point.subtract(this.worldPosition as Phaser.Point, this.center);
            this.x = x + diff.x;
            this.y = y + diff.y;
        }

        public get widthPx(): number {
            return this._nbCols * this.grid.size;
        }

        public get heightPx(): number {
            return this._nbRows * this.grid.size;
        }

        public move(pi: Phaser.Pointer) {
            if (this._picked) {
                this.x = pi.clientX - this.dragStartCoords.x;
                this.y = pi.clientY - this.dragStartCoords.y;
            }
        }

        /**
         * Returns the octagon the nearest of the screen position given in parameter
         */
        public getNearestOctagon(pointer: { x: number, y: number }): Octagon {
            let minDist = Number.MAX_VALUE;
            let nearest = null;
            for (let oct of this.octagons) {
                let dist = Phaser.Math.distanceSq(oct.worldPosition.x, oct.worldPosition.y, pointer.x, pointer.y);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = oct
                }
            }
            return nearest;
        }

        public addGeometry(geo: Geometry) {
            if (geo instanceof Octagon) {
                this.octagons.push(geo as Octagon);
                this._updateCenter();
            }
            if (geo instanceof Diamond) {
                this.diamonds.push(geo as Diamond);
            }

            geo.shape = this;
            geo.updateColor(this.color);
            this.add(geo);

            this._countRowsCols();
        }

        public updateColor(color: number) {
            this.color = color;
            for (let oct of this.octagons) {
                oct.updateColor(color);
            }
            for (let d of this.diamonds) {
                d.updateColor(color);
            }
        }

        public getAllNeighbours(predicate: (oct: Octagon) => boolean = (oct) => true): Array<Octagon> {
            let res = [];

            for (let oct of this.octagons) {
                let neighbours = this.grid.getOctagonsNearOctagon(oct);
                for (let n of neighbours) {
                    if (n && !this.hasOctagon(n) && res.indexOf(n) === -1) {
                        if (predicate(n)) {
                            res.push(n);
                        }
                    }
                }
            }

            return res;
        }

        public hasOctagon(other: Octagon): boolean {
            for (let oct of this.octagons) {
                if (oct.equals(other)) {
                    return true;
                }
            }
            return false;
        }

    }
}