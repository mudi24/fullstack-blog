# Vite 面试题

### **一、核心概念**
1. **Vite 是什么？它的核心优势是什么？**  
   - 基于原生 ESM 的现代前端构建工具，开发环境秒级启动（无需打包），生产环境用 Rollup 打包。  
   - 优势：开发速度快、按需编译、内置 HMR、轻量高效。

2. **Vite 的启动速度为什么快？**  
   - 利用浏览器原生 ESM，跳过传统打包步骤，按需编译文件。  
   - 依赖预构建（`node_modules` 转换为 ESM 并缓存）。

3. **Vite 的热更新（HMR）有什么特点？**  
   - 基于 ESM 的细粒度 HMR，仅更新修改的模块，保留应用状态。

4. **依赖预构建（Dependency Pre-Bundling）的作用是什么？**  
   - 将 CommonJS 模块转换为 ESM，合并零散文件减少请求次数，提高缓存效率。

---

### **二、使用与配置**
5. **如何创建 Vite 项目？支持哪些框架？**  
   - `npm create vite@latest`，支持 React、Vue、Svelte、Lit 等。

6. **Vite 如何处理 CSS 和静态资源？**  
   - 原生支持 CSS、Sass/Less（需安装预处理器）、PostCSS。  
   - 静态资源通过 `/public` 目录或直接导入（返回解析后的 URL）。

7. **如何配置多页面应用？**  
   - 在 `vite.config.js` 中设置 `build.rollupOptions.input` 为多个入口文件。

8. **环境变量如何管理？**  
   - 使用 `.env` 文件，变量需以 `VITE_` 前缀开头，通过 `import.meta.env` 访问。

---

### **三、进阶知识点**
9. **Vite 和 Webpack 的主要区别？**  
   - 开发环境：Vite 无打包，Webpack 需打包整个应用。  
   - 生产环境：Vite 用 Rollup，Webpack 自建打包流程。  
   - HMR：Vite 更快速，Webpack 需维护模块依赖图。

10. **如何自定义 Vite 插件？**  
    - 实现 Rollup 插件接口，通过 `configureServer` 扩展开发服务器（如处理中间件）。

11. **Vite 如何支持 SSR（服务端渲染）？**  
    - 通过 `vite-plugin-ssr` 或手动配置 Node.js 服务端入口。

12. **如何优化 Vite 生产构建？**  
    - 代码分割、Tree-shaking、CDN 引入依赖、压缩资源（`build.minify` 配置）。

---

### **四、常见场景问题**
13. **Vite 如何处理兼容性问题（如旧版浏览器）？**  
    - 生产构建时通过 `@vitejs/plugin-legacy` 生成传统包和 Polyfill。

14. **如何解决开发环境的跨域问题？**  
    - 配置 `server.proxy` 代理 API 请求。

15. **Vite 如何集成 TypeScript？**  
    - 天然支持 `.ts` 文件，类型检查需单独执行 `tsc --noEmit` 或使用 `vite-plugin-checker`。

---

### **五、底层原理**
16. **Vite 的模块解析流程是怎样的？**  
    - 浏览器发起 ESM 请求 → Vite 拦截 → 编译转换（如 Vue/Svelte 文件） → 返回编译后内容。

17. **为什么生产环境使用 Rollup？**  
    - Rollup 更擅长生成高效的 ESM 包，适合 Tree-shaking 和代码分割。
