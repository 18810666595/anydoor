const {createGzip, createDeflate} = require('zlib');

function compress(rs, req, res) {
  const {headers} = req;
  const acceptEncoding = headers['accept-encoding'];
  if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
    return rs;
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    res.setHeader('Content-Encoding', 'gzip');
    return rs.pipe(createGzip());
  } else if (/\bdeflate\b/) {
    res.setHeader('Content-Encoding', 'deflate');
    return rs.pipe(createDeflate());
  }
}

module.exports = compress;
