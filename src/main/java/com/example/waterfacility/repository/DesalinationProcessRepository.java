package com.example.waterfacility.repository;

import com.example.waterfacility.model.DesalinationProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DesalinationProcessRepository extends JpaRepository<DesalinationProcess, Long> {
    Optional<DesalinationProcess> findByProcessCode(String processCode);
}
