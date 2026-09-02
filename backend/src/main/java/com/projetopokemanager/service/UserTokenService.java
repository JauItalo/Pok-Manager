package com.projetopokemanager.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projetopokemanager.entity.User;
import com.projetopokemanager.entity.UserToken;
import com.projetopokemanager.entity.enums.TokenType;
import com.projetopokemanager.exception.InvalidTokenException;
import com.projetopokemanager.repository.UserTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserTokenService {

    private final UserTokenRepository userTokenRepository;

    @Transactional
    public String generateToken(User user, TokenType type, Duration ttl) {
        // invalida qualquer token anterior desse tipo para esse usuário
        userTokenRepository.deleteAllByUserAndType(user, type);

        String rawToken = UUID.randomUUID().toString();

        UserToken userToken = UserToken.builder()
                .token(rawToken)
                .user(user)
                .type(type)
                .expiresAt(LocalDateTime.now().plus(ttl))
                .used(false)
                .build();

        userTokenRepository.save(userToken);

        return rawToken;
    }

    @Transactional
    public User consumeToken(String rawToken, TokenType type) {
        UserToken userToken = userTokenRepository.findByTokenAndType(rawToken, type)
                .orElseThrow(() -> new InvalidTokenException("Token inválido"));

        if (userToken.isUsed()) {
            throw new InvalidTokenException("Token já utilizado");
        }

        if (userToken.isExpired()) {
            throw new InvalidTokenException("Token expirado");
        }

        userToken.setUsed(true);
        userTokenRepository.save(userToken);

        return userToken.getUser();
    }
}