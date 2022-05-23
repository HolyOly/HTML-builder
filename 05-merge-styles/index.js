const fs = require('fs');
const path = require('path');

const pathToStyles = path.join(__dirname, 'styles');
const dirBundle = path.join(__dirname, 'project-dist');
const pathToBundle = path.join(dirBundle, 'bundle.css');
let arrOfStyles = [];
let arrOfPaths = [];

function readAndWriteStyles() {
    fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
        if (err)
            return console.error(err);
        else {
            files.forEach(file => {
                if (file.name.includes('.css') && file.isFile()) {
                    arrOfStyles.push(file.name);
                }
            });

            for (let i = 0; i < arrOfStyles.length; i++) {
                arrOfPaths.push(path.join(__dirname, 'styles', arrOfStyles[i]));
            }
            for (let i = 0; i < arrOfPaths.length; i++) {
                let data = '';
                const stream = fs.createReadStream(arrOfPaths[i], 'utf-8');
                stream.on('data', chunk => data += chunk);
                stream.on('end', () => fs.writeFile(pathToBundle, data, { flag: 'a+' }, err => {
                    if (err) {
                        return console.error(err);
                    }
                }));
                stream.on('error', error => console.log(error));
            }
            
        }
    });
}

function main() {
    fs.mkdir(dirBundle, {recursive: true}, (err) => {
        if (err) {
            return console.error(err);
        }

        fs.writeFile(pathToBundle, '', function (err) {
            if (err) {
                return console.log(err);
            }
    
            readAndWriteStyles();
        });
    });
}

main();