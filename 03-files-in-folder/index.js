const fs = require('fs');
const path = require('path');

async function getFilesInfo(folder) {
  try {
    const files = await fs.promises.readdir(folder,{withFileTypes: true});
    console.log('Found files: ');
    files.forEach(file => {
      const filePath = path.join(folder, file.name);
      fs.stat(filePath,(err, stats)=>{
        if(err) throw err;
        if(stats.isFile()) {
          const name = path.parse(filePath).name;
          const size = `${(stats.size/1024).toFixed(2)} KB`;
          const extName = path.extname(filePath).replace('.','');
          console.log(`${name} - ${extName} - ${size}`);
        }
      });
    });
  } catch (error) {
    console.log('Error: ' + error);
  }
}

getFilesInfo(path.join(__dirname,'secret-folder'));
