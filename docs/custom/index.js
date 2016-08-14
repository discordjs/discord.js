const files = [
  require('./getting_started'),
];

const categories = {};
for (const file of files) {
  file.category = file.category.toLowerCase();
  if (!categories[file.category]) {
    categories[file.category] = {};
  }
  categories[file.category][file.name] = file.data;
}

module.exports = categories;
