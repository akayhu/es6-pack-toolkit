module.exports = {

  // env production
  ENV_PRODUCTION: 'production',

  // env development
  ENV_DEVELOPMENT: 'development',

  // source資料夾
  SRC_FOLDER: 'src',

  // 預設主程式資料夾
  PAGE_FOLDER: 'src/page',

  // 預設主程式對應 ejs 樣板資料夾
  EJS_FOLDER: 'src/ejs',

  // 其他靜態資源資料夾 jpg, png, css, js...
  PUBLIC_FOLDER: 'public',

  // Bundle & Build 統一整理輸出資料夾
  BUILD_FOLDER: 'build',

  // 無對應 ejs 樣板時的預設樣板
  DEFAULT_TEMPLATE: `${__dirname}/template/_default.ejs`,

  // 預設首頁清單頁的主程式，主要顯示 espack 資訊
  DEFAULT_JS: `${__dirname}/template/_about.js`,

  // 預設首頁清單頁的 chunk 名稱
  INFO_CHUNK_NAME: '__about__',

  // Bundle 後所有靜態資源根目錄
  STATIC_ROOT: '__static__',

  // Bundle 後所有 html 根目錄
  VIEW_ROOT: '__views__',

};
