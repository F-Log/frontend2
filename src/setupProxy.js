const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy endpoints starting with "/api" to the target "http://localhost:8080"
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080', // The server URL or localhost:configured_port_number
      changeOrigin: true,
    })
  );

  // Proxy endpoints starting with "/ocr" to the target "http://localhost:5000"
  app.use(
    '/ocr',
    createProxyMiddleware({
      target: 'http://localhost:5000', // The OCR server URL or localhost:configured_port_number
      changeOrigin: true,
    })
  );
};
