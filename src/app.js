const http = require('http');
const {port, hostname} = require('./config/defaultConfig');
const chalk = require('chalk');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': "text/html; charset=utf8"
  });
  res.write('<h1>标题1</h1>');
  res.write('<h1>标题1</h1>');
  res.write('<h1>标题1</h1>');
  res.write('<h1>标题1</h1>');
  res.write('<h1>标题1</h1>');
  res.write('<h1>标题1</h1>');
  res.write('<h1>标题1</h1>');
  res.write('<h1>标题1</h1>');
  res.write('<h1>标题1</h1>');
  res.end();
});

server.listen(port, hostname, () => {
  let url = `http://${hostname}:${port}`;
  console.log(`打开浏览器，访问 ${chalk.green(url)}`);
});
