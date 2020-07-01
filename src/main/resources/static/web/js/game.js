var vue = new Vue({
    el: '#app',
    data: {
        state: "",
        gridNumbers: ["#", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        gridLetters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        gpId: null,
        gpInfo: [],
        allShips: [],
        player: [],
        playerType: "",
        opponent: [],
        playerHistory: [],
        opponentHistory: [],
        newShips: [],
        newSalvosLocations: [],
        newGame: true,
    },
    updated() {
        this.$nextTick(function () {
            paintSalvosFired();
        });
    },
    methods: {
        obtainGpId: function () {
            const urlParams = new URLSearchParams(window.location.search);
            vue.gpId = urlParams.get('gp');
        },
        gpInformation: function () {
            $.get("/api/game_view/" + vue.gpId, function (data) {

                vue.gpInfo = data;
                vue.gpUsers();
                vue.gridShips();
                vue.stateF();
                /*vue.checkGameState();*/
                vue.shipsImagen();
                vue.historyTablePlayer();
                vue.historyTableOpponent();
            })
        },
        gpUsers: function () {
            for (var i = 0; i < vue.gpInfo.gamePlayers.length; i++) {
                if (vue.gpInfo.gamePlayers[i].id == vue.gpId) {
                    vue.player = vue.gpInfo.gamePlayers[i].player;
                    vue.playerType = vue.gpInfo.gamePlayers[i].food;
                } else {
                    vue.opponent = vue.gpInfo.gamePlayers[i].player;
                }
            }

        },
        //GRILLA Y FUNCIONES PARA SHIPS
        //todas las funciones se encuentran en la documentación - https://github.com/gridstack/gridstack.js/tree/develop/doc

        //Creando la grilla para posicionar barcos 
        gridShips: function () {
            const optionsP = {
                //grilla de 10 x 10
                column: 10,
                row: 10,
                //separacion entre elementos (les llaman widgets)
                verticalMargin: 0,
                //altura de las celdas
                disableOneColumnMode: true,
                //altura de las filas/celdas
                cellHeight: 52,
                //necesario
                float: true,
                //desabilitando el resize de los widgets
                disableResize: true,
                //false permite mover los widgets, true impide
                staticGrid: false,
                // function example, else can be simple: true | false | '.someClass' value
                acceptWidgets: function (i, el) {
                    return true;
                },
                animate: true
            }

            //Iiniciando la grilla
            const gridPosition = GridStack.init(optionsP, '.gridPosition');

            //Condicion para que muestre los barcos a posicionar y una grilla vacia.
            if (vue.gpInfo.ships.length == 0) {
                vue.newGame = true;

                //Grilla donde estan los barcos de muestra:
                const optionsFive = {
                    column: 5,
                    row: 1,
                    verticalMargin: 0,
                    disableOneColumnMode: true,
                    cellHeight: 50,
                    float: true,
                    disableResize: true,
                    staticGrid: false,
                }

                const optionsFour = {
                    column: 4,
                    row: 1,
                    verticalMargin: 0,
                    disableOneColumnMode: true,
                    cellHeight: 50,
                    float: true,
                    disableResize: true,
                    staticGrid: false,
                }

                const optionsThree = {
                    column: 3,
                    row: 1,
                    verticalMargin: 0,
                    disableOneColumnMode: true,
                    cellHeight: 50,
                    float: true,
                    disableResize: true,
                    staticGrid: false,
                }

                const optionsThreeB = {
                    column: 3,
                    row: 1,
                    verticalMargin: 0,
                    disableOneColumnMode: true,
                    cellHeight: 50,
                    float: true,
                    disableResize: true,
                    staticGrid: false,
                }

                const optionsTwo = {
                    column: 2,
                    row: 1,
                    verticalMargin: 0,
                    disableOneColumnMode: true,
                    cellHeight: 50,
                    float: true,
                    disableResize: true,
                    staticGrid: false,
                }

                //Iniciando la grilla donde esta cada widget
                const gridFive = GridStack.init(optionsFive, '#gridFive');
                const gridFour = GridStack.init(optionsFour, '#gridFour');
                const gridThree = GridStack.init(optionsThree, '#gridThree');
                const gridThreeB = GridStack.init(optionsThreeB, '#gridThreeB');
                const gridTwo = GridStack.init(optionsTwo, '#gridTwo');
                
                const gridFive2 = GridStack.init(optionsFive, '#gridFive2');
                const gridFour2 = GridStack.init(optionsFour, '#gridFour2');
                const gridThree2 = GridStack.init(optionsThree, '#gridThree2');
                const gridThreeB2 = GridStack.init(optionsThreeB, '#gridThreeB2');
                const gridTwo2 = GridStack.init(optionsTwo, '#gridTwo2');

                if (vue.playerType == 'VEGETARIAN') {

                    //Agregando elementos (widget) desde el javascripta a cada grilla
                    //elemento,x,y,width,height
                    gridFive.addWidget('<div><div id="choclo" class="grid-stack-item-content chocloHorizontal"></div></div>',
                        0, 0, 5, 1, );

                    gridFour.addWidget('<div><div id="pepino" class="grid-stack-item-content pepinoHorizontal"></div></div>',
                        0, 0, 4, 1);

                    gridThree.addWidget('<div><div id="morron" class="grid-stack-item-content morronHorizontal"></div></div>',
                        0, 0, 3, 1);

                    gridThreeB.addWidget('<div><div id="lechuga" class="grid-stack-item-content lechugaHorizontal"></div></div>',
                        0, 0, 3, 1);

                    gridTwo.addWidget('<div><div id="papa" class="grid-stack-item-content papaHorizontal"></div></div>',
                        0, 0, 2, 1);
                } else if (vue.playerType == 'MEATLOVER') {

                    //Agregando elementos (widget) desde el javascripta a cada grilla
                    //elemento,x,y,width,height
                    gridFive2.addWidget('<div><div id="costillar" class="grid-stack-item-content costillarHorizontal"></div></div>',
                        0, 0, 5, 1, );

                    gridFour2.addWidget('<div><div id="pernil" class="grid-stack-item-content pernilHorizontal"></div></div>',
                        0, 0, 4, 1);

                    gridThree2.addWidget('<div><div id="pollo" class="grid-stack-item-content polloHorizontal"></div></div>',
                        0, 0, 3, 1);

                    gridThreeB2.addWidget('<div><div id="churrasco" class="grid-stack-item-content churrascoHorizontal"></div></div>',
                        0, 0, 3, 1);

                    gridTwo2.addWidget('<div><div id="chorizo" class="grid-stack-item-content chorizoHorizontal"></div></div>',
                        0, 0, 2, 1);
                }
                //Funcion para que los barcos puedan girarse una vez droppeados
                gridPosition.on('dropped', function (event, previousWidget, newWidget) {

                    newWidget.el.onclick = function (event) {
                        //obteniendo el ship (widget) al que se le hace click
                        let itemContent = event.target;
                        //obteniendo valores del widget
                        let itemX = parseInt(itemContent.parentElement.dataset.gsX);
                        let itemY = parseInt(itemContent.parentElement.dataset.gsY);
                        let itemWidth = parseInt(itemContent.parentElement.dataset.gsWidth);
                        let itemHeight = parseInt(itemContent.parentElement.dataset.gsHeight);
                        //si esta horizontal se rota a vertical sino a horizontal
                        if (itemContent.classList.contains(itemContent.id + 'Horizontal')) {
                            //veiricando que existe espacio disponible para la rotacion
                            if (gridPosition.isAreaEmpty(itemX, itemY + 1, itemHeight, itemWidth - 1) && (itemY + (itemWidth - 1) <= 9)) {
                                //la rotacion del widget es solo intercambiar el alto y ancho del widget, ademas se cambia la clase
                                gridPosition.resize(itemContent.parentElement, itemHeight, itemWidth);
                                itemContent.classList.remove(itemContent.id + 'Horizontal');
                                itemContent.classList.add(itemContent.id + 'Vertical');
                            } else {
                                alert("Espacio no disponible");
                            }
                        } else {
                            if (gridPosition.isAreaEmpty(itemX + 1, itemY, itemHeight - 1, itemWidth) && (itemX + (itemHeight - 1) <= 9)) {
                                gridPosition.resize(itemContent.parentElement, itemHeight, itemWidth);
                                itemContent.classList.remove(itemContent.id + 'Vertical');
                                itemContent.classList.add(itemContent.id + 'Horizontal');
                            } else {
                                alert("Espacio no disponible");
                            }
                        }
                    }
                });
                //Condicion para que arme la grilla con los barcos salvados.
            } else {
                vue.newGame = false;
                optionsP.staticGrid = true;
                alreadySavedShips();
            }
        },
        /*checkGameState: function () {
            if(vue.gpInfo.state == "WAIT_OPPONENT_ATTACK" || "WAIT_FOR_AN_OPPONENT") {
                setTimeout("location.reload();", 15000);
            }
        },*/
        stateF: function () {
            if (vue.gpInfo.state == "PLACE_SHIPS") {
                vue.state = "Place Ships";
            } else if (vue.gpInfo.state == "WAIT_FOR_AN_OPPONENT") {
                vue.state = "Wait for an Opponent";
            } else if (vue.gpInfo.state == "FIRE") {
                vue.state = "Your Turn";
            } else if (vue.gpInfo.state == "WAIT_OPPONENT_ATTACK") {
                vue.state = "Opponent Turn";
            } else if (vue.gpInfo.state == "YOU_WON") {
                vue.state = "You Won!";
            } else if (vue.gpInfo.state == "YOU_LOST") {
                vue.state = "You Lost!";
            } else if (vue.gpInfo.state == "BOTH_TIE") {
                vue.state = "Tie!";
            }
        },
        addShips: function () {
            $.post({
                    url: "/api/games/players/" + vue.gpId + "/ships",
                    data: JSON.stringify(vue.newShips),
                    dataType: "text",
                    contentType: "application/json"
                })
                .done(function () {
                    alert("Ships positions saved");
                    location.reload();
                })
                .fail(function () {
                    alert("Failed to add ship");
                })
        },
        addSalvos: function () {
            $.post({
                    url: "/api/games/players/" + vue.gpId + "/salvos",
                    data: JSON.stringify(vue.newSalvosLocations),
                    dataType: "text",
                    contentType: "application/json"
                })
                .done(function () {
                    alert("Salvos fired!")
                    location.reload();

                })
                .fail(function () {
                    alert("Opponent turn!");
                })
        },
        shipsImagen: function () {
            var allShips = [];

            vue.gpInfo.ships.forEach(s => {
                allShips.push(s);
            })

            allShips.sort((a, b) =>
                a.locations.length - b.locations.length
            )

            for (var i = 0; i < allShips.length; i++) {
                vue.allShips.push(allShips[i].type);
            }
        },
        historyTablePlayer: function () {
            var salvos = vue.gpInfo.salvos.filter(salvo => salvo.playerId == vue.player.id);
            var playerHistory = [];

            //Turn
            for (var i = 0; i < salvos.length; i++) {
                var plHistory = {
                    turn: salvos[i].turn,
                    miss: 0,
                    hit: 0,
                    sunk: [],
                    remain: []
                };

                playerHistory.push(plHistory);
            }
            playerHistory.sort((a, b) => a.turn - b.turn);

            //ShipsDraw

            //Miss and Hits
            playerHistory.forEach(plHistoryTurn => {
                vue.gpInfo.playerHits.forEach(hit => {
                    if (plHistoryTurn.turn == hit.turn) {
                        plHistoryTurn.hit = hit.hits.length;
                        plHistoryTurn.miss = 5 - plHistoryTurn.hit;
                    }
                })
            })

            //Sunk
            playerHistory.forEach(plHistoryTurn => {
                vue.gpInfo.playerSunkOpponentShips.forEach(sunk => {
                    if (plHistoryTurn.turn == sunk.turn) {
                        if (sunk.sunk.length == 0) {
                            plHistoryTurn.sunk = 0;
                        } else {
                            sunk.sunk.forEach(type => {
                                plHistoryTurn.sunk.push(type);
                            });
                        }
                    }
                })
            })

            //Remain
            playerHistory.forEach(plHistoryTurn => {
                vue.gpInfo.opponentShipsRemain.forEach(remain => {
                    if (plHistoryTurn.turn == remain.turn) {
                        remain.shipsRemain.forEach(type => {
                            plHistoryTurn.remain.push(type);
                        })

                    }
                })
            })

            vue.playerHistory = playerHistory;
        },
        historyTableOpponent: function () {
            var salvos = vue.gpInfo.salvos.filter(salvo => salvo.playerId != vue.player.id);
            var opponentHistory = [];

            //Turn
            for (var i = 0; i < salvos.length; i++) {
                var opHistory = {
                    turn: salvos[i].turn,
                    ships: [],
                    miss: 0,
                    hit: 0,
                    sunk: [],
                    remain: []
                };

                opponentHistory.push(opHistory);
            }
            opponentHistory.sort((a, b) => a.turn - b.turn);

            //ShipsDraw
            opponentHistory.forEach(opHistoryTurn => {
                vue.gpInfo.ships.forEach(s => {
                    opHistoryTurn.ships.push(s.type);
                })
            })

            //Miss and Hits
            opponentHistory.forEach(opHistoryTurn => {
                vue.gpInfo.opponentHits.forEach(hit => {
                    if (opHistoryTurn.turn == hit.turn) {
                        opHistoryTurn.hit = hit.hits.length;
                        opHistoryTurn.miss = 5 - opHistoryTurn.hit;
                    }
                })
            })

            //Sunk
            opponentHistory.forEach(opHistoryTurn => {
                vue.gpInfo.opponentSunkPlayerShips.forEach(sunk => {
                    if (opHistoryTurn.turn == sunk.turn) {
                        if (sunk.sunk.length == 0) {
                            opHistoryTurn.sunk = 0;
                        } else {
                            sunk.sunk.forEach(type => {
                                opHistoryTurn.sunk = type
                            });
                        }
                    }
                })
            })

            //Remain
            opponentHistory.forEach(opHistoryTurn => {
                vue.gpInfo.playerShipsRemain.forEach(remain => {
                    if (opHistoryTurn.turn == remain.turn) {
                        remain.shipsRemain.forEach(type => {
                            opHistoryTurn.remain.push(type);
                        })

                    }
                })
            })

            vue.opponentHistory = opponentHistory;
        },
        quitGame: function () {
            swal({
                    title: "We will be waiting for you recruit!",
                    icon: "warning",
                    button: "Quit",
                })
                .then((willDelete) => {
                    if (willDelete) {
                        window.close()
                    };
                })
        },
    }
})

vue.obtainGpId();
vue.gpInformation();

//Funcion para salvar los barcos posicionados
function saveShips() {
    vue.newShips = [];
    $(".gridPosition .grid-stack-item").each(function () {
        var coordinate = [];
        var ship = {
            type: "",
            locations: ""
        };
        if ($(this).attr("data-gs-width") !== "1") {
            for (var i = 0; i < parseInt($(this).attr("data-gs-width")); i++) {
                coordinate.push(String.fromCharCode(parseInt($(this).attr("data-gs-y")) + 65) + (parseInt($(this).attr("data-gs-x")) + i + 1).toString());
            }
        } else {
            for (var i = 0; i < parseInt($(this).attr("data-gs-height")); i++) {
                coordinate.push(String.fromCharCode(parseInt($(this).attr("data-gs-y")) + i + 65) + (parseInt($(this).attr("data-gs-x")) + 1).toString());
            }
        }

        ship.type = $(this)[0].firstChild.id;
        ship.locations = coordinate;
        vue.newShips.push(ship);
        console.log(ship);
    });
    if (vue.newShips.length == 5) {
        vue.addShips();

    } else {
        alert("Please place all ships before saving");
    };
}

//Funcion de la condicion de grilla salvados, para mostrar ya la grilla con los barcos.
function alreadySavedShips() {
    const optionsP = {
        column: 10,
        row: 10,
        verticalMargin: 0,
        disableOneColumnMode: true,
        cellHeight: 52,
        float: true,
        disableResize: true,
        staticGrid: false,
        acceptWidgets: function (i, el) {
            return true;
        },
        animate: true
    }

    const gridPosition = GridStack.init(optionsP, '.gridPosition');

    for (var i = 0; i < vue.gpInfo.ships.length; i++) {
        var ship = vue.gpInfo.ships[i];

        let xShip = parseInt(ship.locations[0].slice(1)) - 1;
        let yShip = parseInt(ship.locations[0].slice(0, 1).charCodeAt(0)) - 65;

        if (ship.locations[0][0] == ship.locations[1][0]) {
            widthShip = ship.locations.length;
            heigthShip = 1;

            gridPosition.addWidget('<div id="' + ship.type + '"><div class="grid-stack-item-content' + " " + ship.type + 'Horizontal"></div></div>', {
                width: widthShip,
                heigth: heigthShip,
                x: xShip,
                y: yShip,
                noResize: true,
                id: ship.type
            })
        } else {
            widthShip = 1;
            heigthShip = ship.locations.length;

            gridPosition.addWidget('<div id="' + ship.type + '"><div class="grid-stack-item-content' + " " + ship.type + 'Vertical"></div></div>', {
                width: widthShip,
                height: heigthShip,
                x: xShip,
                y: yShip,
                noResize: true,
                id: ship.type
            })
        }
    }
}

/*----------------------------------GRILLA Y FUNCIONES PARA SALVOS---------------------------------------------*/

/*Marcar los Salvos en la Grilla*/
function salvoLocation(id) {
    if (vue.state == "Place Ships") {
        alert('First need an Opponent');
    } else if (vue.state == "Wait for an Opponent") {
        alert('First need an Opponent');
    } else if (vue.state == "Your Turn") {
        if (vue.newSalvosLocations.length < 5) {
            if (vue.newSalvosLocations.includes(id) == false) {
                vue.newSalvosLocations.push(id);
                document.getElementById(id).classList.add("shot");

                vue.gpInfo.salvos.forEach(x => {
                    if (x.playerId == vue.player.id) {
                        x.locations.forEach(y => {
                            if (vue.newSalvosLocations.includes(y) == true) {
                                document.getElementById(y).classList.remove("shot");
                                quitarSalvoLocation(id);
                                alert("You already select this cell before");
                            }
                        })
                    }
                })
            } else {
                document.getElementById(id).classList.remove("shot");
                quitarSalvoLocation(id);
            }
        } else if (vue.newSalvosLocations.length == 5) {
            document.getElementById(id).classList.remove("shot");
            /*te permite modificar el salvo guardado en el json, ojo! no en el back */
            quitarSalvoLocation(id);
        }
    } else if (vue.state == "Opponent Turn") {
        alert('Opponent Turn');
    } else {
        alert('GAME OVER');
    }
};

/*Sub-funcion de marcar salvos en la grilla*/
function quitarSalvoLocation(id) {
    var index = vue.newSalvosLocations.indexOf(id);
    if (index > -1) {
        vue.newSalvosLocations.splice(index, 1);
    }
};

/*Salvar los salvos en la Grilla*/
function saveSalvoLocations() {
    if (vue.state == "Place Ships") {
        alert('First need an Opponent');
    } else if (vue.state == "Wait for an Opponent") {
        alert('First need an Opponent');
    } else if (vue.state == "Your Turn") {
        var turn = 0;
        if (vue.newSalvosLocations.length < 5) {
            alert('Need to place all Shoots');
        } else {
            vue.addSalvos();
            document.getElementById("buttonSaveSalvo").disabled = true;
        }
    } else if (vue.state == "Opponent Turn") {
        alert('Opponent Turn');
    } else {
        alert('GAME OVER');
    }
};

/*Pintar los salvos en la grilla*/
function paintSalvosFired() {
    var playerHits = [];
    vue.gpInfo.playerHits.forEach(x => {
        x.hits.forEach(y => {
            playerHits.push(y)
        })
    })

    var playerSunk = [];
    vue.gpInfo.playerSunkOpponentShips.forEach(s => {
        s.location.forEach(sl => {
            for (var i = 0; i < sl.length; i++) {
                playerSunk.push(sl[i]);
            }
        })
    })

    vue.gpInfo.salvos.forEach(x => {
        if (x.playerId == vue.player.id) {
            x.locations.forEach(y => {
                if (playerSunk.includes(y) == true) {
                    document.getElementById(y).classList.add("sunk");
                } else if (playerSunk.includes(y) == false) {
                    if (playerHits.includes(y) == true) {
                        document.getElementById(y).classList.add("hit");
                    } else if (playerHits.includes(y) == false) {
                        document.getElementById(y).classList.add("miss");
                    }
                }
            })
        }
    })
};
