# Vue 面试题

### **一、Vue 基础**
1. **Vue 的核心特点是什么？**  
   - 响应式数据绑定（数据驱动视图）
   - 组件化开发模式
   - 轻量级、渐进式框架
   - 虚拟 DOM 和高效的 Diff 算法

2. **Vue 的生命周期钩子函数及作用**  
   - `beforeCreate`：实例初始化，数据观测未开始  
   - `created`：数据观测完成，可访问数据，但 DOM 未生成  
   - `beforeMount`：模板编译完成，DOM 挂载前  
   - `mounted`：DOM 挂载完成，可操作 DOM  
   - `beforeUpdate`：数据变化，DOM 更新前  
   - `updated`：DOM 更新完成  
   - `beforeDestroy`：实例销毁前，清理定时器等  
   - `destroyed`：实例销毁完成  

3. **Vue 的响应式原理（Vue2 vs Vue3）**  
   - **Vue2**：通过 `Object.defineProperty` 劫持数据，递归遍历对象的每个属性，对数组方法（push/pop 等）重写。  
   - **Vue3**：使用 `Proxy` 代理对象，支持动态新增属性，性能更优。

4. **v-if 和 v-show 的区别**  
   - `v-if`：条件渲染，DOM 元素动态添加/移除，切换开销大。  
   - `v-show`：通过 CSS `display` 控制显示，适合频繁切换的场景。

5. **v-for 中 key 的作用**  
   - 唯一标识元素，帮助 Vue 高效更新虚拟 DOM，避免重复渲染问题。

---

### **二、组件与通信**
1. **组件间通信方式**  
   - 父传子：`props`  
   - 子传父：`$emit` 触发事件  
   - 兄弟组件：事件总线（Event Bus）或 Vuex/Pinia  
   - 跨层级：`provide/inject`  
   - 状态管理库：Vuex（Vue2）或 Pinia（Vue3）

2. **slot 插槽的作用**  
   - 默认插槽：`<slot>` 接收父组件内容    
    ```
     // Card.vue
    <template>
      <div class="card">
        <div class="card-header">标题</div>
        <div class="card-body">
          <!-- 默认插槽 -->
          <slot>这是默认内容，当没有传入内容时显示</slot>
        </div>
      </div>
    </template>

    // 使用组件
    <Card>
      <p>这是插入到默认插槽的内容</p>
    </Card>
    ```
   - 具名插槽：通过 `name` 指定位置  
    ```
    // Layout.vue
    <template>
      <div class="layout">
        <header>
          <slot name="header">默认页头</slot>
        </header>
        
        <main>
          <slot>默认主内容</slot>
        </main>
        
        <footer>
          <slot name="footer">默认页脚</slot>
        </footer>
      </div>
    </template>
    // 使用组件
    <Layout>
      <template v-slot:header>
        自定义页头内容
      </template>
      <template v-slot:footer>
        自定义页脚内容
      </template>
    </Layout>
    ```

   - 作用域插槽：子组件传递数据给父组件（`v-slot:name="props"`）
   ```
   // List.vue
   <template>
    <ul class="list">
      <li v-for="item in items" :key="item.id">
        <slot :item="item" :index="index">
          <!-- 默认内容 -->
          {{ item.name }}
        </slot>
      </li>
    </ul>
  </template>

  <script>
  export default {
    data() {
      return {
        items: [
          { id: 1, name: '项目1', desc: '描述1' },
          { id: 2, name: '项目2', desc: '描述2' }
        ]
      }
    }
  }
  </script>
  // 使用组件
  <List>
    <template #default="{ item, index }">
      <div class="item">
        <span>{{ index + 1 }}. </span>
        <strong>{{ item.name }}</strong>
        <p>{{ item.desc }}</p>
      </div>
    </template>
  </List>
  ```
3. **动态组件与异步组件**  
   - `<component :is="currentComponent">` 动态切换组件  
   - 异步组件：`defineAsyncComponent`（Vue3）或 `() => import()` 实现按需加载。

4. **keep-alive 的作用**  
   - 缓存非活跃组件实例，避免重复渲染，常用 `include/exclude` 控制缓存范围。

---

### **三、Vue 进阶**
1. **Vue 的 computed 和 watch 区别**  
   - `computed`：依赖缓存，适合计算派生数据（如：购物车总价）。  
   - `watch`：监听数据变化，执行异步或复杂逻辑（如：搜索建议）。

2. **Vue 的 nextTick 原理**  
   - 将回调延迟到下次 DOM 更新后执行，常用于获取更新后的 DOM 状态。

3. **Vue 的虚拟 DOM 和 Diff 算法**  
   - 通过 JS 对象模拟真实 DOM，减少直接操作 DOM 的性能损耗。  
   - Diff 算法：同层比较，通过 `key` 复用节点，优化更新效率。

4. **Vue Router 的核心概念**  
   - 路由模式：`hash`（`#`）和 `history`（需服务端支持）  
   - 导航守卫：`beforeEach`、`beforeRouteEnter` 等控制路由权限  
   - 动态路由：`/user/:id` 通过 `$route.params` 获取参数  
   - 懒加载：`component: () => import('./User.vue')`

5. **Vuex 的核心概念**  
   - `state`：状态仓库  
   - `mutations`：同步修改状态  
   - `actions`：异步提交 mutations  
   - `getters`：计算派生状态  
   - `modules`：模块化拆分（Vue3 推荐使用 Pinia）

---

### **四、Vue3 新特性**
1. **Composition API 优势**  
   - 逻辑复用更灵活（替代 Mixins），代码组织更清晰（按功能而非选项）。

2. **响应式系统的升级**  
   - 使用 `reactive`（对象）和 `ref`（基本类型）创建响应式数据，基于 `Proxy`。

3. **Teleport 和 Suspense**  
   - `Teleport`：将组件渲染到 DOM 的任意位置（如弹窗）。  
   - `Suspense`：处理异步组件加载状态（显示 fallback 内容）。

4. **Vue3 的 Tree-shaking 优化**  
   - 按需引入 API，减小打包体积（如：`v-model` 可绑定多个值）。

---

### **五、性能优化**
1. **组件懒加载**  
   - 使用 `defineAsyncComponent` 或路由懒加载减少首屏体积。

2. **避免 v-if 和 v-for 同时使用**  
   - 优先用 `computed` 过滤数据，再渲染列表。

3. **长列表优化**  
   - 使用虚拟滚动（如 `vue-virtual-scroller`）减少 DOM 节点数量。

4. **Object.freeze 冻结数据**  
   - 对不需要响应式的数据冻结，减少劫持开销。

5. **SSR（服务端渲染）**  
   - 使用 Nuxt.js 提升首屏加载速度和 SEO。

---

### **六、实战问题**
1. **如何封装一个高复用性的组件？**  
   - 通过 `props` 控制行为，`slots` 扩展内容，`emit` 事件通信，提供清晰的文档。

2. **如何实现权限控制？**  
   - 路由守卫校验用户角色，动态生成可访问路由（`addRoute`）。

3. **如何处理 Vue 中的内存泄漏？**  
   - 及时销毁定时器、事件监听，避免在全局变量中保留组件引用。

4. **Vue3 迁移注意事项**  
   - 生命周期钩子更名（`beforeDestroy` → `beforeUnmount`），`$children` 移除，使用 `setup` 替代选项式 API。
