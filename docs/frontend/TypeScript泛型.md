TypeScript 中的泛型（Generics）是一种强大的工具，用于编写灵活且类型安全的代码。以下是泛型的关键知识点和用法总结：

### 1. **基本概念**
泛型允许在定义函数、接口、类时**参数化类型**，使得这些结构可以处理多种类型，同时保持类型约束。通过泛型，可以避免重复代码，提升代码复用性。

```typescript
function identity<T>(arg: T): T {
  return arg;
}
// 使用
const output = identity<string>("hello"); // 显式指定类型
const inferred = identity(42); // 自动推断为number
```

### 2. **泛型约束**
通过 `extends` 关键字限制泛型参数的类型范围，确保符合特定结构：
```typescript
interface Lengthwise {
  length: number;
}
function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length);
}
logLength("abc"); // 合法，字符串有length属性
logLength([1, 2, 3]); // 合法
```

### 3. **泛型接口与类**
- **接口**：
  ```typescript
  interface KeyPair<T, U> {
    key: T;
    value: U;
  }
  const pair: KeyPair<number, string> = { key: 1, value: "one" };
  ```
- **类**：
  ```typescript
  class Box<T> {
    private content: T;
    constructor(value: T) {
      this.content = value;
    }
    getValue(): T {
      return this.content;
    }
  }
  const numberBox = new Box<number>(42);
  ```

### 4. **默认类型**
为泛型参数提供默认类型，简化调用：
```typescript
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}
const strArr = createArray(3, "x"); // T默认为string
```

### 5. **多类型参数**
支持多个泛型参数，处理不同类型组合：
```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
const merged = merge({ name: "Alice" }, { age: 30 });
```

### 6. **类型参数与约束**
结合 `keyof` 确保安全访问对象属性：
```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const obj = { name: "Bob", age: 25 };
const name = getProperty(obj, "name"); // 类型安全
```

### 7. **泛型与函数类型**
定义泛型函数类型或回调：
```typescript
type Mapper<T, U> = (item: T) => U;
const stringify: Mapper<number, string> = (n) => n.toString();
```

### 8. **高级用法**
- **工厂函数**：通过构造函数创建实例：
  ```typescript
  function create<T>(ctor: new () => T): T {
    return new ctor();
  }
  class MyClass {}
  const instance = create(MyClass);
  ```
- **条件类型**：结合 `extends` 和三元运算实现类型逻辑：
  ```typescript
  type IsString<T> = T extends string ? true : false;
  type A = IsString<"hello">; // true
  ```

### 9. **注意事项**
- **类型擦除**：泛型仅在编译时有效，运行时无类型信息。
- **避免过度使用**：合理使用泛型，避免代码复杂度上升。

### 总结
泛型在TypeScript中用于编写灵活且类型安全的代码，适用于函数、接口、类等场景。通过参数化类型、约束、默认值等特性，泛型显著提升了代码复用性和可维护性。理解其核心概念和常见模式，能够更高效地构建健壮的TypeScript应用。