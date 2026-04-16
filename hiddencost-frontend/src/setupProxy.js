const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Use localhost for development, deployed URL for production
  const backendUrl = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api', // Keep /api in the path
      },
      logLevel: 'info',
      onError: (err, req, res) => {
        console.error(`[Proxy Error] ${err.message}`);
        // Backend offline — return a clean 503 instead of crashing the proxy
        if (!res.headersSent) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false,
            error: 'Backend unavailable. Please try again later.' 
          }));
        }
      },
    })
  );
};