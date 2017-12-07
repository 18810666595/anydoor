const http = require('http');
const path = require('path');
const {port, hostname, root} = require('./config/defaultConfig');
const chalk = require('chalk');
const route = require('./helper/route');

const server = http.createServer((req, res) => {
  /*获取用户的访问的 url*/
  let {url} = req;
  /*用根路径与用户访问的 url 拼接成绝对路径*/
  let filePath = path.join(root, url);
  /*根据用户访问的的绝对路径，匹配不同的路由，返回不同的结果*/
  route(res, filePath);
});

server.listen(port, hostname, () => {
  let url = `http://${hostname}:${port}`;
  console.log(`打开浏览器，访问 ${chalk.green(url)}`);
});


