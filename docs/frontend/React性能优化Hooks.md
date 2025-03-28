# React用于性能优化的Hooks

---

### 1. **`useMemo`**
- **作用**：缓存计算结果，避免重复执行高开销的运算。
- **使用场景**：当某个计算结果需要大量计算时（如复杂的数据转换、过滤、排序等），可以用 `useMemo` 缓存结果，仅在依赖项变化时重新计算。
- **示例**：
  ```jsx
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```

---

### 2. **`useCallback`**
- **作用**：缓存函数引用，避免因函数重新创建导致子组件不必要的渲染。
- **使用场景**：当需要将函数传递给子组件（尤其是用 `React.memo` 优化的子组件）时，用 `useCallback` 保持函数引用不变。
- **示例**：
  ```jsx
  const memoizedCallback = useCallback(() => {
    doSomething(a, b);
  }, [a, b]);
  ```

---

### 3. **`useTransition`**（React 18+）
- **作用**：标记非紧急的状态更新为“过渡更新”（低优先级），避免阻塞用户交互。
- **使用场景**：优化长列表渲染、搜索输入等场景，让高优先级的更新（如用户输入）优先执行。
- **示例**：
  ```jsx
  const [isPending, startTransition] = useTransition();
  startTransition(() => {
    setNonUrgentState(newValue); // 低优先级更新
  });
  ```

---

### 4. **`useDeferredValue`**（React 18+）
- **作用**：延迟某个值的更新，直到浏览器空闲时再处理。
- **使用场景**：用于优化输入框联想搜索、大数据量渲染等场景，避免输入卡顿。
- **示例**：
  ```jsx
  const deferredValue = useDeferredValue(value); // value 是高优先级更新
  // 使用 deferredValue 渲染低优先级内容
  ```

---

### 补充说明
- **`React.memo`**（非 Hook，但常配合使用）：
  - 用于优化函数组件的渲染行为，通过浅比较 props 变化决定是否重新渲染。
  - 需结合 `useMemo` 或 `useCallback` 使用，避免因 props 中的函数或对象引用变化导致失效。

---

### 优化原则
1. **避免过早优化**：只在性能问题实际出现时使用这些 Hooks。
2. **合理设置依赖项**：确保 `useMemo`、`useCallback` 的依赖项准确，避免遗漏或冗余。
3. **结合性能工具**：使用 React DevTools 的 Profiler 和组件渲染跟踪功能定位问题。

通过合理组合这些 Hooks，可以有效减少不必要的渲染和计算，提升 React 应用的性能。