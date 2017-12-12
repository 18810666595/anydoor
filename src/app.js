const http = require('http');
const path = require('path');
const conf = require('./config/defaultConfig');
const chalk = require('chalk');
const route = require('./helper/route');

class Server {
  constructor(config) {
    this.conf = Object.assign({}, conf, config);
  }

  start() {
    const {root,port,hostname}=this.conf;

    const server = http.createServer((req, res) => {
      /*用根路径与用户访问的 url 拼接成绝对路径*/
      let filePath = path.join(root, req.url);
      /*根据用户访问的的绝对路径，匹配不同的路由，返回不同的结果*/
      route(req, res, filePath, this.conf);
    });

    server.listen(port, hostname, () => {
      let url = `http://${hostname}:${port}`;
      console.log(`打开浏览器，访问 ${chalk.green(url)}`);
    });

  }
}

module.exports = Server;




