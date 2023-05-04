const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'styles');
const targetFile = path.join(__dirname, 'project-dist', 'bundle.css');

const writer = fs.createWriteStream(targetFile);

async function readFile(filePath) {
  try {    
    const stream = fs.createReadStream(filePath, 'utf-8');
    stream.on('data', (chunk) => {
      writer.write(chunk);
    });
    stream.on('error', (error) => console.log('Error: ', error.message));
  } catch (err) {
    console.error(err.message);
  }
}

async function getStylesFrom(folder) {
  try {
    const files = await fs.promises.readdir(folder, { withFileTypes: true });
    files.forEach(file => {
      const filePath = path.join(folder, file.name);
      fs.stat(filePath,(err, stats)=>{
        if(err) throw err;
        if(stats.isFile()) {
          const extName = path.extname(filePath).replace('.','');
          if(extName === 'css') {
            readFile(filePath);
          }
        }
      });
    });
    console.log(`SUCSESS: all styles imported to ${targetFile}`);
  } catch (err) {
    console.error(err.message);
  }
}
getStylesFrom(sourceDir);