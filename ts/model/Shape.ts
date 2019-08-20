module OCT {

    export class Shape extends Phaser.Group {

        public octagons: Array<Octagon> = [];
        public diamonds: Array<Diamond> = [];
        private _picked = false;
        private dragStartCoords: { x: number, y: number } = { x: 0, y: 0 };

        public color: number;

        constructor(game: Phaser.Game, public grid: Grid) {
            super(game);


            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0xFF0000);
            graphics.drawCircle(0, 0, 25);
            graphics.endFill();
            this.addChild(graphics);

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
            }
            if (geo instanceof Diamond) {
                this.diamonds.push(geo as Diamond);
            }

            geo.shape = this;
            geo.updateColor(this.color);
            this.add(geo);
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