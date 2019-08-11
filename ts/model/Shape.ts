module OCT {

    export class Shape extends Phaser.Group {

        public octagons: Array<Octagon> = [];
        public diamonds: Array<Diamond> = [];
        private _picked = false;
        private dragStartCoords: { x: number, y: number } = { x: 0, y: 0 };

        public color: number;

        constructor(game: Phaser.Game, public grid: Grid) {
            super(game);

            // Activate drag n drop
            this.inputEnableChildren = true;

            let startx, starty;
            this.onChildInputDown.add((children: Phaser.Sprite, pi: Phaser.Pointer) => {
                this._picked = true;
                this.dragStartCoords.x = pi.clientX - this.x;
                this.dragStartCoords.y = pi.clientY - this.y;
                this.game.world.bringToTop(this);
            });
            this.onChildInputUp.add((sprite, pi: Phaser.Pointer) => {
                this._picked = false;
                console.log(pi);

                // Try to set up its position on the grid
                let octa = this.grid.getNearestOctagon({ x: pi.clientX, y: pi.clientY });
                // this.x = this.grid.x;
                // this.y = this.grid.y;

                // this.y = octa.worldPosition.y - this.grid.y
            });
        }

        public move(pi: Phaser.Pointer) {
            if (this._picked) {
                this.x = pi.clientX - this.dragStartCoords.x;
                this.y = pi.clientY - this.dragStartCoords.y;
            }
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