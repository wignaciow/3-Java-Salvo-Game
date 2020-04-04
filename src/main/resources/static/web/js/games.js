var vue = new Vue({
    el: '#app',
    data: {
        show: "home",
        gamesInfo: [],
        gamePlayersInfo: [],
        gameFinish: [],
        players: [],
        user: "",
        userNick: "",
        userName: "",
        password: "",
        nickName: "",
    },
    methods: {
        display: function (page) {
            this.show = page;
        },
        logIn: function () {
            if (vue.userName == "" || vue.password == "") {
                alert("Please complete all fields");
            } else {
                $.post("/api/login", {
                        userName: vue.userName,
                        password: vue.password
                    }).done(function () {
                        location.reload();
                        alert("Log in successful");

                    })
                    .fail(function () {
                        alert("Wrong user name or password, Please try again or Sign up");
                        location.reload();
                    })
            }
        },
        signUp: function () {
            $.post("/api/players", {
                    nickName: vue.nickName,
                    userName: vue.userName,
                    password: vue.password
                })
                .done(function () {
                    alert("Sign up successful!");
                    vue.logIn();
                })
                .fail(function () {
                    alert("Wrong user name or password, Try Sign up again!");
                    location.reload();
                })
        },
        loginFormTab: function (e) {
            e.preventDefault();

            document.getElementById('logLi').classList.remove('active');
            document.getElementById('signLi').classList.remove('active');

            document.getElementById(e.target.id).parentElement.classList.add('active');

            target = e.target.hash.substring(1);

            document.getElementById('login').style.display = "none";
            document.getElementById('signup').style.display = "none";

            document.getElementById(target).style.display = "block";
        },
        actualUser: function () {
            $.getJSON("/api/games", function (data) {
                if (data.playerLogged !== null) {
                    vue.user = data.playerLogged.userName;
                    vue.userNick = data.playerLogged.nickname;
                } else {
                    vue.user = null;
                    vue.userNick = null;
                }
            })
        },
        logOut: function () {
            $.post("/api/logout").done(function () {
                location.reload();
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
                        vue.gamePlayersInfo.push(gp);
                })
            })
        },
        playerData: function () {
            for (var i = 0; i < vue.gamePlayersInfo.length; i++) {
                var index = vue.players.findIndex(allPlayers => allPlayers.user === vue.gamePlayersInfo[i].player.nickname);
                if (index == -1) {
                    var allPlayers = {
                        user: vue.gamePlayersInfo[i].player.nickname,
                        score: 0,
                        loss: 0,
                        tie: 0,
                        win: 0,
                    };
                    if (vue.gamePlayersInfo[i].scores.score == 0.0) {
                        allPlayers.loss++
                    } else if (vue.gamePlayersInfo[i].scores.score == 0.5) {
                        allPlayers.tie++
                    } else if (vue.gamePlayersInfo[i].scores.score == 1.0) {
                        allPlayers.win++
                    };

                    allPlayers.score += vue.gamePlayersInfo[i].scores.score;
                    vue.players.push(allPlayers);

                } else {
                    if (vue.gamePlayersInfo[i].scores.score == 0.0) {
                        vue.players[index].loss++
                    } else if (vue.gamePlayersInfo[i].scores.score == 0.5) {
                        vue.players[index].tie++
                    } else if (vue.gamePlayersInfo[i].scores.score == 1.0) {
                        vue.players[index].win++
                    };

                    vue.players[index].score += vue.gamePlayersInfo[i].scores.score;
                }
            }
        },
        createGame: function () {
            $.post("/api/games")
                .done(function (data) {
                    window.open("game.html?gp=" + data.gpID, "_blank");
                })
        },
        joinGame: function (gameID) {
            $.post("/api/games/" + gameID + "/player")
                .done(function (data) {
                    window.open("game.html?gp=" + data.gpID, "_blank");
                })
        },
    }
})
vue.gamesData();
vue.actualUser();
