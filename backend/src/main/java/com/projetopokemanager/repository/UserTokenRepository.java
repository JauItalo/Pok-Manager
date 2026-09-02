package com.projetopokemanager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projetopokemanager.entity.User;
import com.projetopokemanager.entity.UserToken;
import com.projetopokemanager.entity.enums.TokenType;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {

    Optional<UserToken> findByTokenAndType(String token, TokenType type);

    void deleteAllByUserAndType(User user, TokenType type);
}