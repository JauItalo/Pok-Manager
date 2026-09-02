package com.projetopokemanager.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projetopokemanager.dto.AuthResponseDTO;
import com.projetopokemanager.dto.LoginRequestDTO;
import com.projetopokemanager.dto.RegisterRequestDTO;
import com.projetopokemanager.dto.UserResponseDTO;
import com.projetopokemanager.entity.User;
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
                .build();

        User saved = userRepository.save(user);

        return new UserResponseDTO(saved.getId(), saved.getUsername(), saved.getEmail());
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(); // não deveria acontecer, já autenticou acima

        String token = jwtService.generateToken(user);

        return new AuthResponseDTO(token, "Bearer", user.getUsername());
    }
}