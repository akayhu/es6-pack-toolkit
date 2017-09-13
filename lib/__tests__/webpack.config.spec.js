import webpackConfig from '../webpack.config';

jest.mock('../config');
jest.mock('fs');
jest.mock('webpack');
jest.mock('extract-text-webpack-plugin');

describe('webpack.config.js', () => {
  beforeEach(() => {
    require('fs').__setMockFiles([ // eslint-disable-line no-underscore-dangle, global-require
      'index.js',
    ]);
    global.process = {
      env: {},
      cwd: () => '/',
    };
  });

  it('production', () => {
    const config = webpackConfig({ production: true, dropConsole: false });
    expect(config).toMatchSnapshot();
  });

  it('development', () => {
    const config = webpackConfig({ production: false });
    expect(config).toMatchSnapshot();
  });
});
