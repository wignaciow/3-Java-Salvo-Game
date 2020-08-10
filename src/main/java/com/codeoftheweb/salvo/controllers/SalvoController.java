package com.codeoftheweb.salvo.controllers;



import com.codeoftheweb.salvo.models.*;
import com.codeoftheweb.salvo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.time.LocalDateTime;
import java.util.*;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api")

public class SalvoController {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GamePlayerRepository gamePlayerRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private ShipRepository shipRepository;

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //PLAYER LOGGED//
    @RequestMapping("/games")
    public Map<String, Object> Game(Authentication authentication) {
        Map<String, Object> dto = new LinkedHashMap<>();
        if (isGuest(authentication)) {
            dto.put("playerLogged", null);
        } else {
            Player playerLogged = playerRepository.findByUserName(authentication.getName());
            dto.put("playerLogged", playerLogged.toDTO());
        }
        dto.put("games", gameRepository.findAll().stream().map(Game::toDTO).collect(toList()));
        return dto;
    }

    //CREATE USER//
    @RequestMapping("/players")
    public ResponseEntity<Map<String, Object>> createUser(@RequestParam String nickName, @RequestParam String userName,  @RequestParam String password ) {
        if (!(userName.contains("@")) || !userName.contains(".") || userName.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NOT_VALID), HttpStatus.FORBIDDEN);
        }
        Player player = playerRepository.findByUserName(userName);
        if (player != null) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_USERNAME_EXISTS), HttpStatus.CONFLICT);
        }

        Player newPlayer = playerRepository.save(new Player(nickName, userName, passwordEncoder.encode(password)));
        return new ResponseEntity<>(makeMap("id", newPlayer.getId()), HttpStatus.CREATED);
    }

    //JOIN GAME//
    @PostMapping("/games/{gameId}/player")
    private ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long gameId, Authentication authentication, @RequestParam Food food) {
        Player player = playerRepository.findByUserName(authentication.getName());
        if (isGuest(authentication)) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NO_LOG_IN), HttpStatus.UNAUTHORIZED);
        }

        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (optionalGame.isEmpty()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NOT_FOUND), HttpStatus.FORBIDDEN);
        }

        Game game = optionalGame.get();
        if (game.getGamePlayers().size() > 1) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_TOO_MANY + " PLAYERS"), HttpStatus.FORBIDDEN);
        }
        if (game.getGamePlayers().stream().anyMatch(gamePlayer -> gamePlayer.getPlayer().getId() == player.getId())) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_USERNAME_EXISTS), HttpStatus.FORBIDDEN);
        }

        GamePlayer gamePlayer = gamePlayerRepository.save(new GamePlayer(player, game, food));
        return new ResponseEntity<>(makeMap("gamePlayerId", gamePlayer.getId()), HttpStatus.OK);
    }

    //CREATE GAME//
    @PostMapping("/games")
    public ResponseEntity<Map<String, Object>> createGame(Authentication authentication, @RequestParam Food food) {
        if (isGuest(authentication)) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NO_LOG_IN), HttpStatus.UNAUTHORIZED);
        }
        Game newGame = gameRepository.save(new Game(LocalDateTime.now()));
        Player player = playerRepository.findByUserName(authentication.getName());
        GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(player, newGame, food));

        return new ResponseEntity<>(makeMap("gamePlayerId", newGamePlayer.getId()), HttpStatus.CREATED);
    }

    //VIEW CONDITIONS//
    @RequestMapping("/game_view/{gamePlayerId}")
    private ResponseEntity<Map<String, Object>> gameView(@PathVariable Long gamePlayerId, Authentication authentication) {
        Player playerLogged = playerRepository.findByUserName(authentication.getName());
        Optional<GamePlayer> gamePlayer = gamePlayerRepository.findById(gamePlayerId);
        if (!gamePlayer.isPresent()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NO_LOG_IN), HttpStatus.CONFLICT);
        }
        if (gamePlayer.get().getPlayer().getId() != playerLogged.getId()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_UNAUTHORIZED), HttpStatus.FORBIDDEN);

        }
        return new ResponseEntity<>(gamePlayer.get().GameViewDTO(), HttpStatus.OK);
    }

    //LIST OF SHIPS//
    @PostMapping("/games/players/{gamePlayerId}/ships")
    public ResponseEntity<Map<String, Object>> addShips(Authentication authentication, @PathVariable long gamePlayerId, @RequestBody List<Ship> ships) {

        Optional<GamePlayer> optionalGamePlayer = gamePlayerRepository.findById(gamePlayerId);
        Player playerLogged = playerRepository.findByUserName(authentication.getName());

        if (isGuest(authentication)) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NO_LOG_IN), HttpStatus.UNAUTHORIZED);
        }
        if (optionalGamePlayer.isEmpty()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NOT_FOUND), HttpStatus.FORBIDDEN);
        }
        if (optionalGamePlayer.get().getPlayer().getId() != playerLogged.getId()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_UNAUTHORIZED), HttpStatus.FORBIDDEN);
        }
        if (optionalGamePlayer.get().getShips().size() >= 5) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_TOO_MANY + " SHIPS"), HttpStatus.FORBIDDEN);
        }

        ships.forEach(ship -> optionalGamePlayer.get().addShip(ship));

        gamePlayerRepository.save(optionalGamePlayer.get());
        return new ResponseEntity<>(makeMap(Response.KEY_SUCCESS, Response.INFO_SHIPS_SENT), HttpStatus.CREATED);
    }

    //LIST OF SALVOS//
    @PostMapping("games/players/{gamePlayerId}/salvos")
    public ResponseEntity<Map<String,Object>> addSalvo(Authentication authentication, @PathVariable Long gamePlayerId, @RequestBody List<String> locations) {

        Optional<GamePlayer> optionalGamePlayer = gamePlayerRepository.findById(gamePlayerId);
        Player playerLogged = playerRepository.findByUserName(authentication.getName());
        Optional<GamePlayer> opponent = optionalGamePlayer.get().getGame().getGamePlayers().stream().filter(gp -> gp.getPlayer().getId() != playerLogged.getId()).findFirst();

        if (isGuest(authentication)) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NOT_VALID), HttpStatus.UNAUTHORIZED);
        }
        if (optionalGamePlayer.isEmpty()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NOT_FOUND), HttpStatus.FORBIDDEN);
        }
        if (opponent.isEmpty()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NO_OPPONENT), HttpStatus.FORBIDDEN);
        }
        if (optionalGamePlayer.get().getPlayer().getId() != playerLogged.getId()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_UNAUTHORIZED), HttpStatus.FORBIDDEN);
        }
        //first salvo
        if (optionalGamePlayer.get().getId() > opponent.get().getId() && optionalGamePlayer.get().getSalvos().size() ==
                opponent.get().getSalvos().size()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_FIRST_TURN), HttpStatus.FORBIDDEN);
        }
        //salvo turns
        if (optionalGamePlayer.get().getSalvos().size() > opponent.get().getSalvos().size()) {
            return new ResponseEntity<>(makeMap(Response.KEY_FAILURE, Response.ERR_NOT_YOUR_TURN), HttpStatus.FORBIDDEN);
        }

        Salvo newSalvo = new Salvo(optionalGamePlayer.get().getSalvos().size() + 1, locations);
        optionalGamePlayer.get().addSalvo(newSalvo);

        if (optionalGamePlayer.get().getStateGame() == "YOU_WON") {
            scoreRepository.save(new Score(1.0, LocalDateTime.now(), optionalGamePlayer.get().getPlayer(), optionalGamePlayer.get().getGame()));
            scoreRepository.save(new Score(0.0, LocalDateTime.now(), opponent.get().getPlayer(), opponent.get().getGame()));
        }

        if (optionalGamePlayer.get().getStateGame() == "YOU_LOST") {
            scoreRepository.save(new Score(0.0, LocalDateTime.now(), optionalGamePlayer.get().getPlayer(), optionalGamePlayer.get().getGame()));
            scoreRepository.save(new Score(1.0, LocalDateTime.now(), opponent.get().getPlayer(), opponent.get().getGame()));
        }

        if (optionalGamePlayer.get().getStateGame() == "BOTH_TIE") {
            scoreRepository.save(new Score(0.5, LocalDateTime.now(), optionalGamePlayer.get().getPlayer(), optionalGamePlayer.get().getGame()));
            scoreRepository.save(new Score(0.5, LocalDateTime.now(), opponent.get().getPlayer(), opponent.get().getGame()));
        }

        gamePlayerRepository.save(optionalGamePlayer.get());
        return new ResponseEntity<>(makeMap(Response.KEY_SUCCESS, Response.INFO_SALVOS_FIRED), HttpStatus.CREATED);
    }

    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
}





