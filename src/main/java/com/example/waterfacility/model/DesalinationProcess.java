package com.example.waterfacility.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "desalination_process")
public class DesalinationProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "process_code", nullable = false, unique = true)
    private String processCode;

    @Column(name = "water_processed", nullable = false)
    private Double waterProcessed;

    @Column(name = "fresh_water_output", nullable = false)
    private Double freshWaterOutput;

    @Column(name = "brine_output", nullable = false)
    private Double brineOutput;

    @Column(name = "process_date", nullable = false)
    private LocalDate processDate;

    @Column(name = "status", nullable = false)
    private String status;

    public DesalinationProcess() {
    }

    public DesalinationProcess(Long id, String processCode, Double waterProcessed, Double freshWaterOutput, Double brineOutput, LocalDate processDate, String status) {
        this.id = id;
        this.processCode = processCode;
        this.waterProcessed = waterProcessed;
        this.freshWaterOutput = freshWaterOutput;
        this.brineOutput = brineOutput;
        this.processDate = processDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProcessCode() {
        return processCode;
    }

    public void setProcessCode(String processCode) {
        this.processCode = processCode;
    }

    public Double getWaterProcessed() {
        return waterProcessed;
    }

    public void setWaterProcessed(Double waterProcessed) {
        this.waterProcessed = waterProcessed;
    }

    public Double getFreshWaterOutput() {
        return freshWaterOutput;
    }

    public void setFreshWaterOutput(Double freshWaterOutput) {
        this.freshWaterOutput = freshWaterOutput;
    }

    public Double getBrineOutput() {
        return brineOutput;
    }

    public void setBrineOutput(Double brineOutput) {
        this.brineOutput = brineOutput;
    }

    public LocalDate getProcessDate() {
        return processDate;
    }

    public void setProcessDate(LocalDate processDate) {
        this.processDate = processDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
