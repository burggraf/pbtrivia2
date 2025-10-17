#!/usr/bin/env node

const ADMIN_EMAIL = 'admin@pbtrivia.local';
const ADMIN_PASSWORD = 'admin123456';
const PB_URL = 'http://127.0.0.1:8090';

async function checkSchema() {
  // Authenticate
  const authResponse = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  const { token } = await authResponse.json();

  // Get questions collection
  const response = await fetch(`${PB_URL}/api/collections/questions`, {
    headers: { 'Authorization': token }
  });

  const collection = await response.json();

  console.log('\n=== Questions Collection Schema ===\n');
  console.log('Collection ID:', collection.id);
  console.log('Collection Name:', collection.name);
  console.log('Collection Type:', collection.type);
  console.log('\nFields:');

  if (collection.schema && collection.schema.length > 0) {
    collection.schema.forEach(field => {
      console.log(`  - ${field.name} (${field.type})${field.required ? ' [REQUIRED]' : ''}`);
    });
  } else {
    console.log('  ⚠️  NO FIELDS DEFINED! Collection schema is empty.');
  }

  console.log('\nIndexes:');
  if (collection.indexes && collection.indexes.length > 0) {
    collection.indexes.forEach(idx => {
      console.log(`  - ${idx}`);
    });
  } else {
    console.log('  - None');
  }

  console.log('\nAPI Rules:');
  console.log('  - List Rule:', collection.listRule || 'null');
  console.log('  - View Rule:', collection.viewRule || 'null');
  console.log('  - Create Rule:', collection.createRule || 'null');
  console.log('  - Update Rule:', collection.updateRule || 'null');
  console.log('  - Delete Rule:', collection.deleteRule || 'null');

  // Get a sample record to verify fields
  console.log('\n=== Sample Record ===\n');
  const recordsResponse = await fetch(`${PB_URL}/api/collections/questions/records?perPage=1`, {
    headers: { 'Authorization': token }
  });

  const { items, totalItems } = await recordsResponse.json();

  console.log('Total Records:', totalItems);

  if (items.length > 0) {
    const sample = items[0];
    console.log('\nSample Record Fields:');
    Object.keys(sample).forEach(key => {
      const value = sample[key];
      const preview = typeof value === 'string' && value.length > 50
        ? value.substring(0, 50) + '...'
        : value;
      console.log(`  - ${key}:`, preview);
    });
  }
}

checkSchema().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
