module OCT {

    declare var moment;

    export class Leaderboard extends Phaser.State {


        create() {

            this.game.stage.backgroundColor = '#F2F2F2';

            // * Debug Bounds
            // var graphics = this.game.add.graphics(0, 0);
            // graphics.beginFill(0xFFFF0B);
            // graphics.fillAlpha = 0.25;
            // graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
            // graphics.endFill();
            // g.destroy();

            // LOGO
            let cup = this.game.add.sprite(this.game.width / 2, 200 * ratio, 'cup');
            cup.scale.multiply(0.75, 0.75);

            let colors = [
                "#FFBC67",
                "#6DBCDB",
                "#FC4349",
                "#2C3E50",
                "#685C79"
            ]

            let width = 800 * ratio;
            let height = 200 * ratio;
            let y = cup.y + 300 * ratio;

            // EASY
            {
                let bestEasy = JSON.parse(localStorage.getItem(Game.LB_KEYS[0]));
                let durationText;
                let dateText;
                let color = "#cecece";

                if (bestEasy) {
                    let duration = moment.duration(parseInt(bestEasy.time))
                    if (duration.minutes() !== 0) {
                        durationText = `${duration.minutes()}m ${duration.seconds()}s`;
                    } else {
                        durationText = `       ${duration.seconds()}s`;
                    }
                    dateText = moment(bestEasy.date).fromNow();
                    color = colors[0];
                }

                let backEasy = this.createBackground(color, width, height, "Easy", "button.easy", dateText, durationText);
                backEasy.x = this.game.world.centerX;
                backEasy.y = y;
            }
            y += 220 * ratio;

            // MEDIUM
            {
                let bestMedium = JSON.parse(localStorage.getItem(Game.LB_KEYS[1]));
                let durationText;
                let dateText;
                let color = "#cecece";

                if (bestMedium) {
                    let duration = moment.duration(parseInt(bestMedium.time))
                    if (duration.minutes() !== 0) {
                        durationText = `${duration.minutes()}m ${duration.seconds()}s`;
                    } else {
                        durationText = `       ${duration.seconds()}s`;
                    }
                    dateText = moment(bestMedium.date).fromNow();
                    color = colors[1];
                }

                let backMedium = this.createBackground(color, width, height, "Medium", "button.medium", dateText, durationText);
                backMedium.x = this.game.world.centerX;
                backMedium.y = y;
            }
            y += 220 * ratio;

            // HARD
            {
                let bestHard = JSON.parse(localStorage.getItem(Game.LB_KEYS[2]));
                let durationText;
                let dateText;
                let color = "#cecece";

                if (bestHard) {
                    let duration = moment.duration(parseInt(bestHard.time))
                    if (duration.minutes() !== 0) {
                        durationText = `${duration.minutes()}m ${duration.seconds()}s`;
                    } else {
                        durationText = `       ${duration.seconds()}s`;
                    }
                    dateText = moment(bestHard.date).fromNow();
                    color = colors[2];
                }

                let backMedium = this.createBackground(color, width, height, "Hard", "button.hard", dateText, durationText);
                backMedium.x = this.game.world.centerX;
                backMedium.y = y;
            }
            y += 220 * ratio;

            // HARDEST
            {
                let bestHard = JSON.parse(localStorage.getItem(Game.LB_KEYS[3]));
                let durationText;
                let dateText;
                let color = "#cecece";

                if (bestHard) {
                    let duration = moment.duration(parseInt(bestHard.time))
                    if (duration.minutes() !== 0) {
                        durationText = `${duration.minutes()}m ${duration.seconds()}s`;
                    } else {
                        durationText = `       ${duration.seconds()}s`;
                    }
                    dateText = moment(bestHard.date).fromNow();
                    color = colors[3];
                }

                let backMedium = this.createBackground(color, width, height, "Hardest", "button.hardest", dateText, durationText);
                backMedium.x = this.game.world.centerX;
                backMedium.y = y;
            }
            y += 220 * ratio;

            // INSANE
            {
                let bestHard = JSON.parse(localStorage.getItem(Game.LB_KEYS[4]));
                let durationText;
                let dateText;
                let color = "#cecece";

                if (bestHard) {
                    let duration = moment.duration(parseInt(bestHard.time))
                    if (duration.minutes() !== 0) {
                        durationText = `${duration.minutes()}m ${duration.seconds()}s`;
                    } else {
                        durationText = `       ${duration.seconds()}s`;
                    }
                    dateText = moment(bestHard.date).fromNow();
                    color = colors[4];
                }

                let backMedium = this.createBackground(color, width, height, "Insane", "button.insane", dateText, durationText);
                backMedium.x = this.game.world.centerX;
                backMedium.y = y;
            }
            y += 220 * ratio;


            // BACK HOME
            let backButton = this.game.add.sprite(this.game.world.centerX, this.game.height - 200 * ratio, 'button.back');
            backButton.inputEnabled = true;
            backButton.events.onInputDown.add(() => {
                backButton.scale.multiply(0.85, 0.85);
            });

            backButton.events.onInputUp.add(() => {
                backButton.scale.set(ratio, ratio);
                this.game.time.events.add(100, () => {
                    this.game.state.start('home');
                });
            });

        }

        private createBackground(color: string, width: number, height: number, text: string, iconKey: string, date: string, time: string): Phaser.Sprite {
            let colorAsNumber = Phaser.Color.hexToColor(color).color;
            let lighter: string = Helpers.shadeBlendConvert(colorAsNumber, 0.2, true) as string;
            let lighter2: string = Helpers.shadeBlendConvert(colorAsNumber, 0.7, true) as string;


            let w = width / ratio;
            let h = height / ratio;

            var myBitmap: Phaser.BitmapData = this.game.add.bitmapData(w, h);
            let grd = myBitmap.context.createLinearGradient(0, h / 2, w, h / 2);
            grd.addColorStop(0, lighter);
            grd.addColorStop(1, color);
            myBitmap.context.fillStyle = grd;
            myBitmap.context.fillRect(0, 0, w, h);

            let myMask = this.game.add.graphics(0, 0);
            myMask.beginFill(0x000);
            let maskW = w / 2;
            let maskH = h / 2;

            myMask.drawRoundedRect(-maskW, -maskH, w, h, 30 * ratio)
            myMask.endFill();

            let sprite = this.game.add.sprite(0, 0, myBitmap);
            sprite.addChild(myMask);
            sprite.mask = myMask;

            // Difficulty
            let yposition = -h / 2 + 80;
            if (!date) {
                yposition = 0;
            }
            let style = { font: Helpers.font(50 * 1 / ratio, 'KeepCalm'), fill: "#fff", align: "center" };
            let textText = this.game.add.text(-w / 2 + 220, yposition, text, style);
            textText.anchor.set(0, 0.5);
            sprite.addChild(textText);

            let icon = this.game.add.sprite(-w / 2, 0, iconKey);
            icon.scale.set(0.7, 0.7);
            icon.anchor.set(-0.25, 0.5);
            icon.alpha = 0.5;
            sprite.addChild(icon);

            // Time
            style = { font: Helpers.font(65 * 1 / ratio, 'KeepCalm'), fill: "#fff", align: "center" };
            let timeText = this.game.add.text(120, 0, time, style);
            timeText.anchor.set(0, 0.5);
            sprite.addChild(timeText);

            // Date
            style = { font: Helpers.font(30 * 1 / ratio, 'KeepCalm'), fill: lighter2, align: "center" };
            let dateText = this.game.add.text(-w / 2 + 220, 35, date, style);
            dateText.anchor.set(0, 0.5);
            sprite.addChild(dateText);


            return sprite;
        }
    }
}