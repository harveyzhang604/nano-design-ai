#!/bin/bash

# 测试新增和修改的功能

echo "=== 测试时间: $(date '+%Y-%m-%d %H:%M:%S') ==="
echo ""

# 测试 API 端点是否存在
echo "=== 测试 API 端点 ==="
for endpoint in baby-prediction filter gender-swap hairstyle makeup tattoo outfit-change sketch-to-image product-photo age-transform interior-design fashion-model greeting-card; do
  status=$(curl -s -o /dev/null -w "%{http_code}" https://talkphoto.app/api/$endpoint)
  if [ "$status" = "405" ] || [ "$status" = "200" ]; then
    echo "✅ $endpoint - $status"
  else
    echo "❌ $endpoint - $status"
  fi
done

echo ""
echo "=== 测试前端显示 ==="
curl -s https://talkphoto.app/tools | grep -o "id: '[^']*'" | wc -l
echo "个功能"

echo ""
echo "=== 检查新功能是否显示 ==="
for func in baby-prediction filter gender-swap hairstyle makeup tattoo outfit-change; do
  if curl -s https://talkphoto.app/tools | grep -q "id: '$func'"; then
    echo "✅ $func"
  else
    echo "❌ $func"
  fi
done
