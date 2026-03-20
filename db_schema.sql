-- =============================================================================
-- JobReady Database Schema
-- Version: 1.0.0
-- Created: 2026-03-21
-- Description: Complete database schema for JobReady job portal application
-- =============================================================================

-- Set character set and collation
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- Table: users
-- Purpose: Stores user account information
-- =============================================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(32) NOT NULL COMMENT 'Unique user identifier (nanoID)',
  `email` VARCHAR(255) NOT NULL COMMENT 'User email address (unique)',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'SHA-256 hashed password',
  `first_name` VARCHAR(100) DEFAULT NULL COMMENT 'User first name',
  `last_name` VARCHAR(100) DEFAULT NULL COMMENT 'User last name',
  `role` ENUM('USER', 'ADMIN', 'MODERATOR') DEFAULT 'USER' COMMENT 'User role for permissions',
  `organization_id` VARCHAR(32) DEFAULT NULL COMMENT 'Reference to organization if user belongs to one',
  `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT 'URL to user avatar image',
  `bio` TEXT DEFAULT NULL COMMENT 'User biography/description',
  `phone` VARCHAR(50) DEFAULT NULL COMMENT 'User phone number',
  `location` VARCHAR(255) DEFAULT NULL COMMENT 'User location/city',
  `website` VARCHAR(500) DEFAULT NULL COMMENT 'User personal website URL',
  `linkedin_url` VARCHAR(500) DEFAULT NULL COMMENT 'User LinkedIn profile URL',
  `twitter_url` VARCHAR(500) DEFAULT NULL COMMENT 'User Twitter profile URL',
  `is_verified` BOOLEAN DEFAULT FALSE COMMENT 'Email verification status',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Account active status',
  `last_login` TIMESTAMP NULL DEFAULT NULL COMMENT 'Last successful login timestamp',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_email` (`email`),
  KEY `idx_organization_id` (`organization_id`),
  KEY `idx_role` (`role`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User accounts table';

-- =============================================================================
-- Table: user_sessions
-- Purpose: Manages user authentication sessions
-- =============================================================================
DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE `user_sessions` (
  `id` VARCHAR(32) NOT NULL COMMENT 'Unique session identifier',
  `user_id` VARCHAR(32) NOT NULL COMMENT 'Reference to users table',
  `token` VARCHAR(64) NOT NULL COMMENT 'Session token for authentication',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'Client IP address (IPv4/IPv6)',
  `user_agent` TEXT DEFAULT NULL COMMENT 'Browser/Client user agent string',
  `device_name` VARCHAR(255) DEFAULT NULL COMMENT 'Detected device name',
  `device_type` ENUM('DESKTOP', 'MOBILE', 'TABLET', 'BOT', 'UNKNOWN') DEFAULT 'UNKNOWN' COMMENT 'Detected device type',
  `expires_at` TIMESTAMP NOT NULL COMMENT 'Session expiration timestamp',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Session creation timestamp',
  `last_activity` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last session activity',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_token` (`token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User sessions for authentication';

-- =============================================================================
-- Table: organizations
-- Purpose: Stores organization/company information
-- =============================================================================
DROP TABLE IF EXISTS `organizations`;
CREATE TABLE `organizations` (
  `id` VARCHAR(32) NOT NULL COMMENT 'Unique organization identifier',
  `organization_name` VARCHAR(255) NOT NULL COMMENT 'Organization name',
  `organization_slug` VARCHAR(255) NOT NULL COMMENT 'URL-friendly slug (unique)',
  `organization_description` TEXT DEFAULT NULL COMMENT 'Organization description',
  `organization_type` ENUM('PRIVATE', 'PUBLIC', 'NON_PROFIT', 'GOVERNMENT', 'STARTUP', 'AGENCY') DEFAULT 'PRIVATE' COMMENT 'Organization type',
  `organization_industry` VARCHAR(100) DEFAULT NULL COMMENT 'Industry sector',
  `organization_website` VARCHAR(500) DEFAULT NULL COMMENT 'Organization website URL',
  `organization_logo_url` VARCHAR(500) DEFAULT NULL COMMENT 'URL to organization logo',
  `organization_status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING') DEFAULT 'ACTIVE' COMMENT 'Organization status',
  `country` VARCHAR(100) DEFAULT NULL COMMENT 'Country name',
  `country_code` VARCHAR(10) DEFAULT NULL COMMENT 'ISO country code',
  `region` VARCHAR(100) DEFAULT NULL COMMENT 'State/Province/Region',
  `city` VARCHAR(100) DEFAULT NULL COMMENT 'City name',
  `address` VARCHAR(500) DEFAULT NULL COMMENT 'Full street address',
  `postal_code` VARCHAR(20) DEFAULT NULL COMMENT 'Postal/ZIP code',
  `phone` VARCHAR(50) DEFAULT NULL COMMENT 'Organization phone number',
  `email` VARCHAR(255) DEFAULT NULL COMMENT 'Organization contact email',
  `employee_count` INT DEFAULT NULL COMMENT 'Number of employees',
  `founded_year` INT DEFAULT NULL COMMENT 'Year founded',
  `rating` DECIMAL(3,2) DEFAULT 0.00 COMMENT 'Organization rating (0.00-5.00)',
  `views` INT DEFAULT 0 COMMENT 'Profile view count',
  `likes` INT DEFAULT 0 COMMENT 'Like/favorite count',
  `featured_image` VARCHAR(500) DEFAULT NULL COMMENT 'Featured image URL',
  `canonical_url` VARCHAR(500) DEFAULT NULL COMMENT 'Canonical URL for SEO',
  `meta_title` VARCHAR(255) DEFAULT NULL COMMENT 'SEO meta title',
  `meta_description` TEXT DEFAULT NULL COMMENT 'SEO meta description',
  `created_by` VARCHAR(32) DEFAULT NULL COMMENT 'User who created this record',
  `updated_by` VARCHAR(32) DEFAULT NULL COMMENT 'User who last updated this record',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_slug` (`organization_slug`),
  KEY `idx_name` (`organization_name`),
  KEY `idx_status` (`organization_status`),
  KEY `idx_type` (`organization_type`),
  KEY `idx_industry` (`organization_industry`),
  KEY `idx_country` (`country`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_rating` (`rating`),
  FULLTEXT KEY `idx_search` (`organization_name`, `organization_description`),
  CONSTRAINT `fk_org_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_org_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Organizations/companies table';

-- =============================================================================
-- Table: jobs
-- Purpose: Stores job listings
-- =============================================================================
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` VARCHAR(32) NOT NULL COMMENT 'Unique job identifier',
  `job_title` VARCHAR(255) NOT NULL COMMENT 'Job title',
  `job_slug` VARCHAR(255) NOT NULL COMMENT 'URL-friendly slug (unique)',
  `job_description` TEXT DEFAULT NULL COMMENT 'Full job description',
  `job_category` VARCHAR(100) DEFAULT NULL COMMENT 'Job category',
  `job_subcategory` VARCHAR(100) DEFAULT NULL COMMENT 'Job subcategory',
  `job_status` ENUM('ACTIVE', 'INACTIVE', 'CLOSED', 'DRAFT', 'EXPIRED') DEFAULT 'ACTIVE' COMMENT 'Job listing status',
  `job_source` VARCHAR(50) DEFAULT 'DIRECT_CREATION' COMMENT 'Source of job listing',
  `employment_type` ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP', 'TEMPORARY') DEFAULT NULL COMMENT 'Employment type',
  `experience_level` ENUM('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR', 'EXECUTIVE', 'INTERN') DEFAULT NULL COMMENT 'Required experience level',
  `organization_id` VARCHAR(32) DEFAULT NULL COMMENT 'Reference to organization',
  `country` VARCHAR(100) DEFAULT NULL COMMENT 'Job location country',
  `region` VARCHAR(100) DEFAULT NULL COMMENT 'Job location state/province',
  `city` VARCHAR(100) DEFAULT NULL COMMENT 'Job location city',
  `remote` BOOLEAN DEFAULT FALSE COMMENT 'Remote work available',
  `salary_min` DECIMAL(15,2) DEFAULT NULL COMMENT 'Minimum salary',
  `salary_max` DECIMAL(15,2) DEFAULT NULL COMMENT 'Maximum salary',
  `salary_currency` VARCHAR(10) DEFAULT NULL COMMENT 'Salary currency code (USD, EUR, etc.)',
  `salary_period` ENUM('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY') DEFAULT 'YEARLY' COMMENT 'Salary period',
  `view_count` INT DEFAULT 0 COMMENT 'Job view count',
  `apply_count` INT DEFAULT 0 COMMENT 'Application count',
  `date_posted` TIMESTAMP NULL DEFAULT NULL COMMENT 'Original posting date',
  `valid_through` TIMESTAMP NULL DEFAULT NULL COMMENT 'Application deadline',
  `featured_image` VARCHAR(500) DEFAULT NULL COMMENT 'Featured image URL',
  `canonical_url` VARCHAR(500) DEFAULT NULL COMMENT 'Canonical URL for SEO',
  `meta_title` VARCHAR(255) DEFAULT NULL COMMENT 'SEO meta title',
  `meta_description` TEXT DEFAULT NULL COMMENT 'SEO meta description',
  `created_by` VARCHAR(32) DEFAULT NULL COMMENT 'User who created this record',
  `updated_by` VARCHAR(32) DEFAULT NULL COMMENT 'User who last updated this record',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_slug` (`job_slug`),
  KEY `idx_title` (`job_title`),
  KEY `idx_status` (`job_status`),
  KEY `idx_category` (`job_category`),
  KEY `idx_employment_type` (`employment_type`),
  KEY `idx_experience_level` (`experience_level`),
  KEY `idx_organization_id` (`organization_id`),
  KEY `idx_country` (`country`),
  KEY `idx_remote` (`remote`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_salary` (`salary_min`, `salary_max`),
  FULLTEXT KEY `idx_search` (`job_title`, `job_description`),
  CONSTRAINT `fk_job_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_job_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_job_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Job listings table';

-- =============================================================================
-- Table: opportunities
-- Purpose: Stores various opportunities (scholarships, grants, internships, etc.)
-- =============================================================================
DROP TABLE IF EXISTS `opportunities`;
CREATE TABLE `opportunities` (
  `id` VARCHAR(32) NOT NULL COMMENT 'Unique opportunity identifier',
  `title` VARCHAR(255) NOT NULL COMMENT 'Opportunity title',
  `slug` VARCHAR(255) NOT NULL COMMENT 'URL-friendly slug (unique)',
  `description` TEXT DEFAULT NULL COMMENT 'Full opportunity description',
  `opportunity_type` ENUM('SCHOLARSHIP', 'GRANT', 'INTERNSHIP', 'FELLOWSHIP', 'VOLUNTEER', 'COMPETITION', 'CONFERENCE', 'OTHER') DEFAULT NULL COMMENT 'Type of opportunity',
  `status` ENUM('ACTIVE', 'INACTIVE', 'CLOSED', 'DRAFT', 'EXPIRED') DEFAULT 'ACTIVE' COMMENT 'Opportunity status',
  `organization_id` VARCHAR(32) DEFAULT NULL COMMENT 'Reference to organization',
  `country` VARCHAR(100) DEFAULT NULL COMMENT 'Opportunity location country',
  `region` VARCHAR(100) DEFAULT NULL COMMENT 'Opportunity location state/province',
  `city` VARCHAR(100) DEFAULT NULL COMMENT 'Opportunity location city',
  `remote` BOOLEAN DEFAULT FALSE COMMENT 'Remote participation available',
  `value` DECIMAL(15,2) DEFAULT NULL COMMENT 'Monetary value (if applicable)',
  `currency` VARCHAR(10) DEFAULT NULL COMMENT 'Currency code',
  `duration` VARCHAR(100) DEFAULT NULL COMMENT 'Duration of opportunity',
  `eligibility` TEXT DEFAULT NULL COMMENT 'Eligibility requirements',
  `benefits` TEXT DEFAULT NULL COMMENT 'Benefits offered',
  `application_url` VARCHAR(500) DEFAULT NULL COMMENT 'External application URL',
  `contact_email` VARCHAR(255) DEFAULT NULL COMMENT 'Contact email',
  `contact_phone` VARCHAR(50) DEFAULT NULL COMMENT 'Contact phone',
  `view_count` INT DEFAULT 0 COMMENT 'View count',
  `apply_count` INT DEFAULT 0 COMMENT 'Application/interest count',
  `date_posted` TIMESTAMP NULL DEFAULT NULL COMMENT 'Original posting date',
  `valid_through` TIMESTAMP NULL DEFAULT NULL COMMENT 'Application deadline',
  `featured_image` VARCHAR(500) DEFAULT NULL COMMENT 'Featured image URL',
  `canonical_url` VARCHAR(500) DEFAULT NULL COMMENT 'Canonical URL for SEO',
  `meta_title` VARCHAR(255) DEFAULT NULL COMMENT 'SEO meta title',
  `meta_description` TEXT DEFAULT NULL COMMENT 'SEO meta description',
  `created_by` VARCHAR(32) DEFAULT NULL COMMENT 'User who created this record',
  `updated_by` VARCHAR(32) DEFAULT NULL COMMENT 'User who last updated this record',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_slug` (`slug`),
  KEY `idx_title` (`title`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`opportunity_type`),
  KEY `idx_organization_id` (`organization_id`),
  KEY `idx_country` (`country`),
  KEY `idx_remote` (`remote`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_valid_through` (`valid_through`),
  FULLTEXT KEY `idx_search` (`title`, `description`),
  CONSTRAINT `fk_opp_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_opp_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_opp_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Opportunities table';

-- =============================================================================
-- Table: audit_logs
-- Purpose: Stores audit trail for all operations
-- =============================================================================
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` VARCHAR(32) NOT NULL COMMENT 'Unique log entry identifier',
  `user_id` VARCHAR(32) DEFAULT NULL COMMENT 'User who performed the action',
  `session_id` VARCHAR(32) DEFAULT NULL COMMENT 'Session ID used for the action',
  `action` VARCHAR(50) NOT NULL COMMENT 'Action type (CREATE, UPDATE, DELETE, LOGIN, etc.)',
  `entity_type` VARCHAR(50) NOT NULL COMMENT 'Type of entity (USER, JOB, ORGANIZATION, etc.)',
  `entity_id` VARCHAR(32) DEFAULT NULL COMMENT 'ID of affected entity',
  `old_values` JSON DEFAULT NULL COMMENT 'Previous values (for updates)',
  `new_values` JSON DEFAULT NULL COMMENT 'New values (for creates/updates)',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'Client IP address',
  `user_agent` TEXT DEFAULT NULL COMMENT 'Client user agent',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Log timestamp',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_action` (`action`),
  KEY `idx_entity` (`entity_type`, `entity_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Audit trail table';

-- =============================================================================
-- Table: rate_limits
-- Purpose: Stores rate limiting data for API protection
-- =============================================================================
DROP TABLE IF EXISTS `rate_limits`;
CREATE TABLE `rate_limits` (
  `id` VARCHAR(255) NOT NULL COMMENT 'Unique rate limit entry ID',
  `identifier` VARCHAR(255) NOT NULL COMMENT 'Client identifier (IP or user ID)',
  `request_count` INT DEFAULT 1 COMMENT 'Number of requests in current window',
  `window_start` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Window start timestamp',
  `expires_at` TIMESTAMP NOT NULL COMMENT 'Entry expiration timestamp',
  PRIMARY KEY (`id`),
  KEY `idx_identifier` (`identifier`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Rate limiting table';

-- =============================================================================
-- Indexes for performance optimization
-- =============================================================================

-- Add composite indexes for common query patterns
CREATE INDEX idx_jobs_active_created ON jobs(job_status, created_at DESC);
CREATE INDEX idx_opps_active_created ON opportunities(status, created_at DESC);
CREATE INDEX idx_orgs_active_created ON organizations(organization_status, created_at DESC);

-- =============================================================================
-- Sample Data (Optional - Uncomment to use)
-- =============================================================================

-- Insert a default admin user (password: AdminPass123!)
-- Password hash is SHA-256 of 'AdminPass123!'
-- INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified, is_active)
-- VALUES ('admin_user_001', 'admin@jobready.com', 'e99a18c428cb38d5f260853678922e03abd1d3a4d6a5c1e0e7a8b9c0d1e2f3a4', 'System', 'Admin', 'ADMIN', TRUE, TRUE);

-- =============================================================================
-- Stored Procedures
-- =============================================================================

DELIMITER //

-- Procedure: Clean up expired sessions
CREATE PROCEDURE IF NOT EXISTS `cleanup_expired_sessions`()
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
END //

-- Procedure: Clean up expired rate limits
CREATE PROCEDURE IF NOT EXISTS `cleanup_rate_limits`()
BEGIN
    DELETE FROM rate_limits WHERE expires_at < NOW();
END //

-- Procedure: Get user statistics
CREATE PROCEDURE IF NOT EXISTS `get_user_stats`(IN p_user_id VARCHAR(32))
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM jobs WHERE created_by = p_user_id) AS jobs_created,
        (SELECT COUNT(*) FROM opportunities WHERE created_by = p_user_id) AS opportunities_created,
        (SELECT COUNT(*) FROM organizations WHERE created_by = p_user_id) AS organizations_created,
        (SELECT COUNT(*) FROM user_sessions WHERE user_id = p_user_id AND expires_at > NOW()) AS active_sessions;
END //

DELIMITER ;

-- =============================================================================
-- Events (Require event_scheduler = ON)
-- =============================================================================

-- Schedule session cleanup to run every hour
-- CREATE EVENT IF NOT EXISTS cleanup_sessions_event
-- ON SCHEDULE EVERY 1 HOUR
-- DO CALL cleanup_expired_sessions();

-- Schedule rate limit cleanup to run every 15 minutes
-- CREATE EVENT IF NOT EXISTS cleanup_rate_limits_event
-- ON SCHEDULE EVERY 15 MINUTE
-- DO CALL cleanup_rate_limits();

-- =============================================================================
-- Views for common queries
-- =============================================================================

-- View: Active jobs with organization details
DROP VIEW IF EXISTS `v_active_jobs`;
CREATE VIEW `v_active_jobs` AS
SELECT 
    j.id,
    j.job_title,
    j.job_slug,
    j.job_description,
    j.job_category,
    j.employment_type,
    j.experience_level,
    j.country,
    j.city,
    j.remote,
    j.salary_min,
    j.salary_max,
    j.salary_currency,
    j.view_count,
    j.apply_count,
    j.date_posted,
    j.valid_through,
    o.organization_name,
    o.organization_logo_url,
    o.organization_industry
FROM jobs j
LEFT JOIN organizations o ON j.organization_id = o.id
WHERE j.job_status = 'ACTIVE'
ORDER BY j.created_at DESC;

-- View: Active opportunities with organization details
DROP VIEW IF EXISTS `v_active_opportunities`;
CREATE VIEW `v_active_opportunities` AS
SELECT 
    opp.id,
    opp.title,
    opp.slug,
    opp.description,
    opp.opportunity_type,
    opp.country,
    opp.city,
    opp.remote,
    opp.value,
    opp.currency,
    opp.view_count,
    opp.date_posted,
    opp.valid_through,
    org.organization_name,
    org.organization_logo_url
FROM opportunities opp
LEFT JOIN organizations org ON opp.organization_id = org.id
WHERE opp.status = 'ACTIVE'
ORDER BY opp.created_at DESC;

-- View: User activity summary
DROP VIEW IF EXISTS `v_user_activity`;
CREATE VIEW `v_user_activity` AS
SELECT 
    u.id AS user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.last_login,
    u.created_at,
    COUNT(DISTINCT j.id) AS jobs_created,
    COUNT(DISTINCT opp.id) AS opportunities_created,
    COUNT(DISTINCT org.id) AS organizations_created,
    COUNT(DISTINCT s.id) AS active_sessions
FROM users u
LEFT JOIN jobs j ON j.created_by = u.id
LEFT JOIN opportunities opp ON opp.created_by = u.id
LEFT JOIN organizations org ON org.created_by = u.id
LEFT JOIN user_sessions s ON s.user_id = u.id AND s.expires_at > NOW()
GROUP BY u.id;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- End of Schema
-- =============================================================================
