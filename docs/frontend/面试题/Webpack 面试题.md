# Webpack面试题

### **一、核心概念**
1. **Webpack的作用是什么？**  
   - 模块打包工具，将多个模块及其依赖打包为静态资源（如JS、CSS、图片），支持代码分割、按需加载、优化等。

2. **解释Entry、Output、Loader、Plugin、Bundle、Chunk的区别**  
   - **Entry**：入口文件，Webpack构建的起点。  
   - **Output**：输出配置，指定打包后的文件路径和名称。  
   - **Loader**：处理非JS文件（如CSS、图片），转换为Webpack可处理的模块。  
   - **Plugin**：扩展功能，如优化、资源管理（如`HtmlWebpackPlugin`）。  
   - **Bundle**：最终生成的打包文件。  
   - **Chunk**：代码块，可能由代码分割（如`import()`）生成。

3. **Loader和Plugin的区别？**  
   - **Loader**：处理单个文件，在打包前转换文件（如`babel-loader`转译JS）。  
   - **Plugin**：在打包全生命周期中执行任务（如优化、资源注入）。

---

### **二、配置与使用**
4. **如何支持CSS文件？**  
   - 使用`css-loader`解析CSS，`style-loader`将CSS注入DOM，或`MiniCssExtractPlugin`提取为独立文件。

5. **如何配置多入口？**  
   ```javascript
   entry: {
     app: './src/app.js',
     admin: './src/admin.js'
   },
   output: {
     filename: '[name].bundle.js', // 根据入口名生成文件
   }
   ```

6. **如何实现按需加载（懒加载）？**  
   - 使用动态`import()`语法，Webpack自动分割代码。

7. **如何配置开发环境与生产环境？**  
   - 通过`mode: 'development' | 'production'`设置模式，或用`webpack-merge`合并公共配置。

---

### **三、优化策略**
8. **如何优化构建速度？**  
   - 使用缓存（`cache-loader`、Webpack5持久化缓存）。  
   - 多线程处理（`thread-loader`）。  
   - 缩小文件搜索范围（`resolve.extensions`、`alias`）。  
   - 减少打包体积（Tree Shaking、代码分割）。

9. **什么是Tree Shaking？如何生效？**  
   - 删除未使用的代码（需ES6模块语法，生产模式下自动启用，注意避免副作用）。

10. **代码分割（Code Splitting）有哪些方式？**  
    - 入口配置多个Entry。  
    - 动态`import()`语法。  
    - `SplitChunksPlugin`提取公共依赖。

11. **Webpack5有哪些新特性？**  
    - 模块联邦（Module Federation）。  
    - 持久化缓存（显著提升构建速度）。  
    - 内置资源模块（替代`file-loader`）。

---

### **四、高级原理**
12. **Webpack的工作流程？**  
    - 初始化配置 → 解析入口文件 → 递归构建依赖图 → 应用Loader → 生成Chunk → 输出Bundle。

13. **热更新（HMR）原理？**  
    - 通过WebSocket连接服务器，文件变化时重新编译，仅更新变化的模块。

14. **如何编写自定义Loader/Plugin？**  
    - **Loader**：导出一个函数，处理输入内容并返回。  
    - **Plugin**：定义一个类，实现`apply`方法，监听Webpack生命周期钩子。

---

### **五、其他常见问题**
15. **如何解决打包体积过大？**  
    - 代码分割、压缩（`TerserPlugin`）、按需加载、Tree Shaking、CDN引入库。

16. **source map的作用？如何配置？**  
    - 映射压缩代码到源码，便于调试。通过`devtool`配置（如`cheap-module-source-map`）。

17. **Webpack如何处理图片等静态资源？**  
    - Webpack5使用`asset/resource`（替代`file-loader`），或通过`url-loader`转Base64。

18. **模块联邦（Module Federation）是什么？**  
    - 允许不同应用共享模块，实现微前端架构。

---

### **六、代码示例**
**配置CSS处理：**
```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }
  ]
}
```

**配置SplitChunks：**
```javascript
optimization: {
  splitChunks: {
    chunks: 'all', // 分割公共模块
  }
}
```

---
