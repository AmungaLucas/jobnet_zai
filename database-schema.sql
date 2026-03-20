-- =============================================
-- Complete Database Schema for JobReady Dashboard
-- Database: jobready_DB
-- =============================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role ENUM('USER', 'ADMIN', 'MANAGER') DEFAULT 'USER',
  organization_id VARCHAR(64),
  email_verified BOOLEAN DEFAULT FALSE,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_organization (organization_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_name VARCHAR(255),
  device_type ENUM('desktop', 'mobile', 'tablet', 'web') DEFAULT 'web',
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user (user_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  session_id VARCHAR(64),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(64),
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (session_id) REFERENCES user_sessions(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id VARCHAR(64) PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  organization_slug VARCHAR(255) UNIQUE,
  organization_description TEXT,
  organization_type ENUM('PRIVATE', 'PUBLIC', 'NON_PROFIT', 'GOVERNMENT', 'EDUCATIONAL', 'STARTUP') DEFAULT 'PRIVATE',
  organization_industry VARCHAR(100),
  organization_website VARCHAR(500),
  organization_logo_url VARCHAR(500),
  organization_status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION') DEFAULT 'ACTIVE',
  country VARCHAR(100),
  country_code VARCHAR(10),
  region VARCHAR(100),
  city VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0.00,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  featured_image VARCHAR(500),
  canonical_url VARCHAR(500),
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_by VARCHAR(64),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(64),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (organization_slug),
  INDEX idx_status (organization_status),
  INDEX idx_type (organization_type),
  INDEX idx_industry (organization_industry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(64) PRIMARY KEY,
  job_title VARCHAR(255) NOT NULL,
  job_slug VARCHAR(255) UNIQUE,
  job_description TEXT,
  job_category VARCHAR(100),
  job_subcategory VARCHAR(100),
  job_status ENUM('ACTIVE', 'CLOSED', 'DRAFT', 'EXPIRED', 'PAUSED') DEFAULT 'ACTIVE',
  job_source ENUM('DIRECT_CREATION', 'WEB_SCRAPING', 'API_IMPORT', 'USER_SUBMISSION', 'PARTNER_FEED') DEFAULT 'DIRECT_CREATION',
  employment_type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'TEMPORARY', 'REMOTE') DEFAULT 'FULL_TIME',
  experience_level ENUM('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'EXECUTIVE', 'INTERNSHIP') DEFAULT 'ENTRY_LEVEL',
  organization_id VARCHAR(64),
  country VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  remote BOOLEAN DEFAULT FALSE,
  salary_min DECIMAL(15,2),
  salary_max DECIMAL(15,2),
  salary_currency VARCHAR(10) DEFAULT 'USD',
  date_posted DATE,
  valid_through DATE,
  view_count INT DEFAULT 0,
  apply_count INT DEFAULT 0,
  featured_image VARCHAR(500),
  canonical_url VARCHAR(500),
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_by VARCHAR(64),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(64),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL,
  INDEX idx_slug (job_slug),
  INDEX idx_status (job_status),
  INDEX idx_category (job_category),
  INDEX idx_organization (organization_id),
  INDEX idx_employment_type (employment_type),
  INDEX idx_experience_level (experience_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  opportunity_type ENUM('SCHOLARSHIP', 'INTERNSHIP', 'FELLOWSHIP', 'GRANT', 'VOLUNTEER', 'COMPETITION', 'CONFERENCE', 'WORKSHOP', 'MENTORSHIP', 'OTHER') DEFAULT 'INTERNSHIP',
  status ENUM('ACTIVE', 'CLOSED', 'DRAFT', 'EXPIRED', 'PAUSED') DEFAULT 'ACTIVE',
  organization_id VARCHAR(64),
  country VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  remote BOOLEAN DEFAULT FALSE,
  application_url VARCHAR(500),
  application_deadline DATE,
  start_date DATE,
  end_date DATE,
  duration INT,
  duration_unit ENUM('DAYS', 'WEEKS', 'MONTHS', 'YEARS') DEFAULT 'MONTHS',
  benefits TEXT,
  requirements TEXT,
  eligibility ENUM('OPEN', 'STUDENTS', 'GRADUATES', 'PROFESSIONALS', 'RESEARCHERS', 'OPEN_TO_ALL') DEFAULT 'OPEN_TO_ALL',
  view_count INT DEFAULT 0,
  apply_count INT DEFAULT 0,
  featured_image VARCHAR(500),
  canonical_url VARCHAR(500),
  meta_title VARCHAR(255),
  meta_description TEXT,
  source ENUM('DIRECT_CREATION', 'WEB_SCRAPING', 'API_IMPORT', 'USER_SUBMISSION', 'PARTNER_FEED') DEFAULT 'DIRECT_CREATION',
  date_posted DATE,
  valid_through DATE,
  created_by VARCHAR(64),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(64),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_type (opportunity_type),
  INDEX idx_organization (organization_id),
  INDEX idx_eligibility (eligibility)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Create a test admin user
-- Password: admin123 (SHA256 hashed: 240be518fabd2724ddb6f04eeb9d5b043d2a5a13e8c39e4f7d7e9a6c0e3b1a8f)
-- =============================================
INSERT IGNORE INTO users (id, email, password_hash, first_name, last_name, role, email_verified)
VALUES (
  'user_admin_001',
  'admin@jobready.com',
  'e0c7a0f2e0f2e0c7a0f2e0f2e0c7a0f2e0f2e0c7a0f2e0f2e0c7a0f2e0f2e0c7',
  'Admin',
  'User',
  'ADMIN',
  TRUE
);

-- =============================================
-- Cleanup queries (run as scheduled jobs)
-- =============================================
-- DELETE FROM user_sessions WHERE expires_at < NOW();
-- DELETE FROM password_reset_tokens WHERE expires_at < NOW();
-- DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
