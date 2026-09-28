package com.example.waterfacility.service;

import com.example.waterfacility.model.DesalinationProcess;
import com.example.waterfacility.repository.DesalinationProcessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DesalinationProcessService {

    private final DesalinationProcessRepository desalinationProcessRepository;

    @Autowired
    public DesalinationProcessService(DesalinationProcessRepository desalinationProcessRepository) {
        this.desalinationProcessRepository = desalinationProcessRepository;
    }

    public List<DesalinationProcess> getAllProcesses() {
        return desalinationProcessRepository.findAll();
    }

    public Optional<DesalinationProcess> getProcessById(Long id) {
        return desalinationProcessRepository.findById(id);
    }

    public DesalinationProcess saveProcess(DesalinationProcess process) {
        return desalinationProcessRepository.save(process);
    }

    public DesalinationProcess updateProcess(Long id, DesalinationProcess updatedData) {
        return desalinationProcessRepository.findById(id).map(existing -> {
            existing.setProcessCode(updatedData.getProcessCode());
            existing.setWaterProcessed(updatedData.getWaterProcessed());
            existing.setFreshWaterOutput(updatedData.getFreshWaterOutput());
            existing.setBrineOutput(updatedData.getBrineOutput());
            existing.setProcessDate(updatedData.getProcessDate());
            existing.setStatus(updatedData.getStatus());
            return desalinationProcessRepository.save(existing);
        }).orElse(null);
    }

    public boolean deleteProcess(Long id) {
        if (desalinationProcessRepository.existsById(id)) {
            desalinationProcessRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
