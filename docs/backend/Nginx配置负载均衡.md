配置 Nginx 实现负载均衡的步骤如下，分为基础配置和进阶选项：

---

### **一、基础负载均衡配置**
1. **安装 Nginx**
   ```bash
   sudo apt update && sudo apt install nginx  # Debian/Ubuntu
   sudo yum install nginx                     # CentOS/RHEL
   ```

2. **编辑配置文件**
   在 `http` 块内添加 `upstream` 模块定义后端服务器组：
   ```nginx
   http {
       upstream backend_servers {
           # 默认使用轮询（Round Robin）策略
           server 192.168.1.101:80;
           server 192.168.1.102:80;
           server 192.168.1.103:80;
       }

       server {
           listen 80;
           server_name your-domain.com;

           location / {
               proxy_pass http://backend_servers;
               proxy_set_header Host $host;
               proxy_set_header X-Real-IP $remote_addr;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           }
       }
   }
   ```

---

### **二、负载均衡算法**
按需选择以下策略：
1. **轮询（Round Robin）**
   ```nginx
   upstream backend_servers {
       server 192.168.1.101;
       server 192.168.1.102;
   }
   ```

2. **加权轮询（Weighted Round Robin）**
   ```nginx
   upstream backend_servers {
       server 192.168.1.101 weight=3;  # 3/5 的请求分配到此服务器
       server 192.168.1.102 weight=2;
   }
   ```

3. **IP 哈希（IP Hash，保持会话）**
   ```nginx
   upstream backend_servers {
       ip_hash;
       server 192.168.1.101;
       server 192.168.1.102;
   }
   ```

4. **最少连接（Least Connections）**
   ```nginx
   upstream backend_servers {
       least_conn;
       server 192.168.1.101;
       server 192.168.1.102;
   }
   ```

---

### **三、健康检查与容错**
1. **被动健康检查**
   ```nginx
   upstream backend_servers {
       server 192.168.1.101 max_fails=3 fail_timeout=30s;
       server 192.168.1.102 max_fails=3 fail_timeout=30s;
   }
   ```
   - `max_fails`: 允许失败次数。
   - `fail_timeout`: 服务器被标记为不可用的超时时间。

2. **主动健康检查（需 Nginx Plus 或第三方模块）**
   ```nginx
   health_check interval=5s uri=/health_check;
   ```

---

### **四、HTTPS 后端支持**
若后端服务使用 HTTPS：
```nginx
upstream backend_servers {
    server 192.168.1.101:443;
}

server {
    location / {
        proxy_pass https://backend_servers;
        proxy_ssl_verify off;  # 可选：跳过证书验证（测试环境用）
    }
}
```

---

### **五、重载配置**
```bash
sudo nginx -t          # 测试配置语法
sudo systemctl reload nginx  # 应用新配置
```

---

### **六、调试与日志**
- 查看错误日志：
  ```bash
  tail -f /var/log/nginx/error.log
  ```
- 检查后端响应：
  ```nginx
  location / {
      proxy_pass http://backend_servers;
      proxy_intercept_errors on;
      error_page 500 502 503 504 /custom_error.html;
  }
  ```

---

**示例完整配置：**
```nginx
http {
    upstream backend {
        least_conn;
        server 10.0.0.1:80 weight=2;
        server 10.0.0.2:80;
        server 10.0.0.3:80 backup;  # 备用服务器（当其他服务器宕机时启用）
    }

    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

**注意事项：**
- 确保后端服务器的防火墙允许 Nginx 访问。
- 使用 `sticky` 模块（需额外安装）实现基于 Cookie 的会话保持。
- 调整 `keepalive` 参数优化长连接。