package com.example.waterfacility.service;

import com.example.waterfacility.model.WaterIntake;
import com.example.waterfacility.repository.WaterIntakeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WaterIntakeService {

    private final WaterIntakeRepository waterIntakeRepository;

    @Autowired
    public WaterIntakeService(WaterIntakeRepository waterIntakeRepository) {
        this.waterIntakeRepository = waterIntakeRepository;
    }

    public List<WaterIntake> getAllWaterIntakes() {
        return waterIntakeRepository.findAll();
    }

    public Optional<WaterIntake> getWaterIntakeById(Long id) {
        return waterIntakeRepository.findById(id);
    }

    public WaterIntake saveWaterIntake(WaterIntake waterIntake) {
        return waterIntakeRepository.save(waterIntake);
    }

    public WaterIntake updateWaterIntake(Long id, WaterIntake updatedData) {
        return waterIntakeRepository.findById(id).map(existing -> {
            existing.setIntakeCode(updatedData.getIntakeCode());
            existing.setSource(updatedData.getSource());
            existing.setQuantity(updatedData.getQuantity());
            existing.setSalinity(updatedData.getSalinity());
            existing.setIntakeDate(updatedData.getIntakeDate());
            existing.setStatus(updatedData.getStatus());
            return waterIntakeRepository.save(existing);
        }).orElse(null);
    }

    public boolean deleteWaterIntake(Long id) {
        if (waterIntakeRepository.existsById(id)) {
            waterIntakeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
