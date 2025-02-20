import { Attachment } from './patch.js';
import { AttachmentRe } from './patch_refactored.js';
import { BranchCoverage } from '../../BranchCoverage.js';

// colors
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
const RED = '\x1b[31m';

// Setup
export const bc = new BranchCoverage('attachment.js:patch');
bc.setTotal(20);
export const bc_re = new BranchCoverage('attachment.js:patch_refactored');
bc_re.setTotal(1);

// Mock AttachmentFlagsBitField
class AttachmentFlagsBitField {
  constructor(flags) {
    this.flags = flags;
  }
  freeze() {
    return this;
  }
}

// Mock global functions
global.AttachmentFlagsBitField = AttachmentFlagsBitField;

// Run all the tests
function runTest(name, data, expectedOutput, message) {
  // original version
  const attachment = new Attachment();
  const beforeCoverage = bc.coveredBranches.size;
  attachment._patch(data);
  console.log(`${GREEN}Original - ${name}: ${bc.coveredBranches.size - beforeCoverage} new branches covered${RESET}`);

  // Refactored
  const attachmentRe = new AttachmentRe();
  const beforeCoverageRe = bc_re.coveredBranches.size;
  attachmentRe._patch(data);
  console.log(
    `${BLUE}Refactored - ${name}: ${bc_re.coveredBranches.size - beforeCoverageRe} new branches covered${RESET}`,
  );

  Object.entries(expectedOutput).forEach(([key, expectedValue]) => {
    const actualValue = attachment[key];
    const success = JSON.stringify(actualValue) === JSON.stringify(expectedValue);

    console.assert(success, `${message} - Expected ${key}: ${expectedValue}, but got ${actualValue}`);

    if (success) {
      console.log(`${GREEN}✔ ${message} - ${key} is correct${RESET}`);
    } else {
      console.error(`${RED}✖ ${message} - ${key} is incorrect${RESET}`);
    }
  });

  Object.entries(expectedOutput).forEach(([key, expectedValue]) => {
    const actualValue = attachmentRe[key];
    const success = JSON.stringify(actualValue) === JSON.stringify(expectedValue);

    console.assert(success, `${message} - Expected ${key}: ${expectedValue}, but got ${actualValue}`);

    if (success) {
      console.log(`${GREEN}✔ ${message} - ${key} is correct${RESET}`);
    } else {
      console.error(`${RED}✖ ${message} - ${key} is incorrect${RESET}`);
    }
  });
}

// Test for the branch coverage
const tests = [
  {
    name: 'Only ID',
    data: {
      id: '123',
    },
    message: "Ensure 'height' and 'width' default to null when missing",
    expectedOutput: { height: null, width: null },
  },
  {
    name: 'ID, size, URL, ProxyURL',
    data: {
      id: '123',
      size: 500,
      url: 'https://example.com/image.png',
      proxy_url: 'https://proxy.example.com/image.png',
    },
    message: "Ensure 'ephemeral' is false when missing",
    expectedOutput: { ephemeral: false },
  },
  {
    name: 'ID, height, width, contentType, description',
    data: {
      id: '123',
      height: 800,
      width: 600,
      content_type: 'image/png',
      description: 'Cat',
    },
    message: "Ensure 'description' is correctcly set",
    expectedOutput: { description: 'Cat' },
  },
  {
    name: 'ID, ephemeral, duration_secs, wavform, flags, title',
    data: {
      id: '123',
      ephemeral: true,
      duration_secs: 120,
      waveform: 'waveform_data',
      flags: 1,
      title: 'Just some cat',
    },
    message: "Ensure 'url' is correctcly set when missing",
    expectedOutput: { url: undefined },
  },
];

// Display the logged coverage results
console.log('Running Attachment._patch coverage tests...\n');
tests.forEach(test => runTest(test.name, test.data, test.expectedOutput, test.message));
console.log('\n');
console.log(`${GREEN}Original version coverage:${RESET}`);
bc.report();
console.log(`${BLUE}Refactored version coverage:${RESET}`);
bc_re.report();
