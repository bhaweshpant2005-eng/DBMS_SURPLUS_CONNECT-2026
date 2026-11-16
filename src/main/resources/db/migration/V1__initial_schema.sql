-- Surplus Connect PostgreSQL Schema
-- Version: 1.0
-- Description: Initial schema for Surplus Connect resource allocation platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- USER & AUTHENTICATION TABLES
-- ========================================

-- Users table (replaces the User entity)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('DONOR', 'NGO', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ========================================
-- NGO TABLE
-- ========================================

CREATE TABLE ngos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ngo_name VARCHAR(255) NOT NULL,
    ngo_category VARCHAR(100),
    description TEXT,
    address VARCHAR(500),
    phone VARCHAR(50),
    email VARCHAR(255),
    latitude DOUBLE PRECISION DEFAULT 0.0,
    longitude DOUBLE PRECISION DEFAULT 0.0,
    max_distance DOUBLE PRECISION DEFAULT 0.0,
    max_capacity INTEGER DEFAULT 0,
    current_load INTEGER DEFAULT 0,
    total_received INTEGER DEFAULT 0,
    allocation_count INTEGER DEFAULT 0,
    trust_score DOUBLE PRECISION DEFAULT 50.0,
    rating DOUBLE PRECISION DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    accepted_types TEXT,
    cluster_group INTEGER,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ngos_user_id ON ngos(user_id);
CREATE INDEX idx_ngos_category ON ngos(ngo_category);
CREATE INDEX idx_ngos_location ON ngos(latitude, longitude);
CREATE INDEX idx_ngos_rating ON ngos(rating DESC);

-- ========================================
-- ITEM/DONATION TABLE
-- ========================================

CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    donor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    donor_name VARCHAR(255),
    donor_phone VARCHAR(50),
    item_type VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    quantity VARCHAR(100),
    original_quantity_num INTEGER DEFAULT 0,
    remaining_quantity_num INTEGER DEFAULT 0,
    expiry_date DATE,
    location VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Available',
    latitude DOUBLE PRECISION DEFAULT 0.0,
    longitude DOUBLE PRECISION DEFAULT 0.0,
    lifecycle_state VARCHAR(50) DEFAULT 'PENDING',
    image_url VARCHAR(500),
    dependency_group VARCHAR(100),
    content_hash VARCHAR(64),
    is_quality_verified BOOLEAN DEFAULT false,
    verification_score DOUBLE PRECISION DEFAULT 0.0,
    verification_notes TEXT,
    priority VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_items_donor_id ON items(donor_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_item_type ON items(item_type);
CREATE INDEX idx_items_location ON items(latitude, longitude);
CREATE INDEX idx_items_content_hash ON items(content_hash);
CREATE INDEX idx_items_lifecycle_state ON items(lifecycle_state);

-- ========================================
-- RESOURCE REQUEST TABLE
-- ========================================

CREATE TABLE resource_requests (
    id BIGSERIAL PRIMARY KEY,
    ngo_id BIGINT NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    ngo_name VARCHAR(255),
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    resource_type VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    quantity_requested INTEGER DEFAULT 0,
    remaining_need INTEGER DEFAULT 0,
    location VARCHAR(500),
    urgency_level VARCHAR(20) DEFAULT 'NORMAL',
    priority_score DOUBLE PRECISION DEFAULT 0.0,
    min_acceptable_quantity INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Pending',
    request_hash VARCHAR(64),
    backup_ngo_ids TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resource_requests_ngo_id ON resource_requests(ngo_id);
CREATE INDEX idx_resource_requests_status ON resource_requests(status);
CREATE INDEX idx_resource_requests_urgency ON resource_requests(urgency_level);
CREATE INDEX idx_resource_requests_resource_type ON resource_requests(resource_type);
CREATE INDEX idx_resource_requests_priority ON resource_requests(priority_score DESC);

-- ========================================
-- ALLOCATION TABLE
-- ========================================

CREATE TABLE allocations (
    id BIGSERIAL PRIMARY KEY,
    item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    ngo_id BIGINT NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    request_id BIGINT REFERENCES resource_requests(id) ON DELETE SET NULL,
    allocated_quantity INTEGER NOT NULL DEFAULT 0,
    current_state VARCHAR(50) DEFAULT 'MATCHED',
    previous_item_status VARCHAR(50),
    previous_remaining_quantity INTEGER DEFAULT 0,
    previous_ngo_load INTEGER DEFAULT 0,
    rolled_back BOOLEAN DEFAULT false,
    scheduled_pickup TIMESTAMP,
    scheduled_delivery TIMESTAMP,
    hop_path TEXT,
    match_score DOUBLE PRECISION DEFAULT 0.0,
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_allocations_item_id ON allocations(item_id);
CREATE INDEX idx_allocations_ngo_id ON allocations(ngo_id);
CREATE INDEX idx_allocations_request_id ON allocations(request_id);
CREATE INDEX idx_allocations_state ON allocations(current_state);

-- ========================================
-- REVIEW TABLE
-- ========================================

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    reviewer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id BIGINT NOT NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('NGO', 'DONOR')),
    allocation_id BIGINT REFERENCES allocations(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    sentiment_score DOUBLE PRECISION DEFAULT 0.0,
    sentiment_label VARCHAR(20),
    proof_image_url VARCHAR(500),
    content_hash VARCHAR(64),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_target ON reviews(target_id, target_type);
CREATE INDEX idx_reviews_allocation ON reviews(allocation_id);
CREATE INDEX idx_reviews_content_hash ON reviews(content_hash);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

-- ========================================
-- NOTIFICATION TABLE
-- ========================================

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    related_item_id BIGINT,
    related_allocation_id BIGINT,
    related_request_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ========================================
-- TIME SLOT TABLE
-- ========================================

CREATE TABLE time_slots (
    id BIGSERIAL PRIMARY KEY,
    ngo_id BIGINT NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    allocation_id BIGINT REFERENCES allocations(id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_time_slots_ngo_id ON time_slots(ngo_id);
CREATE INDEX idx_time_slots_allocation ON time_slots(allocation_id);
CREATE INDEX idx_time_slots_time ON time_slots(start_time, end_time);

-- ========================================
-- TRIGGER FOR UPDATED_AT
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ngos_updated_at
    BEFORE UPDATE ON ngos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resource_requests_updated_at
    BEFORE UPDATE ON resource_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();