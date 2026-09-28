package com.example.waterfacility.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "water_distribution")
public class WaterDistribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "distribution_code", nullable = false, unique = true)
    private String distributionCode;

    @Column(name = "water_quantity", nullable = false)
    private Double waterQuantity;

    @Column(name = "distribution_zone", nullable = false)
    private String distributionZone;

    @Column(name = "distribution_date", nullable = false)
    private LocalDate distributionDate;

    @Column(name = "status", nullable = false)
    private String status;

    public WaterDistribution() {
    }

    public WaterDistribution(Long id, String distributionCode, Double waterQuantity, String distributionZone, LocalDate distributionDate, String status) {
        this.id = id;
        this.distributionCode = distributionCode;
        this.waterQuantity = waterQuantity;
        this.distributionZone = distributionZone;
        this.distributionDate = distributionDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDistributionCode() {
        return distributionCode;
    }

    public void setDistributionCode(String distributionCode) {
        this.distributionCode = distributionCode;
    }

    public Double getWaterQuantity() {
        return waterQuantity;
    }

    public void setWaterQuantity(Double waterQuantity) {
        this.waterQuantity = waterQuantity;
    }

    public String getDistributionZone() {
        return distributionZone;
    }

    public void setDistributionZone(String distributionZone) {
        this.distributionZone = distributionZone;
    }

    public LocalDate getDistributionDate() {
        return distributionDate;
    }

    public void setDistributionDate(LocalDate distributionDate) {
        this.distributionDate = distributionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
