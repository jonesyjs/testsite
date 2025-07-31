#!/usr/bin/env node

/**
 * CONTENTFUL CONTENT SEEDING DEMO
 * 
 * This script demonstrates how to seed content into Contentful using the Management API.
 * It reads data from a JSON file and creates entries in your Contentful space.
 */

require('dotenv').config({ path: '.env.local' });
const contentful = require('contentful-management');
const fs = require('fs');
const path = require('path');

// ============================================
// MAIN DEMO FUNCTION
// ============================================

async function seedContent() {
  console.log('🌱 CONTENTFUL SEEDING DEMO\n');
  
  try {
    // Step 1: Connect to Contentful
    const environment = await connectToContentful();
    
    // Step 2: Load our demo data
    const demoData = loadDemoData();
    
    // Step 3: Create blog posts
    await createBlogPosts(environment, demoData.blogPosts);
    
    // Step 4: Create author profile
    await createAuthor(environment, demoData.author);
    
    // Step 5: Show summary
    showSummary(demoData);

  } catch (error) {
    console.error('\n❌ DEMO FAILED:', error.message);
    console.log('\n🔧 Check your environment variables and try again.');
    process.exit(1);
  }
}




// ============================================
// HELPER FUNCTIONS
// ============================================

async function connectToContentful() {
  console.log('🔗 Connecting to Contentful...');
  
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  });
  
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const environment = await space.getEnvironment('master');
  
  console.log('✅ Connected successfully!\n');
  
  return environment;
}

function loadDemoData() {
  console.log('📁 Loading demo data from seed-data.json...');
  
  const dataFile = path.join(__dirname, '../data/seed-data.json');
  const demoData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  
  console.log('✅ Demo data loaded!\n');
  
  return demoData;
}

async function createBlogPosts(environment, blogPostsData) {
  console.log('📝 Creating blog posts...');
  
  for (const postData of blogPostsData) {
    try {
      // Create the blog post entry
      const blogPost = await environment.createEntry('blogPost', {
        fields: {
          title: { 'en-US': postData.title },
          slug: { 'en-US': postData.slug },
          body: { 'en-US': postData.body },
          publishedDate: { 'en-US': new Date().toISOString() }
        }
      });
      
      // Publish it to make it live
      await blogPost.publish();
      
      console.log(`   ✅ "${postData.title}"`);
    } catch (error) {
      console.log(`   ❌ Failed: "${postData.title}" - ${error.message}`);
    }
  }
}

async function createAuthor(environment, authorData) {
  console.log('\n👤 Creating author profile...');
  
  try {
    // Create the author entry
    const author = await environment.createEntry('author', {
      fields: {
        name: { 'en-US': authorData.name },
        email: { 'en-US': authorData.email },
        bio: { 'en-US': authorData.bio },
        website: { 'en-US': authorData.website }
      }
    });
    
    // Publish it to make it live
    await author.publish();
    
    console.log(`   ✅ "${authorData.name}"`);
  } catch (error) {
    console.log(`   ❌ Failed: "${authorData.name}" - ${error.message}`);
  }
}

function showSummary(demoData) {
  console.log('\n🎉 DEMO COMPLETED SUCCESSFULLY!');
  console.log('\n📊 What was created:');
  console.log(`   📝 ${demoData.blogPosts.length} blog posts`);
  console.log('   👤 1 author profile');
  console.log('\n💡 Check your Contentful space to see the new content!');
}

// Run the demo
if (require.main === module) {
  seedContent();
}

module.exports = { seedContent };