# Pinia 面试题

---

### **1. Pinia 基础概念**
#### **Q1: 什么是 Pinia？**
- **答案**:  
  Pinia 是 Vue.js 的轻量级状态管理库，替代 Vuex 成为 Vue 3 官方推荐的状态管理工具。它提供**响应式状态管理**、**TypeScript 友好**的 API，并支持组合式（Composition API）和选项式（Options API）写法。

---

#### **Q2: Pinia 和 Vuex 的区别？**
- **答案**:  
  - **简化 API**：Pinia 去除 Vuex 中的 `mutations`，直接通过 `actions` 同步/异步修改状态。  
  - **TypeScript 支持**：Pinia 的 API 设计更符合 TS 类型推断。  
  - **模块化**：无需嵌套模块，每个 Store 独立且扁平化。  
  - **体积更小**：Pinia 源码更简洁，打包体积更小。  
  - **DevTools 集成**：支持 Vue DevTools 跟踪状态变化。

---

### **2. 核心概念**
#### **Q3: Pinia 的核心概念有哪些？**
- **答案**:  
  - **Store**: 状态容器，通过 `defineStore()` 定义。  
  - **State**: 响应式数据，类似组件的 `data`。  
  - **Getters**: 计算属性，类似 `computed`。  
  - **Actions**: 修改状态的方法，支持同步和异步。

---

#### **Q4: 如何定义和注册一个 Store？**
- **答案**:  
  ```javascript
  // 定义 Store（userStore.js）
  import { defineStore } from 'pinia';

  export const useUserStore = defineStore('user', {
    state: () => ({ name: 'Alice', age: 25 }),
    getters: {
      isAdult: (state) => state.age >= 18,
    },
    actions: {
      setName(newName) {
        this.name = newName;
      },
    },
  });

  // 在组件中使用
  import { useUserStore } from './userStore';
  const userStore = useUserStore();
  ```

---

### **3. 高级用法**
#### **Q5: 如何实现状态持久化（如 localStorage）？**
- **答案**:  
  使用插件（如 `pinia-plugin-persistedstate`）或手动实现：  
  ```javascript
  // 手动持久化
  const store = useUserStore();
  store.$subscribe((mutation, state) => {
    localStorage.setItem('user', JSON.stringify(state));
  });
  ```

---

#### **Q6: 如何在 Pinia 中使用 TypeScript？**
- **答案**:  
  通过泛型定义 State、Getters 和 Actions 的类型：  
  ```typescript
  interface UserState {
    name: string;
    age: number;
  }

  export const useUserStore = defineStore('user', {
    state: (): UserState => ({ name: 'Alice', age: 25 }),
    // ...
  });
  ```

---

#### **Q7: 如何重置 Store 的状态？**
- **答案**:  
  调用 `$reset()` 方法：  
  ```javascript
  const userStore = useUserStore();
  userStore.$reset(); // 重置为初始状态
  ```

---

### **4. 对比与原理**
#### **Q8: Pinia 为什么推荐替代 Vuex？**
- **答案**:  
  - **更简单的 API 设计**：去除冗余的 `mutations`。  
  - **更好的开发体验**：支持组合式 API 和 TypeScript。  
  - **更轻量**：源码体积小，无依赖。  
  - **更好的模块化**：无需动态注册模块。

---

#### **Q9: Pinia 的响应式原理是什么？**
- **答案**:  
  Pinia 基于 Vue 3 的 `reactive()` 实现响应式状态。Store 的 `state` 属性是一个 `reactive` 对象，Getters 通过 `computed()` 实现。

---

### **5. 实战场景**
#### **Q10: 如何跨组件共享状态？**
- **答案**:  
  在组件中导入同一个 Store 实例：  
  ```javascript
  // ComponentA.vue
  const userStore = useUserStore();
  userStore.name = 'Bob';

  // ComponentB.vue
  const userStore = useUserStore();
  console.log(userStore.name); // 输出 'Bob'
  ```

---

#### **Q11: 如何在服务端渲染（SSR）中使用 Pinia？**
- **答案**:  
  使用 `pinia` 的 `createPinia()` 在服务端和客户端分别创建实例，并通过 `hydrate()` 同步状态。

---

### **6. 错误处理**
#### **Q12: 如何捕获 Actions 中的错误？**
- **答案**:  
  在 Action 中使用 `try/catch`，或在调用时捕获：  
  ```javascript
  // 定义 Action
  async fetchData() {
    try {
      this.data = await api.getData();
    } catch (error) {
      console.error(error);
    }
  }

  // 调用时捕获
  userStore.fetchData().catch(error => { ... });
  ```

---

### **总结**
Pinia 的核心优势在于**简化状态管理流程**和**更好的开发体验**。掌握其核心概念（Store/State/Getters/Actions）、与 Vuex 的对比、插件机制和 TypeScript 集成，是面试中的重点。