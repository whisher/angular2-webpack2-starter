const path = require('path');
const fs = require('fs');
module.exports = function(source) {
    this.cacheable();
    const callback = this.async();
    const stylesPath = path.resolve(__dirname,'../src','styles.scss');
    this.addDependency(stylesPath);
    fs.readFile(stylesPath, "utf-8", function(err, header) {
        if(err) return callback(err);
        console.log(header,source);
        callback(null, header + "\n" + source);
    });
};
