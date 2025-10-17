# PocketBase Backup & Seed Strategy

## Current Seed File Setup ✅

Your questions collection is already backed up in source control:

### Primary Seed File
- **File**: `questions.tsv` (61,258 lines)
- **Import Script**: `setup-pocketbase.js`
- **Status**: ✅ In source control

### Rebuilding Database from Seed

```bash
# 1. Stop PocketBase
pkill -f "pocketbase serve"

# 2. Remove existing data
rm -rf pb_data

# 3. Start PocketBase
./pocketbase serve --dev > logs/pocketbase.log 2>&1 &

# 4. Wait 2 seconds, then create superuser
sleep 2
./pocketbase superuser create admin@pbtrivia.local admin123456

# 5. Import questions
node setup-pocketbase.js
```

Result: Fresh database with all 61,254 questions in ~2-3 minutes.

## Additional Backup Options

### 1. JSON Export (for human inspection)

```bash
# Export current database to JSON
node export-to-json.js
```

**Output**: `questions-export.json`
- Human-readable format
- Includes all fields
- ~40-50 MB file size
- Good for inspection, diffs, and archival

**Pros**:
- Easy to inspect and search
- Can track changes with git diff
- Compatible with other tools

**Cons**:
- Large file size (~50MB)
- Slower to import than TSV

### 2. SQLite Database Backup

```bash
# Option A: Copy the database file
cp pb_data/data.db backups/data-$(date +%Y%m%d).db

# Option B: Use SQLite backup command
sqlite3 pb_data/data.db ".backup 'backups/data-$(date +%Y%m%d).db'"

# Option C: Export to SQL dump
sqlite3 pb_data/data.db .dump > backups/dump-$(date +%Y%m%d).sql
```

**Pros**:
- Complete database snapshot
- Fastest to restore
- Includes all collections and settings

**Cons**:
- Binary format (data.db) not human-readable
- SQL dump is very large
- Not ideal for source control

### 3. PocketBase ZIP Backup

```bash
# Create full backup via admin dashboard
# Navigate to: http://127.0.0.1:8090/_/ > Settings > Backups
# Or use the API:
curl -X POST http://127.0.0.1:8090/api/backups \
  -H "Authorization: YOUR_ADMIN_TOKEN"
```

**Output**: ZIP archive of entire `pb_data` directory
- Includes database, uploads, settings
- Stored in `pb_data/backups/` by default

**Pros**:
- Complete system backup
- Can configure automatic backups
- Can store in S3

**Cons**:
- Large file size
- Not granular (all or nothing)

## Recommended Strategy

### For Source Control (Current Setup) ✅
1. **Keep** `questions.tsv` in repo
2. **Keep** `setup-pocketbase.js` import script
3. **Keep** `pb_migrations/` directory
4. **Ignore** `pb_data/` in `.gitignore`

### For Production Backups
1. Enable automatic PocketBase backups in admin dashboard
2. Configure S3 storage for backups
3. Schedule: Daily at 2 AM
4. Retention: Keep last 7 days

### For Development
1. Use `questions.tsv` as seed file
2. Optionally export to JSON for inspection: `node export-to-json.js`
3. Create local SQLite backups before major changes

## Files Overview

| File | Purpose | Source Control | Size |
|------|---------|---------------|------|
| `questions.tsv` | Primary seed file | ✅ Yes | ~15 MB |
| `setup-pocketbase.js` | Import script | ✅ Yes | ~10 KB |
| `export-to-json.js` | JSON export utility | ✅ Yes | ~3 KB |
| `pb_migrations/` | Schema migrations | ✅ Yes | <1 KB |
| `pb_data/` | Database & files | ❌ No (.gitignored) | Varies |
| `questions-export.json` | JSON backup | ⚠️ Optional | ~50 MB |

## Quick Reference

```bash
# Rebuild from seed
node setup-pocketbase.js

# Export to JSON
node export-to-json.js

# Backup database
cp pb_data/data.db backups/data-$(date +%Y%m%d).db

# Restore database
cp backups/data-YYYYMMDD.db pb_data/data.db
```

## Notes

- **TSV is your source of truth** - All 61,254 questions are in `questions.tsv`
- **Migrations handle schema** - `pb_migrations/` ensures correct schema on any fresh database
- **Import script is idempotent** - Running multiple times won't create duplicates (will update instead)
- **PocketBase backup API** requires authentication and includes everything in `pb_data/`
