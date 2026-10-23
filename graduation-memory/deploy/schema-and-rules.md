# 时光寄 · 数据库初始化脚本

> 微信云开发的集合权限规则 **不能通过云函数 API 批量创建**（只开放了集合/索引的 API），
> 所以这一步需要手动贴到「云开发控制台 → 数据库 → 权限设置」里。
> 下面的 JSON 格式就是控制台自定义规则的语法，可以整段复制。

---

## 🟢 users 集合（学生档案）

```json
{
  "read":  "_openid == auth.openid",
  "write": "_openid == auth.openid",
  "create": "_openid == auth.openid",
  "update": "_openid == auth.openid",
  "delete": "_openid == auth.openid"
}
```

## 🟢 teachers 集合（老师名录 · 学生维护）

```json
{
  "read":  "_openid == auth.openid",
  "write": "_openid == auth.openid",
  "create": "_openid == auth.openid",
  "update": "_openid == auth.openid",
  "delete": "_openid == auth.openid"
}
```

## 🟢 memories 集合（共同回忆 · 学生写）

```json
{
  "read":  "_openid == auth.openid",
  "write": "_openid == auth.openid",
  "create": "_openid == auth.openid",
  "update": "_openid == auth.openid",
  "delete": "_openid == auth.openid"
}
```

## 🔴 responses 集合（老师写给学生的评价 · 数据隔离核心）

```json
{
  "read":  "auth.openid in [studentOpenid, _openid]",
  "write": "_openid == auth.openid",
  "create": "_openid == auth.openid",
  "update": "_openid == auth.openid",
  "delete": "_openid == auth.openid"
}
```

### 规则语义

| 字段 | 说明 |
|------|------|
| `auth.openid` | 当前请求者（前端）的 openid，由微信云开发自动注入 |
| `_openid` | 记录所有者的 openid |
| `studentOpenid` | responses 记录里存的"被评价学生"的 openid |

**效果**：
- 写评价的老师（`_openid == auth.openid`）→ 可以写、可以改、可以删自己写的
- 被评价的学生（`studentOpenid == auth.openid`）→ 只能读
- 其他任何用户 → 完全看不到这条记录 ✅

### 配置步骤

1. 打开微信开发者工具
2. 顶部 **云开发** 按钮 → 进入云开发控制台
3. 左侧菜单 **数据库**
4. 分别点四张集合 → **权限设置** → 切换到 **自定义安全规则**
5. 把上面对应的 JSON 整段粘进去 → 保存

---

## 📌 索引（已由 initSchema action 创建，仅供查看）

| 集合 | 索引字段 | 用途 |
|------|---------|------|
| teachers | `_openid` | 学生查自己的老师列表 |
| teachers | `inviteToken` | 老师端通过邀请码直达 |
| memories | `teacherId` | 按老师聚合共同回忆 |
| memories | `_openid` | 学生查自己写的所有回忆 |
| responses | `teacherId` | 老师打开自己写的评价 |
| responses | `studentOpenid` | 学生首页聚合所有老师的评价 |
