package com.example.waterfacility.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "mineral_extraction")
public class MineralExtraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "extraction_code", nullable = false, unique = true)
    private String extractionCode;

    @Column(name = "mineral_name", nullable = false)
    private String mineralName;

    @Column(name = "mineral_quantity", nullable = false)
    private Double mineralQuantity;

    @Column(name = "purity", nullable = false)
    private Double purity;

    @Column(name = "extraction_date", nullable = false)
    private LocalDate extractionDate;

    @Column(name = "utilization", nullable = false)
    private String utilization;

    @Column(name = "status", nullable = false)
    private String status;

    public MineralExtraction() {
    }

    public MineralExtraction(Long id, String extractionCode, String mineralName, Double mineralQuantity, Double purity, LocalDate extractionDate, String utilization, String status) {
        this.id = id;
        this.extractionCode = extractionCode;
        this.mineralName = mineralName;
        this.mineralQuantity = mineralQuantity;
        this.purity = purity;
        this.extractionDate = extractionDate;
        this.utilization = utilization;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExtractionCode() {
        return extractionCode;
    }

    public void setExtractionCode(String extractionCode) {
        this.extractionCode = extractionCode;
    }

    public String getMineralName() {
        return mineralName;
    }

    public void setMineralName(String mineralName) {
        this.mineralName = mineralName;
    }

    public Double getMineralQuantity() {
        return mineralQuantity;
    }

    public void setMineralQuantity(Double mineralQuantity) {
        this.mineralQuantity = mineralQuantity;
    }

    public Double getPurity() {
        return purity;
    }

    public void setPurity(Double purity) {
        this.purity = purity;
    }

    public LocalDate getExtractionDate() {
        return extractionDate;
    }

    public void setExtractionDate(LocalDate extractionDate) {
        this.extractionDate = extractionDate;
    }

    public String getUtilization() {
        return utilization;
    }

    public void setUtilization(String utilization) {
        this.utilization = utilization;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
