# JWT（JSON Web Token） 认证详解

### 一、基本概念
JWT 是一种基于 JSON 的开放标准（RFC 7519），用于在各方之间安全地传输信息。JWT 通常用于：
1. 身份认证
2. 信息交换
3. 授权管理

### 二、JWT 结构
JWT 由三部分组成，用点（.）分隔：
```plaintext
Header.Payload.Signature
```

1. **Header（头部）**
```json
{
  "alg": "HS256",  // 签名算法
  "typ": "JWT"     // token类型
}
```

2. **Payload（负载）**
```json
{
  "sub": "1234567890",    // subject（用户ID）
  "name": "John Doe",     // 自定义数据
  "iat": 1516239022,      // 签发时间
  "exp": 1516242622      // 过期时间
}
```

3. **Signature（签名）**
```javascript
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### 三、认证流程
1. **登录流程**
```typescript:/Users/kaiyao/AI/fullstack-blog/web/src/lib/auth.ts
async function login(username: string, password: string) {
  // 1. 发送登录请求
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

  // 2. 获取 JWT token
  const { token } = await response.json();
  
  // 3. 存储 token
  localStorage.setItem('token', token);
  
  // 4. 添加到请求头
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
```

2. **请求拦截**
```typescript:/Users/kaiyao/AI/fullstack-blog/web/src/lib/axios.ts
import axios from 'axios';

// 请求拦截器
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // token 过期或无效，跳转登录
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 四、安全考虑

1. **Token 存储**
- 推荐存储在 HttpOnly Cookie 中
- 避免存储在 localStorage（防止 XSS 攻击）

2. **防止 Token 被盗**
```typescript
// 1. 设置合理的过期时间
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// 2. 使用刷新令牌
interface Tokens {
  accessToken: string;
  refreshToken: string;
}

async function refreshTokens(refreshToken: string): Promise<Tokens> {
  const response = await fetch('/api/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    }
  });
  return response.json();
}
```

3. **Token 撤销**
```typescript
// 维护黑名单
const tokenBlacklist = new Set<string>();

function revokeToken(token: string) {
  tokenBlacklist.add(token);
}

function isTokenRevoked(token: string): boolean {
  return tokenBlacklist.has(token);
}
```

### 五、最佳实践

1. **错误处理**
```typescript
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // token 有效
} catch (err) {
  if (err instanceof jwt.TokenExpiredError) {
    // token 过期
  } else if (err instanceof jwt.JsonWebTokenError) {
    // token 无效
  }
}
```

2. **自动刷新**
```typescript
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401 && !error.config._retry) {
      if (isRefreshing) {
        // 等待其他请求刷新完成
        return new Promise(resolve => {
          refreshSubscribers.push(token => {
            error.config.headers.Authorization = `Bearer ${token}`;
            resolve(axios(error.config));
          });
        });
      }

      isRefreshing = true;
      error.config._retry = true;

      try {
        const { accessToken } = await refreshTokens(refreshToken);
        refreshSubscribers.forEach(cb => cb(accessToken));
        refreshSubscribers = [];
        return axios(error.config);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

### 六、优缺点

**优点：**
1. 无状态，减少服务器存储压力
2. 跨域支持好
3. 扩展性强

**缺点：**
1. Token 一旦签发，无法在过期前废除
2. Payload 部分可以解码，不要存储敏感信息
3. Token 会增加请求头大小

需要根据具体场景选择合适的认证方案，JWT 特别适合分布式系统和微服务架构。