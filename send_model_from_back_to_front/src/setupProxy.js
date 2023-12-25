
const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = {
//   pluginOptions:{
//     electronBuilder:{
//       nodeIntegration:true
//     }
//   },
//   devserver:{
//     before: (app) => {
//       app.use(
//         '/api',
//         createProxyMiddleware({
//           target: 'http://43.138.68.84:8081', 
//           changeOrigin: true,
//         })
//       );
//     }
//   }
// }

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://43.138.68.84:8081', 
      changeOrigin: true,
    })
  );
};

