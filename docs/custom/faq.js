const fs = require('fs');

module.exports = {
  category: 'General',
  name: 'FAQ',
  data: fs.readFileSync('./docs/custom/documents/faq.md').toString('utf-8'),
};
