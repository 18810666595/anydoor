const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const {root} = require('../config/defaultConfig');
/*引入 handlebars*/
const Handlebars = require('handlebars');
/*模板页面的路径*/
const tplPath = path.join(__dirname, '../template/dir.hbs');
/*读取模板内容，转成 utf8 的格式*/
const source = fs.readFileSync(tplPath, 'utf8');
/*用 handlebars 的 compile 方法来编译模板*/
const template = Handlebars.compile(source);

async function route(req, res) {
  /*获取用户的访问的 url*/
  let {url} = req;
  /*用根路径与用户访问的 url 拼接成绝对路径*/
  let filePath = path.join(root, url);
  try {
    const stats = await stat(filePath);
    /*判断是文件还是文件夹*/
    if (stats.isDirectory()) {
      /*如果是文件夹，则给出文件列表*/
      try {
        const files = await readdir(filePath);
        let dir = path.relative(root, filePath);
        let data = {
          title: path.basename(filePath), /*title 为文件名*/
          dir: dir ? `/${dir}` : '', /*title 为文件所在的文件夹路径*/
          files   /*files 是一个数组，为文件列表*/
        };

        res.writeHead(200, 'directory', {
          'Content-Type': 'text/html; charset=utf8'
        });
        /*渲染 template 模板引擎*/
        res.end(template(data));
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

module.exports = route;
