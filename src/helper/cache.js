const {cache} = require('../config/defaultConfig');

function refreshRes(stats, res) {
  const {maxAge, expires, cacheControl, lastModified, etag} = cache;

  if (expires) {
    res.setHeader('Expires', new Date((Date.now() + maxAge * 1000)).toUTCString());
  }

  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }

  if (lastModified) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString());
  }

  if (etag) {
    res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
  }
}

module.exports = function isFresh(stats, req, res) {
  refreshRes(stats, res);

  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];

  /*如果是第一次请求，没有 lastModified 和 etag*/
  if (!lastModified && !etag) {
    return false;
  }

  /*如果有 lastModified 但是和原来的不一样*/
  else if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }

  /*如果有 etag 但是和原来的不一样*/
  else if (etag && etag !== res.getHeader('ETag')) {
    return false;
  }

  return true;

};
