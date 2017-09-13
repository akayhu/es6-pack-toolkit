# 104-f2e-es6-pack-toolkit &middot; [![Build Status](https://travis-ci.com/104corp/104-f2e-es6-pack-toolkit.svg?token=HvhmsWaMptMBAKRxkphy&branch=master)](https://travis-ci.com/104corp/104-f2e-es6-pack-toolkit)

## Pack Toolkit 使用情境：

1. server side 前後分離開發建置
2. ie8 需求，前端建置
3. javascript es2015 語法
4. 對應 VIP 製作文件拆分需求


## 功能

* Bundle 工具
* 支援 IE 8 瀏覽器以上。
* 使用 javascript es2015 語法。
* 使用 webpack 拆分 javascript module，使用前端 unit test 工具 jest。
* 使用 Airbnb 所提供的 javascript 語法檢查。
* 模擬與後端合作狀況，拆分 view 結構。


## 開發工具

* pack tool - [webpack 3](https://webpack.js.org/)
* test tool - [jest](https://facebook.github.io/jest/)
* cmd tool - [commander](https://www.npmjs.com/package/commander)
* view engin - [ejs](http://www.embeddedjs.com/)
* style tool - [sass](http://sass-lang.com/)

## 環境需求

* node >= 6.0.0

## 使用步驟

```
$ mkdir my-app
$ cd my-app
$ npm init -y
$ npm install git+https://github.com/104corp/104-f2e-es6-pack-toolkit.git
```

> 建立檔案結構

```
.
└── src
    └── page
         └── index.js

# ./src/page/index.js
alert('Hello!');
```

> 設定 scripts

```
# package.json
"scripts": {
  "dev": "espack dev",
  "build": "espack build"
}

# 更多 bundle 設定選擇
# bundle 時將 html 預設資料夾路徑 __views__ 名稱改為 vip
# bundle 時將靜態檔案預設資料夾路徑 __static__ 名稱改為 .
"scripts": {
  "dev": "espack dev -v vip -s .",
  "build": "espack build -v vip -s ."
}
```

> 啟動 Develop Server

```
$ npm run dev
# 指定啟動 port
$ npm run dev -- -p 1234
```

> help

```
＄ npm run dev -- -h
```

> 發佈 production 檔案至 ./build

```
＄ npm run build
# build 時移除程式中所有 console
$ npm run build -- -d
```

## 更多可用細節規範

> 完整可用檔案結構 [example](https://github.com/104corp/104-f2e-es6-pack-toolkit/tree/example)

```
.
├── src
│   ├── page
│   │    └── account
│   │         ├── account_list.js
│   │         └── account_form.js
│   └── ejs
│        └── account
│             ├── account_list.ejs
│             └── account_form.ejs
└── public
    └── __static__
         ├── img
         │    ├── *.jpg
         │    └── *.png
         ├── js
         │    └── vender.js
         └── other
```

|    資料夾    |   說明   |
| :--------------- | :---------------------- |
| ./src/page/*.js  |   各主程式放置資料夾      |
| ./src/ejs/*.ejs  |   各對應主程式 html 樣板  |
| ./public/*       |   靜態檔案存放資料夾      |


Toolkit 自動掃 `./src/page` 之下所有資料夾層 `*.js` 檔案，接著尋找 `./src/ejs` 中對應樣板，不存在時會自動使用預設頁面，測試網址會相對於 `page` 內檔案路徑並在 `__views__` 之下。


## 打包後結構

依照 VIP 需求 `npm run build` 之後會將檔案分類成 `__views__` 與 `__static__` 資料夾

|    資料夾    |   說明   |
| :--------------- | :---------------------- |
| `__views__`      |   對應後端的 views 樣板資料夾      |
| `__static__`     |   對應後端 STATIC_VIP_PATH 靜態檔案位置路徑  |

此結構方便讓後端做近一步檔案整合，但主要讓前端依照實際檔案結構在本地端來做開發，統一檔案拆分方式。