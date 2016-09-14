const cwd = (`${process.cwd()}\\`).replace(/\\/g, '/');
const backToForward = /\\/g;

const DocumentedItem = require('./DocumentedItem');

/*
   { lineno: 7,
     filename: 'VoiceChannel.js',
     path: 'src/structures' },
*/

class DocumentedItemMeta extends DocumentedItem {

  registerMetaInfo(data) {
    super.registerMetaInfo(data);
    this.directData.line = data.lineno;
    this.directData.file = data.filename;
    this.directData.path = data.path.replace(backToForward, '/').replace(cwd, '');
  }

  serialize() {
    super.serialize();
    const { line, file, path } = this.directData;
    return { line, file, path };
  }

}

module.exports = DocumentedItemMeta;
