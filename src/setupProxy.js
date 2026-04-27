const { createProxyMiddleware } = require("http-proxy-middleware");

/**
 * target need to be changed upon production
 */
const signServerProxy = {
  target: "https://demo.signingcloud.com:9443",
  //target: "http://localhost:5005",
  changeOrigin: true,
  onProxyReq: (proxReq, req, res) => {
    proxReq.removeHeader("referer");
  },
  headers: { 'Content-Security-Policy': "base-uri 'self'" }
};

/**
 * "/signserver2" need to be changed upon production
 */
module.exports = function(app) {
  app.use("/signserver", createProxyMiddleware(signServerProxy));
};
