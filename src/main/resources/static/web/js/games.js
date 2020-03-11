var vue = new Vue({
    el: '#app',
    data: {
        gamesInfo: [],
        gamePlayersInfo: [],
        gameFinish: [],
        players: [],
        user: "",
        userName: [],
        password: [],
    },
    methods: {
        logIn: function () {
            if (vue.userName == "" || vue.password == "") {
                alert ("Please complete all fields");
            } else {
                $.post("/api/login", { userName: vue.userName, password: vue.password}).done(function() {
                   location.reload();
                   alert ("Log in successful");
                })
                .fail(function(){
                    alert ("Wrong user name or password, Please try again or Sign up");
                    location.reload();
                })
            }
        },
        signUp: function(){
            $.post("/api/players", { userName: vue.userName, password: vue.password})
            .done(function() {
            alert ("Sign up successful!");
                        vue.logIn();
            })

         },
        actualUser: function () {
            $.getJSON("/api/games", function (data) {
                if ( data.playerLogged !== null) {
                vue.user = data.playerLogged.userName;
                } else {
                vue.user = null;
                }
            })
        },
        logOut: function(){
            $.post("/api/logout").done(function()
                { location.reload();
            })
        },
        gamesData: function () {
        $.getJSON("/api/games", function (data) {
            vue.gamesInfo = data.games;
            vue.gamesPlayerData();
            vue.playerData();
        })
        },
        gamesPlayerData: function () {
            vue.gamesInfo.forEach(gg => {
                gg.gamePlayers.forEach(gp => {
                if (gp.scores != null)
                    vue.gamePlayersInfo.push(gp)
                })
            })
        },
        playerData: function () {
            for (var i = 0; i < vue.gamePlayersInfo.length; i++ ) {
                var index =  vue.players.findIndex(allPlayers => allPlayers.user === vue.gamePlayersInfo[i].player.userName);
                if (index == -1) {
                    var allPlayers = {
                        user: vue.gamePlayersInfo[i].player.userName,
                        score: 0,
                        loss: 0,
                        tie: 0,
                        win: 0,
                    };
                    if (vue.gamePlayersInfo[i].scores.score == 0.0) {allPlayers.loss ++}
                    else if (vue.gamePlayersInfo[i].scores.score == 0.5) {allPlayers.tie ++}
                    else if (vue.gamePlayersInfo[i].scores.score == 1.0) {allPlayers.win ++};

                    allPlayers.score += vue.gamePlayersInfo[i].scores.score;
                    vue.players.push(allPlayers);

                } else {
                    if (vue.gamePlayersInfo[i].scores.score == 0.0) {vue.players[index].loss ++}
                    else if (vue.gamePlayersInfo[i].scores.score == 0.5) {vue.players[index].tie ++}
                    else if (vue.gamePlayersInfo[i].scores.score == 1.0) {vue.players[index].win ++};

                    vue.players[index].score += vue.gamePlayersInfo[i].scores.score;

                }
            }
        }
    }
})
vue.gamesData();
vue.actualUser();