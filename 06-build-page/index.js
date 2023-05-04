// + 1. Создать папку project-dist
// + 2. Полностью перенести assets
// + 3. Собрать все стили из папки styles в style.css
// 4. Прочитать все файлы из components в массив структур
// 5. Потоково копировать и сохранять template заменяя шаблонные теги
// "John Smith".replace(/(\w+) (\w+)/i, '$2, $1')) // Smith, John

const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'project-dist');
const components = {};

async function copyFile(source, dest, name) {  
  try {
    await fs.promises.mkdir(dest, { recursive: true });    
    await fs.promises.copyFile(path.join(source, name), path.join(dest, name));
  } catch (err) {
    console.error(err.message);
  }  
}
async function copyDir(source, dest, name) {
  try {
    const sourceDir = path.join(source, name);
    const files = await fs.promises.readdir(sourceDir, { withFileTypes: true });
    files.forEach(file => {
      const filePath = path.join(sourceDir, file.name);
      fs.stat(filePath, (err, stats) => {
        if(err) throw err;
        if(stats.isFile()) {
          copyFile(sourceDir, path.join(dest, name), file.name);
        } else if (stats.isDirectory()) {
          copyDir(sourceDir, path.join(dest, name), path.parse(filePath).name);
        }
      });
    });
  } catch (err) {
    console.error(err.message);
  }
}

async function readFromFile(filePath,writer) {
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
async function getStylesFrom(source, dest) {
  try {
    const writer = fs.createWriteStream(dest);
    const files = await fs.promises.readdir(source, { withFileTypes: true });
    files.forEach(file => {
      const filePath = path.join(source, file.name);
      fs.stat(filePath,(err, stats)=>{
        if(err) throw err;
        if(stats.isFile()) {
          const extName = path.extname(filePath).replace('.','');
          if(extName === 'css') {
            readFromFile(filePath, writer);
          }
        }
      });
    });    
  } catch (err) {
    console.error(err.message);
  }
}

async function getDataFromFile(filePath, object) {  
  try {    
    const data = await fs.promises.readFile(filePath, 'utf8');
    components['aaa'] = 124;
    components[path.parse(filePath).name] = data;
  } catch (err) {
    console.error(err.message);
  }
}

(async () => {
  try {
    // create './project-dist' directory
    await fs.promises.mkdir(targetDir, { recursive: true });
    // copy './assets' to './project-dist
    await copyDir(__dirname, targetDir, 'assets');
    // merge './styles' to './project-dist/style.css'
    await getStylesFrom(path.join(__dirname, 'styles'), path.join(targetDir, 'style.css'));
    //read files from './components' to object    
    const files = await fs.promises.readdir(path.join(__dirname, 'components'));
    const components = await getDataFromFiles(files);
    files.forEach(file => {
      const filePath = path.join(__dirname, 'components',file);
      getDataFromFile(filePath, components);
    });
    console.log(components);
  } catch (err) {
    console.error(err.message);
  }
})();
