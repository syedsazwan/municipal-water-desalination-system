-- Municipal Water Desalination & Brine Mineral Extraction Facility Management System
-- Database Creation Script

CREATE DATABASE IF NOT EXISTS water_facility_db;
USE water_facility_db;

-- 1. Water Intake Table
CREATE TABLE IF NOT EXISTS water_intake (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    intake_code VARCHAR(50) NOT NULL UNIQUE,
    source VARCHAR(255) NOT NULL,
    quantity DOUBLE NOT NULL,
    salinity DOUBLE NOT NULL,
    intake_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- 2. Desalination Process Table
CREATE TABLE IF NOT EXISTS desalination_process (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    process_code VARCHAR(50) NOT NULL UNIQUE,
    water_processed DOUBLE NOT NULL,
    fresh_water_output DOUBLE NOT NULL,
    brine_output DOUBLE NOT NULL,
    process_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- 3. Mineral Extraction Table
CREATE TABLE IF NOT EXISTS mineral_extraction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    extraction_code VARCHAR(50) NOT NULL UNIQUE,
    mineral_name VARCHAR(100) NOT NULL,
    mineral_quantity DOUBLE NOT NULL,
    purity DOUBLE NOT NULL,
    extraction_date DATE NOT NULL,
    utilization VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- 4. Water Distribution Table
CREATE TABLE IF NOT EXISTS water_distribution (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    distribution_code VARCHAR(50) NOT NULL UNIQUE,
    water_quantity DOUBLE NOT NULL,
    distribution_zone VARCHAR(255) NOT NULL,
    distribution_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL
);
