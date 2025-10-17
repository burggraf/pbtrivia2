# PocketBase Setup Documentation

## Overview

This document describes the PocketBase backend setup for the pbtrivia2 application, including the questions collection and data import process.

## Setup Summary

- **PocketBase Version**: 0.30.3
- **Questions Imported**: 61,254
- **Collection**: `questions` with full schema
- **Admin Superuser**: admin@pbtrivia.local

## Initial Setup

### 1. Start PocketBase

```bash
./pocketbase serve --dev
```

The server will start at:
- REST API: http://127.0.0.1:8090/api/
- Admin Dashboard: http://127.0.0.1:8090/_/

### 2. Create Admin Superuser

```bash
./pocketbase superuser create admin@pbtrivia.local admin123456
```

**⚠️ Important**: Change the admin password in production!

### 3. Questions Collection Schema

The `questions` collection was created with the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | text (15 chars) | Yes | Auto-generated primary key |
| category | text (max 255) | Yes | Question category (History, Geography, etc.) |
| subcategory | text (max 255) | No | More specific categorization |
| difficulty | text (max 50) | No | Difficulty level (easy, medium, hard) |
| question | text | Yes | The question text |
| a | text | Yes | Answer A (CORRECT ANSWER) |
| b | text | Yes | Answer B (incorrect) |
| c | text | Yes | Answer C (incorrect) |
| d | text | Yes | Answer D (incorrect) |
| level | text | No | Additional level field (currently unused) |
| metadata | json | No | Additional metadata in JSON format |
| created | datetime | Auto | Auto-generated creation timestamp |
| updated | datetime | Auto | Auto-updated timestamp |

**Critical**: Column "a" always contains the correct answer.

### 4. API Access Rules

```javascript
// List Rule (read access)
@request.auth.id != ""  // Any authenticated user can read

// View Rule (single record access)
@request.auth.id != ""  // Any authenticated user can view

// Create/Update/Delete Rules
null  // Only admins via dashboard
```

## Data Import

### Import Script

The `setup-pocketbase.js` script handles:
1. Admin authentication
2. TSV file parsing with multi-line field support
3. Batch import (1000 records per batch)
4. Error handling and validation
5. Progress reporting

### Running the Import

```bash
node setup-pocketbase.js
```

### Import Features

- **Multi-line Support**: Handles questions with embedded newlines
- **Escaped Quotes**: Properly processes "" within quoted fields
- **Batch Processing**: Imports 1000 records at a time
- **Error Recovery**: Continues on individual record failures
- **Validation**: Checks required fields before import
- **Idempotent**: Can be run multiple times (creates new records)

### Import Results

```
Total imported: 61,254
Total skipped: 0
Total failed: 0
```

## File Structure

```
pbtrivia2/
├── pocketbase              # PocketBase executable
├── pb_data/                # Database and data files (gitignored)
├── pb_migrations/          # Migration files
│   └── 1760655600_create_questions.js
├── questions.tsv           # Source data (61,258 lines including header)
├── setup-pocketbase.js     # Import script
├── update-collection-schema.js  # Schema update helper
└── logs/                   # Log files
    └── pocketbase.log
```

## Verifying the Setup

### Check Record Count

```bash
curl -H "Authorization: YOUR_TOKEN" \
  "http://127.0.0.1:8090/api/collections/questions/records?perPage=1"
```

Look for `totalItems: 61254` in the response.

### Sample Query by Category

```bash
curl -H "Authorization: YOUR_TOKEN" \
  "http://127.0.0.1:8090/api/collections/questions/records?filter=category='History'&perPage=10"
```

### Admin Dashboard

Access the dashboard at http://127.0.0.1:8090/_/ to:
- Browse questions
- Manage collections
- View API logs
- Update access rules

## Maintenance

### Backup Database

```bash
cp -r pb_data pb_data_backup_$(date +%Y%m%d)
```

### Reset Database

```bash
pkill -f "pocketbase serve"
rm pb_data/data.db*
./pocketbase serve --dev &
./pocketbase superuser create admin@pbtrivia.local admin123456
node setup-pocketbase.js
```

### Re-import Questions

1. Stop PocketBase
2. Delete `pb_data/data.db*`
3. Restart PocketBase
4. Recreate superuser
5. Run `node setup-pocketbase.js`

## Troubleshooting

### Import Failures

If the import fails:
1. Check PocketBase is running: `curl http://127.0.0.1:8090/api/health`
2. Verify admin credentials in `setup-pocketbase.js`
3. Check logs: `tail -f logs/pocketbase.log`
4. Ensure `questions.tsv` exists and is readable

### Authentication Errors

If you see 401 errors:
1. Verify admin superuser exists
2. Check credentials in scripts
3. Try re-authenticating via the dashboard

### Schema Issues

If records fail validation:
1. Check collection schema in admin dashboard
2. Verify all required fields are present
3. Ensure field types match the schema

## Final Status

✅ **Setup Complete - All Fields Verified**

1. ✅ PocketBase initialized (v0.30.3)
2. ✅ Questions collection created with complete schema
3. ✅ **61,254 questions imported with ALL fields**:
   - category ✓
   - subcategory ✓
   - difficulty ✓
   - question ✓
   - a, b, c, d (answer options) ✓
   - level ✓
   - metadata ✓
4. ✅ Data integrity verified - sample records show all fields populated

## Next Steps

1. 🔲 Add category index (optional, for performance)
2. 🔲 Create user authentication collections for players/hosts
3. 🔲 Create game state collections
4. 🔲 Configure CORS for frontend
5. 🔲 Change admin password before deployment

## Security Notes

- Change default admin password immediately
- Use environment variables for credentials in production
- Enable HTTPS in production
- Review and tighten API rules before deployment
- Regular database backups recommended
