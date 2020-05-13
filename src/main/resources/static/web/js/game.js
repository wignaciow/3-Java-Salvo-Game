var vue = new Vue({
    el: '#app',
    data: {
        gridNumbers: ["#", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        gridLetters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        gpId: null,
        gpInfo: [],
        player: [],
        opponent: [],
        newShips: [],
        newSalvosLocations: [],
        playerStatusBoard: [],
        opponentStatusBoard: [{
            turnOpponent: 0,
            hitsOpponent: [],
            sunkenOpponent: [],
        }],        
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
                gridShips();
            })
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
        gpUsers: function () {
            for (var i = 0; i < vue.gpInfo.gamePlayers.length; i++) {
                if (vue.gpInfo.gamePlayers[i].id == vue.gpId) {
                    vue.player = vue.gpInfo.gamePlayers[i].player;
                } else {
                    vue.opponent = vue.gpInfo.gamePlayers[i].player;
                }
            }

        },
        guitGame: function () {
            $.post("/api/logout").done(function () {
                location.reload();
            })
        },
    }
})

vue.obtainGpId();
vue.gpInformation();

/*----------------------------------GRILLA Y FUNCIONES PARA SHIPS---------------------------------------------*/
//todas las funciones se encuentran en la documentación
//https://github.com/gridstack/gridstack.js/tree/develop/doc

//Creando la grilla para posicionar barcos 
function gridShips() {

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
    const gridPosition = GridStack.init(optionsP, '#gridPosition');

    //Condicion para que muestre los barcos a posicionar y una grilla vacia.
    if (vue.gpInfo.ships.length == 0) {
        vue.newGame = true;

        //Grilla donde estan los barcos de muestra:
        const optionsCarrier = {
            column: 5,
            row: 1,
            verticalMargin: 0,
            disableOneColumnMode: true,
            cellHeight: 50,
            float: true,
            disableResize: true,
            staticGrid: false,
        }

        const optionsBattleship = {
            column: 4,
            row: 1,
            verticalMargin: 0,
            disableOneColumnMode: true,
            cellHeight: 50,
            float: true,
            disableResize: true,
            staticGrid: false,
        }

        const optionsSubmarine = {
            column: 3,
            row: 1,
            verticalMargin: 0,
            disableOneColumnMode: true,
            cellHeight: 50,
            float: true,
            disableResize: true,
            staticGrid: false,
        }

        const optionsDestroyer = {
            column: 3,
            row: 1,
            verticalMargin: 0,
            disableOneColumnMode: true,
            cellHeight: 50,
            float: true,
            disableResize: true,
            staticGrid: false,
        }

        const optionsPatrol = {
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
        const gridCarrier = GridStack.init(optionsCarrier, '#gridCarrier');
        const gridBattleship = GridStack.init(optionsBattleship, '#gridBattleship');
        const gridSubmarine = GridStack.init(optionsSubmarine, '#gridSubmarine');
        const gridDestroyer = GridStack.init(optionsDestroyer, '#gridDestroyer');
        const gridPatrol = GridStack.init(optionsPatrol, '#gridPatrol');

        //Agregando elementos (widget) desde el javascripta cada grilla
        //elemento,x,y,width,height
        gridCarrier.addWidget('<div><div id="carrier" class="grid-stack-item-content carrierHorizontal"></div><div/>',
            0, 0, 5, 1, );

        gridBattleship.addWidget('<div><div id="battleship" class="grid-stack-item-content battleshipHorizontal"></div><div/>',
            0, 0, 4, 1);

        gridSubmarine.addWidget('<div><div id="submarine" class="grid-stack-item-content submarineHorizontal"></div><div/>',
            0, 0, 3, 1);

        gridDestroyer.addWidget('<div><div id="destroyer" class="grid-stack-item-content destroyerHorizontal"></div><div/>',
            0, 0, 3, 1);

        gridPatrol.addWidget('<div><div id="patrol" class="grid-stack-item-content patrolHorizontal"></div><div/>',
            0, 0, 2, 1);

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
};

    //Funcion para salvar los barcos posicionados
    function saveShips() {
        vue.newShips = [];
        $("#gridPosition .grid-stack-item").each(function () {
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

        const gridPosition = GridStack.init(optionsP, '#gridPosition');

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
        if (vue.newSalvosLocations.length < 5) {
            if (vue.newSalvosLocations.includes(id) == false) {
                vue.newSalvosLocations.push(id);
                document.getElementById(id).classList.add("bg-warning");

                vue.gpInfo.salvos.forEach(x => {
                    if (x.playerId == vue.player.id) {
                        x.locations.forEach(y => {
                            if (vue.newSalvosLocations.includes(y) == true) {
                                document.getElementById(y).classList.remove("bg-warning");
                                quitarSalvoLocation(id);
                                alert("You already select this cell before");
                            }
                        })
                    }
                })
            } else {
                document.getElementById(id).classList.remove("bg-warning");
                quitarSalvoLocation(id);
            }
        } else if (vue.newSalvosLocations.length == 5) {
            document.getElementById(id).classList.remove("bg-warning");
            /*te permite modificar el salvo guardado en el json, ojo! no en el back */
            quitarSalvoLocation(id);
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
        var turn = 0;
        if (vue.newSalvosLocations.length < 5) {
            alert('Need to place all Shoots');
        } else {
           vue.addSalvos();
        } 
        
    };

    /*Pintar los salvos en la grilla*/
    function paintSalvosFired() {
        vue.gpInfo.salvos.forEach(x => {
            if (x.playerId == vue.player.id) {
                x.locations.forEach(y => {
                    document.getElementById(y).classList.add("bg-success");
                })
            }
        })
    };

/*function gameStatusBoard () {
recorrer arrays y volcar informacion en tabla html por turno
vue.gpInfo.salvos.turn
vue.gpInfo.playerHits
vue.gpInfo.playerSunken
vue.gpInfo.playerShipRemain

vue.gpInfo.salvos.turn
vue.gpInfo.opponentHits
vvue.gpInfo.opponentSunken
vue.gpInfo.opponentShipRemain
}*/

