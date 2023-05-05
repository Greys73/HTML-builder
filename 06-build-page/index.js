// TODO:
/* 
 + 1. Создать папку project-dist
 + 2. Полностью перенести assets
 + 3. Собрать все стили из папки styles в style.css
 + 4. Прочитать все файлы из components в объект
 + 5. Прочитать template и заменить шаблонные теги на данные из п.4 
 */

const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'project-dist');

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

async function getDataFromFile(filePath) {  
  try {    
    const data = await fs.promises.readFile(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(err.message);
  }
}
async function saveDataToFile(data, filePath) {
  try {    
    await fs.promises.writeFile(filePath, data, 'utf8');
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
    const components = {};
    const files = await fs.promises.readdir(path.join(__dirname, 'components'), { recursive: true });    
    await Promise.all(
      files.map(async (file) => {        
        const res = await getDataFromFile(path.join(__dirname, 'components',file));
        components[path.parse(file).name] = res;
      })
    );    
    // read ./template.html
    let resultHTML = await getDataFromFile(path.join(__dirname, 'template.html'));    
    resultHTML = resultHTML.replace(/{{(\w+)}}/g, (str) => {
      const file = str.replace(/[{}]/g,'');
      if(file in components) {
        return components[file];
      }
    });
    // save index.html
    await saveDataToFile(resultHTML, path.join(targetDir, 'index.html'));
    // result message
    console.log(`SUCSESS: HTML-page was build in ${targetDir}`);
  } catch (err) {
    console.error(err.message);
  }
})();
