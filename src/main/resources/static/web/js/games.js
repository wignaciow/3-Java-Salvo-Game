var vue = new Vue({
    el: '#app',
    data: {
        show: "home",
        gamesInfo: [],
        returnGameList: [],
        joinGameList: [],
        gamePlayersInfo: [],
        gameFinish: [],
        players: [],
        userN: "",
        userNick: "",
        nickNameV: "",
        userNameV: "",
        passwordV: "",
        nickNameM: "",
        userNameM: "",
        passwordM: "",
        
    },
    methods: {
        display: function (page) {
            this.show = page;
        },
        signUpV: function () {
            $.post("/api/players", {
                    nickName: vue.nickNameV,
                    userName: vue.userNameV,
                    password: vue.passwordV
                })
                .done(function () {
                    alert("Sign up successful!");
                    vue.logInV();
                })
                .fail(function () {
                    alert("Wrong user name or password, Try Sign up again!");
                    location.reload();
                })
        },
        signUpM: function () {
            $.post("/api/players", {
                    nickName: vue.nickNameM,
                    userName: vue.userNameM,
                    password: vue.passwordM
                })
                .done(function () {
                    alert("Sign up successful!");
                    vue.logInM();
                })
                .fail(function () {
                    alert("Wrong user name or password, Try Sign up again!");
                    location.reload();
                })
        },
        logInV: function () {
            if (vue.userNameV == "" || vue.passwordV == "") {
                alert("Please complete all fields");
            } else {
                $.post("/api/login", {
                        userName: vue.userNameV,
                        password: vue.passwordV
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
        logInM: function () {
            if (vue.userNameM == "" || vue.passwordM == "") {
                alert("Please complete all fields");
            } else {
                $.post("/api/login", {
                        userName: vue.userNameM,
                        password: vue.passwordM
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
        loginFormTabV: function (e) {
            e.preventDefault();

            document.getElementById('logLiV').classList.remove('active');
            document.getElementById('signLiV').classList.remove('active');

            document.getElementById(e.target.id).parentElement.classList.add('active');

            target = e.target.hash.substring(1);

            document.getElementById('loginV').style.display = "none";
            document.getElementById('signupV').style.display = "none";

            document.getElementById(target).style.display = "block";
        },
        loginFormTabM: function (e) {
            e.preventDefault();

            document.getElementById('logLiM').classList.remove('active');
            document.getElementById('signLiM').classList.remove('active');

            document.getElementById(e.target.id).parentElement.classList.add('active');

            target = e.target.hash.substring(1);

            document.getElementById('loginM').style.display = "none";
            document.getElementById('signupM').style.display = "none";

            document.getElementById(target).style.display = "block";
        },
        actualUser: function () {
            $.getJSON("/api/games", function (data) {
                if (data.playerLogged !== null) {
                    vue.userN = data.playerLogged.userName;
                    vue.userNick = data.playerLogged.nickname;
                } else {
                    vue.userN = null;
                    vue.userNick = null;
                }
                vue.gameList();
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
                vue.actualUser();
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
                    window.open("game.html?gp=" + data.gamePlayerId, "_blank");
                })
        },
        joinGame: function (gameID) {
            $.post("/api/games/" + gameID + "/player")
                .done(function (data) {
                    window.open("game.html?gp=" + data.gamePlayerId, "_blank");
                })
        },
        gameList: function () {
            vue.gamesInfo.forEach(gal => {
                gal.gamePlayers.forEach(gpl => {
                    if (gpl.player.userName == vue.userN) {
                        vue.returnGameList.push(gal)
                    } else if (gal.gamePlayers.length == 1 && gpl.player.userName != vue.userN) {
                        vue.joinGameList.push(gal)
                    };
                })
            })
        },
    }
})
vue.gamesData();


