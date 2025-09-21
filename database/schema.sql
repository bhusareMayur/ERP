-- ERP Quiz System Database Schema
-- Run this script to create the required database and tables

CREATE DATABASE IF NOT EXISTS ERP;
USE ERP;

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  student_id INT NOT NULL,
  status ENUM('in_progress','submitted','resumed') DEFAULT 'in_progress',
  submitted_at TIMESTAMP NULL,
  answers JSON,
  tab_switch_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Quiz tab switches table
CREATE TABLE IF NOT EXISTS quiz_tab_switches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  student_id INT NOT NULL,
  switch_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attempt_id INT,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id)
);

-- Resume requests table
CREATE TABLE IF NOT EXISTS resume_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  student_id INT NOT NULL,
  attempt_id INT NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id)
);

-- Insert dummy data for testing
INSERT IGNORE INTO students (id, name, email) VALUES 
(1, 'John Doe', 'john@example.com'),
(2, 'Jane Smith', 'jane@example.com');

INSERT IGNORE INTO quizzes (id, title, description) VALUES 
(1, 'JavaScript Fundamentals', 'Basic JavaScript concepts and syntax'),
(2, 'Database Design', 'Principles of relational database design');

-- Create a sample quiz attempt
INSERT IGNORE INTO quiz_attempts (id, quiz_id, student_id, status) VALUES 
(1, 1, 1, 'in_progress');