var app = {

    loadFonts: () => {
        // Load fonts
        let fonts = ['KeepCalm'];
        let fontloaded = 0;
        for (let f of fonts) {
            new FontFaceObserver(f).load().then(() => {
                console.log(f + ' loaded!')
                if (fontloaded === fonts.length - 1) {
                    app.initialize();
                }
                else {
                    fontloaded++;
                }
            });
        }
    },

    initialize: function () {
        let game = new Phaser.Game(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio, Phaser.CANVAS);
        game.state.add('boot', SYM.Boot);
        game.state.add('home', SYM.Home);
        game.state.add('game', SYM.Game);
        game.state.add('finish', SYM.Finish);

        game.state.start('boot');
    }

};

app.loadFonts();