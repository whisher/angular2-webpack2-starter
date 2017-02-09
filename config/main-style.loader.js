const fileLoader = require('file-loader');
const path = require('path');
const fs = require('fs');
module.exports = function(content) {
  this.cacheable && this.cacheable();
	this.value = content;
  const stylesPath = path.resolve(__dirname,'../src','styles.scss');
  var buf = fs.readFileSync(stylesPath, 'utf8');
  return buf;
  //return "module.exports = " + JSON.stringify(buf);
  //return  fileLoader('../src/styles.scss');
};
