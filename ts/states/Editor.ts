module OCT {

    export class Editor extends Phaser.State {

        // GUI
        public exportButton: Button;
        public skipButton: Button;
        public levelText: Phaser.Text;

        private _rows: number = 3;
        private _cols: number = 3;
        private _grid: Grid;
        private cellNumberText: Phaser.Text;

        constructor() {
            super();
        }

        create() {

            // * Debug Bounds
            // var graphics = this.game.add.graphics(0, 0);
            // graphics.beginFill(0xFFFF0B);
            // graphics.fillAlpha = 0.25;
            // graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
            // graphics.endFill();
            // * Debug text
            // let style = { font: Helpers.font(70, 'arial'), fill: "#ffffff" };
            // let t = this.game.add.text(bounds.x, bounds.y, "Cells : " + window.devicePixelRatio, style);

            // * Grid
            this._grid = this.buildGrid();

            // * Number of cells
            let style = { font: Helpers.font(55, 'Open Sans'), fill: "#204E5F" };
            this.cellNumberText = this.game.add.text(this.game.width / 2, 100, this._grid.getOctagons(oct => oct !== null).length.toString(), style);
            this.cellNumberText.anchor.set(0.5, 0.5);

            //* GUI
            // Export button            
            this.exportButton = new Button(this.game, { w: 200 * ratio, h: 80 * ratio }, 0x204E5F, "Export", 40);
            this.exportButton.setAt(this.game.width / 2 - 150 * ratio, this.game.height - 150 * ratio);
            this.exportButton.onInputDown = () => {
                console.log(this._grid.toString());
                console.log('-');
            };
            // Reset button            
            this.exportButton = new Button(this.game, { w: 200 * ratio, h: 80 * ratio }, 0x204E5F, "Reset", 40);
            this.exportButton.setAt(this.game.width / 2 + 150 * ratio, this.game.height - 150 * ratio);
            this.exportButton.onInputDown = () => {
                this._grid.destroy();
                this._grid = this.buildGrid();
            };
            // Grid size           
            let plus1Row = new Button(this.game, { w: 150 * ratio, h: 80 * ratio }, 0x204E5F, "+1 row", 40);
            plus1Row.setAt(this.game.width / 2 - 300 * ratio, 300 * ratio);
            plus1Row.onInputDown = () => {
                this._rows++;
                this._grid.destroy();
                this._grid = this.buildGrid();
                this.cellNumberText.text = this._grid.getOctagons(oct => oct !== null).length.toString();
            };
            let minus1Row = new Button(this.game, { w: 150 * ratio, h: 80 * ratio }, 0x204E5F, "-1 row", 40);
            minus1Row.setAt(this.game.width / 2 - 100 * ratio, 300 * ratio);
            minus1Row.onInputDown = () => {
                this._rows--;
                if (this._rows < 1) {
                    this._rows = 1;
                }
                this._grid.destroy();
                this._grid = this.buildGrid();
                this.cellNumberText.text = this._grid.getOctagons(oct => oct !== null).length.toString();
            };
            let plus1Col = new Button(this.game, { w: 150 * ratio, h: 80 * ratio }, 0x204E5F, "+1 col", 40);
            plus1Col.setAt(this.game.width / 2 + 300 * ratio, 300 * ratio);
            plus1Col.onInputDown = () => {
                this._cols++;
                this._grid.destroy();
                this._grid = this.buildGrid();
                this.cellNumberText.text = this._grid.getOctagons(oct => oct !== null).length.toString();
            };
            let minus1Col = new Button(this.game, { w: 150 * ratio, h: 80 * ratio }, 0x204E5F, "-1 col", 40);
            minus1Col.setAt(this.game.width / 2 + 100 * ratio, 300 * ratio);
            minus1Col.onInputDown = () => {
                this._cols--;
                if (this._cols < 1) {
                    this._cols = 1;
                }
                this._grid.destroy();
                this._grid = this.buildGrid();
                this.cellNumberText.text = this._grid.getOctagons(oct => oct !== null).length.toString();
            };

        }

        private buildGrid(): Grid {
            let grid: Grid = new Grid(this.game, this._rows, this._cols);
            grid.x = this.game.world.centerX;
            grid.y = this.game.world.centerY;

            grid.forEach((geo: Geometry) => {
                geo.inputEnabled = true;
            })

            grid.onChildInputDown.add((oct: Geometry) => {
                oct.kill();
                grid.setGeometry(oct, null);
                this.cellNumberText.text = this._grid.getOctagons(oct => oct !== null).length.toString();
            });


            return grid;
        }
    }
}