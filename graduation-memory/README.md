# 时光寄 · 部署手册

> 本科四年的一页纸，寄给老师们。

---

## 0. 准备清单

| 项 | 说明 |
|----|------|
| HBuilderX | ≥ 3.99，用来开发与编译到 mp-weixin |
| 微信开发者工具 | 最新稳定版，用来跑模拟器 + 部署云函数 |
| 微信小程序 AppID | 去 [mp.weixin.qq.com](https://mp.weixin.qq.com/) 申请，**个人账号也可以** |
| 微信云开发环境 | 在开发者工具里一键开通，免费额度够用（5 万次/月调用、2GB 存储） |

---

## 1. 代码配置（3 处）

### 1.1 填 AppID

打开 `manifest.json`，把占位符替换成你的真实 AppID：

```jsonc
// manifest.json
"mp-weixin": {
    "appid": "wx你的真实AppID写这里"
}
```

### 1.2 填云环境 ID（两处）

微信开发者工具 → 工具栏「云开发」→ 顶部会显示环境名/ID（类似 `prod-3gxxxxx`）。

**第一处**：`utils/cloud.js`

```js
// 切真实环境用 false，切完自动走云函数
export const USE_MOCK = false
```

**第二处**：`App.vue` 的 onLaunch

```js
// #ifdef MP-WEIXIN
wx.cloud.init({
    env: 'prod-3gxxxxx',    // ← 换成你的环境 ID
    traceUser: true
})
// #endif
```

### 1.3 保留 mock 模式本地演示（可选）

不想上云时 `USE_MOCK = true`，HBuilderX 打开就能看完整流程，数据存内存（刷新会重置）。

---

## 2. 部署云函数

1. **在微信开发者工具里打开项目**：文件 → 导入项目 → 选中 `graduation-memory` 目录，AppID 填你自己的
2. **右键** `cloudfunctions/init` 目录 → **上传并部署：云端安装依赖**
3. 等待控制台输出 `上传成功 + 部署成功`

### 2.1 一键创建数据库（重点）

部署完云函数后，立刻在开发者工具里：

- 点击 `cloudfunctions/init/index.js` 打开
- 工具栏 **云开发** → 本地测试 / 云端测试
- 请求参数填入：

```json
{ "action": "initSchema" }
```

- 点击 **运行**，预期返回：

```json
{
  "code": 0,
  "data": {
    "collections": [
      "users ✓",
      "teachers ✓",
      "memories ✓",
      "responses ✓"
    ],
    "indexes": [
      "teachers/_openid_1 ✓",
      "teachers/inviteToken_1 ✓",
      "memories/teacherId_1 ✓",
      "memories/_openid_1 ✓",
      "responses/teacherId_1 ✓",
      "responses/studentOpenid_1 ✓"
    ]
  }
}
```

---

## 3. 设置数据库权限规则（最容易漏掉的一步）

回到 **云开发控制台 → 数据库 → 权限设置**，4 张集合依次配置：

### users（学生档案）
- 仅创建者可读写
- 规则：`"read": "_openid == auth.openid", "write": "_openid == auth.openid"`

### teachers（老师名录）
- 仅创建者可读写（每位学生的老师列表天然互隔离）
- 规则同上：`"read/write": "_openid == auth.openid"`

### memories（共同回忆）
- 仅创建者可读写
- 规则同上

### responses（老师写给学生的评价） ⭐ 这里特殊
- **学生能看、老师能写能改、其他老师看不到**
- 规则：

```
read:  auth.openid in [studentOpenid, _openid]
write: _openid == auth.openid
```

> 语义：`studentOpenid` 是被评价的学生 openid，`_openid` 是写评价老师的 openid。云函数 `submitResponse` 写入时会把这两个字段都填上。

**在控制台的操作**：点击 responses 集合 → 权限设置 → 「自定义安全规则」→ 粘贴上面两条即可。

---

## 4. 运行到小程序模拟器

HBuilderX → 打开目录 `graduation-memory` → 工具栏「运行」→「运行到小程序模拟器」→「微信开发者工具」

> 首次记得在微信开发者工具 → 设置 → 安全设置 → 开启服务端口

### 老师端怎么走？

两种方式：
1. **真实环境**：在学生端 `pages/invite/invite` 页点「直接分享」，转发到老师微信，老师点开即进入专属欢迎页
2. **mock 演示**：把页面路由手动改成 `/pages/teacher-welcome/teacher-welcome?token=ABC123`（token 换成某位老师的）

---

## 5. 上线前 Checklist

- [ ] `manifest.json` 的 AppID 已替换成真实的
- [ ] `utils/cloud.js` 的 `USE_MOCK` 改为 `false`
- [ ] `App.vue` 的 `wx.cloud.init.env` 已填真实环境 ID
- [ ] `cloudfunctions/init` 已部署 + 云端测试 `initSchema` 通过
- [ ] 4 张集合的权限规则已在云开发控制台配置（尤其是 responses 的 read 规则）
- [ ] 真机预览跑一遍学生端全流程 + 老师端全流程
- [ ] 确认 tabBar 图标路径在真机上正常显示

---

## 6. 数据模型速查

### users（学生档案）
```
_openid           string  ← 系统自动
nickName          string
avatarUrl         string
realName          string
school            string
major             string
gradYear          string   例 "2025-06"
bio               string
photoWall         array    [{ url, caption }]
createdAt         serverDate
```

### teachers（老师名录 · 学生维护）
```
_openid           string   ← 学生自己的 openid
name              string
subject           string
avatarUrl         string
memo              string   ← 学生写给这位老师的开场白
inviteToken       string   6位大写字母数字，系统生成
createdAt         serverDate
updatedAt         serverDate
```

### memories（共同回忆 · 学生写）
```
_openid           string   ← 学生自己的 openid
teacherId         string   ← teachers._id
kind              string   默认 "shared"
content           string
photos            array    [tempPath或cloudFileID]
date              string|timestamp
createdAt         serverDate
```

### responses（老师写给学生的评价 ⭐）
```
_openid           string   ← 写评价的老师 openid（关键！）
teacherId         string   ← 关联的 teachers._id
studentOpenid     string   ← 被评价的学生 openid（关键！）
evaluation        string   主评价内容
memories          array    老师也想补充的回忆（字符串数组）
photos            array    老师上传的合影
createdAt         serverDate
updatedAt         serverDate
```

> ⚠️ `teacherEnter` 云函数是老师端唯一的数据入口：通过 `inviteToken` 找到老师记录 → 拿到学生 openid → 聚合返回学生档案、共同回忆、已有评价。整条查询链路都在云函数里做，前端看不到学生/老师的 openid 具体值。

---

## 7. 常见踩坑

| 症状 | 原因 | 解决 |
|------|------|------|
| 老师端"邀请码无效" | inviteToken 没存进去 | 查数据库 teachers 集合是否有 inviteToken 字段，看云函数 createTeacher 是否成功 |
| 老师能打开但看不到内容 | responses 权限规则没设对 | 重新粘贴第 3 节的自定义规则 |
| 学生看不到老师写的评价 | listResponses 传的 openid 为空 | 检查 teacher-welcome 页面跳转时 studentOpenid 参数是否正确传递 |
| 云函数 initSchema 报"集合已存在" | 你已经手动创建过 | 忽略即可，继续走索引创建 |
| 真机 tabBar 图标不显示 | 微信小程序要求 tabBar 图片 ≤ 40KB 且本地路径 | 本项目图标仅 512B，符合要求 |
| 本地 mock 切云端后仍走 mock | `cloud.js` 里 USE_MOCK 没改成 false | 切记改完保存再跑 |

---

## 8. 免费额度够吗？

微信云开发基础版：
- 云函数调用：5 万次/月
- 数据库读写：5 万次/天
- 存储：2GB
- 流量：1GB/天

一位学生用整个大四毕业季（约 3 个月）给 10 位老师写，每天调用 < 50 次，完全在免费额度内。如果同学集体使用、量上来了，再升级到 19 元/月的基础版也够。

---

祝你毕业快乐 🌿
