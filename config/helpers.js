const path = require('path');

const _root = path.resolve(__dirname, '..');
const root = (...args) => {
  return path.join.apply(path, [_root].concat(args));
}
function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server/.exec(process.argv[1]));
}
exports.root = root;
exports.isWebpackDevServer = isWebpackDevServer;
