const { createProxyMiddleware } = require("http-proxy-middleware");

const target = "http://localhost:5000";

module.exports = function(app) {
  app.use(
      "/api/socket.io/",
      createProxyMiddleware({
          target,
          ws: true,
          pathRewrite: {
              '^/api/': '/'
          }
      })
  );
  app.use(
    "/api",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        '^/api/': '/'
      }
    })
  );
};
