package com.projetopokemanager.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projetopokemanager.dto.ChangePasswordRequestDTO;
import com.projetopokemanager.dto.ProfileResponseDTO;
import com.projetopokemanager.dto.UpdateProfileRequestDTO;
import com.projetopokemanager.entity.User;
import com.projetopokemanager.exception.InvalidCurrentPasswordException;
import com.projetopokemanager.exception.UsernameAlreadyExistsException;
import com.projetopokemanager.repository.PokemonCollectionEntryRepository;
import com.projetopokemanager.repository.TeamRepository;
import com.projetopokemanager.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PokemonCollectionEntryRepository collectionRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileResponseDTO getProfile(User user) {
        long collectionCount = collectionRepository.countByUser_Id(user.getId());
        long favoriteCount = collectionRepository.countByUser_IdAndFavoriteTrue(user.getId());
        long teamCount = teamRepository.countByUser_Id(user.getId());

        return new ProfileResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getCreatedAt(),
                collectionCount,
                favoriteCount,
                teamCount
        );
    }

    public ProfileResponseDTO updateUsername(User user, UpdateProfileRequestDTO request) {
        if (!user.getUsername().equals(request.username())
                && userRepository.existsByUsername(request.username())) {
            throw new UsernameAlreadyExistsException(
                    "Username '" + request.username() + "' já está em uso");
        }

        user.setUsername(request.username());
        userRepository.save(user);

        return getProfile(user);
    }

    public void changePassword(User user, ChangePasswordRequestDTO request) {
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new InvalidCurrentPasswordException("Senha atual incorreta");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}