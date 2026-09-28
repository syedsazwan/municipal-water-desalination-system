package com.example.waterfacility.service;

import com.example.waterfacility.model.WaterDistribution;
import com.example.waterfacility.repository.WaterDistributionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WaterDistributionService {

    private final WaterDistributionRepository waterDistributionRepository;

    @Autowired
    public WaterDistributionService(WaterDistributionRepository waterDistributionRepository) {
        this.waterDistributionRepository = waterDistributionRepository;
    }

    public List<WaterDistribution> getAllDistributions() {
        return waterDistributionRepository.findAll();
    }

    public Optional<WaterDistribution> getDistributionById(Long id) {
        return waterDistributionRepository.findById(id);
    }

    public WaterDistribution saveDistribution(WaterDistribution distribution) {
        return waterDistributionRepository.save(distribution);
    }

    public WaterDistribution updateDistribution(Long id, WaterDistribution updatedData) {
        return waterDistributionRepository.findById(id).map(existing -> {
            existing.setDistributionCode(updatedData.getDistributionCode());
            existing.setWaterQuantity(updatedData.getWaterQuantity());
            existing.setDistributionZone(updatedData.getDistributionZone());
            existing.setDistributionDate(updatedData.getDistributionDate());
            existing.setStatus(updatedData.getStatus());
            return waterDistributionRepository.save(existing);
        }).orElse(null);
    }

    public boolean deleteDistribution(Long id) {
        if (waterDistributionRepository.existsById(id)) {
            waterDistributionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
