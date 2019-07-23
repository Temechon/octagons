module OCT {
    export class HomeButton extends Phaser.Graphics {

        private _text: Phaser.Text;
        private _icon: Phaser.Sprite;
        private _top: Phaser.Graphics;
        private _offset: number;

        private _isCliked = false;

        /** Function called when the selected animation is finished */
        public onInputDown: () => void;

        constructor(game: Phaser.Game,
            public size: { w: number, h: number },
            public backgroundColor: number,
            public label: string,
            public iconKey: string,
            public fontSize?: number) {

            super(game, 0, 0);

            this._offset = 15 * ratio;
            if (!this.fontSize) {
                this.fontSize = this.size.h / 1.5;
            }

            this._top = new Phaser.Graphics(this.game, 0, 0);
            this.addChild(this._top);
            this.build();
            this.game.add.existing(this);

            this.inputEnabled = true;
            this.input.useHandCursor = true;
            this.events.onInputDown.add((target: Phaser.Graphics, pointer: Phaser.Pointer) => {

                this._top.y += this._offset;
                this._text.y += this._offset;
                this._icon.y += this._offset;
                this._isCliked = true;

            });

            this.events.onInputOut.add(() => {
                if (this._isCliked) {
                    this._top.y -= this._offset;
                    this._text.y -= this._offset;
                    this._icon.y -= this._offset;
                    this._isCliked = false;
                }
            });

            this.events.onInputUp.add((target: Phaser.Graphics, pointer: Phaser.Pointer) => {

                if (this._isCliked) {
                    this._top.y -= this._offset;
                    this._text.y -= this._offset;
                    this._icon.y -= this._offset;
                    this._isCliked = false;

                    this.game.time.events.add(100, () => {
                        if (this.onInputDown) {
                            this.onInputDown();
                        }
                    });
                }
            });
        }


        public build() {

            // * Background
            this._top.clear();
            this.clear();

            let lighter = Helpers.shadeBlendConvert(this.backgroundColor, 0.2);
            this._top.beginFill(this.backgroundColor);
            this._top.drawRoundedRect(-this.size.w / 2, -this.size.h / 2, this.size.w, this.size.h, 20 * ratio);

            this._top.beginFill(lighter);
            this._top.drawRoundedRect(-this.size.w / 2, -this.size.h / 2, this.size.h, this.size.h, 20 * ratio);
            this._top.endFill();

            // * Shadow 
            let darker = Helpers.shadeBlendConvert(this.backgroundColor, -0.4);
            this.beginFill(darker, 1);
            this.drawRoundedRect(-this.size.w / 2, -this.size.h / 2 + 20 * ratio, this.size.w, this.size.h, 20 * ratio);
            this.endFill();

            //* Text
            let size = (this.size.w - this.size.h) / 2;
            let style = { font: Helpers.font(this.fontSize, 'KeepCalm'), fill: "#fff", align: "center" };
            let labelText = this.game.add.text(0, 5 * ratio, this.label, style);
            labelText.anchor.set(0.5, 0.5);
            labelText.x = -this.width / 2 + this.size.h + size;
            labelText.name = "coinsText";
            this._text = labelText;
            this.addChild(labelText);

            // * Icon
            let icon = this.game.add.sprite(0, 0, this.iconKey);
            icon.anchor.set(0.5, 0.5);
            icon.width = icon.height = this.size.h - 50 * ratio;
            this.addChild(icon);
            icon.x = -this.width / 2 + this.size.h / 2
            this._icon = icon;

        }

        updateText(label: string) {
            this.label = label;
            this._text.text = label;
        }
    }
}