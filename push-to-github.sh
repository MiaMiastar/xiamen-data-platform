#!/bin/bash
# 使用前：把下面 YOUR_GITHUB_USERNAME 改成你的 GitHub 用户名，然后在项目目录执行: bash push-to-github.sh

cd "$(dirname "$0")"
GITHUB_USER="YOUR_GITHUB_USERNAME"
REPO="xiamen-data-platform"

git init
git add .
git commit -m "Initial commit: 厦门数据处理平台"
git remote add origin "https://github.com/${GITHUB_USER}/${REPO}.git"
git branch -M main
git push -u origin main
