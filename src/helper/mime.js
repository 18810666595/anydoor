const path = require('path');

const mimeLists = {
  css: 'text/css',
  html: 'text/html',
  js: 'text/javascript',
  xml: 'text/xml',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/jpeg',
  json: 'application/json'
};


function mimeType(filepath) {
  let ext = path.extname(filepath)
    .split('.')   // jquery.min.js
    .pop()        //取最后的那个为扩展名
    .toLocaleLowerCase(); //转成小写

  if (!ext) {
    ext = path.basename(filepath);
  }

  return mimeLists[ext] || 'text/plain';

}

module.exports = mimeType;
