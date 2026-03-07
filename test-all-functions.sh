#!/bin/bash
# 测试所有26个功能的API端点
# 2026-03-07 Week 1 紧急修复

BASE_URL="https://talkphoto.app"
TEST_IMAGE="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"

echo "=========================================="
echo "测试 Nano Design AI 所有26个功能"
echo "=========================================="
echo ""

# 定义所有26个功能
FUNCTIONS=(
  "remove-bg"
  "upscale"
  "restore"
  "colorize"
  "erase"
  "change-bg"
  "portrait"
  "enhance"
  "style-transfer"
  "sketch-to-image"
  "avatar"
  "product-photo"
  "meme"
  "greeting-card"
  "interior-design"
  "fashion-model"
  "baby-prediction"
  "age-transform"
  "gender-swap"
  "hairstyle"
  "makeup"
  "pet-cartoon"
  "tattoo"
  "face-swap"
  "photoshoot"
  "filter"
)

SUCCESS=0
FAILED=0
FAILED_LIST=()

for func in "${FUNCTIONS[@]}"; do
  echo -n "测试 $func ... "
  
  response=$(curl -s -X POST "$BASE_URL/api/$func" \
    -H "Content-Type: application/json" \
    -d "{\"imageUrl\":\"$TEST_IMAGE\"}" \
    --max-time 30)
  
  if echo "$response" | grep -q '"imageUrl"'; then
    echo "✅ 成功"
    ((SUCCESS++))
  else
    echo "❌ 失败"
    ((FAILED++))
    FAILED_LIST+=("$func")
    echo "   错误: $response" | head -c 100
    echo ""
  fi
done

echo ""
echo "=========================================="
echo "测试结果汇总"
echo "=========================================="
echo "成功: $SUCCESS / 26"
echo "失败: $FAILED / 26"
echo ""

if [ $FAILED -gt 0 ]; then
  echo "失败的功能:"
  for func in "${FAILED_LIST[@]}"; do
    echo "  - $func"
  done
  exit 1
else
  echo "🎉 所有功能测试通过！"
  exit 0
fi
