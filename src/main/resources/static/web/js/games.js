var vue = new Vue({
    el: '#app',
    data: {
        gamesInfo: [],
        gamePlayersInfo: [],
        gameFinish: [],
        players: [],
   },
    methods: {
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