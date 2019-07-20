module SYM {

    // ChooseAsync - Select a player in the friend list
    // SwitchAsync - Switch the current context - Useful to retrieve a previous duel

    export class APIHelper {

        public static getLastLevel(): number {
            let lastlevel = localStorage.getItem('lastlevel');
            if (lastlevel) {
                return parseInt(lastlevel);
            }
            return 1;
        }

        public static saveLastLevel(lastLevel: number) {
            kongregate.stats.submit("bestlevel", lastLevel);
            localStorage.setItem('lastlevel', lastLevel.toString());
        }

        public static sendStat(stats, value: any) {
            kongregate.stats.submit(stats, value);
        }

        public static saveScore(score: number) {
            kongregate.stats.submit('bestscore', score);
        }

        /**
         * Return the current context ID
         */
        public static getContextID() {
            // return FBInstant.context.getID();
        }

        /**
         * Return the current context Type : 'POST', 'THREAD', 'GROUP', or 'SOLO'.
         */
        public static getContextType() {
            // return FBInstant.context.getType();
        }

        /**
         * Returns any data object associated with the entry point that the game was launched from.
         */
        public static getEntryPointData() {
            // return FBInstant.getEntryPointData();
        }

        public static getPhoto() {
            // return FBInstant.player.getPhoto();
        }

        /**
         * Send a custom update in the thread
         * No CTA as PLAY is used by default and already localized
         */
        // public static sendUpdate(templateName: string, cta: LocalizedUpdateText, text: LocalizedUpdateText, data: any) {
        //     FBInstant.updateAsync({
        //         action: 'CUSTOM',
        //         cta: cta,
        //         template: templateName,
        //         image: ONEBOSS.DUEL_FINISHED_NOTIF,
        //         text: text,
        //         data: data,
        //         strategy: 'IMMEDIATE',
        //         notification: 'NO_PUSH'
        //     }).catch((e) => {
        //         console.error(e);
        //     })
        // }

        /**
         * Share the given image in base 64 with Facebook
         */
        // public static share(text: string, imgBase64: string): Promise<any> {
        //     return FBInstant.shareAsync({
        //         intent: 'REQUEST',
        //         image: imgBase64,
        //         text: text
        //     });
        // }

        /**
         * Returns the current player name
         */
        // public static getPlayerName() {
        //     return FBInstant.player.getName();
        // }

        /**
         * Return the current player ID
         */
        // public static getPlayerID() {
        //     return FBInstant.player.getID();
        // }

        /**
         * Returns true if the given operation is supported by the client
         * @param operation 
         */
        // public static isSupported(operation: string): boolean {
        //     let supported = FBInstant.getSupportedAPIs();
        //     return supported.indexOf(operation) !== -1;
        // }

        /**
         * Adds X coins to the player accounts
         * @param delta 
         */
        // public static addCoins(delta: number) {
        //     // TODO here
        //     // FBInstant.player.incrementStatsAsync({ coins: delta });
        // }

        // public static async getData(data: string): Promise<any> {
        //     return { data: 'coucou' };
        // }
    }
}