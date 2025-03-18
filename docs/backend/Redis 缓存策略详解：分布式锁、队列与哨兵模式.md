---
title: Redis 缓存策略详解：分布式锁、队列与哨兵模式
date: 2025-01-15
readTime: 20 min read
category: 后端
---

作为全栈开发工程师，深入理解 Redis 的核心缓存策略对构建高性能、高可用的分布式系统至关重要。以下从 **分布式锁**、**队列** 和 **哨兵模式** 三个方向展开深入分析，结合实际场景和最佳实践。

---

### 一、分布式锁（Distributed Lock）

#### 1. **核心需求**
在分布式系统中，多个节点需要**协调对共享资源的访问**（如库存扣减、任务调度），避免并发操作导致数据不一致。

#### 2. **实现方案**
- **SETNX + Lua 脚本（基础版）**
  ```redis
  SET key unique_value NX PX 30000  # NX表示不存在才设置，PX为过期时间（毫秒）
  ```
  释放锁时需验证 `unique_value`（如 UUID），防止误删其他客户端的锁：
  ```lua
  if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
  else
      return 0
  end
  ```
  **问题**：单节点 Redis 锁在故障转移时可能失效（主从切换导致锁丢失）。

- **RedLock 算法（多节点容错）**
  1. 客户端向 N 个独立的 Redis 节点顺序请求加锁。
  2. 当且仅当超过半数节点（N/2 +1）加锁成功，且总耗时小于锁的有效期，视为成功。
  3. 释放锁时向所有节点发送删除请求。
  **优点**：提升容错性；**缺点**：实现复杂，性能较低。

- **Redisson 客户端（推荐实践）**
  Java 客户端 Redisson 实现了基于看门狗（Watchdog）的自动续期锁：
  ```java
  RLock lock = redisson.getLock("myLock");
  lock.lock();  // 默认30秒过期，看门狗每10秒续期
  try {
      // 业务逻辑
  } finally {
      lock.unlock();
  }
  ```

#### 3. **关键问题与优化**
- **锁续期**：处理业务逻辑超时，需后台线程定期续期（如 Redisson 的 Watchdog）。
- **锁竞争**：通过队列或公平锁减少资源争用。
- **网络分区**：可能导致锁的脑裂，需结合业务做幂等处理。

---

### 二、队列（Queue）

Redis 提供多种队列模式，适用于异步处理、削峰填谷和解耦系统组件。

#### 1. **List 实现基础队列**
- **生产者**：`LPUSH` 插入消息到列表头部。
- **消费者**：`BRPOP` 阻塞弹出尾部消息。
  ```redis
  LPUSH task_queue "task1"
  BRPOP task_queue 30  # 阻塞30秒等待消息
  ```
  **特点**：支持持久化，但无消息确认机制（消息可能丢失）。

#### 2. **Pub/Sub 发布订阅**
- 实时广播消息，无持久化：
  ```redis
  PUBLISH channel "message"
  SUBSCRIBE channel
  ```
  **适用场景**：实时通知（如聊天室），但消息可能丢失。

#### 3. **Stream（Redis 5.0+）**
 支持消费者组（Consumer Group）和消息确认：
```redis
XADD mystream * field1 value1  # 添加消息
XGROUP CREATE mystream mygroup $  # 创建消费者组
XREADGROUP GROUP mygroup consumer1 BLOCK 0 STREAMS mystream > 
```
- **优势**：消息持久化、支持多消费者组、消息ACK机制。
- **应用场景**：订单处理流水线、日志收集。

#### 4. **延迟队列**
使用 **Sorted Set** 按时间戳排序：
```redis
ZADD delay_queue 1640995200 "task1"  # 插入任务，score为执行时间
ZRANGEBYSCORE delay_queue 0 <current_timestamp>  # 获取到期任务
```
**适用场景**：定时任务调度（如订单超时关闭）。

---

### 三、哨兵模式（Sentinel）

#### 1. **架构目标**
实现 Redis 高可用（HA）：监控主从节点，自动故障转移（Failover），提供配置中心。

#### 2. **工作原理**
- **监控**：哨兵节点定期检测主从节点健康状态。
- **主观下线（SDOWN）**：单个哨兵认为节点不可达。
- **客观下线（ODOWN）**：多个哨兵（通过投票）确认主节点下线。
- **选举 Leader 哨兵**：基于 Raft 算法选出 Leader 执行故障转移。
- **故障转移**：提升从节点为新主节点，并通知客户端。

#### 3. **配置示例**
```conf
# sentinel.conf
sentinel monitor mymaster 127.0.0.1 6379 2  # 监控主节点，2为法定人数
sentinel down-after-milliseconds mymaster 5000  # 5秒无响应视为下线
sentinel failover-timeout mymaster 60000  # 故障转移超时时间
```

#### 4. **客户端接入**
客户端通过哨兵获取主节点地址：
```java
JedisSentinelPool pool = new JedisSentinelPool("mymaster", sentinels);
Jedis jedis = pool.getResource();
```

#### 5. **注意事项**
- **部署奇数个哨兵**（如3或5）避免脑裂。
- **网络分区处理**：可能发生旧主节点继续写入导致数据不一致，需配置 `min-slaves-to-write` 限制写入。

---

### 四、对比与选型建议

| 策略          | 适用场景                          | 优缺点                                  |
|---------------|----------------------------------|----------------------------------------|
| **分布式锁**  | 资源争用（如秒杀）               | 强一致性，但需处理锁续期和网络问题      |
| **List 队列** | 简单任务队列                     | 轻量，但无消息确认                     |
| **Stream**    | 复杂消息流（需ACK、消费者组）    | 功能丰富，适合企业级应用               |
| **哨兵模式**  | 高可用主从架构                   | 自动故障转移，但扩容复杂，Cluster替代方案 |

---

### 五、总结与最佳实践
1. **分布式锁**：优先选择成熟客户端（如 Redisson），避免重复造轮子。
2. **队列**：根据消息可靠性需求选择 Stream 或 List，延迟任务用 Sorted Set。
3. **哨兵模式**：搭配主从复制，确保至少3个哨兵节点，监控网络延迟。

通过合理组合这些策略，可构建出高效、可靠的分布式系统架构。