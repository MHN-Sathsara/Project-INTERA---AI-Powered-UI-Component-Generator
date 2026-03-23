-- Generation Logs Table for Automatic Logging
-- This table stores all component generation attempts with detailed metrics

CREATE TABLE generation_logs (
    id BIGSERIAL PRIMARY KEY,
    log_id VARCHAR(50) UNIQUE NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    prompt TEXT NOT NULL,
    api_provider VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    duration INTEGER NOT NULL, -- in milliseconds
    success BOOLEAN NOT NULL,
    error_message TEXT,
    code_length INTEGER,
    component_type VARCHAR(50),
    prompt_complexity VARCHAR(20),
    session_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_generation_logs_timestamp ON generation_logs(timestamp);
CREATE INDEX idx_generation_logs_success ON generation_logs(success);
CREATE INDEX idx_generation_logs_api_provider ON generation_logs(api_provider);
CREATE INDEX idx_generation_logs_component_type ON generation_logs(component_type);
CREATE INDEX idx_generation_logs_log_id ON generation_logs(log_id);

-- Enable Row Level Security (RLS)
ALTER TABLE generation_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for logging)
CREATE POLICY "Allow inserts for generation logs" ON generation_logs
    FOR INSERT WITH CHECK (true);

-- Create policy to allow reads (for analytics)
CREATE POLICY "Allow reads for generation logs" ON generation_logs
    FOR SELECT USING (true);

-- Optional: Create view for analytics
CREATE VIEW generation_analytics AS
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as total_generations,
    COUNT(*) FILTER (WHERE success = true) as successful_generations,
    COUNT(*) FILTER (WHERE success = false) as failed_generations,
    ROUND(AVG(duration)) as avg_duration_ms,
    api_provider,
    component_type,
    prompt_complexity
FROM generation_logs
GROUP BY DATE(timestamp), api_provider, component_type, prompt_complexity
ORDER BY date DESC;

-- Create function to get daily stats
CREATE OR REPLACE FUNCTION get_daily_stats(start_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    date DATE,
    total_generations BIGINT,
    successful_generations BIGINT,
    failed_generations BIGINT,
    success_rate NUMERIC,
    avg_duration_ms NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(timestamp) as date,
        COUNT(*) as total_generations,
        COUNT(*) FILTER (WHERE success = true) as successful_generations,
        COUNT(*) FILTER (WHERE success = false) as failed_generations,
        ROUND(COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*), 2) as success_rate,
        ROUND(AVG(duration), 0) as avg_duration_ms
    FROM generation_logs
    WHERE DATE(timestamp) >= start_date
    GROUP BY DATE(timestamp)
    ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;