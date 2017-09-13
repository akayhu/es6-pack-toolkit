const path = require('path');
const express = require('express');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const opener = require('opener');
const fse = require('fs-extra');
const del = require('del');
const {
  PUBLIC_FOLDER,
  BUILD_FOLDER,
  SRC_FOLDER,
  VIEW_ROOT,
  STATIC_ROOT,
} = require('./config');

/**
 * @class
 */
module.exports = class Runner {
  /**
   * Creates an instance of Runner.
   * @param {Object} [param]
   * @param {boolean} [param.dev=false] - 是否為開發模式
   * @param {boolean} [param.dropConsole=false] - 生產模式時是否移除所有 console
   * @param {number|string} [param.port=8888] - Http Server Port
   * @param {string} [param.viewsFolder=VIEW_ROOT] - bundle 時 view 的根目錄
   * @param {string} [param.staticFolder=STATIC_ROOT] - bundle 時靜態資源的根目錄
   * @param {completeCallback} cb - bundle 時靜態資源的根目錄
   */
  constructor({
    dev = false,
    dropConsole = false,
    port = 8888,
    viewsFolder = VIEW_ROOT,
    staticFolder = STATIC_ROOT,
    cb,
  } = {}) {
    const cwd = process.cwd();
    const config = webpackConfig({
      production: !dev,
      dropConsole,
      viewsFolder,
      staticFolder,
    });

    if (dev) {
      Object.keys(config.entry).forEach((key) => {
        config.entry[key].unshift(
          `webpack-dev-server/client?http://localhost:${port}/`,
          'webpack/hot/dev-server',
        );
      });
    }
    const compiler = webpack(config);
    if (!dev) {
      // production build
      del.sync([path.join(cwd, BUILD_FOLDER)]);
      compiler.run((err, stats) => {
        if (err) console.error(err);
        if (fse.existsSync(path.join(cwd, PUBLIC_FOLDER))) {
          fse.copySync(
            path.join(cwd, PUBLIC_FOLDER),
            path.join(cwd, BUILD_FOLDER),
          );
        }
        if (cb) cb.call(null, stats.endTime - stats.startTime);
      });
    } else {
      // creat server
      this.server = new WebpackDevServer(compiler, {
        hot: true,
        stats: { colors: true },
        publicPath: config.output.publicPath,
        contentBase: path.join(cwd, SRC_FOLDER),
        compress: true, // use gzip compression
        watchOptions: {
          aggregateTimeout: 300,
          ignored: /node_modules/,
          poll: 1000,
        },
        setup(app) {
          // 設定 Express middleware
          app.use(express.static(path.join(cwd, PUBLIC_FOLDER)));
        },
      });
    }
    this.port = port;
  }

  /**
   * 啟動 develop server 和開啟網址
   */
  start() {
    if (this.server) {
      this.server.listen(this.port, '0.0.0.0', (error) => {
        if (error) console.error(error);
        opener(`http://0.0.0.0:${this.port}`);
      });
    }
  }
};


/**
 * @callback completeCallback
 * @param {number|string} responseMessage - 回傳訊息
 */
