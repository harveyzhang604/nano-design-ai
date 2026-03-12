#!/usr/bin/env python3
import requests
import base64
import time

BASE_URL = "https://talkphoto.app/api"
TEST_IMAGE = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
TEST_PET = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"
TEST_ROOM = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400"
OUTPUT_DIR = "public"

def generate(api_name, params, filename):
    print(f"生成 {filename}...")
    try:
        r = requests.post(f"{BASE_URL}/{api_name}", json=params, timeout=90)
        if r.status_code == 200:
            data = r.json()
            url = data.get('imageUrl', '')
            if url.startswith('data:image'):
                data = base64.b64decode(url.split(',')[1])
            else:
                data = requests.get(url).content
            with open(f"{OUTPUT_DIR}/{filename}.png", 'wb') as f:
                f.write(data)
            print(f"✅ {filename} - {len(data)} bytes")
            return True
        else:
            print(f"❌ {filename} - HTTP {r.status_code}")
            return False
    except Exception as e:
        print(f"❌ {filename} - {e}")
        return False

# 剩余 13 个
examples = [
    ("age-evolution", {"imageUrl": TEST_IMAGE, "startAge": 20, "endAge": 60}, "age-evolution-example"),
    ("authenticity", {"imageUrl": TEST_IMAGE, "realismLevel": 50}, "authenticity-example"),
    ("character-library", {"imageUrl": TEST_IMAGE, "action": "save", "characterName": "Hero"}, "character-library-example"),
    ("chibi", {"imageUrl": TEST_IMAGE}, "chibi-example"),
    ("fashion-model", {"imageUrl": TEST_IMAGE}, "fashion-model-example"),
    ("greeting-card", {"imageUrl": TEST_IMAGE, "occasion": "birthday"}, "greeting-card-example"),
    ("italian-gesture", {"imageUrl": TEST_IMAGE, "gesture": "chef-kiss"}, "italian-gesture-example"),
    ("partial-redesign", {"imageUrl": TEST_ROOM, "target": "wall", "style": "modern"}, "partial-redesign-example"),
    ("pet-humanize", {"imageUrl": TEST_PET}, "pet-humanize-example"),
    ("pet-family", {"imageUrls": [TEST_PET, TEST_PET]}, "pet-family-example"),
    ("pseudo-animation", {"imageUrl": TEST_IMAGE, "animationType": "subtle-motion", "frames": 3}, "pseudo-animation-example"),
    ("style-mix", {"imageUrl": TEST_IMAGE, "styles": ["impressionism", "cyberpunk"]}, "style-mix-example"),
    ("vintage-film", {"imageUrl": TEST_IMAGE, "filmStyle": "kodachrome"}, "vintage-film-example"),
]

print("=== 生成剩余 13 个示例图片 ===\n")
success = 0
for api, params, name in examples:
    if generate(api, params, name):
        success += 1
    time.sleep(1)

print(f"\n完成: {success}/{len(examples)}")
