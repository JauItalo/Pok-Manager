package com.projetopokemanager.service;

import java.time.Duration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projetopokemanager.dto.AuthResponseDTO;
import com.projetopokemanager.dto.LoginRequestDTO;
import com.projetopokemanager.dto.RegisterRequestDTO;
import com.projetopokemanager.dto.UserResponseDTO;
import com.projetopokemanager.entity.User;
import com.projetopokemanager.entity.enums.TokenType;
import com.projetopokemanager.exception.EmailAlreadyExistsException;
import com.projetopokemanager.exception.UsernameAlreadyExistsException;
import com.projetopokemanager.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserTokenService userTokenService;
    private final EmailService emailService;

    public UserResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new UsernameAlreadyExistsException(
                    "Username '" + request.username() + "' já está em uso");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(
                    "Email '" + request.email() + "' já está em uso");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .enabled(false)
                .build();

        User saved = userRepository.save(user);

        String token = userTokenService.generateToken(
                saved, TokenType.EMAIL_VERIFICATION, Duration.ofHours(24));

        emailService.sendVerificationEmail(saved.getEmail(), token);

        return new UserResponseDTO(saved.getId(), saved.getUsername(), saved.getEmail());
    }

    public void verifyEmail(String token) {
        User user = userTokenService.consumeToken(token, TokenType.EMAIL_VERIFICATION);
        user.setEnabled(true);
        userRepository.save(user);
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        User user = userRepository.findByUsername(request.username())
                .orElseThrow();

        String token = jwtService.generateToken(user);

        return new AuthResponseDTO(token, "Bearer", user.getUsername());
    }
}