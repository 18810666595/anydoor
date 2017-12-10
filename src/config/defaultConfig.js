const defaultConfig = {
  root: process.cwd(),
  hostname: '127.0.0.1',
  port: 9527,
  compressType: /\.(html|css|js|md|json|jpg|jpeg|png)$/,
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
};

module.exports = defaultConfig;
