const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyFile(fileName) {  
  try {
    await fs.promises.mkdir(targetDir, { recursive: true });
    await fs.promises.copyFile(path.join(sourceDir, fileName), path.join(targetDir, fileName));
  } catch (err) {
    console.error(err.message);
  }  
}

async function copyDir(folder) {
  try {
    await fs.promises.rmdir(targetDir, { recursive: true });
    const files = await fs.promises.readdir(folder, { withFileTypes: true });
    files.forEach(file => {
      copyFile(file.name);
    });
    console.log(`SUCCESS: all files was copied from ${ sourceDir } to ${ targetDir }`);
  } catch (err) {
    console.error(err.message);
  }
}

copyDir(sourceDir);