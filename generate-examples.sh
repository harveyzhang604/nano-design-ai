#!/bin/bash

# 为缺失的功能生成示例图片
# 使用现有 API 自我生成真实效果

BASE_URL="https://talkphoto.app/api"
TEST_IMAGE="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
TEST_IMAGE2="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
OUTPUT_DIR="public"

echo "=== 生成示例图片 ==="
echo ""

# 1. age-transform
echo "1. 生成 age-transform-example.webp..."
curl -s -X POST $BASE_URL/age-transform \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\",\"targetAge\":60}" \
  | jq -r '.imageUrl' | sed 's/^data:image\/png;base64,//' | base64 -d > $OUTPUT_DIR/age-transform-example.png

# 2. gender-swap
echo "2. 生成 gender-swap-example.webp..."
curl -s -X POST $BASE_URL/gender-swap \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\"}" \
  | jq -r '.imageUrl' | sed 's/^data:image\/png;base64,//' | base64 -d > $OUTPUT_DIR/gender-swap-example.png

# 3. hairstyle
echo "3. 生成 hairstyle-example.webp..."
curl -s -X POST $BASE_URL/hairstyle \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\",\"hairstyle\":\"long\"}" \
  | jq -r '.imageUrl' | sed 's/^data:image\/png;base64,//' | base64 -d > $OUTPUT_DIR/hairstyle-example.png

# 4. makeup
echo "4. 生成 makeup-example.webp..."
curl -s -X POST $BASE_URL/makeup \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\",\"makeupStyle\":\"glamorous\"}" \
  | jq -r '.imageUrl' | sed 's/^data:image\/png;base64,//' | base64 -d > $OUTPUT_DIR/makeup-example.png

# 5. tattoo
echo "5. 生成 tattoo-example.webp..."
curl -s -X POST $BASE_URL/tattoo \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\",\"tattooDesign\":\"dragon\",\"bodyPart\":\"arm\"}" \
  | jq -r '.imageUrl' | sed 's/^data:image\/png;base64,//' | base64 -d > $OUTPUT_DIR/tattoo-example.png

# 6. ghibli
echo "6. 生成 ghibli-example.webp..."
curl -s -X POST $BASE_URL/ghibli \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\"}" \
  | jq -r '.imageUrl' | sed 's/^data:image\/png;base64,//' | base64 -d > $OUTPUT_DIR/ghibli-example.png

echo ""
echo "=== 生成完成 ==="
echo "生成了 6 个示例图片"
