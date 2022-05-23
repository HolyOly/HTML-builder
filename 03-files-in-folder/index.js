const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'secret-folder');
let pathes = [];

fs.readdir(pathToDir, { withFileTypes: true }, (err, files) => {
    if (err)
        console.log(err);
    else {
        console.log('\nCurrent directory filenames:\nname  -  extention  -  size\n---------------------------');
        let count = 0;
        files.forEach(file => {
            if (file.isFile()) {
                let p = path.join(__dirname, 'secret-folder', file.name);
                pathes.push(p);
                fs.stat(pathes[count], (err, stats) => {
                    if (err) console.log(err);
                    console.log(`${file.name.split('.')[0]}  -  ${file.name.split('.')[1]}  -  ${stats.size} bytes`);
                });
                count++;
            }
        });
    }
});
