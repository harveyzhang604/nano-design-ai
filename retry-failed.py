#!/usr/bin/env python3
"""
重新生成失败的16个功能
"""
import requests
from PIL import Image, ImageDraw, ImageFont
import io
import time

BASE_URL = "https://talkphoto.app/api"
OUTPUT_DIR = "public"

TEST_IMAGES = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',  # 0
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',  # 1
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',  # 2
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',  # 8
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',  # 12
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',  # 18
    'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800',  # 36
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=800',  # 37
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800',  # 40
    'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=800',  # 41
    'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=800',  # 44
    'https://images.unsplash.com/photo-1515077678510-ce3bdf418862?w=800',  # 48
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',  # 27
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',  # 30
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',  # 32
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',  # 33
]

# 16个失败的功能，修正参数
FAILED_TOOLS = [
    ('remove-bg', 0, {'imageUrl': None}, '背景移除'),
    ('upscale', 1, {'imageUrl': None, 'scale': 2}, '照片放大'),
    ('style-transfer', 2, {'imageUrl': None, 'style': 'watercolor'}, '艺术风格'),
    ('face-swap', 3, {'sourceImage': None, 'targetImage': TEST_IMAGES[4]}, 'AI换脸'),
    ('baby-prediction', 4, {'parent1Image': None, 'parent2Image': TEST_IMAGES[5]}, '婴儿预测'),
    ('tattoo', 5, {'imageUrl': None, 'design': 'dragon'}, '纹身预览'),
    ('character-library', 6, {'imageUrl': None, 'action': 'save'}, '角色库'),
    ('vintage-film', 7, {'imageUrl': None, 'style': 'kodachrome'}, '复古胶片'),
    ('greeting-card', 8, {'imageUrl': None, 'text': 'Happy Birthday!'}, '生日贺卡'),
    ('pseudo-animation', 9, {'imageUrl': None, 'keyframes': 3}, '伪动画'),
    ('caricature', 10, {'imageUrl': None, 'style': 'cartoon'}, '职业漫画化'),
    ('cosplay', 11, {'imageUrl': None, 'character': 'anime'}, 'Cosplay'),
    ('real-estate', 12, {'imageUrl': None, 'style': 'modern'}, '房产渲染'),
    ('map-gen', 13, {'prompt': 'fantasy world with mountains and rivers'}, '地图生成'),
    ('compose', 14, {'image1': None, 'image2': TEST_IMAGES[15]}, '图像合成'),
    ('try-on', 15, {'imageUrl': None, 'clothing': 'dress'}, '虚拟试穿'),
]

def download_image(url):
    response = requests.get(url, timeout=15)
    return Image.open(io.BytesIO(response.content))

def call_api(api_name, params):
    try:
        print(f"    调用 API: {BASE_URL}/{api_name}")
        print(f"    参数: {params}")
        response = requests.post(
            f"{BASE_URL}/{api_name}",
            json=params,
            timeout=180
        )
        
        print(f"    状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            image_url = data.get('imageUrl', '')
            
            if image_url.startswith('data:image'):
                base64_data = image_url.split(',')[1]
                import base64
                image_data = base64.b64decode(base64_data)
                return Image.open(io.BytesIO(image_data))
            elif image_url.startswith('http'):
                return download_image(image_url)
        else:
            print(f"    错误响应: {response.text[:200]}")
        return None
    except Exception as e:
        print(f"    ❌ 错误: {str(e)}")
        return None

def create_comparison(before_img, after_img, title):
    size = (600, 600)
    before_img = before_img.resize(size, Image.Resampling.LANCZOS)
    
    if after_img:
        after_img = after_img.resize(size, Image.Resampling.LANCZOS)
    else:
        after_img = Image.new('RGB', size, (50, 50, 50))
    
    comparison = Image.new('RGB', (1200, 600))
    comparison.paste(before_img, (0, 0))
    comparison.paste(after_img, (600, 0))
    
    draw = ImageDraw.Draw(comparison)
    draw.line([(600, 0), (600, 600)], fill=(255, 255, 255), width=4)
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
    except:
        font = ImageFont.load_default()
    
    draw.text((30, 30), "Before", fill=(255, 255, 255), font=font, stroke_width=3, stroke_fill=(0, 0, 0))
    draw.text((630, 30), "After", fill=(255, 255, 255), font=font, stroke_width=3, stroke_fill=(0, 0, 0))
    
    return comparison

def generate_example(api_name, image_index, params, title):
    print(f"\n[{title}] {api_name}")
    
    test_image_url = TEST_IMAGES[image_index]
    print(f"  📥 下载原图...")
    before_img = download_image(test_image_url)
    
    # 设置参数
    for key in params:
        if params[key] is None:
            params[key] = test_image_url
    
    print(f"  🔄 调用 API 生成...")
    after_img = call_api(api_name, params)
    
    if after_img:
        print(f"  🎨 生成对比图...")
        comparison = create_comparison(before_img, after_img, title)
        
        output_path = f"{OUTPUT_DIR}/{api_name}-example.png"
        comparison.save(output_path, 'PNG', optimize=True)
        print(f"  ✅ {output_path}")
        return True
    else:
        print(f"  ❌ 失败")
        return False

if __name__ == '__main__':
    print("=== 重新生成失败的16个功能 ===\n")
    
    success = 0
    failed = []
    
    for i, (api_name, image_index, params, title) in enumerate(FAILED_TOOLS, 1):
        print(f"\n进度: {i}/{len(FAILED_TOOLS)}")
        try:
            if generate_example(api_name, image_index, params, title):
                success += 1
            else:
                failed.append(api_name)
        except Exception as e:
            print(f"  ❌ 异常: {str(e)}")
            failed.append(api_name)
        
        time.sleep(2)
    
    print(f"\n=== 完成 ===")
    print(f"成功: {success}/{len(FAILED_TOOLS)}")
    if failed:
        print(f"仍然失败: {', '.join(failed)}")
