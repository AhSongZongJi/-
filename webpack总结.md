# webpack
```js
// webpack 是一种前端资源构建工具 ， 一个静态模块打包工具

// webpack 五个核心概念
/**
 * 1 entry  入口文件 以哪个文件开始打包
 * 2 outPut  出口文件  打包好的文件输出到哪里去
 * 3 loader  css js 预处理  处理成浏览器兼容的代码
 * 4 plugins 插件 扩展插件的  压缩 打包优化
 * 5 mode 打包模式  mode='development'  会将peocess.env.NODE_ENV的值设置为development
 * /

```

- 前端代码为何要进行构建打包？

- module chunk bundle 分别是什么意思， 有何区别？

- loader 和 plugin的区别？

- webpack 如何实现懒加载?

- webpack 常见性能优化

- babel-tuntime和babel-polyfill的区别


# webpack-merge 配置分离

- 1 把公共的配置抽离到webpack.config.base.js  通过smart可以合并配置项
```js
let { smart } = require('webpack-merge');
let base = require('./webpack.config');

module.exports = smart(base, {
  mode: 'development',
  devServer: {
    port: 8080, // 打包后的输出端口
    
    proxy: {// 重写方式，代理
      '/api': {
        target: 'http://localhost:3000',
        // changeOrigin: true,
        pathReWrite: { '^/api': '' }
      }
    }
  }
})
原文链接：https://blog.csdn.net/LLL_liuhui/article/details/103923061
```

# loader  js预处理 css预处理

```js
const path = require('path')
const distPath = path(__dirname,'..','dist')
module.exports = {
mode : 'production', // 当前模式

output: { //打包输出的路径
filename :'bundle.[contentHash:8].js', // 加上hash值 防止缓存
path : distPath, // 打包输出的目录
}, 
module :{
  reles : [ // 配置规则
    {
        test : /\.js$/,  // 文件规则  把es6js代码 转换成浏览器兼容的 
        loader : [ 'babel-loader' ], //babel-loader 把js文件 es6代码转换成es5    使用那些loader   loader的执行顺序 从 后往前
        include : [ './mian.js' ], // 包含那些文件
        exclude : /node-modules/ // 排除那些文件
    },

    {
        test : /\.vue$/,  // 文件规则  把es6js代码 转换成浏览器兼容的 
        loader : [ 'vue-loader' ], // vue-loader 把vue文件 vue代码转换成js代码   
        include : [ './mian.js' ], // 包含那些文件
        exclude : /node-modules/ // 排除那些文件
    },
    { 
        test : /\.css$/
        // postcss-loader 处理浏览器兼容性 自动添加浏览器前缀  需要配置postcss.config.js才会生效
        // css-loader 只会解析css文件里面的css代码 解析过的格式是个数组 不会挂载到style标签里面
        // style-loader  直接将css-loader解析后的内容挂载到html页面当中
        loader:[ "style-loader","css-loader","postcss-loader" ] // 顺序从后往前执行  
    },
    { 
        test : /\.less$/
        // less-loader 处理less格式的css
        loader:[ "style-loader","css-loader","less-loader" ] // 顺序从后往前执行  
    },

    // 开发环境配置图片的规则
    // {   
    //     // file-loader  图片以地址的形式引入  localhost:8080/xxx/xxx.png
    //     test : /\.(png|jpg|jpeg|gif)$/,
    //     use: "file-loader" , // loader 的快捷方式
    // },

    // 线上配置图片的规则 
    {
        test : /\.(png|jpg|jpeg|gif)$/,
        use :{
            loader : "url-loader",
            options : {
                //  图片小于5kb用base64格式产出
                limit : 5 *1024,
                // 打包的文件目录
                outputPath : "/images/",
                // 关闭url-loader的es6模块 使用commonjs解析
                exModule : false ,
                // 解决名字过长可以自定义
                // ext 取原文件的扩展名
                name : '[hash:8].[ext]'
            }
        }
    },
    { // url-loader 不能处理html里面引入的图片  所以要单独处理
        test : /\.html$/,
        use :{
            loader : "html-loader",
            
        }
    }
]
},
plugins :[  // 管理插件的配置

  new CleanWebPackPlugin(), // 清空之前的打包文件 
  // 如果需要多入口 在配置一个
  new HtmlWebPackPlugin({   //html 模板
    template: path.jojn(srcPath,'index.html'),
    filename : 'index.html', //要出入的文件名
    chunks :['index'] // 要引入那些js文件 
  }),
]
}
```

# webpack高级配置
- 1 多入口
```js
const srcPath = path(__dirname,'..','src')

module.exports = {
  mode : 'production', // 当前模式
  entry  : {
    index : path.jojn(srcPath ,'index.js' ), //第一入口
    other : path.jojn(srcPath ,'other.js' ) 
  }
}


module.exports = {
  mode : 'production', // 当前模式
  output  : {
    filename :'[name].[contentHash:8].js', // 多入口配置
    path : distPath,
  }
}

```

# css打包成文件 以link的方式引入

- 1 安装npm install --save-dev mini-css-extract-plugin
- 2 { test : /\.css$/,loader:[MiniCssExtractPlugin.loader, 'css-loader','postcss-loader' ]  }
- 3 在plugins里面配置ccs打包的文件名 plugins :[  new MiniCssExtractPlugin({ filename:css/main.['contentHash:8'].css  }) ]
```js
{ 
  test : /\.css$/,
  loader:[MiniCssExtractPlugin.loader, 'css-loader','postcss-loader' ]  
}
plugins :[  new MiniCssExtractPlugin({ filename:css/main.['contentHash:8'].css })]
```



# 压缩 css 和 js
- 1 在 optimization  打包优化项里面可以配置
- 2 optimization :{  minimizer : [  new TerserJSPlugin({})], new OptimizeCSSassetsPlugin() }



# 抽离公共代码
- 1  在 optimization splitChunks 配置
```js

optimization :{ // 配置打包优化项
  splitChunks :{
    chunks : 'all',
    // initila 入口 chunk 对于异步导入的文件不出来
    //  async 异步 chunk  只对异步导入的文件处理
    //  all  全部 chunk

    // 缓存分组
    cacheGroups ：{
      // 处理第三方模块
      vendor：{
        name : 'cendor',  // chunk名称
        priority : 1, // 优先级
        test :/node_modules/,
        minSize : 0, // 大小限制 
        miniChunks: 1  , // 最少复用过几次（代码里面引用过几次）
      },

      // 公共的模块处理
      common :{
        name : 'common',
        priority : 0, // 优先级
        minSize : 0, // 大小限制 
        miniChunks: 2, // 最少复用过几次
      }
    }
  }
}

```

# 懒加载
```js
import('./xxx.js').then( res => {
  /**
    todo.....
  *\
})
```

# module chunk bundle 分别是什么意思， 有何区别？
- 1 module ----------  模块 webpack中一切皆模块
- 2 chunk  ----------  多模块合并成的 如 entry import() splitChunk
- 3 bundle ---------- 最终的输出文件



# loader 和 piugin 的区别
- 1 loader 模块转换器  less ----- css  ES6 ------- ES5/ES4
- 2 plugins 扩展插件 比如把 转换的css和js 进行压缩 



# babel 和 webpack的区别
- 1 babel  js新语法编译工具
- 2 webpack 打包构建工具 是多个 loader 和 plugin 的集合


# webpack性能优化
- 1 优化babel-loader  loader :[ 'babel-loader?cacheDirectory' ]  // 开启缓存  include: path.resolve(__dirname,'src') // 明确打包范围 或者 排除那些文件  exclude: /node_modules/

- 2 [happyPack](https://www.jianshu.com/p/b9bf995f3712)插件 多进程打包js 因为js单线程开启多进程打包 **如果项目小，打包很快，开启多进程会降低速度**
```js
// 1 安装 happyPack  npm install happypack --save-dev
// 2 const HappyPack = require('happypack');
// 3 把HappyPack替换成loader   loader:['happypack/loader?id=bable']
// 4 在plugins配置项里面开启多进程打包 
/**
 * new HappyPack({
 * id: 'bable',
 * loaders: [babel-loader?cacheDirectory]
 * })
 * 
*/
```
- 3 开启多进程压缩js代码  [ParallelUglifyPlugin](https://blog.csdn.net/qq_24147051/article/details/103557728)插件


# webpack 性能优化 - 产出代码
- 1 小图片使用base64格式产出 没必要在做一次网络请求
- 2 懒加载 import('./xxxx')
- 3 提取公共代码打包
- 4 使用production模式 会自动开启代码压缩 或者使用ParallelUglifyPlugin压缩代码


# Tree-Shaking
- 1 打包自动去除没有用到的代码   Tree Shaking 时必须使用 ES6 模块 的写法



  

# ES6 Module 和 Commonjs 区别
- 1 ES6 Module 静态引入，编译时引入  
- 2 Commonjs 动态引入，执行时引入
- 3 只有ES6 Module才能静态分析，实现Tree-Shaking


# babel 
- 1 把ES6以上的代码解析成ES5 ES4 解决浏览器的兼容性



# babel-polyfill 是什么
- 1 低版本浏览器没有的api babel-polyfill会自己生成代码兼容



# babel-runtime
- 1 避免 babel 编译的工具函数在每个模块里重复出现，减小库和工具包的体积；


# 前端为何要进行打包构建？
- 1 体积更小（Tree-Shaking,压缩,合并）,加载更快
- 2 编译高级语言或者语法（TS,ES6+,模块化,scss,vue）提高开发效率 
- 3 兼容性和错误检查(polyfill,postcss,eslint)
- 4 统一 高效的开发环境，代码风格 ，构建流程 集成公司构建规范(提测，上线)


# webpack 优化构建速度
- 1 优化babel-loader
- 2 happyPack 多进程构建
- 3 parallelUglifyPlugin 多进程压缩js 和 css
- 4 使用production模式 会自动开启代码压缩

