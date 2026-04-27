const rewire = require("rewire");
const defaults = rewire("react-scripts/scripts/build.js"); // If you ejected, use this instead: const defaults = rewire('./build.js')
let config = defaults.__get__("config");

config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
};

// Move runtime into bundle instead of separate file
config.optimization.runtimeChunk = false;

// JS
config.output.filename = "static/js/[name].js";
// CSS. "5" is MiniCssPlugin
config.plugins[5].options.filename = "static/css/[name].css";
