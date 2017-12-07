const http = require('http');
const path = require('path');
const fs = require('fs');
const {port, hostname, root} = require('./config/defaultConfig');
const chalk = require('chalk');
const {promisify} = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);


const server = http.createServer((req, res) => {
  /*获取用户的访问的 url*/
  let {url} = req;
  /*用根路径与用户访问的 url 拼接成绝对路径*/
  let filePath = path.join(root, url);

  route(res, filePath);
});

server.listen(port, hostname, () => {
  let url = `http://${hostname}:${port}`;
  console.log(`打开浏览器，访问 ${chalk.green(url)}`);
});


async function route(res, filePath) {
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
}
