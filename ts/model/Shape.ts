module OCT {

    export class Shape extends Phaser.Group {

        public octagons: Array<Octagon> = [];
        public diamonds: Array<Diamond> = [];
        private _picked = false;
        private dragStartCoords: { x: number, y: number } = { x: 0, y: 0 };

        private _nbRows = 0;
        private _nbCols = 0;

        public center: Phaser.Point;

        private outline: Phaser.Graphics;
        private smallOutline: Phaser.Graphics;


        constructor(game: Phaser.Game, public grid: Grid, public color: number) {
            super(game);

            // let origin = this.game.add.graphics(0, 0);
            // origin.beginFill(0x0000ff);
            // origin.drawCircle(0, 0, 25);
            // origin.endFill();
            // this.addChild(origin);

            this.outline = this.game.add.graphics(0, 0);
            this.outline.visible = false;
            this.addChild(this.outline);


            this.smallOutline = this.game.add.graphics(0, 0);
            this.smallOutline.visible = false;
            this.addChild(this.smallOutline);

            // Activate drag n drop
            this.inputEnableChildren = true;

            this.onChildInputDown.add((children: Phaser.Sprite, pi: Phaser.Pointer) => {
                this._picked = true;

                this.dragStartCoords.x = this.game.input.x - this.x;
                this.dragStartCoords.y = this.game.input.y - this.y;
                this.game.world.bringToTop(this);
                this.highlight();
            });
            this.onChildInputUp.add((sprite, pi: Phaser.Pointer) => {
                this._picked = false;
                this.highlight();

                // Unblink for all shapes
                for (let s of this.grid.shapes) {
                    s.unblink();
                }
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

                this.grid.lastColorMoved = this.color;
                this.grid.checkOverlap();

                // Check if the game is won
                if (this.grid.checkVictory()) {
                    this.grid.onVictory();
                }

            });
        }

        public pop(color: number) {

            this.updateColor(color);
            setTimeout(() => {
                this.game.add.tween(this.scale).to({ x: 2, y: 2 }, 1000, Phaser.Easing.Circular.Out, true);
                this.game.add.tween(this).to({ alpha: 0 }, 500, Phaser.Easing.Circular.Out, true);
            }, 750);

        }

        private _countRowsCols() {
            this._nbRows = this.octagons.map(oct => oct.row).filter(Helpers.distinct).length;
            this._nbCols = this.octagons.map(oct => oct.col).filter(Helpers.distinct).length;
        }

        public highlight() {
            this.outline.visible = !this.outline.visible;
        }

        public unblink() {
            for (let oct of this.octagons) {
                oct.unblink();
            }
            for (let d of this.diamonds) {
                d.unblink();
            }
        }

        public debug() {
            this._updateCenter();
            let gcenter = this.game.add.graphics(0, 0);
            gcenter.beginFill(0xFF0000);
            gcenter.drawCircle(this.center.x, this.center.y, 15);
            gcenter.endFill();
            this.addChild(gcenter);
            this.bringToTop(gcenter);
        }


        private _updateCenter() {
            this.center = new Phaser.Point(0, 0);
            this.updateTransform();
            // Bounding box
            let xmin = Math.min(...this.octagons.map(o => o.worldPosition.x));
            let ymin = Math.min(...this.octagons.map(o => o.worldPosition.y));
            let xmax = Math.max(...this.octagons.map(o => o.worldPosition.x));
            let ymax = Math.max(...this.octagons.map(o => o.worldPosition.y));

            let width = (xmax - xmin);
            let height = (ymax - ymin);

            // let bbox = this.game.add.graphics(0, 0);
            // bbox.lineStyle(3, 0x00ff00);
            // bbox.drawRect(xmin - this.x, ymin - this.y, width, height);
            // bbox.endFill();
            // this.addChild(bbox);
            // this.bringToTop(bbox);

            this.center.x = (xmin - this.x) + width / 2;
            this.center.y = (ymin - this.y) + height / 2;
        }

        /**
         * Set the shape to the given x/y coordinates
         */
        public setAt(x: number, y: number) {
            this.x = x - this.center.x;
            this.y = y - this.center.y;
        }

        public get widthPx(): number {
            return this._nbCols * this.grid.size;
        }

        public get heightPx(): number {
            return this._nbRows * this.grid.size;
        }

        public move(pi: Phaser.Pointer) {
            if (this._picked) {
                this.x = this.game.input.x - this.dragStartCoords.x;
                this.y = this.game.input.y - this.dragStartCoords.y;
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
                // Draw on outline
                geo.drawOn(this.outline, 1.2, Helpers.shadeBlendConvert(this.color, -0.4) as number);
                geo.drawOn(this.smallOutline, 1.05, Helpers.shadeBlendConvert(this.color, -0.1) as number);
            }
            if (geo instanceof Diamond) {
                this.diamonds.push(geo as Diamond);
                // Draw on outline
                geo.drawOn(this.outline, 1.5, Helpers.shadeBlendConvert(this.color, -0.4) as number);
                geo.drawOn(this.smallOutline, 1.1, Helpers.shadeBlendConvert(this.color, -0.1) as number);
            }

            this._countRowsCols();
            geo.shape = this;
            geo.updateColor(this.color);
            this.add(geo);

            this._updateCenter();

        }

        public updateColor(color: number) {
            this.color = color;

            this.outline.clear();
            this.smallOutline.clear();

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