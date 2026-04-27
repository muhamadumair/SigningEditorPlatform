const { createProxyMiddleware } = require("http-proxy-middleware");

/**
 * target need to be changed upon production
 */
const signServerProxy = {
  // Set the target to your sign-server backend (e.g. via env var or config).
  target: process.env.REACT_APP_SIGN_SERVER_URL || "http://localhost:5005",
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
