package com.codeoftheweb.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
    private PasswordEncoder passwordEncoder;

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

    @PostMapping("/games/{gameId}/player")
    private ResponseEntity<Map<String,Object>> joinGame(@PathVariable Long gameId, Authentication authentication) {
        Player player = playerRepository.findByUserName(authentication.getName());
        if (isGuest(authentication)) {
            return new ResponseEntity<>(makeMap("error","Not logged in!"), HttpStatus.UNAUTHORIZED);
        }

        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (optionalGame.isEmpty()) {
            return new ResponseEntity<>(makeMap("error","Not such game"), HttpStatus.FORBIDDEN);
        }

        Game game = optionalGame.get();
        if (game.getGamePlayers().size() > 1) {
            return new ResponseEntity<>(makeMap("error","Already 2 players"), HttpStatus.FORBIDDEN);
        }
        if (game.getGamePlayers().stream().anyMatch(gamePlayer -> gamePlayer.getPlayer().getId() == player.getId())) {
            return new ResponseEntity<>(makeMap("error","You can't play against yourself!"), HttpStatus.FORBIDDEN);
        }

        GamePlayer gamePlayer = gamePlayerRepository.save(new GamePlayer (player, game));
        return new ResponseEntity<>(makeMap("gpID", gamePlayer.getId()), HttpStatus.OK);
    }

    @PostMapping("/games")
    public ResponseEntity<Map<String,Object>> createGame(  Authentication authentication) {
        if (isGuest(authentication)) {
            System.out.println("Not logged in!");
            return new ResponseEntity<>(makeMap("error","Not logged in!"), HttpStatus.UNAUTHORIZED);
        }
            Game newGame = gameRepository.save(new Game(LocalDateTime.now()));
            Player player = playerRepository.findByUserName(authentication.getName());
            GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(player, newGame));

        return new ResponseEntity<>(makeMap("gamePlayerId", newGamePlayer.getId()), HttpStatus.CREATED);
    }

    @RequestMapping("/game_view/{gamePlayerId}")
    private ResponseEntity<Map<String, Object>> gameView(@PathVariable Long gamePlayerId, Authentication authentication) {
        Player playerLogged = playerRepository.findByUserName(authentication.getName());
        Optional<GamePlayer> gamePlayer = gamePlayerRepository.findById(gamePlayerId);
        if (!gamePlayer.isPresent()) {
            return new ResponseEntity<>(makeMap("error", "Not logged in!"), HttpStatus.CONFLICT);
        }
        if ( gamePlayer.get().getPlayer().getId() != playerLogged.getId()) {
            return new ResponseEntity<>(makeMap("error", "User not authorized"), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(gamePlayer.get().toDTOGameView(), HttpStatus.OK);
    }

    @RequestMapping("/players")
    public ResponseEntity<Map<String, Object>> createUser(@RequestParam String userName, @RequestParam String password) {
        if (!(userName.contains ("@")) || !userName.contains(".") || userName.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        }
        Player player = playerRepository.findByUserName(userName);
        if (player != null) {
            return new ResponseEntity<>(makeMap("error", "Username already exists"), HttpStatus.CONFLICT);
        }
        Player newPlayer = playerRepository.save(new Player(userName, passwordEncoder.encode(password)));
        return new ResponseEntity<>(makeMap("id", newPlayer.getId()), HttpStatus.CREATED);
    }

    public SalvoController() {
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




