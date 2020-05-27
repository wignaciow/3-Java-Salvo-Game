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
        dto.put("scores", score != null ? score.toDTO() : null);
        return dto;
    }

    public Map<String, Object> GameViewDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", this.id);
        dto.put("date", this.joinDate);
        dto.put("gamePlayers", this.game.getGamePlayers().stream().map(GamePlayer::toDTO).collect(toList()));
        dto.put("ships", this.ships.stream().map(Ship::toDTOships).collect(toList()));
        dto.put("salvos", this.game.getGamePlayers().stream().flatMap(gp -> gp.getSalvos().stream().map(Salvo::salvosDTO)).collect(Collectors.toList()));
        dto.put("playerHits", this.salvos.stream().map(Salvo::hitsDTO).collect(Collectors.toList()));
        dto.put("playerSunkOpponentShips", this.salvos.stream().map(Salvo::sunkDTO).collect(Collectors.toList()));
        if (this.getOpponent().isPresent()) {
            dto.put("opponentHits", this.getOpponent().get().getSalvos().stream().map(Salvo::hitsDTO).collect(Collectors.toList()));
            dto.put("opponentSunkPlayerShips", this.getOpponent().get().getSalvos().stream().map(Salvo::sunkDTO).collect(Collectors.toList()));
            dto.put("opponentShipsRemain", this.salvos.stream().map(Salvo::shipsRemainDTO).collect(Collectors.toList()));
            dto.put("playerShipsRemain", this.getOpponent().get().getSalvos().stream().map(Salvo::shipsRemainDTO).collect(Collectors.toList()));
        }
        dto.put("state", this.getStateGame());
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

    public long getId() {
        return id;
    }

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
        return this.player.getScore(this.game);
    }

    public Set<Ship> getShips() {
        return ships;
    }

    //METODO PARAR IDENTIFICAR OPPONENT
    public Optional<GamePlayer> getOpponent() {
        return this.game.getGamePlayers().stream().filter(g -> g.getId() != this.id).findFirst();
    }

    //ESTADO DEL JUEGO
    public String getStateGame() {
        String state = " ";
        if (this.getOpponent().isEmpty()) {
            if (this.getShips().isEmpty()) {
                state = "PLACE_SHIPS";
            } else if (this.getOpponent().isEmpty()) {
                state = "WAIT_FOR_AN_OPPONENT";
            }
        } else {
            int myTurn = this.getSalvos().size();
            int opponentTurn = this.getOpponent().get().getSalvos().size();

            if (this.getShips().isEmpty()) {
                state = "PLACE_SHIPS";
            } else if (this.getOpponent().get().getShips().isEmpty()) {
                state = "WAIT_OPPONENT_SHIPS";
            } else if (myTurn > opponentTurn) {
                state = "WAIT_OPPONENT_ATTACK";
            } else if (myTurn < opponentTurn){
                state = "FIRE";
            } else if (myTurn == opponentTurn) {
                if(this.getId() < this.getOpponent().get().getId()){
                    state = "FIRE";
                }else if(this.getId() > this.getOpponent().get().getId()){
                    state = "WAIT_OPPONENT_ATTACK";
                }

                boolean sinkPlayer = this.getSalvos().stream().anyMatch(salvo -> salvo.getShipsRemain().size() == 0);
                boolean sinkOpponent = this.getOpponent().get().getSalvos().stream().anyMatch(salvo -> salvo.getShipsRemain().size() == 0);

                if (sinkPlayer && !sinkOpponent) {
                    state = "YOU_WON";
                } else if (!sinkPlayer && sinkOpponent) {
                    state = "YOU_LOST";
                } else if (sinkPlayer && sinkOpponent) {
                    state = "BOTH_TIE";
                }
            }
        }
        return state;
    }
 }


