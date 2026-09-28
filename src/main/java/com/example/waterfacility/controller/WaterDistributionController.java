package com.example.waterfacility.controller;

import com.example.waterfacility.model.WaterDistribution;
import com.example.waterfacility.service.WaterDistributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/distribution")
@CrossOrigin(origins = "*")
public class WaterDistributionController {

    private final WaterDistributionService waterDistributionService;

    @Autowired
    public WaterDistributionController(WaterDistributionService waterDistributionService) {
        this.waterDistributionService = waterDistributionService;
    }

    @GetMapping
    public List<WaterDistribution> getAllDistributions() {
        return waterDistributionService.getAllDistributions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WaterDistribution> getDistributionById(@PathVariable Long id) {
        return waterDistributionService.getDistributionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<WaterDistribution> createDistribution(@RequestBody WaterDistribution distribution) {
        WaterDistribution saved = waterDistributionService.saveDistribution(distribution);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WaterDistribution> updateDistribution(@PathVariable Long id, @RequestBody WaterDistribution distribution) {
        WaterDistribution updated = waterDistributionService.updateDistribution(id, distribution);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDistribution(@PathVariable Long id) {
        if (waterDistributionService.deleteDistribution(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
