const fs = require('fs');

module.exports = {
  category: 'Examples',
  name: 'Avatars',
  data:
`\`\`\`js
${fs.readFileSync('./docs/custom/examples/avatar.js').toString('utf-8')}
\`\`\``,
};
