const fs = require('fs');
const includeFiles = (dir, file) => {
    file = file || [];
    const inputs = fs.readdirSync(dir);
    for (var i in inputs) {
        var name = dir + '/' + inputs[i];
        if (fs.statSync(name).isDirectory()){
            includeFiles(name, file);
        } else {
            file.push(name);
            if (name.match(/\.spec.js$/) === null) {
                console.log(`Skipping ${name} as it's not ends with .spec.js`);
            } else {
              require(name);
            }
        }
    }
    return file;
}

module.exports = includeFiles;
