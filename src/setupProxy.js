
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://43.138.68.84:8082', 
      changeOrigin: true,
    })
  );
};

