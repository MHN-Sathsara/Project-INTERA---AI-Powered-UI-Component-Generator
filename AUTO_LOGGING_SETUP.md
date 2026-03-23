# Auto-Logging Setup Guide

This guide explains how to set up automatic logging to Supabase for the UI Component Generator.

## Supabase Setup

### 1. Create the Database Table

Run the SQL script in your Supabase dashboard:

```sql
-- Execute the contents of supabase_generation_logs_schema.sql
```

The script creates:

- `generation_logs` table to store all generation data
- Indexes for better performance
- Row Level Security policies
- Analytics view and functions

### 2. Environment Variables

Make sure your `.env` file contains:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## How It Works

### Automatic Logging

- Every component generation is automatically logged to Supabase
- Data includes prompt, API provider, timing, success/failure, etc.
- Local backup is maintained in localStorage
- No manual intervention required

### Data Captured

- **Prompt**: User's original request
- **API Provider**: Which AI service was used (Puter, Ollama, etc.)
- **Model**: Specific model used
- **Duration**: Generation time in milliseconds
- **Success**: Whether generation succeeded
- **Error Message**: If generation failed
- **Code Length**: Size of generated code
- **Component Type**: Detected type (button, form, etc.)
- **Prompt Complexity**: Simple, medium, complex, very-complex
- **Session Info**: Browser and environment data

### Stats Widget

- Bottom-right corner shows live statistics
- Click to expand for detailed metrics
- Shows success rate, average time, counts
- Indicator shows data source (DB = Supabase, Local = localStorage)
- Manual download option for local backup
- Clear local logs (Supabase data remains)

## Database Schema

### Main Table: `generation_logs`

```sql
Column              Type        Description
------------------  ----------  -------------------------
id                  BIGSERIAL   Primary key
log_id              VARCHAR     Unique generation ID
timestamp           TIMESTAMPTZ When generation occurred
prompt              TEXT        User's prompt
api_provider        VARCHAR     AI service used
model               VARCHAR     Specific model
duration            INTEGER     Time in milliseconds
success             BOOLEAN     Success/failure
error_message       TEXT        Error details if failed
code_length         INTEGER     Generated code size
component_type      VARCHAR     Detected component type
prompt_complexity   VARCHAR     Complexity level
session_info        JSONB       Browser/session data
created_at          TIMESTAMPTZ Record creation time
```

### Analytics View: `generation_analytics`

Provides daily aggregated statistics:

- Total generations per day
- Success/failure counts
- Average duration
- Breakdown by API provider and component type

### Analytics Function: `get_daily_stats()`

Returns daily statistics starting from a specific date.

## Usage Examples

### Query Recent Generations

```sql
SELECT * FROM generation_logs
ORDER BY timestamp DESC
LIMIT 10;
```

### Success Rate by API Provider

```sql
SELECT
    api_provider,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE success = true) as successful,
    ROUND(COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*), 2) as success_rate
FROM generation_logs
GROUP BY api_provider;
```

### Average Duration by Component Type

```sql
SELECT
    component_type,
    COUNT(*) as count,
    ROUND(AVG(duration), 0) as avg_duration_ms
FROM generation_logs
WHERE success = true
GROUP BY component_type
ORDER BY avg_duration_ms DESC;
```

### Daily Stats for Last Week

```sql
SELECT * FROM get_daily_stats(CURRENT_DATE - INTERVAL '7 days');
```

## Benefits

1. **Research Data**: Comprehensive data for AI performance analysis
2. **Quality Tracking**: Monitor success rates and identify issues
3. **Performance Analysis**: Track generation times and optimize
4. **User Behavior**: Understand how users interact with the system
5. **Automatic Backup**: Data preserved even if browser cache is cleared
6. **Scalable**: Handles large amounts of data with proper indexing

## Privacy & Security

- No personal user data is collected
- Only generation-related metrics are stored
- Row Level Security enabled on table
- Data can be anonymized by removing session_info
- Compliance with research data requirements

## Troubleshooting

### Data Not Appearing in Supabase

1. Check environment variables are correct
2. Verify Supabase connection in browser console
3. Ensure table exists and has proper permissions
4. Check Row Level Security policies

### Stats Showing "Local" Instead of "DB"

1. Supabase connection issue - check console for errors
2. Table doesn't exist or has wrong name
3. RLS policies blocking access
4. Network connectivity issues

### Performance Issues

1. Check if indexes are created properly
2. Consider archiving old data
3. Verify query efficiency in analytics view

The system gracefully falls back to local storage if Supabase is unavailable, ensuring logging continues uninterrupted.
