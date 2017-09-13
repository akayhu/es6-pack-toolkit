const webpack = jest.genMockFromModule('webpack');

webpack.optimize = {
  UglifyJsPlugin: options => options,
};


webpack.DefinePlugin = options => options;
webpack.HotModuleReplacementPlugin = options => options;
webpack.NoEmitOnErrorsPlugin = options => options;
webpack.NamedModulesPlugin = options => options;

module.exports = webpack;
