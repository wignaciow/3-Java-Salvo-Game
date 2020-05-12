package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Entity
public class GamePlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private LocalDateTime joinDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id")
    private Game game;

    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Ship> ships = new HashSet<>();

    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Salvo> salvos = new HashSet<>();

    public GamePlayer() {
    }

    public GamePlayer(Player player, Game game) {
        this.joinDate = LocalDateTime.now();
        this.player = player;
        this.game = game;
    }

    public Map<String, Object> toDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("player", this.player.toDTO());
        Score score = getScore();
        dto.put("scores", score != null? score.toDTO() : null );
        return dto;
    }

    public Map<String, Object> toDTOGameView() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("date", this.joinDate);
        dto.put("gamePlayers", this.game.getGamePlayers().stream().map(GamePlayer:: toDTO).collect(toList()));
        dto.put("ships", this.ships.stream().map(Ship:: toDTOships).collect(toList()));
        dto.put("salvos", this.game.gamePlayers.stream().flatMap(gamePlayer -> gamePlayer.getSalvos().stream()
                .map(Salvo:: toDTOsalvos)).collect(toList()));
        dto.put("hitsPlayer", this.salvos.stream().map(Salvo::hitsDto).collect(Collectors.toList()));
        dto.put("sunkenPlayer", this.salvos.stream().map(Salvo::sunkenDto).collect(Collectors.toList()));
        dto.put("hitsOpponent", this.getOpponent().get().getSalvos().stream().map(Salvo::hitsDto).collect(Collectors.toList()));
        dto.put("sunkenOpponent", this.getOpponent().get().getSalvos().stream().map(Salvo::sunkenDto).collect(Collectors.toList()));
        return dto;
    }

    public void addShip(Ship ship) {
        ship.setGamePlayer(this);
        ships.add(ship);
    }

    public void addSalvo(Salvo salvo) {
        salvo.setGamePlayer(this);
        salvos.add(salvo);
    }
    public Set<Salvo> getSalvos() {
        return salvos;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public long getId() { return id; }

    public LocalDateTime getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDateTime joinDate) {
        this.joinDate = joinDate;
    }

    public Player getPlayer() {
        return player;
    }

    public Game getGame() {
        return game;
    }

    public Score getScore() {
        return this.player.getScore (this.game );
    }

    public Set<Ship> getShips() {return ships;
    }

    //OTROS METODOS
    public Optional <GamePlayer> getOpponent() {
        return this.game.getGamePlayers ().stream ().filter ( g -> g.getId () != this.id ).findFirst ();
    }

    public List <Ship> getShipsOpponent() {
        return (List<Ship>) getOpponent().get().getShips();
    }

    public List <String> getOpponentShipsLocations() {
            return getShipsOpponent().stream().sorted ().flatMap ( s -> s.getLocations ().stream () ).collect ( toList () );
    }

    public List <String> getOpponentSalvoLocations() {
        return getOpponent ().get ().getSalvos ().stream ().sorted().flatMap ( s -> s.getLocations ().stream () ).collect ( toList () );
    }


}

