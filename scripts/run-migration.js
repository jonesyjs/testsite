#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { runMigration } = require('contentful-migration');

async function runContentfulMigration() {
  try {
    console.log('🚀 Running Contentful Migrations...\n');

    // List of migration files to run in order
    const migrationFiles = [
      './migrations/001-create-blog-post-type.js',
      './migrations/002-create-author-type.js'
    ];

    const baseOptions = {
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      yes: true // Auto-confirm (for demo purposes)
    };

    // Run each migration sequentially
    for (const filePath of migrationFiles) {
      console.log(`📄 Running migration: ${filePath}`);
      
      const options = {
        ...baseOptions,
        filePath
      };

      await runMigration(options);
      console.log(`✅ Completed: ${filePath}\n`);
    }

    console.log('🎉 All migrations completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runContentfulMigration();
}

module.exports = { runContentfulMigration };