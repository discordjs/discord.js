const fs = require('fs');

module.exports = {
  category: 'Examples',
  name: 'Ping Pong',
  data:
`\`\`\`js
${fs.readFileSync('./docs/custom/examples/ping_pong.js').toString('utf-8')}
\`\`\``,
};
