module OCT {

    export class APIHelper {

        public static sendStat(stats: string, value: any) {
            kongregate.stats.submit(stats, value);
        }
    }
}