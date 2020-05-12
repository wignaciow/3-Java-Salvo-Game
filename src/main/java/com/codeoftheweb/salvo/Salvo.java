package com.codeoftheweb.salvo;


import org.apache.tomcat.util.net.WriteBuffer;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.*;
import java.util.stream.Collectors;

@Entity
public class Salvo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private int turns;

    @ElementCollection
    @Column(name="locations")
    private List<String> locations = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;

    public Salvo() { }

    public Salvo(int turns, List<String> locations) {
        this.turns = turns;
        this.locations = locations;
    }

    public Map<String, Object> toDTOsalvos() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turns", this.turns);
        dto.put("playerId", this.gamePlayer.getPlayer().getId());
        dto.put("locations", this.locations);
        return dto;
    }

    public Map<String, Object> hitsDto() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
            dto.put("turns", this.turns);
            dto.put("playerId", this.gamePlayer.getPlayer().getId());
            dto.put("hits", this.getHits());
        return dto;
    }

    public Map<String, Object> sunkenDto() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turns", this.turns);
        dto.put("playerId", this.gamePlayer.getPlayer().getId());
        dto.put("sunken", this.getSunken());
        return dto;
    }

    public long getId() {
        return id;
    }

    public int getTurns() { return turns; }

    public List<String> getLocations() {
        return locations;
    }

    public GamePlayer getGamePlayer() { return gamePlayer; }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }

    //OTROS METODOS
    public List <String> getHits () {
        List<String> hits = new ArrayList<>();
        if (this.gamePlayer.getOpponent().isPresent()) {
            hits = this.locations.stream().filter(eachLocation -> {
                return this.gamePlayer.getOpponent().get().getShips().stream()
                        .anyMatch(ship -> ship.getLocations().contains(eachLocation));
            }).collect(Collectors.toList());
        }
        return hits;
    }

    public List<String> getSunken() {
        List<String> salvos = new ArrayList<>();
        Set<Salvo> mySalvos = this.gamePlayer.getSalvos().stream()
                .filter(salvo -> salvo.getTurns() <= this.getTurns()).collect(Collectors.toSet());
                mySalvos.stream().forEach(salvo -> salvos.addAll(salvo.getLocations()));
        return this.gamePlayer.getOpponent().get().getShips().stream().filter(s ->
                salvos.containsAll(s.getLocations())
        ).map(Ship::getType).collect(Collectors.toList());
    }
}
