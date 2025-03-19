# Webpack 面试题

---

### **一、基础概念**
1. **什么是 Webpack？**  
   - 现代 JavaScript 应用的静态模块打包工具，通过依赖图将资源（JS、CSS、图片等）转换为浏览器可识别的静态文件。

2. **Webpack 的核心概念**  
   - **Entry（入口）**：构建依赖图的起点文件（如 `index.js`）。  
   - **Output（出口）**：打包后的文件输出位置和命名规则。  
   - **Loader**：处理非 JS 文件（如 CSS、图片），转换为 Webpack 可处理的模块。  
   - **Plugin（插件）**：扩展功能（如优化、资源管理、环境变量注入）。  
   - **Mode（模式）**：`development`（开发模式，启用调试）或 `production`（生产模式，默认优化）。  
   - **Bundle（包）**：最终生成的打包文件。

3. **Webpack 与 Grunt/Gulp 的区别？**  
   - Grunt/Gulp 是任务运行工具，基于流程处理文件；Webpack 是模块化打包工具，强调依赖分析和代码拆分。

---

### **二、Loader 与 Plugin**
1. **Loader 和 Plugin 的区别？**  
   - **Loader**：处理特定文件类型（如 `css-loader` 处理 CSS），在模块加载时转换文件。  
   - **Plugin**：在打包全生命周期中扩展功能（如 `HtmlWebpackPlugin` 生成 HTML 文件）。

2. **常用 Loader 举例**  
   - `babel-loader`：转译 ES6+ 代码。  
   - `css-loader` + `style-loader`：处理 CSS 文件。  
   - `file-loader`/`url-loader`：处理图片、字体等静态资源。  
   - `sass-loader`：编译 SCSS/Sass 为 CSS。

3. **常用 Plugin 举例**  
   - `HtmlWebpackPlugin`：自动生成 HTML 并注入打包后的 JS/CSS。  
   - `MiniCssExtractPlugin`：将 CSS 提取为独立文件。  
   - `CleanWebpackPlugin`：清理旧的打包文件。  
   - `DefinePlugin`：定义全局常量（如 `process.env.NODE_ENV`）。

---

### **三、配置与优化**
1. **如何减少打包体积？**  
   - **Tree Shaking**：删除未使用的代码（需 ES6 模块语法，生产模式默认开启）。  
   - **Code Splitting**：代码分割（`SplitChunksPlugin` 拆分公共代码，动态导入实现按需加载）。  
   - **压缩代码**：`TerserPlugin` 压缩 JS，`CssMinimizerPlugin` 压缩 CSS。  
   - **CDN 引入**：通过 `externals` 排除第三方库（如 React、Lodash）。

2. **如何提升构建速度？**  
   - **缓存**：  
     - `cache-loader` 或 Webpack 5 内置持久化缓存（`cache: { type: 'filesystem' }`）。  
     - `babel-loader` 开启 `cacheDirectory`。  
   - **多进程编译**：`thread-loader` 或 `HappyPack`（已弃用）。  
   - **缩小文件搜索范围**：  
     - `resolve.modules` 指定模块路径。  
     - `resolve.extensions` 减少后缀尝试。  
     - `module.rules` 添加 `exclude/include` 限制 Loader 范围。

3. **开发环境 vs 生产环境配置差异**  
   - **开发环境**：  
     - `mode: 'development'`，启用 source map。  
     - 使用 `webpack-dev-server` 实现热更新（HMR）。  
   - **生产环境**：  
     - `mode: 'production'`，开启代码压缩和优化。  
     - 分离 CSS、生成哈希文件名（缓存策略）。

---

### **四、原理与高级特性**
1. **Webpack 打包流程**  
   1. 初始化参数（合并配置）。  
   2. 创建 Compiler 对象，加载插件。  
   3. 确定入口，构建模块依赖图。  
   4. 调用 Loader 编译模块。  
   5. 生成 Chunk，输出到文件系统。

2. **模块热更新（HMR）原理**  
   - 通过 WebSocket 连接开发服务器，文件变动后重新编译，推送更新消息到浏览器。  
   - 浏览器替换旧模块，保留应用状态（需代码支持 HMR API）。

3. **Webpack 5 新特性**  
   - 持久化缓存（显著提升构建速度）。  
   - 模块联邦（Module Federation）：跨应用共享代码。  
   - 内置 Asset Modules（替代 `file-loader`）。  
   - Tree Shaking 支持 CommonJS 和嵌套导出。

---

### **五、常见问题**
1. **如何实现按需加载？**  
   - 使用动态导入语法 `import('./module.js')`，Webpack 自动分割代码。

2. **如何配置多页面应用（MPA）？**  
   - 多个入口文件，配合 `HtmlWebpackPlugin` 生成多个 HTML 页面。

3. **如何处理静态资源（图片、字体）？**  
   - 使用 `asset/resource`（Webpack 5）或 `file-loader`，设置输出路径和文件名。

4. **如何解决循环依赖问题？**  
   - 重构代码结构，避免循环引用；或在模块中使用 `import()` 动态加载。

---

### **六、代码示例**
```javascript
// webpack.config.js 示例
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
```

