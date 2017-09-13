/* eslint-disable */
const path = require('path');
const fs = jest.genMockFromModule('fs');

let mockFiles = [];
function __setMockFiles(newMockFiles) {
  mockFiles = [];
  for (const index in newMockFiles) {
    mockFiles.push(path.basename(newMockFiles[index]));
  }
}

function readdirSync(directoryPath) {
  return mockFiles;
}

function statSync(file) {
  return {
    isFile: () => true
  }
}

function existsSync(file) {
  return true;
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.statSync = statSync;
fs.existsSync = existsSync;

module.exports = fs;