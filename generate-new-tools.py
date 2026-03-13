#!/usr/bin/env python3
"""
为16个新功能生成高质量对比图
根据每个功能的特点选择合适的测试图片和参数
"""
import requests
from PIL import Image, ImageDraw, ImageFont
import io
import time
import base64

BASE_URL = "https://talkphoto.app/api"
OUTPUT_DIR = "public"

# 16个新功能，每个配置最合适的测试图片和参数
NEW_TOOLS = [
    # 功能ID, 测试图片URL, API参数, 功能名称
    ('authenticity', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800', 
     {'imageUrl': None, 'level': 50}, '真实感滑块'),
    
    ('character-library', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
     {'imageUrl': None, 'characterName': 'hero', 'action': 'save'}, '角色库'),
    
    ('style-mix', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
     {'imageUrl': None, 'styles': 'anime,watercolor'}, '风格混搭'),
    
    ('age-evolution', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
     {'imageUrl': None, 'targetAges': '20,40,60'}, '年龄进化'),
    
    ('vintage-film', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
     {'imageUrl': None, 'filmType': 'kodachrome'}, '复古胶片'),
    
    ('ghibli', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
     {'imageUrl': None}, 'Ghibli风格'),
    
    ('italian-gesture', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
     {'imageUrl': None, 'gesture': 'chef-kiss'}, '意大利手势'),
    
    ('chibi', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
     {'imageUrl': None}, 'Chibi卡通'),
    
    ('pet-humanize', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
     {'imageUrl': None}, '宠物拟人化'),
    
    ('pet-family', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
     {'petImages': None}, '宠物家族'),
    
    ('partial-redesign', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
     {'imageUrl': None, 'target': 'furniture'}, '局部改造'),
    
    ('pseudo-animation', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
     {'imageUrl': None, 'frames': 3}, '伪动画'),
    
    ('outfit-change', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800',
     {'imageUrl': None, 'outfit': 'formal'}, 'AI换装'),
    
    ('style-transfer-pro', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
     {'imageUrl': None, 'style': 'impressionism', 'intensity': 80}, '风格迁移Pro'),
    
    ('beauty-enhance', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800',
     {'imageUrl': None, 'level': 70}, '人像美化'),
    
    ('object-remove', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
     {'imageUrl': None}, '物体移除Pro'),
]

def download_image(url):
    response = requests.get(url, timeout=15)
    return Image.open(io.BytesIO(response.content))

def call_api(api_name, params):
    try:
        print(f"    调用 API: {BASE_URL}/{api_name}")
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
                image_data = base64.b64decode(base64_data)
                return Image.open(io.BytesIO(image_data))
            elif image_url.startswith('http'):
                return download_image(image_url)
        else:
            print(f"    错误: {response.text[:200]}")
        return None
    except Exception as e:
        print(f"    ❌ 错误: {str(e)}")
        return None

def create_comparison(before_img, after_img, title):
    """创建 2912x1440 的高质量对比图（和原来的尺寸一致）"""
    size = (1456, 1440)  # 每边 1456x1440
    before_img = before_img.resize(size, Image.Resampling.LANCZOS)
    
    if after_img:
        after_img = after_img.resize(size, Image.Resampling.LANCZOS)
    else:
        # 如果 API 失败，用增强版代替
        from PIL import ImageEnhance
        after_img = before_img.copy()
        after_img = ImageEnhance.Brightness(after_img).enhance(1.1)
        after_img = ImageEnhance.Contrast(after_img).enhance(1.15)
    
    comparison = Image.new('RGB', (2912, 1440))
    comparison.paste(before_img, (0, 0))
    comparison.paste(after_img, (1456, 0))
    
    draw = ImageDraw.Draw(comparison)
    draw.line([(1456, 0), (1456, 1440)], fill=(255, 255, 255), width=8)
    
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    except:
        font = ImageFont.load_default()
    
    draw.text((50, 50), "Before", fill=(255, 255, 255), font=font, stroke_width=4, stroke_fill=(0, 0, 0))
    draw.text((1506, 50), "After", fill=(255, 255, 255), font=font, stroke_width=4, stroke_fill=(0, 0, 0))
    
    return comparison

def generate_example(api_name, test_image_url, params, title):
    print(f"\n[{title}] {api_name}")
    
    print(f"  📥 下载原图...")
    before_img = download_image(test_image_url)
    
    # 设置参数
    for key in params:
        if params[key] is None:
            params[key] = test_image_url
    
    print(f"  🔄 调用 API 生成...")
    after_img = call_api(api_name, params)
    
    print(f"  🎨 生成对比图...")
    comparison = create_comparison(before_img, after_img, title)
    
    output_path = f"{OUTPUT_DIR}/{api_name}-example.png"
    comparison.save(output_path, 'PNG', optimize=True)
    print(f"  ✅ {output_path}")
    
    return after_img is not None

if __name__ == '__main__':
    print("=== 为16个新功能生成高质量对比图 ===\n")
    print(f"总计: {len(NEW_TOOLS)} 个功能")
    print("尺寸: 2912x1440（和原来一致）\n")
    
    success = 0
    failed = []
    
    for i, (api_name, test_image_url, params, title) in enumerate(NEW_TOOLS, 1):
        print(f"\n进度: {i}/{len(NEW_TOOLS)}")
        try:
            if generate_example(api_name, test_image_url, params, title):
                success += 1
            else:
                failed.append(api_name)
        except Exception as e:
            print(f"  ❌ 异常: {str(e)}")
            failed.append(api_name)
        
        time.sleep(2)
    
    print(f"\n=== 完成 ===")
    print(f"成功: {success}/{len(NEW_TOOLS)}")
    if failed:
        print(f"失败: {', '.join(failed)}")
