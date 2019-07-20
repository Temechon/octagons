module SYM {

    export class Timer {

        private _game: Phaser.Game;

        /** The number of times this timer will repeat itself. Set to -1 if infinite */
        public readonly repeat: number;
        private _currentRepeat: number = 0;

        /** The timer will start after this delay */
        public delay: number;

        /** Should the timer call 'action function' immediately after starting ? */
        public readonly immediate: boolean;

        /** The action that will be executed when the timer finished */
        public action: (percent: number) => void;

        /** Function to be called when the timer is finished (no more repeat counts) */
        public onFinish: () => void = () => { };

        /** The scale factor of the time, 1 by default. If it is set to 2, the time will fly twice as fast. If set to 0, the timer won't be updated */
        private _scaleFactor: number = 1;
        private _timer: Phaser.Timer;


        constructor(_game: Phaser.Game, data: {
            delay?: number,
            repeat?: number,
            autostart?: boolean,
            immediate?: boolean,
            action: (percent: number) => void,
            onFinish?: () => void
        }) {

            this._game = _game;
            this.delay = data.delay || 0;
            this.repeat = data.repeat || 1;
            this.immediate = data.immediate || false;
            this.action = data.action;
            if (data.onFinish) {
                this.onFinish = data.onFinish;
            }

            if (data.autostart) {
                this.start();
            }
        }

        public start() {
            if (this.immediate) {
                this._tick();
            }
            this._timer = this._game.time.create(true);
            if (this.repeat === -1) {
                // Loop infinitely
                this._timer.loop(this.delay, this._tick, this);
            } else {
                this._timer.repeat(this.delay, this.repeat, this._tick, this);
            }

            this._timer.onComplete.add(this.onFinish.bind(this));
            this._timer.start();

        }

        private _tick() {
            // Execute the timer action
            this.action(++this._currentRepeat / this.repeat);

        }

        public scaleTime(factor: number) {
            this._scaleFactor = factor;
            this._timer.events[0].delay = this.delay / this._scaleFactor;
        }

        /**
         * Stop the timer, and reset it.
         */
        public stop() {
            this._timer.stop();
        }

        public pause() {
            this._timer.pause();
        }

        public resume() {
            this._timer.resume();
        }


    }
}