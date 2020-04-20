var vue = new Vue({
   el: '#app',
   data: {
        gpId: null,
        gpInfo: [],
        player: [],
        userN: "",
        opponent: [],
        newShip: [],
        shipsLocation: [],
        playerSalvos: [],
        opponentSalvos: [],
   },
    methods: {
        obtainGpId: function (){
            const urlParams = new URLSearchParams(window.location.search);
            vue.gpId = urlParams.get('gp');
        },
        gpInformation: function (){
        $.get( "/api/game_view/" + vue.gpId, function(data){
            vue.gpInfo = data;
            vue.gpShipsLocation();
            vue.gpUsers();
            vue.gpPlayerSalvoLocation();
        })
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
        addShips: function () {
          $.post({
              url: "/api/games/players/"+vue.gpId+"/ships",
              data: JSON.stringify(vue.newShip),
              dataType: "text",
              contentType: "application/json"
            })
            .done(function () {
              if (vue.newShip.length=5) {
              alert("Ships positions saved");
              /*location.reload();*/
              } 
            })
            .fail(function () {
              alert("Failed to add ship");
            })   
        },
        gpShipsLocation: function () {
            vue.gpInfo.ships.forEach(x => {
            x.locations.forEach( y => {
                document.getElementById(y).classList.add("bg-secondary");
                vue.shipsLocation.push(y);
             })
             })
         },  
        gpPlayerSalvoLocation: function () {
            for (var i = 0; i < vue.gpInfo.salvos.length; i++) {
                if (vue.gpInfo.salvos[i].playerId == vue.player.id) {
                    vue.playerSalvos.push(vue.gpInfo.salvos[i].locations);
                    } else {
                    vue.opponentSalvos.push(vue.gpInfo.salvos[i].locations);
                    }
                };
            vue.playerSalvos.forEach(salvoLocation => {
                salvoLocation.forEach ( s => {
                document.getElementById(s + 'b').classList.add("bg-success");
                })
            }),
            vue.opponentSalvos.forEach(salvoLocation => {
                salvoLocation.forEach ( t => {
                    for (var i = 0; i < vue.shipsLocation.length; i++) {
                    if (t == vue.shipsLocation[i]) {
                    document.getElementById(t).classList.add("bg-warning");
                    } else {document.getElementById(t).classList.add("bg-primary");
                    }
                }
                })
            })
        },
        gpUsers: function () {
            for (var i = 0; i < vue.gpInfo.gamePlayers.length; i++) {
                if (vue.gpInfo.gamePlayers[i].id == vue.gpId) {
                vue.player = vue.gpInfo.gamePlayers[i].player;
                } else {
                vue.opponent =  vue.gpInfo.gamePlayers[i].player;
                }
            }
        },
    }
})

vue.obtainGpId();
vue.gpInformation();

/*GRILLA*/
//todas las funciones se encuentran en la documentación
//https://github.com/gridstack/gridstack.js/tree/develop/doc

const optionsCarrier = {
    //grilla de 10 x 10
    column: 5,
    row: 1,
    //separacion entre elementos (les llaman widgets)
    verticalMargin: 0,
    //altura de las celdas
    disableOneColumnMode: true,
    //altura de las filas/celdas
    cellHeight: 50,
    //necesario
    float: true,
    //desabilitando el resize de los widgets
    disableResize: true,
    //false permite mover los widgets, true impide
    staticGrid: false,
}

const optionsBattleship = {
    //grilla de 10 x 10
    column: 4,
    row: 1,
    //separacion entre elementos (les llaman widgets)
    verticalMargin: 0,
    //altura de las celdas
    disableOneColumnMode: true,
    //altura de las filas/celdas
    cellHeight: 50,
    //necesario
    float: true,
    //desabilitando el resize de los widgets
    disableResize: true,
    //false permite mover los widgets, true impide
    staticGrid: false,
}

const optionsSubmarine = {
    //grilla de 10 x 10
    column: 3,
    row: 1,
    //separacion entre elementos (les llaman widgets)
    verticalMargin: 0,
    //altura de las celdas
    disableOneColumnMode: true,
    //altura de las filas/celdas
    cellHeight: 50,
    //necesario
    float: true,
    //desabilitando el resize de los widgets
    disableResize: true,
    //false permite mover los widgets, true impide
    staticGrid: false,
}

const optionsDestroyer = {
    //grilla de 10 x 10
    column: 3,
    row: 1,
    //separacion entre elementos (les llaman widgets)
    verticalMargin: 0,
    //altura de las celdas
    disableOneColumnMode: true,
    //altura de las filas/celdas
    cellHeight: 50,
    //necesario
    float: true,
    //desabilitando el resize de los widgets
    disableResize: true,
    //false permite mover los widgets, true impide
    staticGrid: false,
}

const optionsPatrol = {
    //grilla de 10 x 10
    column: 2,
    row: 1,
    //separacion entre elementos (les llaman widgets)
    verticalMargin: 0,
    //altura de las celdas
    disableOneColumnMode: true,
    //altura de las filas/celdas
    cellHeight: 50,
    //necesario
    float: true,
    //desabilitando el resize de los widgets
    disableResize: true,
    //false permite mover los widgets, true impide
    staticGrid: false,
}

//Iniciando la grilla en modo libe staticGridFalse
const gridCarrier = GridStack.init(optionsCarrier, '#gridCarrier');
const gridBattleship = GridStack.init(optionsBattleship, '#gridBattleship');
const gridSubmarine = GridStack.init(optionsSubmarine, '#gridSubmarine');
const gridDestroyer = GridStack.init(optionsDestroyer, '#gridDestroyer');
const gridPatrol = GridStack.init(optionsPatrol, '#gridPatrol');
//obteniendo los ships agregados en la grilla

//Agregando elementos (widget) desde el javascript
//elemento,x,y,width,height
gridCarrier.addWidget('<div><div id="carrier" class="grid-stack-item-content carrierHorizontal"></div><div/>',
0, 0, 5, 1,);

gridBattleship.addWidget('<div><div id="battleship" class="grid-stack-item-content battleshipHorizontal"></div><div/>',
0, 0, 4, 1);

gridSubmarine.addWidget('<div><div id="submarine" class="grid-stack-item-content submarineHorizontal"></div><div/>',
0, 0, 3, 1);

gridDestroyer.addWidget('<div><div id="destroyer" class="grid-stack-item-content destroyerHorizontal"></div><div/>',
0, 0, 3, 1);

gridPatrol.addWidget('<div><div id="patrol" class="grid-stack-item-content patrolHorizontal"></div><div/>',
0, 0, 2, 1);


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
    acceptWidgets: function(i, el) { return true; } 
}



//iniciando la grilla en modo libe statidGridFalse
const gridPosition = GridStack.init(optionsP, '#gridPosition');

gridPosition.on('dropped', function(event, previousWidget, newWidget) {
    
    newWidget.el.onclick = function(event){
        //obteniendo el ship (widget) al que se le hace click
        let itemContent = event.target;
        //obteniendo valores del widget
        let itemX = parseInt(itemContent.parentElement.dataset.gsX);
        let itemY = parseInt(itemContent.parentElement.dataset.gsY);
        let itemWidth = parseInt(itemContent.parentElement.dataset.gsWidth);
        let itemHeight = parseInt(itemContent.parentElement.dataset.gsHeight);
        //si esta horizontal se rota a vertical sino a horizontal
        if(itemContent.classList.contains(itemContent.id + 'Horizontal')){
            //veiricando que existe espacio disponible para la rotacion
            if(gridPosition.isAreaEmpty(itemX, itemY + 1 , itemHeight, itemWidth - 1) && (itemY + (itemWidth - 1) <= 9 ) ){
                //la rotacion del widget es simplemente intercambiar el alto y ancho del widget, ademas se cambia la clase
                gridPosition.resize(itemContent.parentElement, itemHeight, itemWidth);
                itemContent.classList.remove(itemContent.id + 'Horizontal');
                itemContent.classList.add(itemContent.id + 'Vertical');
            } else {
                alert("Espacio no disponible");
            }
        } else {
            if(gridPosition.isAreaEmpty(itemX + 1, itemY , itemHeight - 1, itemWidth)  && (itemX + (itemHeight - 1) <= 9 )){
                gridPosition.resize(itemContent.parentElement, itemHeight, itemWidth);
                itemContent.classList.remove(itemContent.id + 'Vertical');
                itemContent.classList.add(itemContent.id + 'Horizontal');
            }else{
                alert("Espacio no disponible");
            }
        }
    }
  console.log('Added widget in dropped grid:', newWidget);
});

function saveShips(){
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

    ship.type = $(this)[0].parentElement.id;
    ship.locations = coordinate;
    vue.newShip.push(ship);
    console.log(ship);

  });
  vue.addShips();
    
};






  
    
    









