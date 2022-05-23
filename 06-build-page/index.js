const fs = require('fs');
const path = require('path');
const fsp = require('fs').promises;

const pathToProject = path.join(__dirname, 'project-dist');
const pathToHTML = path.join(__dirname, 'project-dist', 'index.html');
const pathToStyles = path.join(__dirname, 'project-dist', 'style.css');
const pathToSourceAssets = path.join(__dirname, 'assets');
const pathToCopyAssets = path.join(__dirname, 'project-dist', 'assets');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToSourceCSS = path.join(__dirname, 'styles');
const pathToArticles = path.join(__dirname, 'components', 'articles.html');
const pathToFooter = path.join(__dirname, 'components', 'footer.html');
const pathToHeader = path.join(__dirname, 'components', 'header.html');

function createHtmlFile() {
    fs.writeFile(pathToHTML, '', function (err) {
        if (err) console.log(err);
        return;
    });
}

function createCssFile() {
    fs.writeFile(pathToStyles, '', function (err) {
        if (err) console.log(err);
        return;
    });
}

function fillAssets() {
    fs.readdir(pathToSourceAssets, {withFileTypes: true}, (err, files) => {
        files.forEach(item => {
            if (item.isDirectory()) {
                fs.mkdir(path.join(pathToCopyAssets, item.name), {recursive: true}, (err) => {
                    if (err) {
                        return console.error(err);
                    }

                    let dirPathFrom = path.join(pathToSourceAssets, item.name);
                    let dirPathTo = path.join(pathToCopyAssets, item.name);

                    fs.readdir(dirPathFrom, {withFileTypes: true}, (err, files) => {
                        files.forEach(item => {
                            if (item.isFile()) {
                                fs.copyFile(path.join(dirPathFrom, item.name), path.join(dirPathTo, item.name), (err) => {
                                    if (err) {
                                        return console.error(err);
                                    }
                                });
                            } 
                        });
                    });
                });
            } 
        });
    });
}

async function read() {
    let dataHeader = await fsp.readFile(pathToHeader, 'utf-8').catch((err) => console.error('Failed to read file', err));
    let dataArticles = await fsp.readFile(pathToArticles, 'utf-8').catch((err) => console.error('Failed to read file', err));
    let dataFooter = await fsp.readFile(pathToFooter, 'utf-8').catch((err) => console.error('Failed to read file', err));

    let dataPage = await fsp.readFile(pathToTemplate, 'utf-8').catch((err) => console.error('Failed to read file', err));

    dataPage = dataPage.replace(/{{header}}/g, dataHeader.toString());
    dataPage = dataPage.replace(/{{articles}}/g, dataArticles.toString());
    dataPage = dataPage.replace(/{{footer}}/g, dataFooter.toString());

    await fs.writeFile(pathToHTML, dataPage.toString(), 'utf8', function (err) {
        if (err) {
            console.log(err);
            return;
        }
    });
}

function copyCSSFiles() {
    fs.readdir(pathToSourceCSS, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log(err);
            return;
        }
        else {
            files.forEach(file => {
                let data = '';
                if (file.name.includes('.css') && file.isFile()) {
                    const stream = fs.createReadStream(path.join(pathToSourceCSS, file.name), 'utf-8');
                    stream.on('data', chunk => data += chunk);
                    stream.on('end', () => fs.writeFile(pathToStyles, data, { flag: 'a+' }, err => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    }));
                    stream.on('error', error => {
                        if (error) {
                            console.log(error);
                            return;
                        }
                    });
                }
            });
        }
    });
}

function fillProject() {
    fs.access(pathToProject, function(err) {
        if (err) {
            if (err.code != 'ENOENT') {
                console.log('other error', err);
                return;
            }

            fs.mkdir(pathToCopyAssets, { recursive: true }, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
        
                createHtmlFile();
                createCssFile();
                fillAssets();
                read();
                copyCSSFiles();   
            });

            return;
        }

        fillAssets();
        read();
        copyCSSFiles();    
    });
}

fillProject();