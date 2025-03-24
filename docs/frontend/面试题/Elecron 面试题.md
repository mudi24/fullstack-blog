# Electron 面试题

### **一、核心概念**
1. **Electron 的核心架构是什么？**  
   - Electron = Chromium（渲染页面） + Node.js（系统交互） + Native APIs（跨平台功能）。  
   - **主进程（Main Process）**：管理窗口、生命周期、原生 API。  
   - **渲染进程（Renderer Process）**：运行网页内容，每个窗口独立进程，默认禁用 Node.js。  

2. **主进程 vs 渲染进程的区别？**  
   - **主进程**：通过 `BrowserWindow` 创建窗口，可调用 Node.js API。  
   - **渲染进程**：展示 UI，默认隔离系统权限，需通过 IPC 与主进程通信。

---

### **二、进程通信（IPC）**
3. **如何实现进程间通信？**  
   - **主进程**：`ipcMain.on()` 接收，`window.webContents.send()` 发送。  
   - **渲染进程**：`ipcRenderer.send()` 发送，`ipcRenderer.on()` 接收。  
   - **代码示例**：  
     ```javascript
     // 主进程
     ipcMain.on('msg-from-renderer', (event, data) => {
       event.sender.send('reply', 'Received!');
     });

     // 渲染进程
     ipcRenderer.send('msg-from-renderer', 'Hello');
     ipcRenderer.on('reply', (event, data) => {});
     ```

4. **如何共享数据？**  
   - **简单数据**：通过 IPC 传递。  
   - **复杂场景**：使用 `localStorage`、`electron-store` 模块，或主进程作为中介。

---

### **三、安全性**
5. **如何防范 XSS 攻击？**  
   - 避免渲染进程动态插入未过滤的 HTML（如 `innerHTML`）。  
   - 启用 CSP（Content Security Policy）：  
     ```html
     <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
     ```

6. **何时禁用 Node.js 集成？**  
   - 在不需要系统权限的渲染进程中设置 `nodeIntegration: false` 和 `sandbox: true`，降低攻击面。
Electron 常见的安全风险及防范措施？

风险：XSS 攻击、Node.js 集成漏洞、任意代码执行。

措施：

禁用渲染进程的 Node.js 集成（nodeIntegration: false）。

启用上下文隔离（contextIsolation: true）。

使用 Content-Security-Policy 头限制资源加载。

验证 IPC 消息来源（event.sender）。

为什么推荐使用 contextBridge？

安全地暴露部分 Node.js API 到渲染进程，避免直接暴露全局对象。
---

### **四、性能优化**
7. **优化加载速度的方法？**  
   - 使用 `webpack` 打包代码，懒加载非关键资源。  
   - 启用 `BrowserWindow` 的 `backgroundThrottling: false` 防止后台休眠。
  
**Electron 应用性能优化方法？**
  - 减少不必要的窗口/进程；
  - 使用 Web Workers 处理计算密集型任务；
  - 预加载脚本优化资源加载；
  - 禁用未使用的 Chromium 功能（如 webgl 按需启用）。
  
8. **内存泄漏排查**  
   - 用 Chromium DevTools 的 Memory 面板分析快照。  
   - 避免全局变量存储大量数据，及时解绑事件监听。

---

### **五、原生功能集成**
9. **如何调用系统对话框？**  
   ```javascript
   const { dialog } = require('electron');
   dialog.showOpenDialog({ properties: ['openFile'] });
   ```

10. **创建系统托盘图标**  
    ```javascript
    const { Tray } = require('electron');
    let tray = new Tray('icon.png');
    tray.setToolTip('My App');
    ```

---

### **六、调试与打包**
11. **调试主进程**  
    - 启动时添加 `--inspect` 参数，用 Chrome 访问 `chrome://inspect`。
    **调试渲染进程**
    - 直接使用浏览器开发者工具（默认快捷键 Ctrl+Shift+I）。
12. **打包工具选择**  
    - **electron-builder**：支持自动更新、多平台打包。  
    - **electron-packager**：轻量级配置。
  **如何减小 Electron 应用体积？**
  - 选择轻量依赖，使用 asar 压缩文件；
  - 按需打包平台特定版本。
---

### **七、常见场景题**
13. **如何实现自动更新？**  
    - 使用 `electron-updater` 模块，结合 GitHub Releases 或私有服务器。

14. **多窗口数据同步？**  
    - 主进程作为数据中心，通过 IPC 广播消息到所有窗口。

---

### **八、Electron 的优缺点**
- **优点**：跨平台、Web 技术栈、丰富的社区生态。  
- **缺点**：内存占用高、性能敏感场景不适用。

### **九、Electron 与 NW.js 的区别？**

* 入口文件：Electron 主进程必须为 JS 文件，NW.js 支持 HTML 入口。
* Node.js 集成：Electron 默认渲染进程无 Node.js 权限，NW.js 默认启用。
* 进程模型：Electron 明确区分主进程和渲染进程，NW.js 的窗口均为独立进程。