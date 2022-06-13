/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const solc = require('solc');

const homeworkPath = path.resolve(__dirname, 'contracts', 'Homework.sol');
const source = fs.readFileSync(homeworkPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Homework.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Homework.sol'
].Homework;
