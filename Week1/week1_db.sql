-- Week 1 Database Schema
-- Banking System Database

DROP DATABASE IF EXISTS banking_system;
CREATE DATABASE banking_system;
USE banking_system;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX idx_user_id ON transactions(user_id);
CREATE INDEX idx_user_email ON users(email);

-- Insert Sample Data
INSERT INTO users (fullname, email, password, balance) VALUES 
('Test User', 'test@example.com', '$2y$10$test', 1000.00);
