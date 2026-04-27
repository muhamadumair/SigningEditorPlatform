const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");


module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Determine the filename based on the condition
      const jsFilename = "static/js/editor.js";

      // Update the output filename in webpack configuration
      webpackConfig.output.filename = jsFilename;

      // You can also update the CSS filename here if needed
      const cssFilename = "static/css/editor.css";

      // Find the plugin responsible for CSS and update the filename
      const cssPluginIndex = webpackConfig.plugins.findIndex(
        (plugin) =>
          plugin.constructor &&
          plugin.constructor.name === "MiniCssExtractPlugin"
      );

      if (cssPluginIndex !== -1) {
        webpackConfig.plugins[cssPluginIndex].options.filename = cssFilename;
      }

        // Minify JavaScript using TerserPlugin
        webpackConfig.optimization.minimizer.push(
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // Remove console statements
                drop_debugger: true, // Remove debugger statements
                // You can add more compress options as needed
              },
              output: {
                comments: false, // Remove comments
                // preamble: "", // Optional preamble
                // You can add more output options as needed
              },
              mangle: {
                toplevel: true, // Mangle top-level variable names
                properties: false, // Don't mangle property names
                // You can add more mangle options as needed
              },
              ecma: 2020, // ECMAScript version
              // Add more terser options as needed
            },
          })
        );

        // Minify CSS using OptimizeCSSAssetsPlugin
        webpackConfig.optimization.minimizer.push(
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              preset: ["default", { discardComments: { removeAll: true } }],
              safe: true, // Enable safe CSS minification
              level: 2, // Use advanced minification level
              rebase: true, // Enable URL rebasing
              // Add more CSS processor options as needed
            },
            // Enable source map generation for CSS
            canPrint: true,
          })
        );
      
      return webpackConfig;
    },
  },
};
