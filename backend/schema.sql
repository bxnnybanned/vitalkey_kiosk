CREATE DATABASE IF NOT EXISTS vitalkey_kiosk;
USE vitalkey_kiosk;

CREATE TABLE IF NOT EXISTS kiosks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kiosk_code VARCHAR(50) NOT NULL UNIQUE,
  kiosk_name VARCHAR(100) NOT NULL,
  location VARCHAR(150) DEFAULT '',
  created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS kiosk_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_token CHAR(36) NOT NULL UNIQUE,
  kiosk_id INT NOT NULL,
  started_at DATETIME NOT NULL,
  status VARCHAR(50) NOT NULL,
  FOREIGN KEY (kiosk_id) REFERENCES kiosks(id)
);

CREATE TABLE IF NOT EXISTS consent_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  agree_terms TINYINT(1) NOT NULL,
  agree_biometric TINYINT(1) NOT NULL,
  accepted_at DATETIME NOT NULL,
  FOREIGN KEY (session_id) REFERENCES kiosk_sessions(id)
);

CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_code VARCHAR(25) NOT NULL UNIQUE,
  id_number VARCHAR(32) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(30) NOT NULL,
  address VARCHAR(255) NOT NULL,
  contact VARCHAR(30) DEFAULT '',
  created_at DATETIME NOT NULL,
  INDEX idx_patients_full_name (full_name),
  INDEX idx_patients_id_number (id_number)
);

CREATE TABLE IF NOT EXISTS visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  patient_id INT NOT NULL,
  visit_type ENUM('new', 'returning') NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (session_id) REFERENCES kiosk_sessions(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

INSERT INTO kiosks (kiosk_code, kiosk_name, location, created_at)
SELECT 'KIOSK-001', 'VitalKey Main Kiosk', 'Main Lobby', NOW()
WHERE NOT EXISTS (SELECT 1 FROM kiosks WHERE kiosk_code = 'KIOSK-001');

INSERT INTO patients (patient_code, id_number, full_name, age, gender, address, contact, created_at)
SELECT 'P100001', '104582', 'Maria Santos', 34, 'Female', 'Quezon City', '09171234567', NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_code = 'P100001');

INSERT INTO patients (patient_code, id_number, full_name, age, gender, address, contact, created_at)
SELECT 'P100002', '209731', 'John Cruz', 29, 'Male', 'Makati City', '09181234567', NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_code = 'P100002');

INSERT INTO patients (patient_code, id_number, full_name, age, gender, address, contact, created_at)
SELECT 'P100003', '887420', 'Ana Reyes', 41, 'Female', 'Pasig City', '09191234567', NOW()
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE patient_code = 'P100003');
