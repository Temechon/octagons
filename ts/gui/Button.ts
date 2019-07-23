module OCT {
    export class Button extends Phaser.Graphics {

        private _text: Phaser.Text;
        private _icon: Phaser.Sprite;
        private _smallIcon: Phaser.Sprite;
        protected _top: Phaser.Graphics;

        private _offset: number = 0;

        /** Function called when the selected animation is finished */
        public onInputDown: () => void;

        constructor(game: Phaser.Game, public size: { w: number, h: number }, public backgroundColor: number, public label: string, public fontSize: number) {
            super(game, 0, 0);

            this._offset = (15 * Math.min(this.size.w, this.size.h) / 180) / devicePixelRatio;

            this._top = new Phaser.Graphics(this.game, 0, 0);
            this.addChild(this._top);
            this.build();

            this.game.add.existing(this);

            this.inputEnabled = true;
            this.input.useHandCursor = true;

            this.events.onInputDown.add((target: Phaser.Graphics, pointer: Phaser.Pointer) => {

                this._top.x -= this._offset;
                this._top.y -= this._offset;

                if (this._text) {
                    this._text.x -= this._offset;
                    this._text.y -= this._offset;
                    this._text.fill = "#E84A5F"
                } else {
                    this._icon.x -= this._offset;
                    this._icon.y -= this._offset;
                }
                if (this._smallIcon) {
                    this._smallIcon.x -= this._offset;
                    this._smallIcon.y -= this._offset;
                }

            });
            this.events.onInputUp.add((target: Phaser.Graphics, pointer: Phaser.Pointer) => {

                this._top.x += this._offset;
                this._top.y += this._offset;

                if (this._text) {
                    this._text.x += this._offset;
                    this._text.y += this._offset;
                    this._text.fill = 'white'
                } else {
                    this._icon.x += this._offset;
                    this._icon.y += this._offset;
                }
                if (this._smallIcon) {
                    this._smallIcon.x += this._offset;
                    this._smallIcon.y += this._offset;
                }

                this.game.time.events.add(100, () => {
                    if (this.onInputDown) {
                        this.onInputDown();
                    }
                });
            });

            this._createText();
        }

        public setAt(x: number, y?: number) {
            this.x = x;

            if (y) {
                this.y = y;
            }
        }

        public scaleIcon(newscale: number) {
            if (this._icon) {
                this._icon.scale.multiply(newscale, newscale);
            }
        }

        public addIconWithText(iconName: string) {
            // Video button
            let icon = this.game.add.sprite(-this.width / 2, 0, iconName);
            icon.anchor.set(-0.2, 0.5);
            icon.scale.set(0.7, 0.7);
            this._smallIcon = icon;
            this.addChild(icon);
        }

        private _createText() {
            // Check if the label is a sprite key
            if (this.game.cache.checkImageKey(this.label)) {
                this._icon = this.game.add.sprite(0, 0, this.label);
                this._icon.scale.multiply(0.40, 0.40);
                this.addChild(this._icon);
            } else {
                let style = { font: Helpers.font(this.fontSize, 'KeepCalm'), fill: "#ffffff", align: "center" };
                this._text = this.game.add.text(0, 0, this.label, style);
                this._text.anchor.set(0.5);
                this.addChild(this._text);
            }
        }

        public build() {
            this._top.clear();
            this.clear();

            this._top.beginFill(this.backgroundColor);
            this._top.drawRoundedRect(-this.size.w / 2, -this.size.h / 2, this.size.w, this.size.h, 20 * ratio);
            this._top.endFill();


            // Draw shadow if needed
            let color = Helpers.shadeBlendConvert(this.backgroundColor, -0.4);
            this.beginFill(color, 1);
            this.drawRoundedRect(-this.size.w / 2 - this._offset, -this.size.h / 2 - this._offset, this.size.w, this.size.h, 20 * ratio);
            this.endFill();
        }

        public updateColor(newColor: number) {
            this.backgroundColor = newColor;
            this.build();
        }
    }
}