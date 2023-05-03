/*const process = require ('process');
const readline = require ('readline');
const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);

const output = fs.createWriteStream(filePath);
const rl = readline.createInterface(process.stdin, process.stdout);

// Начинаем чтение из stdin, чтобы процесс не завершился.
// process.stdin.resume();

process.on('SIGINT', () => {
  console.log('SUCCESS: text was saved to ' + fileName);
  process.exit(1);
});*/
const readline = require ('readline');

const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = () => {
  console.log(
    '\n',
    values
      .filter((val) => val.startsWith(rl.line))
      .join(' ')
  );
};
process.stdin.on('keypress', (c, k) => {
  showResults();
});