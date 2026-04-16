const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://hiddencost-backend.onrender.com',
      changeOrigin: true,
      logLevel: 'silent',          // suppresses proxy noise in terminal
      onError: (err, req, res) => {
        // Backend offline — return a clean 503 instead of crashing the proxy
        if (!res.headersSent) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Backend unavailable' }));
        }
      },
    })
  );
};