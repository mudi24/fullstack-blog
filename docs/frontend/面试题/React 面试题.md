# React 面试题

---

### **一、React 基础概念**
1. **虚拟DOM（Virtual DOM）是什么？**  
   - 核心作用：提升性能，通过对比新旧虚拟DOM差异，减少真实DOM操作。
   - 实现原理：JS对象模拟DOM树，Diff算法优化更新。

2. **JSX 的本质是什么？**  
   - 语法糖：`React.createElement()` 的简写，最终转换为JavaScript对象。

3. **类组件 vs 函数组件的区别**  
   - 生命周期：类组件有生命周期方法，函数组件依赖Hooks（如`useEffect`）。
   - 状态管理：类组件使用`this.state`，函数组件用`useState`。

---

### **二、组件与状态管理**
4. **React 组件通信方式**  
   - 父子：`props`传递数据，子组件通过回调函数通知父组件。
   - 跨级：`Context API` 或 Redux 等状态管理库。
   - 兄弟：状态提升到共同父组件，或使用全局状态管理。

5. **受控组件 vs 非受控组件**  
   - 受控：表单数据由React状态管理（如`value`绑定`state`）。
   - 非受控：通过`ref`直接操作DOM获取数据。

6. **setState 同步还是异步？**  
   - 表现：在合成事件和生命周期中是“异步”（批量更新），在`setTimeout`或原生事件中同步。

---

### **三、Hooks 核心**
7. **useEffect 的依赖数组作用**  
   - 空数组`[]`：仅在组件挂载/卸载时执行（替代`componentDidMount`）。
   - 依赖项变化时触发副作用，类似`componentDidUpdate`。

8. **Hooks 使用规则**  
   - 只在最顶层调用（不在条件/循环中使用）。
   - 仅用于React函数组件或自定义Hook。

9. **useMemo 和 useCallback 的区别**  
   - `useMemo`缓存计算结果，`useCallback`缓存函数实例，均用于性能优化。

---

### **四、高级特性与原理**
10. **React Fiber 架构解决了什么问题？**  
    - 目标：实现增量渲染，将渲染任务拆分为小任务，避免主线程阻塞，支持并发模式。

11. **Diff 算法策略**  
    - 同层比较（减少复杂度）、`key`优化列表对比、组件类型一致则复用。

12. **合成事件（Synthetic Event）机制**  
    - 事件委托：React将所有事件代理到`document`，统一管理，解决跨浏览器兼容性。

---

### **五、状态管理库（如Redux）
13. **Redux 三大原则**  
    - 单一数据源、只读State、纯函数Reducer修改状态。

14. **Redux 中间件原理（如redux-thunk）**  
    - 拦截Action，支持异步操作（如API请求），`thunk`允许Action Creator返回函数。

15. **React-Router 实现原理**  
    - 基于`history`库监听URL变化，通过`Route`组件匹配路径渲染对应组件。

---

### **六、性能优化**
16. **如何避免不必要的组件渲染？**  
    - `React.memo`（函数组件）、`shouldComponentUpdate`（类组件）、合理使用`useMemo`/`useCallback`。

17. **key 属性的作用**  
    - 帮助React识别列表元素的唯一性，优化Diff算法效率。

18. **代码分割（Code Splitting）实现方式**  
    - `React.lazy()` + `Suspense`动态加载组件，或使用`import()`语法。

---

### **七、项目实战相关问题**
19. **如何设计一个可复用的高阶组件（HOC）？**  
    - 示例：权限校验HOC，包裹目标组件并注入逻辑。

20. **React 中的错误边界（Error Boundaries）**  
    - 类组件中实现`static getDerivedStateFromError()`和`componentDidCatch()`捕获子组件错误。

21. **复杂表单处理方案**  
    - 使用`Formik`库或`useReducer`管理表单状态，结合`Yup`做表单校验。

---

### **八、React 18 新特性**
22. **并发模式（Concurrent Mode）**  
    - 特性：可中断渲染、优先级调度（如`startTransition`标记非紧急更新）。

23. **自动批处理（Automatic Batching）**  
    - 在异步操作（如Promise、setTimeout）中自动合并多个`setState`更新。

---

### **附：高频追问场景**
- **Hooks 闭包陷阱**  
  问题：`useEffect`中获取到旧的state值。  
  解决：使用`useRef`保存最新值，或在依赖数组中正确声明变量。

- **Context 性能优化**  
  问题：Context值变化导致所有消费组件重新渲染。  
  优化：拆分Context、使用`memo`包裹子组件。

---
