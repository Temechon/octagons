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
        game.state.add('boot', OCT.Boot);
        game.state.add('home', OCT.Home);
        game.state.add('game', OCT.Game);
        game.state.add('editor', OCT.Editor);

        game.state.start('boot');
    }

};

app.loadFonts();