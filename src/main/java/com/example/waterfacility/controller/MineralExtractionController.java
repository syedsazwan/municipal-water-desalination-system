package com.example.waterfacility.controller;

import com.example.waterfacility.model.MineralExtraction;
import com.example.waterfacility.service.MineralExtractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/minerals")
@CrossOrigin(origins = "*")
public class MineralExtractionController {

    private final MineralExtractionService mineralExtractionService;

    @Autowired
    public MineralExtractionController(MineralExtractionService mineralExtractionService) {
        this.mineralExtractionService = mineralExtractionService;
    }

    @GetMapping
    public List<MineralExtraction> getAllExtractions() {
        return mineralExtractionService.getAllExtractions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MineralExtraction> getExtractionById(@PathVariable Long id) {
        return mineralExtractionService.getExtractionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MineralExtraction> createExtraction(@RequestBody MineralExtraction extraction) {
        MineralExtraction saved = mineralExtractionService.saveExtraction(extraction);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MineralExtraction> updateExtraction(@PathVariable Long id, @RequestBody MineralExtraction extraction) {
        MineralExtraction updated = mineralExtractionService.updateExtraction(id, extraction);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExtraction(@PathVariable Long id) {
        if (mineralExtractionService.deleteExtraction(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
