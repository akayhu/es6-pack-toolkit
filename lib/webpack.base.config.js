const path = require('path');
const fs = require('fs');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
/* eslint-disable */
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
/* eslint-enable */
const {
  PAGE_FOLDER,
  BUILD_FOLDER,
  EJS_FOLDER,
  DEFAULT_TEMPLATE,
  DEFAULT_JS,
  INFO_CHUNK_NAME,
  STATIC_ROOT,
  VIEW_ROOT,
} = require('./config');


/**
 * 掃出指定資料夾路徑下的所有 js 無副檔名清單
 * @param {Object} param - 處理資料，沒指定則使用預設值
 * @param {string} [param.rootPath=PAGE_FOLDER] - 掃描目錄路徑
 * @param {string} param.cwd - node.js進程的當前工作目錄
 * @return {Array} JS 路徑列表 ['src/page/account/account_list', 'src/page/account/account_form']
 */
function scanFolder({ rootPath = PAGE_FOLDER, cwd }) {
  let chunkList = [];
  fs.readdirSync(`${cwd}/${rootPath}`).forEach((file) => {
    const filePath = path.join(`${cwd}/${rootPath}`, file); // 檔案完整路徑
    const fileRelativePath = `${rootPath}/${file}`; // 檔案相對於根目錄路徑
    if (fs.statSync(filePath).isFile()) {
      if (/.js$/.test(file)) {
        // *.js
        chunkList.push(fileRelativePath);
      }
    } else {
      // Folder
      chunkList = chunkList.concat(
        scanFolder({ rootPath: fileRelativePath, cwd }),
      );
    }
  });
  return chunkList;
}
exports.scanFolder = scanFolder;


/**
 * webpack 共用基本設定
 * @param {Object} [param]
 * @param {boolean} [param.production=false] - 是否為生產模式
 * @param {string} [param.viewsFolder=VIEW_ROOT] - bundle 時 view 的根目錄
 * @param {string} [param.staticFolder=STATIC_ROOT] - bundle 時靜態資源的根目錄
 * @returns {Object} webpack config
 */
exports.config = ({
  production = false,
  viewsFolder = VIEW_ROOT,
  staticFolder = STATIC_ROOT,
} = {}) => {
  const isProduction = production === true; // eslint-disable-line no-unused-vars
  const cwd = process.cwd();
  const config = {
    entry: {
      // vendor: [],
    },
    output: {
      path: path.resolve(cwd, BUILD_FOLDER),
      filename: '[name].js',
      publicPath: '',
      chunkFilename: '[name].chunk.js',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.ejs$/, loader: 'ejs-loader',
        }, {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: ['lodash'],
              presets: [['env', { modules: false, targets: { node: 4 } }]],
            },
          },
          exclude: /(node_modules|bower_components)/,
        }, {
          test: /\.json$/,
          use: [
            'json-loader',
          ],
        }, {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: '[path][name].[ext]',
              },
            }, {
              loader: 'img-loader',
              options: {
                minimize: true,
                optimizationLevel: 5,
                progressive: true,
              },
            },
          ],
        }, {
          test: /\.(css|scss)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: { url: false, minimize: true },
              }, {
                loader: 'postcss-loader',
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'), // eslint-disable-line global-require
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 8',
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
              'sass-loader',
            ],
            publicPath: '../',
          }),
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin({
        // filename: 'css/[name].css',
        filename: getPath => (getPath('[name].css').replace('js/', 'css/')),
        allChunks: true,
        disable: false,
      }),
      // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', minChunks: Infinity }),
      new LodashModuleReplacementPlugin(),
    ],
    resolve: {
      modules: ['bower_components', 'node_modules'],
    },
  };

  // 需處理 entry 清單
  const chunkList = scanFolder({ rootPath: PAGE_FOLDER, cwd });

  const pages = chunkList.map((filePath) => {
    const fileName = filePath.replace(/.js$/, '').replace(new RegExp(`^${PAGE_FOLDER}`), '');
    const htmlName = `${viewsFolder}${fileName}`;
    return {
      link: `${htmlName}.html`,
      text: `${htmlName}.html`,
    };
  });

  chunkList.forEach((filePath) => {
    const fileName = filePath.replace(/.js$/, '').replace(new RegExp(`^${PAGE_FOLDER}`), '');
    const chunkName = `${staticFolder}/js${fileName}`;
    const htmlName = `${viewsFolder}${fileName}`;
    // 指定 Bundle Entry
    config.entry[chunkName] = [`./${filePath}`];
    // 指定 ejs 樣板
    const htmlInfo = {
      chunks: [chunkName],
      filename: `${htmlName}.html`,
      inject: 'body',
      hash: true,
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true,
        preserveLineBreaks: true,
      },
      baseTag: '/',
    };
    if (fs.existsSync(`./${EJS_FOLDER}${fileName}.ejs`)) {
      // 自訂樣板存在使用自訂樣板
      htmlInfo.template = `./${EJS_FOLDER}/${fileName}.ejs`;
    } else {
      // 使用預設樣板
      htmlInfo.template = DEFAULT_TEMPLATE;
      htmlInfo.chunkList = pages;
    }
    config.plugins.unshift(new HtmlWebpackPlugin(htmlInfo));
  });

  if (!isProduction) {
    // dev 預設首頁
    config.entry[INFO_CHUNK_NAME] = [DEFAULT_JS]; // eslint-disable-line dot-notation
    config.plugins.unshift(
      new HtmlWebpackPlugin({
        chunks: [INFO_CHUNK_NAME],
        filename: 'index.html',
        template: DEFAULT_TEMPLATE,
        chunkList: pages,
      }),
    );
  }

  return config;
};
