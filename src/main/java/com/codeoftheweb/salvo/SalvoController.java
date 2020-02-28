package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GamePlayerRepository gamePlayerRepository;

    @RequestMapping("/games")
    public List<Map<String, Object>> getAllGames() {
        return gameRepository.findAll()
                .stream()
                .map(Game::toDTO)
                .collect(Collectors.toList());
    }

    @RequestMapping("/game_view/{gamePlayerId}")
       public Map<String, Object> gameView(@PathVariable Long gamePlayerId) {
       return gamePlayerRepository.findById(gamePlayerId).get().toDTOGameView();
        }
}





