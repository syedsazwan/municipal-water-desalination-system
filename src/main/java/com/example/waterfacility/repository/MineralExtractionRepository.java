package com.example.waterfacility.repository;

import com.example.waterfacility.model.MineralExtraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MineralExtractionRepository extends JpaRepository<MineralExtraction, Long> {
    Optional<MineralExtraction> findByExtractionCode(String extractionCode);
}
