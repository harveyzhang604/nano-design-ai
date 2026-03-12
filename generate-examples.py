#!/usr/bin/env python3
import requests
import json
import base64
import os

BASE_URL = "https://talkphoto.app/api"
TEST_IMAGE = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
TEST_IMAGE2 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
OUTPUT_DIR = "public"

def generate_example(api_name, params, output_name):
    """生成示例图片"""
    print(f"生成 {output_name}...")
    try:
        response = requests.post(
            f"{BASE_URL}/{api_name}",
            json=params,
            timeout=60
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
            print(f"❌ {output_name} - HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ {output_name} - {str(e)}")
        return False

# 生成示例图片
examples = [
    ("age-transform", {"imageUrl": TEST_IMAGE, "targetAge": 60}, "age-transform-example"),
    ("gender-swap", {"imageUrl": TEST_IMAGE}, "gender-swap-example"),
    ("hairstyle", {"imageUrl": TEST_IMAGE, "hairstyle": "long"}, "hairstyle-example"),
    ("makeup", {"imageUrl": TEST_IMAGE, "makeupStyle": "glamorous"}, "makeup-example"),
    ("tattoo", {"imageUrl": TEST_IMAGE, "tattooDesign": "dragon", "bodyPart": "arm"}, "tattoo-example"),
    ("ghibli", {"imageUrl": TEST_IMAGE}, "ghibli-example"),
]

print("=== 开始生成示例图片 ===\n")
success = 0
for api_name, params, output_name in examples:
    if generate_example(api_name, params, output_name):
        success += 1

print(f"\n=== 完成 ===")
print(f"成功: {success}/{len(examples)}")
