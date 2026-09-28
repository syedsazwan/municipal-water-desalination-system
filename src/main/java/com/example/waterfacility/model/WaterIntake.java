package com.example.waterfacility.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "water_intake")
public class WaterIntake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "intake_code", nullable = false, unique = true)
    private String intakeCode;

    @Column(name = "source", nullable = false)
    private String source;

    @Column(name = "quantity", nullable = false)
    private Double quantity;

    @Column(name = "salinity", nullable = false)
    private Double salinity;

    @Column(name = "intake_date", nullable = false)
    private LocalDate intakeDate;

    @Column(name = "status", nullable = false)
    private String status;

    public WaterIntake() {
    }

    public WaterIntake(Long id, String intakeCode, String source, Double quantity, Double salinity, LocalDate intakeDate, String status) {
        this.id = id;
        this.intakeCode = intakeCode;
        this.source = source;
        this.quantity = quantity;
        this.salinity = salinity;
        this.intakeDate = intakeDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIntakeCode() {
        return intakeCode;
    }

    public void setIntakeCode(String intakeCode) {
        this.intakeCode = intakeCode;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getSalinity() {
        return salinity;
    }

    public void setSalinity(Double salinity) {
        this.salinity = salinity;
    }

    public LocalDate getIntakeDate() {
        return intakeDate;
    }

    public void setIntakeDate(LocalDate intakeDate) {
        this.intakeDate = intakeDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
