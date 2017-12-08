const http = require('http');

const {port, hostname} = require('./config/defaultConfig');
const chalk = require('chalk');
const route = require('./helper/route');

const server = http.createServer((req, res) => {
  /*根据用户访问的的绝对路径，匹配不同的路由，返回不同的结果*/
  route(req, res);
});

server.listen(port, hostname, () => {
  let url = `http://${hostname}:${port}`;
  console.log(`打开浏览器，访问 ${chalk.green(url)}`);
});


