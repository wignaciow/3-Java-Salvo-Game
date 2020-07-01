package com.codeoftheweb.salvo.models;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import javax.persistence.OneToMany;
import javax.persistence.FetchType;

import static java.util.stream.Collectors.toList;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private LocalDateTime date;

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    Set<Score> scores;

    public Game() { }

    public Game(LocalDateTime date) {
        this.date=date; }

    public Map<String, Object> toDTO() {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put( "id", this.id);
        dto.put("creationDate", this.date);
        dto.put("gamePlayers", this.gamePlayers.stream().map(GamePlayer::toDTO).collect(toList()));
        return dto;
    }

    public Set<GamePlayer> getGamePlayers() { return gamePlayers; }

    public void setGamePlayers(Set<GamePlayer> gamePlayers) { this.gamePlayers = gamePlayers; }

    public long getId() { return id; }

    public void setId(long id) { this.id = id; }

    public LocalDateTime getDate() { return date; }

    public void setDate(LocalDateTime date) { this.date = date; }

    public Set<Score> getScore() { return scores; }
}