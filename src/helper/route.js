const fs = require('fs');
const {promisify} = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);


module.exports = async function route(res, filePath) {
  try {
    const stats = await stat(filePath);
    /*判断是文件还是文件夹*/
    if (stats.isDirectory()) {
      /*如果是文件夹，则给出文件列表*/

      try {
        const files = await readdir(filePath);
        res.writeHead(200, 'directory', {
          'Content-Type': 'text/plain; charset=utf8'
        });
        res.end(files.join('\n'));
      }

      catch (err) {
        console.log(err);
      }
    }
    if (stats.isFile()) {
      /*如果是文件，则返回文件内容*/
      res.writeHead(200, 'file', {
        'Content-Type': 'text/plain; charset=utf8'
      });
      fs.createReadStream(filePath).pipe(res);
    }

  }

  catch (err) {
    res.writeHead(404, 'error', {
      'Content-Type': 'text/html; charset=utf8'
    });
    res.end(`${filePath} 不找到文件或文件夹`);
  }
};
