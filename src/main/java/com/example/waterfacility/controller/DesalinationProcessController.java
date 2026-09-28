package com.example.waterfacility.controller;

import com.example.waterfacility.model.DesalinationProcess;
import com.example.waterfacility.service.DesalinationProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/desalination")
@CrossOrigin(origins = "*")
public class DesalinationProcessController {

    private final DesalinationProcessService desalinationProcessService;

    @Autowired
    public DesalinationProcessController(DesalinationProcessService desalinationProcessService) {
        this.desalinationProcessService = desalinationProcessService;
    }

    @GetMapping
    public List<DesalinationProcess> getAllProcesses() {
        return desalinationProcessService.getAllProcesses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DesalinationProcess> getProcessById(@PathVariable Long id) {
        return desalinationProcessService.getProcessById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DesalinationProcess> createProcess(@RequestBody DesalinationProcess process) {
        DesalinationProcess saved = desalinationProcessService.saveProcess(process);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DesalinationProcess> updateProcess(@PathVariable Long id, @RequestBody DesalinationProcess process) {
        DesalinationProcess updated = desalinationProcessService.updateProcess(id, process);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long id) {
        if (desalinationProcessService.deleteProcess(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
