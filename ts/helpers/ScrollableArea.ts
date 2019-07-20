module SYM {

    export class ScrollableArea extends Phaser.Group {
        _x: any;
        _y: any;
        _w: any;
        _h: any;
        maskGraphics: any;
        dragging: boolean;
        pressedDown: boolean;
        timestamp: number;
        targetX: number;
        targetY: number;
        autoScrollX: boolean;
        autoScrollY: boolean;
        inputX: number;
        inputY: number;
        startX: number;
        startY: number;
        velocityX: number;
        velocityY: number;
        amplitudeX: number;
        amplitudeY: number;
        directionWheel: number;
        velocityWheelX: number;
        velocityWheelY: number;
        settings: {
            kineticMovement: boolean;
            timeConstantScroll: number; //really mimic iOS
            horizontalScroll: boolean;
            verticalScroll: boolean;
            horizontalWheel: boolean;
            verticalWheel: boolean;
            deltaWheel: number;
            clickXThreshold: number;
            clickYThreshold: number;
        };
        allowScrollStopOnTouch: any;
        scrollTween: any;
        startedInside: boolean;
        now: number;
        velocityWheelXAbs: number;
        velocityWheelYAbs: number;
        elapsed: number;

        selectedSprite: Phaser.Sprite;

        constructor(game, x, y, w, h, params) {
            super(game);
            params = params || {};


            this._x = this.x = x;
            this._y = this.y = y;
            this._w = w;
            this._h = h;

            this.maskGraphics = game.add.graphics(x, y);
            this.maskGraphics.beginFill(0x000000);
            this.maskGraphics.drawRect(0, 0, w, h);
            this.maskGraphics.alpha = 0.2;
            this.maskGraphics.inputEnabled = true;
            this.mask = this.maskGraphics;

            this.dragging = false;
            this.pressedDown = false;
            this.timestamp = 0;

            this.targetX = 0;
            this.targetY = 0;

            this.autoScrollX = false;
            this.autoScrollY = false;

            this.inputX = 0;
            this.inputY = 0;

            this.startX = 0;
            this.startY = 0;

            this.velocityX = 0;
            this.velocityY = 0;

            this.amplitudeX = 0;
            this.amplitudeY = 0;

            this.directionWheel = 0;

            this.velocityWheelX = 0;
            this.velocityWheelY = 0;

            this.selectedSprite = null;

            this.settings = {
                kineticMovement: true,
                timeConstantScroll: 325, //really mimic iOS
                horizontalScroll: true,
                verticalScroll: true,
                horizontalWheel: false,
                verticalWheel: true,
                deltaWheel: 40,
                clickXThreshold: 5,
                clickYThreshold: 5,
            };

            this.configure(params);

        }


        addChild(child) {
            this.maskGraphics.x = this.parent.x + this._x;
            this.maskGraphics.y = this.parent.y + this._y;
            return super.addChild(child);
        }

        /**
        * Change Default Settings of the plugin
        *
        * @method ScrollableArea#configure
        * @param {Object}  [options] - Object that contain properties to change the behavior of the plugin.
        * @param {number}  [options.timeConstantScroll=325] - The rate of deceleration for the scrolling.
        * @param {boolean} [options.kineticMovement=true]   - Enable or Disable the kinematic motion.
        * @param {boolean} [options.horizontalScroll=true]  - Enable or Disable the horizontal scrolling.
        * @param {boolean} [options.verticalScroll=false]   - Enable or Disable the vertical scrolling.
        * @param {boolean} [options.horizontalWheel=true]   - Enable or Disable the horizontal scrolling with mouse wheel.
        * @param {boolean} [options.verticalWheel=false]    - Enable or Disable the vertical scrolling with mouse wheel.
        * @param {number}  [options.deltaWheel=40]          - Delta increment of the mouse wheel.
        */
        configure(options) {
            if (options) {
                for (var property in options) {
                    if (this.settings.hasOwnProperty(property) && this.settings[property] != null) {
                        this.settings[property] = options[property];
                    }
                }
            }
        };

        /**
        * Start the Plugin.
        *
        * @method ScrollableArea#start
        */
        start() {
            this.game.input.onDown.add(this.beginMove, this);
            this.game.input.addMoveCallback(this.moveCanvas, this);
            this.game.input.onUp.add(this.endMove, this);
            this.game.input.mouse.mouseWheelCallback = this.mouseWheel.bind(this);
        };

        /**
        * Event triggered when a pointer is pressed down, resets the value of variables.
        */
        beginMove() {

            if (this.allowScrollStopOnTouch && this.scrollTween) {
                this.scrollTween.pause();
            }

            if (this.maskGraphics.getBounds().contains(this.game.input.x, this.game.input.y)) {
                this.startedInside = true;

                this.startX = this.inputX = this.game.input.x;
                this.startY = this.inputY = this.game.input.y;
                this.pressedDown = true;
                this.timestamp = Date.now();
                this.velocityY = this.amplitudeY = this.velocityX = this.amplitudeX = 0;
            }
            else {
                this.startedInside = false;
            }

            // Activate sprite if clicked on it
            let sprite = this._getClickedSprite();
            if (sprite) {
                sprite.events.onInputDown.dispatch();
                this.selectedSprite = sprite;
                // console.log(this.selectedSprite)
            }
        };

        /**
        * Event triggered when the activePointer receives a DOM move event such as a mousemove or touchmove.
        * The camera moves according to the movement of the pointer, calculating the velocity.
        */
        moveCanvas(pointer, x, y) {
            if (!this.pressedDown) return;

            // If a sprite has been selected, unselect it and move the scrollablearea
            if (this.selectedSprite) {
                this.selectedSprite.events.onInputOut.dispatch();
                this.selectedSprite = null;
            }

            this.now = Date.now();
            var elapsed = this.now - this.timestamp;
            this.timestamp = this.now;

            if (this.settings.horizontalScroll) {
                var delta = x - this.startX; //Compute move distance
                if (delta !== 0) this.dragging = true;
                this.startX = x;
                this.velocityX = 0.8 * (1000 * delta / (1 + elapsed)) + 0.2 * this.velocityX;
                this.x += delta;
            }

            if (this.settings.verticalScroll) {
                var delta = y - this.startY; //Compute move distance
                if (delta !== 0) this.dragging = true;
                this.startY = y;
                this.velocityY = 0.8 * (1000 * delta / (1 + elapsed)) + 0.2 * this.velocityY;
                this.y += delta;
            }

            this.limitMovement();

        };

        /**
        * Event triggered when a pointer is released, calculates the automatic scrolling.
        */
        endMove() {
            if (this.selectedSprite) {
                this.selectedSprite.events.onInputUp.dispatch();
                this.selectedSprite = null;
            }

            if (this.startedInside) {
                this.pressedDown = false;
                this.autoScrollX = false;
                this.autoScrollY = false;

                if (!this.settings.kineticMovement) return;

                this.now = Date.now();

                if (this.game.input.activePointer.withinGame) {
                    if (this.velocityX > 10 || this.velocityX < -10) {
                        this.amplitudeX = 0.8 * this.velocityX;
                        this.targetX = Math.round(this.x + this.amplitudeX);
                        this.autoScrollX = true;
                    }

                    if (this.velocityY > 10 || this.velocityY < -10) {
                        this.amplitudeY = 0.8 * this.velocityY;
                        this.targetY = Math.round(this.y + this.amplitudeY);
                        this.autoScrollY = true;
                    }
                }
                if (!this.game.input.activePointer.withinGame) {
                    this.velocityWheelXAbs = Math.abs(this.velocityWheelX);
                    this.velocityWheelYAbs = Math.abs(this.velocityWheelY);
                    if (this.settings.horizontalScroll && (this.velocityWheelXAbs < 0.1 || !this.game.input.activePointer.withinGame)) {
                        this.autoScrollX = true;
                    }
                    if (this.settings.verticalScroll && (this.velocityWheelYAbs < 0.1 || !this.game.input.activePointer.withinGame)) {
                        this.autoScrollY = true;
                    }
                }
            }
        }

        /**
         * Return the selected sprite inside the scrollable area, only if the sprite is inputEnabled = true
         */
        private _getClickedSprite(): Phaser.Sprite {
            if (Math.abs(this.game.input.x - this.inputX) <= this.settings.clickXThreshold && Math.abs(this.game.input.y - this.inputY) <= this.settings.clickYThreshold) {
                for (var i = 0; i < this.children.length; i++) {
                    let obj = this.getChildAt(i) as Phaser.Sprite;
                    if (obj.getBounds().contains(this.game.input.x, this.game.input.y) && obj.inputEnabled) {
                        return obj;
                    }
                }
            }
            return null;
        }

        scrollTo(x, y, time, easing, allowScrollStopOnTouch) {
            if (this.scrollTween) {
                this.scrollTween.pause();
            }

            x = (x > 0) ? -x : x;
            y = (y > 0) ? -y : y;
            easing = easing || Phaser.Easing.Quadratic.Out;
            time = time || 1000;
            allowScrollStopOnTouch = allowScrollStopOnTouch || false;

            this.allowScrollStopOnTouch = allowScrollStopOnTouch;
            this.scrollTween = this.game.add.tween(this);
            this.scrollTween.to({ x: x, y: y }, time, easing).start();
        }

        /**
        * Event called after all the core subsystems and the State have updated, but before the render.
        * Create the deceleration effect.
        */
        update() {

            this.elapsed = Date.now() - this.timestamp;
            this.velocityWheelXAbs = Math.abs(this.velocityWheelX);
            this.velocityWheelYAbs = Math.abs(this.velocityWheelY);

            if (this.autoScrollX && this.amplitudeX != 0) {
                var delta = -this.amplitudeX * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
                if (delta > 0.5 || delta < -0.5) {
                    this.x = this.targetX + delta;
                }
                else {
                    this.autoScrollX = false;
                    //this.x = -this.targetX;
                }
            }

            if (this.autoScrollY && this.amplitudeY != 0) {

                var delta = -this.amplitudeY * Math.exp(-this.elapsed / this.settings.timeConstantScroll);
                if (delta > 0.5 || delta < -0.5) {
                    this.y = this.targetY + delta;
                }
                else {
                    this.autoScrollY = false;
                    //this.y = -this.targetY;
                }
            }

            if (!this.autoScrollX && !this.autoScrollY) {
                this.dragging = false;
            }

            if (this.settings.horizontalWheel && this.velocityWheelXAbs > 0.1) {
                this.dragging = true;
                this.amplitudeX = 0;
                this.autoScrollX = false;
                this.x += this.velocityWheelX;
                this.velocityWheelX *= 0.95;
            }

            if (this.settings.verticalWheel && this.velocityWheelYAbs > 0.1) {
                this.dragging = true;
                this.autoScrollY = false;
                this.y += this.velocityWheelY;
                this.velocityWheelY *= 0.95;
            }

            this.limitMovement();
        };

        /**
        * Event called when the mousewheel is used, affect the direction of scrolling.
        */
        mouseWheel(event) {
            if (!this.settings.horizontalWheel && !this.settings.verticalWheel) return;

            event.preventDefault();

            var delta = this.game.input.mouse.wheelDelta * 120 / this.settings.deltaWheel;

            if (this.directionWheel != this.game.input.mouse.wheelDelta) {
                this.velocityWheelX = 0;
                this.velocityWheelY = 0;
                this.directionWheel = this.game.input.mouse.wheelDelta;
            }

            if (this.settings.horizontalWheel) {
                this.autoScrollX = false;

                this.velocityWheelX += delta;
            }

            if (this.settings.verticalWheel) {
                this.autoScrollY = false;

                this.velocityWheelY += delta;
            }

        };

        /**
        * Stop the Plugin.
        *
        * @method ScrollableArea#stop
        */
        stop() {
            this.game.input.onDown.remove(this.beginMove, this);

            this.game.input.deleteMoveCallback(this.moveCanvas, this);

            this.game.input.onUp.remove(this.endMove, this);

            this.game.input.mouse.mouseWheelCallback = null;

        };

        /**
        * Reposition the scroller
        */
        setPosition(position) {
            if (position.x) {
                this.x += position.x - this._x;
                this.maskGraphics.x = this._x = position.x;
            }
            if (position.y) {
                this.y += position.y - this._y;
                this.maskGraphics.y = this._y = position.y;
            }
        }

        /**
        * Prevent overscrolling.
        */
        limitMovement() {
            if (this.settings.horizontalScroll) {
                if (this.x > this._x)
                    this.x = this._x;
                if (this.x < -(this.width - this._w - this._x)) {
                    if (this.width > this._w) {
                        this.x = -(this.width - this._w - this._x);
                    }
                    else {
                        this.x = this._x;
                    }
                }
            }

            if (this.settings.verticalScroll) {
                if (this.y > this._y)
                    this.y = this._y;
                if (this.y < -(this.height - this._h - this._y)) {
                    if (this.height > this._h) {
                        this.y = -(this.height - this._h - this._y);
                    }
                    else {
                        this.y = this._y;
                    }
                }
            }
        }
    }
}