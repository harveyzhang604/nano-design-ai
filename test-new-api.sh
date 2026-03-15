#!/bin/bash

TEST_IMAGE="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"

echo "=== 测试新增功能 ==="
echo ""

# 1. baby-prediction
echo "1. 测试 baby-prediction..."
curl -s -X POST https://talkphoto.app/api/baby-prediction \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\",\"parent2ImageUrl\":\"$TEST_IMAGE\"}" \
  | jq -r '.error // "✅ 成功"' | head -1

# 2. filter
echo "2. 测试 filter..."
curl -s -X POST https://talkphoto.app/api/filter \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\",\"filterType\":\"vintage\"}" \
  | jq -r '.error // "✅ 成功"' | head -1

# 3. gender-swap
echo "3. 测试 gender-swap..."
curl -s -X POST https://talkphoto.app/api/gender-swap \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\"}" \
  | jq -r '.error // "✅ 成功"' | head -1

# 4. hairstyle
echo "4. 测试 hairstyle..."
curl -s -X POST https://talkphoto.app/api/hairstyle \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\",\"hairstyle\":\"short\"}" \
  | jq -r '.error // "✅ 成功"' | head -1

# 5. makeup
echo "5. 测试 makeup..."
curl -s -X POST https://talkphoto.app/api/makeup \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\",\"makeupStyle\":\"natural\"}" \
  | jq -r '.error // "✅ 成功"' | head -1

# 6. tattoo
echo "6. 测试 tattoo..."
curl -s -X POST https://talkphoto.app/api/tattoo \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\",\"tattooStyle\":\"tribal\"}" \
  | jq -r '.error // "✅ 成功"' | head -1

# 7. outfit-change
echo "7. 测试 outfit-change..."
curl -s -X POST https://talkphoto.app/api/outfit-change \
  -H "Content-Type: application/json" \
  -d "{\"imageUrl\":\"$TEST_IMAGE\",\"outfitStyle\":\"casual\"}" \
  | jq -r '.error // "✅ 成功"' | head -1

