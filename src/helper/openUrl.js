const {exec} = require('child_process');

module.exports = function (url) {
  switch (process.platform) {
    case 'darwin':  //如果是 mac
      exec(`open ${url}`);
      break;
    case 'win32':
      exec(`start ${url}`);
      break;
  }
};
