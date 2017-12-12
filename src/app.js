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
    const server = http.createServer((req, res) => {
      /*用根路径与用户访问的 url 拼接成绝对路径*/
      let filePath = path.join(this.conf.root, req.url);
      /*根据用户访问的的绝对路径，匹配不同的路由，返回不同的结果*/
      route(req, res, filePath, this.conf);
    });

    server.listen(this.conf.port, this.conf.hostname, () => {
      let url = `http://${this.conf.hostname}:${this.conf.port}`;
      console.log(`打开浏览器，访问 ${chalk.green(url)}`);
    });

  }
}

module.exports = Server;




