#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ADMIN_EMAIL = 'admin@pbtrivia.local';
const ADMIN_PASSWORD = 'admin123456';
const PB_URL = 'http://127.0.0.1:8090';
const OUTPUT_FILE = './questions-export.json';

async function exportToJSON() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Export Questions Collection to JSON  ║');
  console.log('╚════════════════════════════════════════╝\n');

  // Authenticate
  console.log('1. Authenticating...');
  const authResponse = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  const { token } = await authResponse.json();
  console.log('✓ Authenticated\n');

  // Get total count
  console.log('2. Getting total record count...');
  const countResponse = await fetch(`${PB_URL}/api/collections/questions/records?perPage=1`, {
    headers: { 'Authorization': token }
  });
  const { totalItems } = await countResponse.json();
  console.log(`✓ Total records: ${totalItems}\n`);

  // Export all records in batches
  console.log('3. Exporting records...');
  const allRecords = [];
  const batchSize = 500;
  let page = 1;

  while (allRecords.length < totalItems) {
    const response = await fetch(`${PB_URL}/api/collections/questions/records?page=${page}&perPage=${batchSize}`, {
      headers: { 'Authorization': token }
    });

    const { items } = await response.json();

    // Remove system fields for cleaner export
    const cleaned = items.map(record => ({
      category: record.category,
      subcategory: record.subcategory,
      difficulty: record.difficulty,
      question: record.question,
      a: record.a,
      b: record.b,
      c: record.c,
      d: record.d,
      level: record.level,
      metadata: record.metadata
    }));

    allRecords.push(...cleaned);

    if (items.length < batchSize) break;
    page++;

    process.stdout.write(`\r  Progress: ${allRecords.length}/${totalItems} records`);
  }

  console.log(`\n✓ Exported ${allRecords.length} records\n`);

  // Write to file
  console.log('4. Writing to file...');
  const exportData = {
    exported_at: new Date().toISOString(),
    total_records: allRecords.length,
    collection: 'questions',
    records: allRecords
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(exportData, null, 2));

  const stats = fs.statSync(OUTPUT_FILE);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`✓ Saved to: ${OUTPUT_FILE}`);
  console.log(`✓ File size: ${fileSizeMB} MB\n`);

  console.log('✅ Export complete!\n');
  console.log('To import this backup:');
  console.log('  1. Modify setup-pocketbase.js to read from JSON instead of TSV');
  console.log('  2. Or use this as a reference backup\n');
}

exportToJSON().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
