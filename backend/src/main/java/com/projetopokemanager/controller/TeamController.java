package com.projetopokemanager.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.projetopokemanager.dto.AddPokemonToTeamRequestDTO;
import com.projetopokemanager.dto.CreateTeamRequestDTO;
import com.projetopokemanager.dto.RenameTeamRequestDTO;
import com.projetopokemanager.dto.TeamAnalysisResponseDTO;
import com.projetopokemanager.dto.TeamResponseDTO;
import com.projetopokemanager.entity.User;
import com.projetopokemanager.service.TeamAnalysisService;
import com.projetopokemanager.service.TeamService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final TeamAnalysisService teamAnalysisService;

    @GetMapping("/{id}/analysis")
    public TeamAnalysisResponseDTO analyzeTeam(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        var team = teamService.findOwnedTeam(user, id);
        return teamAnalysisService.analyze(team);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeamResponseDTO createTeam(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateTeamRequestDTO request
    ) {
        return teamService.createTeam(user, request);
    }

    @GetMapping
    public List<TeamResponseDTO> listTeams(@AuthenticationPrincipal User user) {
        return teamService.listTeams(user);
    }

    @GetMapping("/{id}")
    public TeamResponseDTO getTeam(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return teamService.getTeam(user, id);
    }

    @PatchMapping("/{id}")
    public TeamResponseDTO renameTeam(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody RenameTeamRequestDTO request
    ) {
        return teamService.renameTeam(user, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeam(@AuthenticationPrincipal User user, @PathVariable Long id) {
        teamService.deleteTeam(user, id);
    }

    @PostMapping("/{id}/pokemons")
    public TeamResponseDTO addPokemon(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody AddPokemonToTeamRequestDTO request
    ) {
        return teamService.addPokemon(user, id, request);
    }

    @DeleteMapping("/{id}/pokemons/{entryId}")
    public TeamResponseDTO removePokemon(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @PathVariable Long entryId
    ) {
        return teamService.removePokemon(user, id, entryId);
    }
}
