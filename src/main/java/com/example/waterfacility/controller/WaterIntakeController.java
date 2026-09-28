package com.example.waterfacility.controller;

import com.example.waterfacility.model.WaterIntake;
import com.example.waterfacility.service.WaterIntakeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/water-intake")
@CrossOrigin(origins = "*")
public class WaterIntakeController {

    private final WaterIntakeService waterIntakeService;

    @Autowired
    public WaterIntakeController(WaterIntakeService waterIntakeService) {
        this.waterIntakeService = waterIntakeService;
    }

    @GetMapping
    public List<WaterIntake> getAllWaterIntakes() {
        return waterIntakeService.getAllWaterIntakes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WaterIntake> getWaterIntakeById(@PathVariable Long id) {
        return waterIntakeService.getWaterIntakeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<WaterIntake> createWaterIntake(@RequestBody WaterIntake waterIntake) {
        WaterIntake saved = waterIntakeService.saveWaterIntake(waterIntake);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WaterIntake> updateWaterIntake(@PathVariable Long id, @RequestBody WaterIntake waterIntake) {
        WaterIntake updated = waterIntakeService.updateWaterIntake(id, waterIntake);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWaterIntake(@PathVariable Long id) {
        if (waterIntakeService.deleteWaterIntake(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
