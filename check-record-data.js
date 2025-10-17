#!/usr/bin/env node

const ADMIN_EMAIL = 'admin@pbtrivia.local';
const ADMIN_PASSWORD = 'admin123456';
const PB_URL = 'http://127.0.0.1:8090';

async function checkRecords() {
  const authResponse = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  const { token } = await authResponse.json();

  const response = await fetch(`${PB_URL}/api/collections/questions/records?perPage=3`, {
    headers: { 'Authorization': token }
  });

  const { items, totalItems } = await response.json();

  console.log(`\nTotal records: ${totalItems}\n`);
  console.log('Sample records:\n');

  items.forEach((record, i) => {
    console.log(`Record ${i + 1}:`);
    console.log(JSON.stringify(record, null, 2));
    console.log('\n');
  });
}

checkRecords().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
