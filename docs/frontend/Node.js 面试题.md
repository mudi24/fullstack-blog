# Node.js 面试题

### **一、基础概念**
1. **Node.js 是什么？与 JavaScript 的区别？**  
   - 基于 Chrome V8 引擎的 JavaScript 运行时环境，非浏览器环境，擅长高并发 I/O 操作。
   - 区别：Node.js 提供文件系统、网络等 API，浏览器提供 DOM 操作 API。

2. **Node.js 单线程模型如何支持高并发？**  
   - 单线程 + **事件循环**（Event Loop）处理异步 I/O，通过 **Libuv 线程池**执行阻塞操作（如文件 I/O）。

3. **CommonJS 模块与 ES Modules 的区别？**  
   - `require/module.exports`（同步加载） vs `import/export`（异步加载，需 `.mjs` 或 `package.json` 配置）。

---

### **二、核心机制**
4. **事件循环（Event Loop）的6个阶段**  
   1. Timers（执行 `setTimeout`、`setInterval`）  
   2. Pending callbacks（系统级回调如 TCP 错误）  
   3. Idle/Prepare（内部使用）  
   4. Poll（等待 I/O 事件，执行回调）  
   5. Check（执行 `setImmediate`）  
   6. Close callbacks（如 `socket.on('close')`）

5. **`process.nextTick()` 和 `setImmediate()` 的区别？**  
   - `process.nextTick()`：插入当前阶段尾部，优先于其他异步任务。  
   - `setImmediate()`：在 Check 阶段执行。

6. **如何避免回调地狱（Callback Hell）？**  
   - 使用 **Promise**、**async/await** 或库（如 `util.promisify`）。

---

### **三、核心模块**
7. **`fs.readFile` 和 `fs.createReadStream` 的区别？**  
   - `readFile` 适合小文件（全量读取到内存），`createReadStream` 使用流处理大文件（内存高效）。

8. **`__dirname` 和 `process.cwd()` 的区别？**  
   - `__dirname`：当前模块的目录路径。  
   - `process.cwd()`：进程启动时的目录（可通过 `cd` 命令改变）。

9. **`Buffer` 的作用是什么？**  
   - 处理二进制数据（如图片、文件），解决 JavaScript 字符串无法直接操作二进制的问题。

---

### **四、异步与性能**
10. **Promise 错误处理的最佳实践**  
    - 使用 `.catch()` 或 `try/catch` 包裹 `await`。

11. **如何调试内存泄漏？**  
    - 使用 `--inspect` + Chrome DevTools，或 `heapdump` 分析内存快照。

12. **Cluster 模块如何利用多核 CPU？**  
    - 主进程管理多个子进程（通过 `child_process.fork()`），共享端口，提高并发能力。

---

### **五、Web 开发（如 Express.js）**
13. **中间件（Middleware）的执行顺序？**  
    - 按声明顺序执行，需调用 `next()` 传递控制权。

14. **如何实现 JWT 认证？**  
    - 使用 `jsonwebtoken` 生成 Token，中间件验证 `Authorization` 头。

15. **CORS 问题如何解决？**  
    - 使用 `cors` 中间件或手动设置 `Access-Control-Allow-*` 头。

---

### **六、实战场景题**
16. **设计一个高并发的文件上传服务**  
    - 使用流式处理（`multipart/form-data` 解析 + 管道到存储），避免内存溢出。

17. **如何实现定时任务？**  
    - 使用 `node-schedule` 或 `setInterval`（需考虑进程重启问题）。

18. **优化数据库查询性能**  
    - 连接池、缓存（Redis）、索引、分页查询。

---

### **七、进阶问题**
19. **V8 引擎的垃圾回收机制**  
    - 分代回收（新生代：Scavenge 算法；老生代：Mark-Sweep & Mark-Compact）。

20. **Node.js 的线程安全问题**  
    - 单线程无需担心竞态条件，但使用 `Worker Threads` 时需同步共享内存。

---

### **八、工具与部署**
21. **PM2 的核心功能**  
    - 进程守护、负载均衡、日志管理、零停机重启（`pm2 reload`）。

22. **Docker 部署 Node.js 的注意事项**  
    - 使用 Alpine 镜像减小体积，`npm ci --production` 避免安装 devDependencies。

