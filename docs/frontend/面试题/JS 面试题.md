# JavaScript 面试题

### **一、基础概念**
1. **数据类型与类型判断**
   - 基本类型（`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`） vs 引用类型（`object`, `array`, `function`）
   - `typeof` 的局限性（如 `typeof null === 'object'`）
   - `instanceof` 原理及手写实现
   - 准确判断数组的方法：`Array.isArray()` 或 `Object.prototype.toString.call()`

2. **作用域与闭包**
   - 全局/函数/块级作用域
   - 闭包定义：函数嵌套 + 内部函数访问外部变量
   - 应用场景：模块化、私有变量、防抖节流
   - 内存泄漏风险：未及时释放闭包引用

3. **变量提升与暂时性死区**
   - `var` 的提升行为，`let/const` 的暂时性死区（TDZ）
   - 函数声明与函数表达式的提升差异

---

### **二、ES6+ 新特性**
1. **箭头函数**
   - 无自身 `this`，继承外层上下文
   - 不能作为构造函数，无 `arguments` 对象
   - 适用场景：回调函数、需要词法 `this` 的情况

2. **Promise 与异步**
   - 三种状态（pending, fulfilled, rejected）
   - 链式调用（`.then()`、`.catch()`）
   - `Promise.all`（全成功） vs `Promise.race`（竞速）
   - `async/await` 本质：Generator 语法糖，错误处理用 `try/catch`

3. **其他特性**
   - 解构赋值、模板字符串、默认参数
   - 可选链 `?.` 和空值合并运算符 `??`

---

### **三、异步与事件循环**
1. **事件循环机制（Event Loop）**
   - 浏览器环境：宏任务（`setTimeout`、DOM 事件） vs 微任务（`Promise.then`、`MutationObserver`）
   - 执行顺序：同步代码 → 微任务队列清空 → 宏任务
   - Node.js 中的阶段（Timers、Poll、Check 等）

2. **异步编程模式**
   - 回调地狱 → Promise 链 → `async/await` 同步写法
   - Generator 函数与 `yield` 控制异步流程

---

### **四、原型与继承**
1. **原型链**
   - `prototype`（构造函数属性） vs `__proto__`（实例的隐式原型）
   - 原型链终点：`Object.prototype.__proto__ === null`
   - `new` 操作符的步骤：创建对象 → 绑定原型 → 执行构造函数 → 返回对象

2. **继承实现**
   - 寄生组合继承（组合 `call` 继承属性 + 原型链继承方法）
   - ES6 `class` 与 `extends` 关键字（语法糖，本质基于原型）

---

### **五、this 与执行上下文**
1. **this 指向规则**
   - 默认绑定：全局（严格模式为 `undefined`）
   - 隐式绑定：对象方法调用
   - 显式绑定：`call`、`apply`、`bind`
   - `new` 绑定：指向新创建的对象

2. **改变 this 的方法**
   - `bind` 返回新函数，`call/apply` 立即执行
   - 箭头函数的 `this` 不可变（由词法环境决定）

---

### **六、高级主题**
1. **设计模式**
   - 单例模式（全局唯一实例）
   - 观察者模式（发布-订阅，如 `EventEmitter`）

2. **模块化**
   - CommonJS（`require/module.exports`，同步加载）
   - ES Module（`import/export`，静态分析，支持 Tree Shaking）

3. **性能优化**
   - 防抖（连续触发只执行最后一次） vs 节流（固定间隔执行一次）
   - 减少 DOM 操作，避免重排重绘
   - 内存泄漏检测（Chrome DevTools 的 Memory 面板）

---

### **七、手写代码题**
1. **实现核心方法**
   - `call/apply`：通过对象方法临时绑定 `this`
   - `bind`：返回函数 + 闭包保存参数
   - 深拷贝：递归处理对象/数组，解决循环引用（使用 `WeakMap`）

2. **Promise 相关**
   - 手写 Promise（处理状态、then 方法链式调用）
   - 实现 `Promise.all`（收集所有结果，任一失败即终止）

3. **其他常见题**
   - 数组扁平化、去重
   - 函数柯里化（分步传参）

---

### **高频考点总结**
- 闭包的应用与风险  
- 事件循环执行顺序  
- 原型链与继承实现  
- `this` 的四种绑定规则  
- Promise 链式调用与错误处理  
- ES6 新特性的实际应用  
