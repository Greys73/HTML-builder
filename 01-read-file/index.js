const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);

let data = '';

const stream = fs.createReadStream(filePath, 'utf-8');
stream.on('data', (chunk) => data += chunk);
stream.on('end', () => console.log(data));
stream.on('error', (error) => console.log('Error: ', error.message));