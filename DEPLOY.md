# 部署说明：让其他人访问

本项目是 Vite + React 单页应用，部署前先构建，再把构建产物放到支持「所有路径回退到 index.html」的 Web 服务器上。

---

## 1. 本地构建

```bash
pnpm install
pnpm run build
```

构建产物在 `dist/` 目录。

---

## 2. 部署方式选一种即可

### 方式 A：Vercel（推荐，免费、有 HTTPS）

1. 将代码推送到 GitHub/GitLab。
2. 打开 [vercel.com](https://vercel.com)，用 Git 账号登录，导入该仓库。
3. 保持默认：框架选 Vite，构建命令 `pnpm run build`，输出目录 `dist`。
4. 部署完成后会得到一个 `https://xxx.vercel.app` 的地址，他人即可访问。

项目根目录已包含 `vercel.json`，Vercel 会自动处理 SPA 路由。

---

### 方式 B：Netlify

1. 代码推送到 Git 仓库。
2. 在 [netlify.com](https://netlify.com) 添加站点，连接该仓库。
3. 构建命令：`pnpm run build`，发布目录：`dist`。
4. 在「构建与部署」→「重定向」中新增一条：  
   - 规则：`/*` → `/index.html`，状态码：`200`（保证前端路由刷新不 404）。

---

### 方式 C：自建服务器（Nginx）

1. 在服务器上执行 `pnpm run build`，或在本机构建后把 `dist/` 上传到服务器。
2. 用 Nginx 托管 `dist` 目录，并配置 SPA 回退。示例配置见项目中的 `nginx.conf.example`。
3. 绑定域名或使用服务器 IP，他人通过 `http(s)://你的域名或IP` 访问。

---

### 方式 D：Docker

适合在自有服务器或内网用 Docker 跑。

```bash
# 构建镜像
docker build -t data-platform .

# 运行（映射到 80 端口）
docker run -d -p 80:80 --name data-platform data-platform
```

他人通过 `http://服务器IP` 访问。项目已包含 `Dockerfile`。

---

## 3. 注意事项

- **路由**：必须让服务器对所有路径返回 `index.html`（即 SPA fallback），否则直接访问或刷新子路径会 404。
- **HTTPS**：对外提供访问建议用 HTTPS（Vercel/Netlify 自带；自建可用 Let’s Encrypt）。
- **后端 API**：若将来接真实后端，需在 Vite 或 Nginx 中配置代理，或设置好生产环境 API 地址。
