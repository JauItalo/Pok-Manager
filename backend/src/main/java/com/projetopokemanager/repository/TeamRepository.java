package com.projetopokemanager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projetopokemanager.entity.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findAllByUser_Id(Long userId);

    Optional<Team> findByIdAndUser_Id(Long id, Long userId);

    long countByUser_Id(Long userId);
}