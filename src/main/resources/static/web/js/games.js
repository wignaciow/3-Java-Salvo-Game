var vue = new Vue({
    el: '#app',
    data: {
        gamesInfo: [],
        gamePlayersInfo: [],
        players: [];
   },
    methods: {
        gamesData: function () {
        $.getJSON("/api/games", function (data) {
            vue.gamesInfo = data;
            vue.gamesPlayerData();
            vue.playerData();
        })
        },
        gamesPlayerData: function () {
            vue.gamesInfo.forEach(gg => {
            vue.gamePlayersInfo.push(gg.gamePlayers);
            })
        },
        playerData: function () {
            var allPlayers = {
                   userName: "";
                   score: 0;
                   win: 0;
                   tie: 0;
                   loss: 0;
                 }
            for (var i = 0; i < vue.gamePlayersInfo.length; i++ ) {
                var index =  scores.findIndex(scorePlayer => scorePlayer.player === gamePlayers[j].player.userName);
            }

        }
     }
})
vue.gamesData();