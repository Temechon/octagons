module OCT {
    export class Helpers {


        /**
         * Returns the string to be used as a style to create a phaser text
         * @param _size 
         * @param _family 
         */
        public static font(_size: number, _family: string): string {
            let px = _size * ratio;
            return px + "px " + _family;
        }

        /**
         * array.filter(distinct) return an array with distinct values
         */
        public static distinct(value, index, self) {
            return self.indexOf(value) === index;
        }

        /**
         * Randomize array element order in-place.
         * Using Durstenfeld shuffle algorithm.
         */
        public static shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        public static shadeBlendConvert(color: number, percent: number): number {
            let colorHex: string = color.toString(16);
            if (colorHex.length > 6) {
                colorHex = "#" + colorHex.slice(1);
            } else {
                colorHex = "#" + colorHex;
            }
            colorHex = Helpers.padEnd(colorHex, 7, '0');

            let resHex = Helpers._shadeBlendConvert(percent, colorHex);
            let res = parseInt(resHex.slice(1), 16);
            return res;
        }

        /**
         * Pad the given string with the given filler 
         * @param str 
         * @param length 
         * @param filler 
         */
        public static padEnd(str: string, length: number, filler: string) {
            var intMaxLength = length;
            if (intMaxLength <= str.length) {
                return str;
            }
            var fillLen = intMaxLength - str.length;
            while (filler.length < fillLen) {
                var fLen = filler.length;
                var remainingCodeUnits = fillLen - fLen;
                filler += fLen > remainingCodeUnits ? filler.slice(0, remainingCodeUnits) : filler;
            }

            var truncatedStringFiller = filler.length > fillLen ? filler.slice(0, fillLen) : filler;
            return str + truncatedStringFiller;
        }

        /**
         * Returns
         * @param color Hex color
         * @param percent 
         */
        public static _shadeBlendConvert = function (p: number, from, to?) {
            if (typeof (p) != "number" || p < -1 || p > 1 || typeof (from) != "string" || (from[0] != 'r' && from[0] != '#') || (to && typeof (to) != "string")) return null; //ErrorCheck
            if (!this.sbcRip) this.sbcRip = (d) => {
                let l = d.length, RGB = {};
                if (l > 9) {
                    d = d.split(",");
                    if (d.length < 3 || d.length > 4) return null;//ErrorCheck
                    RGB[0] = i(d[0].split("(")[1]), RGB[1] = i(d[1]), RGB[2] = i(d[2]), RGB[3] = d[3] ? parseFloat(d[3]) : -1;
                } else {
                    if (l == 8 || l == 6 || l < 4) return null; //ErrorCheck
                    if (l < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : ""); //3 or 4 digit
                    d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = -1;
                    if (l == 9 || l == 5) RGB[3] = r((RGB[2] / 255) * 10000) / 10000, RGB[2] = RGB[1], RGB[1] = RGB[0], RGB[0] = d >> 24 & 255;
                } return RGB;
            }
            var i = parseInt, r = Math.round, h = from.length > 9, h = typeof (to) == "string" ? to.length > 9 ? true : to == "c" ? !h : false : h, b = p < 0, p = b ? p * -1 : p, to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF", f = this.sbcRip(from), t = this.sbcRip(to);
            if (!f || !t) return null; //ErrorCheck
            if (h) return "rgb" + (f[3] > -1 || t[3] > -1 ? "a(" : "(") + r((t[0] - f[0]) * p + f[0]) + "," + r((t[1] - f[1]) * p + f[1]) + "," + r((t[2] - f[2]) * p + f[2]) + (f[3] < 0 && t[3] < 0 ? ")" : "," + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3]) + ")");
            else return "#" + (0x100000000 + r((t[0] - f[0]) * p + f[0]) * 0x1000000 + r((t[1] - f[1]) * p + f[1]) * 0x10000 + r((t[2] - f[2]) * p + f[2]) * 0x100 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255)).toString(16).slice(1, f[3] > -1 || t[3] > -1 ? undefined : -2);
        }

        /**
         * Removes all ';' and white spaces at the beginning and at the end of the string
         * @param str 
         */
        public static clean(str: string) {
            return str.trim().replace(/^;+|;+$/g, '').trim();
        }

        /**
         * Executes the given set of promise one after the other.
         * @param list An array of promise functions to be chained
         */
        public static pseries(list) {
            var p = Promise.resolve();
            return list.reduce(function (pacc, fn) {
                return pacc = pacc.then(fn);
            }, p);
        }

        /**
         * Creates the profile picture of the user.
         * Returns a promise having the profile picture as a parameter in the callback function
         */
        public static createProfilePicture(game: Phaser.Game, userId: string, photoUri: string): Promise<Phaser.Image> {
            return new Promise<Phaser.Image>((resolve) => {
                // Check if the photo already exist in cache
                if (game.cache.checkImageKey(userId)) {
                    console.log("find in cache !");

                    resolve(game.make.image(0, 0, game.cache.getBitmapData(userId)));
                } else {
                    // Creates a new image
                    let playerImage = new Image();
                    playerImage.crossOrigin = 'anonymous';
                    playerImage.src = photoUri;

                    playerImage.onload = () => {
                        // Add the image to the phaser game cache
                        game.cache.addImage(userId, photoUri, playerImage);

                        // Create a new image
                        let playerPic = game.make.image(0, 0, userId);
                        // Creates its mask
                        let w = playerPic.width / 2;
                        let mask = game.make.graphics(0, 0);
                        mask.beginFill(0x000000);
                        // Circle mask
                        // mask.drawCircle(w, w, w * 2);
                        // Rounded rectangle mask
                        mask.drawRoundedRect(0, 0, w * 2, w * 2, w / 2);
                        let sprite2 = game.make.sprite(0, 0, mask.generateTexture());
                        let bmd = game.add.bitmapData(2 * w, 2 * w);
                        bmd.alphaMask(playerPic, sprite2);

                        // save bitmap data in cache
                        game.cache.addBitmapData(userId, bmd);
                        resolve(game.make.image(0, 0, bmd));
                    };
                }
            });
        }
    }
}