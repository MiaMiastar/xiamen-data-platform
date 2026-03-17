# 把代码推送到 GitHub

按下面步骤操作即可。

---

## 1. 在项目目录里初始化 Git（仅第一次）

在终端里进入项目目录，然后执行：

```bash
cd "/Users/huangrong/Downloads/同步空间/AI Lab/厦门/厦门-数据处理平台 (Copy)"

# 若当前目录已在「别的」仓库里（例如整盘被 git 管理），先只在本目录建新仓库：
git init
```

---

## 2. 在 GitHub 上新建仓库

1. 打开 [github.com](https://github.com) 并登录。
2. 右上角 **+** → **New repository**。
3. 填写：
   - **Repository name**：例如 `xiamen-data-platform`
   - **Description**（可选）：例如「厦门数据处理平台」
   - 选 **Public** 或 **Private**
   - **不要**勾选 “Add a README” / “Add .gitignore”（本地已有）。
4. 点击 **Create repository**。  
   创建后会看到一个地址，例如：
   - HTTPS：`https://github.com/你的用户名/xiamen-data-platform.git`
   - SSH：`git@github.com:你的用户名/xiamen-data-platform.git`

---

## 3. 在本地提交并推送到 GitHub

在**项目目录**下执行（把下面的仓库地址换成你在第 2 步看到的）：

```bash
# 添加所有文件（.gitignore 会排除 node_modules、dist 等）
git add .
git commit -m "Initial commit: 厦门数据处理平台"

# 添加远程仓库（二选一）
# HTTPS（会提示输入 GitHub 用户名和密码/Token）：
git remote add origin https://github.com/你的用户名/xiamen-data-platform.git

# 或 SSH（需已配置 SSH key）：
# git remote add origin git@github.com:你的用户名/xiamen-data-platform.git

# 推送到 GitHub（首次推送并设置上游分支）
git push -u origin main
```

如果本地默认分支是 `master` 而不是 `main`，可以改为：

```bash
git branch -M main
git push -u origin main
```

---

## 4. 之后每次改完代码再推送

```bash
git add .
git commit -m "简短说明本次修改"
git push
```

---

## 常见问题

- **推送时要登录**：用 HTTPS 时，GitHub 已不支持账号密码，需用 [Personal Access Token](https://github.com/settings/tokens) 当密码；或改用 SSH（在 GitHub 设置里添加 SSH key）。
- **提示 “failed to push”**：检查网络、仓库地址是否正确、是否有写权限。
- **不想把整盘都纳入一个仓库**：务必在**项目目录内**执行 `git init`，不要在家目录或“同步空间”上层目录执行。
