package com.projetopokemanager.exception;

public class TeamFullException extends RuntimeException {
    public TeamFullException(String message) {
        super(message);
    }
}