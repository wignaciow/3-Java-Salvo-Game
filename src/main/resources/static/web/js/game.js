var vue = new Vue({
   el: '#app',
   data: {
        gridNumbers: ["#", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        gridLetters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        
        gpId: null,
        gpInfo: [],
        player: [],
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
        addShips: function () {
          $.post({
              url: "/api/games/players/"+vue.gpId+"/ships",
              data: JSON.stringify(vue.newShip),
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
        gpShipsLocation: function () {
            vue.gpInfo.ships.forEach(ship => {
            ship.locations.forEach( x => {
                document.getElementById(x).classList.add("bg-secondary");
                vue.shipsLocation.push(x);
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
        }
    }
})

vue.obtainGpId();
vue.gpInformation();


/*var Ships = [
    {
        "id" : 1,
        "name" : "Aircraft",
        "size": 5,
        "image": 1,
    },
    {
        "id" : 1,
        "name" : "Aircraft",
        "size" : 0,
        "image" : 0,
    },
    {
        "id" : 1,
        "name" : "Aircraft",
        "size" : 0,
        "image" : 0,
    },
    {
        "id" : 1,
        "name" : "Aircraft",
        "size" : 0,
        "image" : 0,
    },
    {
        "id" : 1,
        "name" : "Aircraft",
        "size" : 0,
        "image" : 0,
    }
]*/




