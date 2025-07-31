module.exports = function(migration) {
  // Create Author content type
  const author = migration.createContentType('author')
    .name('Author')
    .description('Author profile for blog posts');

  // Add name field
  author.createField('name')
    .name('Full Name')
    .type('Symbol')
    .required(true)
    .validations([
      { size: { max: 100 } }
    ]);

  // Add email field
  author.createField('email')
    .name('Email')
    .type('Symbol')
    .required(true)
    .validations([
      { 
        regexp: { 
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          flags: null
        }
      }
    ]);

  // Add bio field
  author.createField('bio')
    .name('Biography')
    .type('Text')
    .required(false)
    .validations([
      { size: { max: 500 } }
    ]);

  // Add website field
  author.createField('website')
    .name('Website URL')
    .type('Symbol')
    .required(false)
    .validations([
      { 
        regexp: { 
          pattern: '^https?://.+',
          flags: null
        }
      }
    ]);

  // Set display field
  author.displayField('name');

  console.log('✅ Created Author content type');
};