#!/bin/bash

# 从 wrangler.toml 或其他配置文件查找 R2 配置
echo "=== 查找 R2 配置 ==="

# 检查 wrangler.toml
if [ -f "wrangler.toml" ]; then
  echo "wrangler.toml:"
  grep -i "r2\|bucket" wrangler.toml || echo "未找到 R2 配置"
fi

# 检查 .dev.vars
if [ -f ".dev.vars" ]; then
  echo ".dev.vars:"
  grep "R2_" .dev.vars || echo "未找到 R2 配置"
fi

# 检查 package.json 的 scripts
echo ""
echo "=== 检查之前成功的上传记录 ==="
git log --all --grep="上传\|upload\|R2" --oneline | head -5

