package com.example.waterfacility.service;

import com.example.waterfacility.model.MineralExtraction;
import com.example.waterfacility.repository.MineralExtractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MineralExtractionService {

    private final MineralExtractionRepository mineralExtractionRepository;

    @Autowired
    public MineralExtractionService(MineralExtractionRepository mineralExtractionRepository) {
        this.mineralExtractionRepository = mineralExtractionRepository;
    }

    public List<MineralExtraction> getAllExtractions() {
        return mineralExtractionRepository.findAll();
    }

    public Optional<MineralExtraction> getExtractionById(Long id) {
        return mineralExtractionRepository.findById(id);
    }

    public MineralExtraction saveExtraction(MineralExtraction extraction) {
        return mineralExtractionRepository.save(extraction);
    }

    public MineralExtraction updateExtraction(Long id, MineralExtraction updatedData) {
        return mineralExtractionRepository.findById(id).map(existing -> {
            existing.setExtractionCode(updatedData.getExtractionCode());
            existing.setMineralName(updatedData.getMineralName());
            existing.setMineralQuantity(updatedData.getMineralQuantity());
            existing.setPurity(updatedData.getPurity());
            existing.setExtractionDate(updatedData.getExtractionDate());
            existing.setUtilization(updatedData.getUtilization());
            existing.setStatus(updatedData.getStatus());
            return mineralExtractionRepository.save(existing);
        }).orElse(null);
    }

    public boolean deleteExtraction(Long id) {
        if (mineralExtractionRepository.existsById(id)) {
            mineralExtractionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
