const jsdoc2md = require('jsdoc-to-markdown');

module.exports = class DocumentationScanner {
  constructor(generator) {
    this.generator = generator;
  }

  scan(directory) {
    return jsdoc2md.getTemplateData({ files: [`${directory}*.js`, `${directory}**/*.js`] });
  }
};
