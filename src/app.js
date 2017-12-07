const http = require('http');
const path = require('path');
const fs = require('fs');
const {port, hostname, root} = require('./config/defaultConfig');
const chalk = require('chalk');

const server = http.createServer((req, res) => {
  /*获取用户的访问的 url*/
  let {url} = req;
  /*用根路径与用户访问的 url 拼接成绝对路径*/
  let filePath = path.join(root, url);

  /*判断是文件还是文件夹*/
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, 'error', {
        'Content-Type': 'text/html; charset=utf8'
      });
      res.end(`${filePath} 不找到文件或文件夹`);
      return;
    }
    if (stats.isDirectory()) {
      /*如果是文件夹，则给出文件列表*/
      fs.readdir(filePath, (err, files) => {
        res.writeHead(200, 'directory', {
          'Content-Type': 'text/plain; charset=utf8'
        });
        res.end(files.join('\n'));
      });
    }
    if (stats.isFile()) {
      /*如果是文件，则返回文件内容*/
      res.writeHead(200, 'file', {
        'Content-Type': 'text/plain; charset=utf8'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(port, hostname, () => {
  let url = `http://${hostname}:${port}`;
  console.log(`打开浏览器，访问 ${chalk.green(url)}`);
});
