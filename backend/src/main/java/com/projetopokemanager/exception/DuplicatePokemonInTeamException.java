package com.projetopokemanager.exception;

public class DuplicatePokemonInTeamException extends RuntimeException {
    public DuplicatePokemonInTeamException(String message) {
        super(message);
    }
}