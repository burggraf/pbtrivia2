#!/usr/bin/env node

/**
 * PocketBase Setup Script
 *
 * This script:
 * 1. Creates an admin superuser
 * 2. Creates the questions collection with proper schema
 * 3. Configures collection API rules
 * 4. Imports all questions from questions.tsv
 */

const fs = require('fs');
const readline = require('readline');

const PB_URL = 'http://127.0.0.1:8090';
const TSV_FILE = './questions.tsv';
const BATCH_SIZE = 1000;

// Admin credentials (change these for production!)
const ADMIN_EMAIL = 'admin@pbtrivia.local';
const ADMIN_PASSWORD = 'admin123456'; // Min 10 chars

class PocketBaseSetup {
  constructor() {
    this.adminToken = null;
    this.stats = {
      imported: 0,
      skipped: 0,
      failed: 0,
      updated: 0
    };
  }

  async request(endpoint, options = {}) {
    const url = `${PB_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.adminToken) {
      headers['Authorization'] = this.adminToken;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { rawText: text };
    }

    if (!response.ok) {
      throw new Error(`API Error (${response.status}): ${JSON.stringify(data)}`);
    }

    return data;
  }

  async createAdminSuperuser() {
    console.log('\n1. Creating admin superuser...');

    try {
      // Try to authenticate with existing superuser
      const auth = await this.request('/api/collections/_superusers/auth-with-password', {
        method: 'POST',
        body: JSON.stringify({
          identity: ADMIN_EMAIL,
          password: ADMIN_PASSWORD
        })
      });

      this.adminToken = auth.token;
      console.log('✓ Admin user already exists, authenticated successfully');
      return;
    } catch (error) {
      // Admin doesn't exist or wrong credentials, try to create
      console.log('  Admin doesn\'t exist, creating new superuser...');
    }

    try {
      // Create new superuser
      const admin = await this.request('/api/collections/_superusers/records', {
        method: 'POST',
        body: JSON.stringify({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          passwordConfirm: ADMIN_PASSWORD
        })
      });

      // Authenticate
      const auth = await this.request('/api/collections/_superusers/auth-with-password', {
        method: 'POST',
        body: JSON.stringify({
          identity: ADMIN_EMAIL,
          password: ADMIN_PASSWORD
        })
      });

      this.adminToken = auth.token;
      console.log(`✓ Superuser created successfully: ${ADMIN_EMAIL}`);
      console.log(`  Password: ${ADMIN_PASSWORD}`);
      console.log('  ⚠️  Please change this password in production!');
    } catch (error) {
      console.error('✗ Failed to create superuser:', error.message);
      throw error;
    }
  }

  async createQuestionsCollection() {
    console.log('\n2. Creating questions collection...');

    const collectionSchema = {
      name: 'questions',
      type: 'base',
      schema: [
        {
          id: 'category_field',
          name: 'category',
          type: 'text',
          required: true,
          presentable: false,
          options: {
            min: 1,
            max: 255,
            pattern: ''
          }
        },
        {
          id: 'subcategory_field',
          name: 'subcategory',
          type: 'text',
          required: false,
          presentable: false,
          options: {
            min: null,
            max: 255,
            pattern: ''
          }
        },
        {
          id: 'difficulty_field',
          name: 'difficulty',
          type: 'text',
          required: false,
          presentable: false,
          options: {
            min: null,
            max: 50,
            pattern: ''
          }
        },
        {
          id: 'question_field',
          name: 'question',
          type: 'text',
          required: true,
          presentable: false,
          options: {
            min: 1,
            max: null,
            pattern: ''
          }
        },
        {
          id: 'a_field',
          name: 'a',
          type: 'text',
          required: true,
          presentable: false,
          options: {
            min: 1,
            max: null,
            pattern: ''
          }
        },
        {
          id: 'b_field',
          name: 'b',
          type: 'text',
          required: true,
          presentable: false,
          options: {
            min: 1,
            max: null,
            pattern: ''
          }
        },
        {
          id: 'c_field',
          name: 'c',
          type: 'text',
          required: true,
          presentable: false,
          options: {
            min: 1,
            max: null,
            pattern: ''
          }
        },
        {
          id: 'd_field',
          name: 'd',
          type: 'text',
          required: true,
          presentable: false,
          options: {
            min: 1,
            max: null,
            pattern: ''
          }
        },
        {
          id: 'level_field',
          name: 'level',
          type: 'text',
          required: false,
          presentable: false,
          options: {
            min: null,
            max: null,
            pattern: ''
          }
        },
        {
          id: 'metadata_field',
          name: 'metadata',
          type: 'json',
          required: false,
          presentable: false,
          options: {
            maxSize: 2000000
          }
        }
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: null,
      updateRule: null,
      deleteRule: null
    };

    try {
      let collectionId;

      // Check if collection already exists
      try {
        const existing = await this.request('/api/collections/questions');
        console.log('✓ Questions collection already exists');
        collectionId = existing.id;

        // Update the collection schema and rules (without indexes)
        await this.request(`/api/collections/${existing.id}`, {
          method: 'PATCH',
          body: JSON.stringify(collectionSchema)
        });
        console.log('✓ Collection schema and rules updated');
      } catch (error) {
        // Collection doesn't exist, create it
        const created = await this.request('/api/collections', {
          method: 'POST',
          body: JSON.stringify(collectionSchema)
        });
        collectionId = created.id;
        console.log('✓ Questions collection created successfully');
      }

      // Now add the index separately
      const withIndexes = {
        ...collectionSchema,
        indexes: [
          'CREATE INDEX idx_category ON questions (category)'
        ]
      };

      await this.request(`/api/collections/${collectionId}`, {
        method: 'PATCH',
        body: JSON.stringify(withIndexes)
      });

      console.log('✓ Schema: id, category, subcategory, difficulty, question, a, b, c, d, level, metadata');
      console.log('✓ Index: category (for fast filtering)');
      console.log('✓ API Rules:');
      console.log('    - List/View: Authenticated users only');
      console.log('    - Create/Update/Delete: Disabled (admin console only)');
    } catch (error) {
      console.error('✗ Failed to create collection:', error.message);
      throw error;
    }
  }

  parseTSVLine(line) {
    // Handle escaped quotes and multi-line fields properly
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"' && nextChar === '"' && inQuotes) {
        // Escaped quote within quoted field
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        // Toggle quote mode
        inQuotes = !inQuotes;
      } else if (char === '\t' && !inQuotes) {
        // Field separator
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current);

    return fields;
  }

  validateQuestion(question) {
    const required = ['category', 'question', 'a', 'b', 'c', 'd'];
    for (const field of required) {
      if (!question[field] || question[field].trim() === '') {
        return false;
      }
    }
    return true;
  }

  async importQuestions() {
    console.log('\n3. Importing questions from TSV...');
    console.log(`  Reading from: ${TSV_FILE}`);

    if (!fs.existsSync(TSV_FILE)) {
      throw new Error(`TSV file not found: ${TSV_FILE}`);
    }

    const fileStream = fs.createReadStream(TSV_FILE);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let isFirstLine = true;
    let headers = [];
    let batch = [];
    let lineNumber = 0;
    let accumulator = '';
    let quoteCount = 0;

    for await (const line of rl) {
      lineNumber++;

      // Accumulate lines if we're inside a quoted field
      accumulator += (accumulator ? '\n' : '') + line;

      // Count quotes to see if we're inside a quoted field
      quoteCount = (accumulator.match(/"/g) || []).length;

      // If odd number of quotes, we're inside a quoted field, continue accumulating
      if (quoteCount % 2 !== 0) {
        continue;
      }

      // We have a complete record
      const completeLine = accumulator;
      accumulator = '';
      quoteCount = 0;

      if (isFirstLine) {
        headers = this.parseTSVLine(completeLine);
        console.log(`  Headers: ${headers.join(', ')}`);
        isFirstLine = false;
        continue;
      }

      const fields = this.parseTSVLine(completeLine);

      if (fields.length !== headers.length) {
        console.warn(`  ⚠️  Line ${lineNumber}: Field count mismatch (expected ${headers.length}, got ${fields.length})`);
        this.stats.skipped++;
        continue;
      }

      const question = {};
      headers.forEach((header, index) => {
        question[header] = fields[index];
      });

      // Validate required fields
      if (!this.validateQuestion(question)) {
        console.warn(`  ⚠️  Line ${lineNumber}: Missing required fields`);
        this.stats.skipped++;
        continue;
      }

      batch.push(question);

      if (batch.length >= BATCH_SIZE) {
        await this.processBatch(batch);
        batch = [];
        process.stdout.write(`\r  Progress: ${this.stats.imported} imported, ${this.stats.skipped} skipped, ${this.stats.failed} failed`);
      }
    }

    // Process remaining batch
    if (batch.length > 0) {
      await this.processBatch(batch);
    }

    console.log(`\n✓ Import complete!`);
    console.log(`  Total imported: ${this.stats.imported}`);
    console.log(`  Total skipped: ${this.stats.skipped}`);
    console.log(`  Total failed: ${this.stats.failed}`);
    console.log(`  Total updated: ${this.stats.updated}`);
  }

  async processBatch(questions) {
    for (const question of questions) {
      try {
        // Parse metadata safely
        let metadata = {};
        if (question.metadata && question.metadata.trim()) {
          try {
            metadata = JSON.parse(question.metadata);
          } catch (e) {
            // Invalid JSON, store as empty object
            metadata = {};
          }
        }

        // Create the question (let PocketBase auto-generate ID)
        const record = {
          category: question.category,
          subcategory: question.subcategory || '',
          difficulty: question.difficulty || '',
          question: question.question,
          a: question.a,
          b: question.b,
          c: question.c,
          d: question.d,
          level: question.level || '',
          metadata: metadata
        };

        // Create new record with PocketBase-generated ID
        await this.request('/api/collections/questions/records', {
          method: 'POST',
          body: JSON.stringify(record)
        });
        this.stats.imported++;
      } catch (error) {
        this.stats.failed++;
        if (this.stats.failed <= 10) {
          console.error(`\n  ✗ Failed to import question: ${error.message}`);
        }
      }
    }
  }

  async verifyImport() {
    console.log('\n4. Verifying import...');

    try {
      const result = await this.request('/api/collections/questions/records?perPage=1');
      const total = result.totalItems || 0;

      console.log(`✓ Total questions in database: ${total}`);

      if (total === 0) {
        console.warn('  ⚠️  Warning: No questions found in database!');
      }

      // Test category index performance
      const start = Date.now();
      await this.request('/api/collections/questions/records?filter=category="History"&perPage=10');
      const duration = Date.now() - start;

      console.log(`✓ Category index query performance: ${duration}ms`);
      if (duration > 100) {
        console.warn('  ⚠️  Warning: Query took longer than 100ms. Index may not be working.');
      }
    } catch (error) {
      console.error('✗ Verification failed:', error.message);
    }
  }

  async run() {
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║   PocketBase Setup & Questions Import         ║');
    console.log('╚═══════════════════════════════════════════════╝');

    try {
      await this.createAdminSuperuser();
      // Skip collection creation - using migration file instead
      // await this.createQuestionsCollection();
      await this.importQuestions();
      await this.verifyImport();

      console.log('\n✅ Setup complete!');
      console.log('\nNext steps:');
      console.log('  1. Access admin dashboard: http://127.0.0.1:8090/_/');
      console.log(`     Email: ${ADMIN_EMAIL}`);
      console.log(`     Password: ${ADMIN_PASSWORD}`);
      console.log('  2. Change the admin password in the dashboard');
      console.log('  3. Create user authentication collections for players/hosts');

    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the setup
const setup = new PocketBaseSetup();
setup.run();
