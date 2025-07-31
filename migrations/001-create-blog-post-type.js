module.exports = function(migration) {
  // Create BlogPost content type
  const blogPost = migration.createContentType('blogPost')
    .name('Blog Post')
    .description('A simple blog post content type for demo purposes');

  // Add title field
  blogPost.createField('title')
    .name('Title')
    .type('Symbol')
    .required(true)
    .validations([
      { size: { max: 200 } }
    ]);

  // Add body field
  blogPost.createField('body')
    .name('Body')
    .type('RichText')
    .required(true);

  // Add slug field
  blogPost.createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .unique(true)
    .validations([
      { size: { max: 100 } }
    ]);

  // Add published date
  blogPost.createField('publishedDate')
    .name('Published Date')
    .type('Date')
    .required(false);

  // Set display field
  blogPost.displayField('title');

  console.log('✅ Created BlogPost content type');
};