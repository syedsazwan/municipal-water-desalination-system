package com.example.waterfacility.repository;

import com.example.waterfacility.model.WaterIntake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WaterIntakeRepository extends JpaRepository<WaterIntake, Long> {
    Optional<WaterIntake> findByIntakeCode(String intakeCode);
}
