const { stdout } = process;
const fs = require('fs');
const path = require('path');

const pathToSourceDir = path.join(__dirname, 'files');
const pathToCopyDir = path.join(__dirname, 'files-copy');

function createAndFillDir() {
    fs.mkdir(pathToCopyDir, (err) => {
        if (err) {
            stdout.write('');
        }
        stdout.write(''); //Directory created successfully!
    });
    fs.readdir(pathToSourceDir, (err, files) => {
        if (err)
            stdout.write('');
        else {
            for(let i = 0; i < files.length; i++) {
                fs.copyFile( path.join(__dirname, 'files', files[i]), path.join(__dirname, 'files-copy', files[i]), (err) => {
                    if (err) {
                        stdout.write('');
                    }
                });
            }
        }
    });
}

function removeDir() {
    fs.rm(pathToCopyDir, { recursive:true }, (err) => {
        if(err){
            isCopyDir();
        }
    });
}

function isCopyDir() {
    fs.access(pathToCopyDir, function(error) {
        if (error) {
            createAndFillDir();
        } 
        else {
            removeDir();
            isCopyDir();
        }
    
    });
}
isCopyDir();