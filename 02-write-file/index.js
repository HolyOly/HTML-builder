const { stdin: input, stdout: output } = require('process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input, output });

console.log('Пожалуйста, введите любой текст');
rl.on('line', function(input) {
    if (!input || input == 'exit') {
        rl.close();
        return;
    }
    fs.appendFile(path.join(__dirname, 'write-file.txt'), input+'\n', function(err) {
        if (err) {
            console.log(err);
        }
    });
});

rl.on('close', function() {
    console.log('\nBye!');
});

