var vue = new Vue({
    el: '#app',
    data: {
        show: "",
        gamesInfo: [],
        returnGameList: [],
        joinGameList: [],
        gamePlayersInfo: [],
        gameFinish: [],
        players: [],
        userN: "",
        userNick: "",
        nickName: "",
        userName: "",
        password: "",
    },
    filters: {
        date: function (value) {
            if (!value) return '';
            return moment(value).format('YYYY - MM - DD / h:mm a');
        }
    },
    methods: {
        display: function (page) {
            this.show = page;
        },
        signUp: function () {
            if (vue.userName == "" || vue.nickName == "" || vue.password == "") {
                swal({
                    title: "Please complete all fields",
                    icon: "warning"
                })
            } else {
                $.post("/api/players", {
                        nickName: vue.nickName,
                        userName: vue.userName,
                        password: vue.password
                    })
                    .done(function () {
                        swal({
                            title: "Sign up Successful",
                            icon: "success",
                        });
                        vue.logIn();
                    })
                    .fail(function () {
                        swal({
                            title: "Misspelled user email , check @ or . missing ",
                            icon: "warning"
                        });

                    })
            }
        },
        logIn: function () {
            if (vue.userName == "" || vue.password == "") {
                swal({
                    title: "Please complete all fields",
                    icon: "warning"
                });
            } else {
                $.post("/api/login", {
                        userName: vue.userName,
                        password: vue.password
                    }).done(function () {
                        swal({
                                title: "Log in Successful",
                                icon: "success",
                            }),
                            setTimeout("location.reload();", 1500);
                    })
                    .fail(function () {
                        swal({
                            title: "Wrong user name or password, Please try again or Sign up",
                            icon: "error"
                        });
                    })
            }
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
                swal({
                        title: "You are Loging Out",
                        icon: "warning",
                        button: "Confirm",
                    })
                    .then((willDelete) => {
                        if (willDelete) {
                            location.reload();
                        };
                    })
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
        newGame: function () {

        },
        createGameMeat: function () {
            $.post("/api/games", {
                    food: "MEATLOVER"
                })
                .done(function (data) {                   
                    window.open("game.html?gp=" + data.gamePlayerId, "_blank");
                })
        },
        createGameVegetables: function () {
            $.post("/api/games", {
                    food: "VEGETARIAN"
                })
                .done(function (data) {                   
                    window.open("game.html?gp=" + data.gamePlayerId, "_blank");
                })
        },
        
        joinGame: function (gameID) {
            $.post("/api/games/" + gameID + "/player", {
                    food: "Carnivoro"
                })
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
