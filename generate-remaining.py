#!/usr/bin/env python3
import requests
import json
import base64
import os
import time

BASE_URL = "https://talkphoto.app/api"
TEST_IMAGE = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
TEST_IMAGE2 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
TEST_ROOM = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400"
TEST_PRODUCT = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
TEST_PET = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"
OUTPUT_DIR = "public"

def generate_example(api_name, params, output_name, retry=2):
    """生成示例图片"""
    print(f"生成 {output_name}...")
    for attempt in range(retry):
        try:
            response = requests.post(
                f"{BASE_URL}/{api_name}",
                json=params,
                timeout=90
            )
            
            if response.status_code == 200:
                data = response.json()
                image_url = data.get('imageUrl', '')
                
                if image_url.startswith('data:image'):
                    # Base64 格式
                    base64_data = image_url.split(',')[1]
                    image_data = base64.b64decode(base64_data)
                    
                    output_path = f"{OUTPUT_DIR}/{output_name}.png"
                    with open(output_path, 'wb') as f:
                        f.write(image_data)
                    print(f"✅ {output_name} - {len(image_data)} bytes")
                    return True
                elif image_url.startswith('http'):
                    # URL 格式
                    img_response = requests.get(image_url)
                    output_path = f"{OUTPUT_DIR}/{output_name}.png"
                    with open(output_path, 'wb') as f:
                        f.write(img_response.content)
                    print(f"✅ {output_name} - {len(img_response.content)} bytes")
                    return True
            else:
                if attempt < retry - 1:
                    print(f"⚠️ {output_name} - HTTP {response.status_code}, 重试...")
                    time.sleep(2)
                else:
                    print(f"❌ {output_name} - HTTP {response.status_code}")
                    return False
        except Exception as e:
            if attempt < retry - 1:
                print(f"⚠️ {output_name} - {str(e)}, 重试...")
                time.sleep(2)
            else:
                print(f"❌ {output_name} - {str(e)}")
                return False
    return False

# 剩余的 17 个示例图片
examples = [
    # P1 功能
    ("baby-prediction", {"parent1Url": TEST_IMAGE, "parent2Url": TEST_IMAGE2, "babyAge": "newborn"}, "baby-prediction-example"),
    ("filter", {"imageUrl": TEST_IMAGE, "filterType": "vintage"}, "filter-example"),
    ("sketch-to-image", {"imageUrl": TEST_IMAGE}, "sketch-to-image-example"),
    ("product-photo", {"imageUrl": TEST_PRODUCT}, "product-photo-example"),
    ("interior-design", {"imageUrl": TEST_ROOM, "style": "modern"}, "interior-design-example"),
    ("greeting-card", {"imageUrl": TEST_IMAGE, "occasion": "birthday"}, "greeting-card-example"),
    ("authenticity", {"imageUrl": TEST_IMAGE, "realismLevel": 30}, "authenticity-example"),
    ("character-library", {"imageUrl": TEST_IMAGE, "action": "save", "characterName": "Hero"}, "character-library-example"),
    ("style-mix", {"imageUrl": TEST_IMAGE, "styles": ["impressionism", "cyberpunk"], "ratio": "50-50"}, "style-mix-example"),
    ("pseudo-animation", {"imageUrl": TEST_IMAGE, "animationType": "subtle-motion", "frames": 3}, "pseudo-animation-example"),
    ("partial-redesign", {"imageUrl": TEST_ROOM, "target": "wall", "style": "modern"}, "partial-redesign-example"),
    ("age-evolution", {"imageUrl": TEST_IMAGE, "startAge": 20, "endAge": 80}, "age-evolution-example"),
    
    # P2 功能
    ("chibi", {"imageUrl": TEST_IMAGE, "profession": "doctor"}, "chibi-example"),
    ("italian-gesture", {"imageUrl": TEST_IMAGE, "gesture": "chef-kiss"}, "italian-gesture-example"),
    ("pet-humanize", {"imageUrl": TEST_PET}, "pet-humanize-example"),
    ("pet-family", {"imageUrls": [TEST_PET, TEST_PET], "scene": "living-room"}, "pet-family-example"),
    ("vintage-film", {"imageUrl": TEST_IMAGE, "filmStyle": "kodachrome"}, "vintage-film-example"),
]

print("=== 开始生成剩余示例图片 ===\n")
success = 0
for api_name, params, output_name in examples:
    if generate_example(api_name, params, output_name):
        success += 1
    time.sleep(1)  # 避免请求过快

print(f"\n=== 完成 ===")
print(f"成功: {success}/{len(examples)}")
