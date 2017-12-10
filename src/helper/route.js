const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const {root, compressType} = require('../config/defaultConfig');
/*引入 handlebars*/
const Handlebars = require('handlebars');
/*模板页面的路径*/
const tplPath = path.join(__dirname, '../template/dir.hbs');
/*读取模板内容，转成 utf8 的格式*/
const source = fs.readFileSync(tplPath, 'utf8');
/*用 handlebars 的 compile 方法来编译模板*/
const template = Handlebars.compile(source);
const mimeType = require('./mime.js');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

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
          files: files.map(file => {
            return {
              file,
              icon: mimeType(file)
            };
          })   /*files 是一个数组，为文件列表*/
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
      let contentType = mimeType(filePath);
      // res.writeHead(200, 'file', {
      //   'Content-Type': `${contentType}; charset=utf8`
      // });
      res.setHeader('Content-Type', `${contentType}; charset=utf8`);
      // let rs = fs.createReadStream(filePath);
      let rs;
      const {code, start, end} = range(stats.size, req, res);

      /*判断 res 是否新鲜，如果新鲜则返回 304*/
      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, {
          start,
          end
        });
      }
      if (filePath.match(compressType)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
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
