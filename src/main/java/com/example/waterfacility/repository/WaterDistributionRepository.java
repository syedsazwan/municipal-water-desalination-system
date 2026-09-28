package com.example.waterfacility.repository;

import com.example.waterfacility.model.WaterDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WaterDistributionRepository extends JpaRepository<WaterDistribution, Long> {
    Optional<WaterDistribution> findByDistributionCode(String distributionCode);
}
