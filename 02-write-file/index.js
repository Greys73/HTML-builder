const process = require ('process');
const readline = require ('readline');
const fs = require('fs');
const path = require('path');

const fileName = 'output.txt';
const filePath = path.join(__dirname, fileName);

const reader = readline.createInterface(process.stdin, process.stdout);
const writer = fs.createWriteStream(filePath);

console.log('Write some text:');
reader.on('line',(data) => {
  if(data.toString().trim() === 'exit'){
    process.exit();
  }
  writer.write(`${data}\n`);
});

process.on('exit', () => {
  console.log(`\nSUCCESS: text was saved to ${filePath}`);
});

process.on('SIGINT', () => {
  process.exit();
});