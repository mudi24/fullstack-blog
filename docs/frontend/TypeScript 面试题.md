# TypeScript 面试题

### **一、基础概念**
1. **TypeScript 是什么？和 JavaScript 的区别？**  
   - TypeScript 是 JavaScript 的超集，添加了静态类型系统，支持 ES6+ 语法，最终编译为 JavaScript。
   - 区别：静态类型检查、接口、泛型等特性，更适合大型项目。

2. **静态类型检查的优势**  
   - 提前发现类型错误，提高代码健壮性；增强 IDE 智能提示；代码可读性和可维护性更高。

3. **类型注解（Type Annotations）的作用**  
   - 显式声明变量、函数参数和返回值的类型，例如：  
     ```typescript
     let age: number = 25;
     function greet(name: string): string { return `Hello, ${name}`; }
     ```

---

### **二、类型系统**
1. **常见基础类型**  
   - `string`, `number`, `boolean`, `array`, `tuple`, `enum`, `any`, `unknown`, `void`, `null`, `undefined`, `never`。

2. **`any` 和 `unknown` 的区别**  
   - `any` 绕过类型检查，`unknown` 是类型安全的顶级类型，使用时需显式断言或类型收窄。

3. **联合类型（Union Types）和交叉类型（Intersection Types）**  
   - 联合类型：`string | number`（可以是其中一种类型）。  
   - 交叉类型：`A & B`（同时满足 A 和 B 的类型）。

4. **类型断言（Type Assertion）**  
   - 手动指定类型：`let value = someValue as string;` 或 `<string>someValue`。

---

### **三、接口和类型别名**
1. **`interface` 和 `type` 的区别**  
   - `interface` 可扩展（通过 `extends`），支持声明合并；  
   - `type` 可定义联合、交叉类型等复杂类型，不可重复声明。

2. **可选属性和只读属性**  
   - `interface User { name?: string; readonly id: number; }`

3. **函数类型定义**  
   ```typescript
   interface SearchFunc {
     (source: string, keyword: string): boolean;
   }
   ```

---

### **四、高级类型**
1. **泛型（Generics）的作用和示例**  
   - 提高代码复用性和类型安全性：  
     ```typescript
     function identity<T>(arg: T): T { return arg; }
     ```

2. **类型守卫（Type Guards）**  
   - `typeof`, `instanceof`, `in`, 自定义类型谓词：  
     ```typescript
     function isString(value: any): value is string {
       return typeof value === "string";
     }
     ```

3. **`keyof` 和 `typeof` 的作用**  
   - `keyof T` 获取类型 T 的键集合；  
   - `typeof` 获取变量类型（在类型上下文中）。

4. **工具类型（Utility Types）**  
   - `Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`。

---

### **五、类和装饰器**
1. **类的访问修饰符**  
   - `public`（默认）、`private`、`protected`、`readonly`。

2. **抽象类（Abstract Class）**  
   - 不能被实例化，用于定义抽象方法（需子类实现）：  
     ```typescript
     abstract class Animal {
       abstract makeSound(): void;
     }
     ```

3. **装饰器（Decorators）的作用**  
   - 修改类、方法、属性等的行为（常用于日志、权限校验等）。

---

### **六、模块和配置**
1. **`namespace` 和 `module` 的区别**  
   - `namespace` 用于逻辑分组（旧语法），`module` 对应 ES6 模块。

2. **`tsconfig.json` 常见配置项**  
   - `target`: 编译目标版本（如 `ES6`）；  
   - `strict`: 启用严格类型检查；  
   - `moduleResolution`: 模块解析策略（如 `node`）。

3. **声明文件（`.d.ts`）的作用**  
   - 为第三方库或无类型定义的代码提供类型声明。

---

### **七、实战问题**
1. **如何处理第三方库缺少类型定义？**  
   - 使用 `@types/<package-name>` 安装社区类型声明，或手动编写 `.d.ts` 文件。

2. **TypeScript 中如何实现函数重载？**  
   - 通过声明多个函数签名，最后实现一个通用函数：  
     ```typescript
     function add(a: number, b: number): number;
     function add(a: string, b: string): string;
     function add(a: any, b: any): any { return a + b; }
     ```

3. **枚举和字面量联合类型的区别**  
   - 枚举生成实际代码，支持反向映射；字面量联合类型更轻量。

---

### **八、进阶问题**
1. **条件类型（Conditional Types）**  
   - `T extends U ? X : Y`，常用于工具类型（如 `Exclude<T, U>`）。

2. **`infer` 关键字的作用**  
   - 在条件类型中推断类型变量，例如提取函数返回值类型：  
     ```typescript
     type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
     ```

3. **类型兼容性的规则（Duck Typing）**  
   - 如果类型结构兼容，则认为是相同类型（“形状”匹配即可）。

---

### **高频考点总结**
- 类型系统（联合、交叉、泛型）、接口与类型别名区别、工具类型、装饰器、类型守卫、模块解析、`tsconfig.json` 配置。
