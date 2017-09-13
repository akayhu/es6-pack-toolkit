const webpack = require('webpack');
const baseConfig = require('./webpack.base.config').config;
const {
  ENV_PRODUCTION,
  ENV_DEVELOPMENT,
  SRC_FOLDER,
  VIEW_ROOT,
  STATIC_ROOT,
} = require('./config');

/**
 * webpack 共用基本設定
 * @param {Object} [param]
 * @param {boolean} [param.production=false] - 是否為生產模式
 * @param {boolean} [param.dropConsole=false] - 生產模式時是否移除所有 console
 * @param {string} [param.viewsFolder=VIEW_ROOT] - bundle 時 view 的根目錄
 * @param {string} [param.staticFolder=STATIC_ROOT] - bundle 時靜態資源的根目錄
 * @returns {Object} webpack config
 */
module.exports = ({
  production = false,
  dropConsole = false,
  viewsFolder = VIEW_ROOT,
  staticFolder = STATIC_ROOT,
} = {}) => {
  const isProduction = production === true;
  process.env.NODE_ENV = isProduction ? ENV_PRODUCTION : ENV_DEVELOPMENT;
  const config = baseConfig({
    production,
    viewsFolder,
    staticFolder,
  });

  if (isProduction) {
    // production
    config.devtool = 'nosources-source-map';
    // 壓縮醜化js
    config.plugins.unshift(
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
          screw_ie8: false,
          warnings: false,
          dead_code: true,
          drop_console: dropConsole || false, // 移除 console
        },
        sourceMap: false,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(ENV_PRODUCTION),
      }),
    );
  } else {
    // development
    config.devServer = {
      contentBase: `./${SRC_FOLDER}`,
      hot: true,
    };
    config.plugins.unshift(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(ENV_DEVELOPMENT),
      }),
    );
  }

  return config;
};
