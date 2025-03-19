# CSP 策略

内容安全策略（Content Security Policy，CSP）是一种通过声明资源加载规则来防范XSS等攻击的安全机制。以下是对CSP的详细解析及实践建议：

---

### **一、CSP的核心原理**
CSP通过HTTP响应头或`<meta>`标签定义**白名单规则**，限制浏览器仅加载或执行符合策略的资源。例如：
- 仅允许同源脚本。
- 禁止内联脚本（如`<script>...</script>`）。
- 阻止未经授权的资源（如图片、字体等）。

---

### **二、关键指令及用途**
CSP指令按资源类型划分，常用指令包括：
1. **默认规则**：
   - `default-src`：未明确指定时，其他指令回退到此规则。
   
2. **资源控制**：
   - `script-src`：控制JavaScript来源。
   - `style-src`：控制CSS来源。
   - `img-src`：控制图片来源。
   - `font-src`：控制字体来源。
   - `connect-src`：限制XHR、WebSocket等连接的域名。
   - `frame-src`：控制iframe加载来源。
   - `media-src`：限制音频和视频来源。
   - `object-src`：控制插件（如Flash）来源。

3. **特殊指令**：
   - `base-uri`：限制`<base>`标签的URL。
   - `form-action`：限制表单提交的目标。
   - `frame-ancestors`：控制页面能否被嵌入为iframe（替代旧的`X-Frame-Options`）。

---

### **三、策略值（指令取值）**
- **域名白名单**：`https://example.com`。
- **关键字**：
  - `'none'`：禁止加载任何资源。
  - `'self'`：仅允许同源资源。
  - `'unsafe-inline'`：允许内联脚本/样式（**高风险**，慎用）。
  - `'unsafe-eval'`：允许`eval()`等动态代码执行（**高风险**）。
- **哈希（Hash）**：通过脚本/样式的哈希值匹配内联内容，如`sha256-xxxx`。
- **Nonce**：生成随机数（一次性值），仅匹配对应`nonce`属性的脚本，如`nonce-abc123`。
- **报告指令**：
  - `report-uri https://example.com/report`：发送违规报告到指定URL。
  - `report-to`：使用Reporting API发送报告（需预定义报告组）。

---

### **四、部署CSP的最佳实践**
1. **最小化权限**：
   - 优先使用`default-src 'none'`，逐步添加必要权限。
   - 避免`unsafe-inline`和`unsafe-eval`，改用`nonce`或哈希。

   ```http
   Content-Security-Policy: 
     default-src 'none';
     script-src 'self' https://apis.example.com 'nonce-abc123';
     style-src 'self' 'sha256-xxxx';
     img-src * data:;
     connect-src 'self';
     report-uri /csp-report;
   ```

2. **处理第三方资源**：
   - 明确列出第三方域名（如Google Analytics、CDN）：
     ```http
     script-src 'self' https://www.googletagmanager.com;
     ```
   - 使用`strict-dynamic`信任由已授权脚本加载的依赖（CSP3支持）。

3. **内联代码处理**：
   - **Nonce**：生成随机数并嵌入脚本：
     ```html
     <script nonce="abc123">/* 允许的代码 */</script>
     ```
   - **Hash**：计算内联脚本/样式的哈希值：
     ```http
     script-src 'sha256-xxxx';
     ```

4. **分阶段部署**：
   - 先用`Content-Security-Policy-Report-Only`模式观察报告：
     ```http
     Content-Security-Policy-Report-Only: ...; report-uri /csp-report;
     ```
   - 根据报告逐步调整策略，再切换为强制执行模式。

---

### **五、常见问题与解决方案**
- **内联事件处理器被阻止**（如`onclick="..."`）：
  - 重构代码为外部事件监听。
  - 使用`unsafe-hashes`（CSP3）配合哈希值（谨慎使用）。

- **第三方库依赖`eval()`**：
  - 评估是否可替换库。
  - 若必须使用，添加`'unsafe-eval'`，但需权衡风险。

- **动态加载资源**：
  - 确保通过授权的脚本加载资源（如使用`strict-dynamic`）。

---

### **六、服务器配置示例**
- **Nginx**：
  ```nginx
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'nonce-abc123'; style-src 'self'; img-src *; report-uri /csp-report;";
  ```
- **Express（Node.js）**：
  ```javascript
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "script-src 'self' 'nonce-abc123'");
    next();
  });
  ```

---

### **七、调试与监控**
- **浏览器控制台**：查看CSP违规错误。
- **报告收集**：分析`report-uri`接收的违规数据，优化策略。
- **工具推荐**：使用[CSP Evaluator](https://csp-evaluator.withgoogle.com/)检查策略安全性。

---

### **总结**
CSP是防范XSS的强有力工具，但需细致规划。核心原则是**最小化权限**、**避免不安全指令**、**利用报告机制持续优化**。通过合理配置，可显著提升应用安全性，同时兼容业务需求。