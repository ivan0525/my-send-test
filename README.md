# 自动播放广告脚本 - GitHub Actions 自动化

这个项目通过 GitHub Actions 每天自动执行广告播放脚本,并将结果通过邮件通知。

## 功能特性

- ✅ 每天自动定时执行(北京时间上午 9 点)
- ✅ 自动播放所有广告并获取免费时长
- ✅ 执行完成后发送邮件通知
- ✅ 支持手动触发执行
- ✅ 敏感信息使用 GitHub Secrets 安全存储

## 快速开始

### 1. 创建 GitHub 仓库

1. 在 GitHub 上创建一个新的私有仓库(建议设为 Private)
2. 将本地代码推送到 GitHub

### 2. 配置 GitHub Secrets

在仓库中添加以下 Secrets(设置路径: Settings → Secrets and variables → Actions → New repository secret):

| Secret 名称 | 说明                            | 示例值                  |
| ----------- | ------------------------------- | ----------------------- |
| `GMAIL`     | 你的 Gmail 邮箱地址             | `your-email@gmail.com`  |
| `APP_PASS`  | Gmail 应用专用密码(16 位带空格) | `abcd efgh ijkl mnop`   |
| `API_TOKEN` | API 认证 Token                  | `eyJ0eXAiOiJKV1Q...`    |
| `RECIPIENT` | 接收邮件通知的邮箱地址          | `recipient@example.com` |

#### 如何获取 Gmail 应用专用密码:

1. 访问 [Google 账号安全设置](https://myaccount.google.com/security)
2. 启用"两步验证"
3. 在"两步验证"页面底部找到"应用专用密码"
4. 选择"邮件"和你的设备,生成 16 位密码
5. 复制完整密码(包含空格)到 `APP_PASS`

### 3. 推送代码到 GitHub

```bash
# 添加远程仓库(替换为你的仓库地址)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 推送代码
git branch -M main
git push -u origin main
```

### 4. 验证自动化设置

1. 进入仓库的 **Actions** 标签页
2. 查看是否有"每日自动执行广告脚本"工作流
3. 点击 **Run workflow** 按钮手动测试一次
4. 查看执行日志确认是否成功

## 定时执行说明

- **自动执行时间**: 每天北京时间上午 9:00 (UTC 1:00)
- **修改执行时间**: 编辑 [.github/workflows/daily-run.yml](.github/workflows/daily-run.yml) 文件中的 cron 表达式

### Cron 时间配置示例:

```yaml
# 每天 UTC 1:00 (北京时间 9:00)
- cron: "0 1 * * *"

# 每天 UTC 22:00 (北京时间次日 6:00)
- cron: "0 22 * * *"

# 每天两次: UTC 1:00 和 13:00 (北京时间 9:00 和 21:00)
- cron: "0 1,13 * * *"
```

## 手动执行

1. 进入仓库的 **Actions** 标签页
2. 选择"每日自动执行广告脚本"
3. 点击 **Run workflow** → **Run workflow**
4. 等待执行完成并查看日志

## 本地测试

```bash
# 安装依赖
npm install

# 运行脚本
node auto-play-adv.js
```

## 项目结构

```
.
├── auto-play-adv.js              # 主脚本文件
├── package.json                  # 项目配置
├── .github/
│   └── workflows/
│       └── daily-run.yml         # GitHub Actions 工作流配置
├── .gitignore                    # Git 忽略文件
└── README.md                     # 说明文档
```

## 注意事项

⚠️ **安全提醒**:

- 永远不要将敏感信息(密码、Token)直接写在代码中
- 使用 GitHub Secrets 存储所有敏感信息
- 建议将仓库设为 Private(私有)

⚠️ **Token 有效期**:

- API Token 可能会过期,如果脚本执行失败请检查 Token 是否有效
- 及时更新 GitHub Secrets 中的 `API_TOKEN`

## 常见问题

### Q: 如何查看执行日志?

A: 进入 Actions → 选择执行记录 → 点击查看详细日志

### Q: 脚本没有按时执行?

A: GitHub Actions 定时任务可能有 5-15 分钟延迟,这是正常现象

### Q: 如何停止自动执行?

A: 进入 Actions → 选择工作流 → 点击右上角 "..." → Disable workflow

### Q: 如何修改执行时间?

A: 编辑 `.github/workflows/daily-run.yml` 文件中的 cron 表达式

## License

MIT
