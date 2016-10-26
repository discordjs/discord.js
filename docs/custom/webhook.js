const fs = require('fs');

module.exports = {
  category: 'Examples',
  name: 'Webhooks',
  data:
`\`\`\`js
${fs.readFileSync('./docs/custom/examples/webhook.js').toString('utf-8')}
\`\`\``,
};
