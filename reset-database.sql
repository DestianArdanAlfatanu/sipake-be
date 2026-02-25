-- ============================================
-- RESET DATABASE SIPAKE
-- ============================================
-- Script ini akan menghapus SEMUA table di database
-- HATI-HATI: Semua data akan hilang!
-- ============================================

-- Drop tables in correct order (foreign keys first)

-- 1. Drop Consultation History (has FK to users, problems, symptoms)
DROP TABLE IF EXISTS consultation_histories CASCADE;

-- 2. Drop Rules (has FK to symptoms and problems)
DROP TABLE IF EXISTS suspension_rules CASCADE;
DROP TABLE IF EXISTS engine_rules CASCADE;

-- 3. Drop Solutions (has FK to problems)
DROP TABLE IF EXISTS suspension_solutions CASCADE;
DROP TABLE IF EXISTS engine_solutions CASCADE;

-- 4. Drop Problems
DROP TABLE IF EXISTS suspension_problems CASCADE;
DROP TABLE IF EXISTS engine_problems CASCADE;

-- 5. Drop Symptoms
DROP TABLE IF EXISTS suspension_symptoms CASCADE;
DROP TABLE IF EXISTS engine_symptoms CASCADE;

-- 6. Drop Users and related tables
DROP TABLE IF EXISTS users CASCADE;

-- 7. Drop Car Data
DROP TABLE IF EXISTS car_series CASCADE;
DROP TABLE IF EXISTS car_brands CASCADE;

-- 8. Drop Migrations table (if exists)
DROP TABLE IF EXISTS migrations CASCADE;

-- ============================================
-- VERIFICATION: List all remaining tables
-- ============================================
\dt

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
\echo '✅ Database reset completed!'
\echo '📝 Run: npm run seed (to populate with new data)'
