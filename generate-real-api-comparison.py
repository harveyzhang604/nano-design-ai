#!/usr/bin/env python3
"""
调用真实 API 生成高质量 before/after 对比图
- 每个功能使用不同的测试图片
- 左边：原图 (before)
- 右边：API 处理后的图 (after)
- 尺寸：1200x600
"""
import requests
import json
import base64
import os
from PIL import Image, ImageDraw, ImageFont
import io
import time

BASE_URL = "https://talkphoto.app/api"
OUTPUT_DIR = "public"

# 测试图片库 - 50个不同的人/场景
TEST_IMAGES = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',  # 0: 女性1
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',  # 1: 男性1
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',  # 2: 女性2
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',  # 3: 男性2
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',  # 4: 女性3
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',  # 5: 男性3
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',  # 6: 女性4
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800',  # 7: 男性4
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',  # 8: 女性5
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800',  # 9: 男性5
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',  # 10: 女性6
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800',  # 11: 男性6
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',  # 12: 女性7
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800',  # 13: 男性7
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',  # 14: 女性8
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800',  # 15: 男性8
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',  # 16: 女性9
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800',  # 17: 男性9
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',  # 18: 女性10
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=800',  # 19: 男性10
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',  # 20: 猫1
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',  # 21: 狗1
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',  # 22: 猫2
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',  # 23: 狗2
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',  # 24: 客厅1
    'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',  # 25: 卧室1
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',  # 26: 客厅2
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',  # 27: 卧室2
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',  # 28: 手表
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',  # 29: 耳机
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',  # 30: 鞋子
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',  # 31: 太阳镜
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',  # 32: 运动鞋
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',  # 33: 运动鞋2
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800',  # 34: 女性11
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',  # 35: 男性11
    'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800',  # 36: 女性12
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=800',  # 37: 男性12
    'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=800',  # 38: 女性13
    'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800',  # 39: 男性13
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800',  # 40: 女性14
    'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=800',  # 41: 男性14
    'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800',  # 42: 女性15
    'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=800',  # 43: 男性15
    'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=800',  # 44: 女性16
    'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=800',  # 45: 男性16
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800',  # 46: 女性17
    'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?w=800',  # 47: 男性17
    'https://images.unsplash.com/photo-1515077678510-ce3bdf418862?w=800',  # 48: 女性18
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',  # 49: 女性19
]

# 50个功能配置：(API名称, 图片索引, 参数, 标题)
TOOLS = [
    ('remove-bg', 0, {'imageUrl': None}, '背景移除'),
    ('upscale', 1, {'imageUrl': None, 'scale': 2}, '照片放大'),
    ('colorize', 2, {'imageUrl': None}, '照片上色'),
    ('restore', 3, {'imageUrl': None, 'mode': 'standard'}, '老照片修复'),
    ('erase', 4, {'imageUrl': None}, 'AI去物体'),
    ('change-bg', 5, {'imageUrl': None, 'background': 'beach'}, 'AI换背景'),
    ('portrait', 6, {'imageUrl': None, 'intensity': 70}, '人像增强'),
    ('enhance', 7, {'imageUrl': None}, '图像超分'),
    ('style-transfer', 8, {'imageUrl': None, 'style': 'oil-painting'}, '艺术风格'),
    ('avatar', 9, {'imageUrl': None}, 'AI头像'),
    ('cartoon', 10, {'imageUrl': None}, '卡通化'),
    ('sketch-to-image', 11, {'imageUrl': None}, '草图转照片'),
    ('product-photo', 28, {'imageUrl': None, 'style': 'ecommerce'}, '产品摄影'),
    ('face-swap', 12, {'imageUrl': None, 'targetImage': TEST_IMAGES[13]}, 'AI换脸'),
    ('fashion-model', 14, {'imageUrl': None}, '服装模特'),
    ('interior-design', 24, {'imageUrl': None, 'style': 'modern'}, '室内设计'),
    ('age-transform', 15, {'imageUrl': None, 'targetAge': 60}, '年龄变化'),
    ('baby-prediction', 16, {'parent1': None, 'parent2': TEST_IMAGES[17]}, '婴儿预测'),
    ('gender-swap', 18, {'imageUrl': None}, '性别转换'),
    ('hairstyle', 19, {'imageUrl': None, 'hairstyle': 'long'}, '发型设计'),
    ('makeup', 34, {'imageUrl': None, 'makeupStyle': 'glamorous'}, '妆容试用'),
    ('tattoo', 35, {'imageUrl': None, 'tattooDesign': 'dragon', 'bodyPart': 'arm'}, '纹身预览'),
    ('filter', 36, {'imageUrl': None, 'filter': 'vintage'}, 'AI滤镜'),
    ('authenticity', 37, {'imageUrl': None, 'level': 50}, '真实感滑块'),
    ('character-library', 38, {'imageUrl': None, 'scene': 'office'}, '角色库'),
    ('style-mix', 39, {'imageUrl': None, 'styles': 'ghibli,80s-neon'}, '风格混搭'),
    ('age-evolution', 40, {'imageUrl': None, 'ages': '20,40,60'}, '年龄进化'),
    ('vintage-film', 41, {'imageUrl': None, 'filmType': 'kodachrome'}, '复古胶片'),
    ('ghibli', 42, {'imageUrl': None}, 'Ghibli风格'),
    ('italian-gesture', 43, {'imageUrl': None, 'gesture': 'chef-kiss'}, '意大利手势'),
    ('chibi', 44, {'imageUrl': None}, 'Chibi卡通'),
    ('pet-humanize', 20, {'imageUrl': None}, '宠物拟人化'),
    ('pet-family', 21, {'petImages': None}, '宠物家族'),
    ('meme', 45, {'imageUrl': None, 'text': 'When you finally fix the bug'}, '表情包'),
    ('greeting-card', 46, {'imageUrl': None, 'occasion': 'birthday'}, '生日贺卡'),
    ('pet-cartoon', 22, {'imageUrl': None}, '宠物卡通化'),
    ('photoshoot', 47, {'imageUrl': None, 'theme': 'professional'}, 'AI写真'),
    ('partial-redesign', 25, {'imageUrl': None, 'target': 'sofa'}, '局部改造'),
    ('pseudo-animation', 48, {'imageUrl': None, 'frames': 3}, '伪动画'),
    ('outfit-change', 49, {'imageUrl': None, 'outfit': 'formal'}, 'AI换装'),
    ('style-transfer-pro', 8, {'imageUrl': None, 'style': 'impressionism', 'intensity': 80}, '风格迁移Pro'),
    ('beauty-enhance', 9, {'imageUrl': None, 'level': 70}, '人像美化'),
    ('object-remove', 23, {'imageUrl': None}, '物体移除Pro'),
    ('caricature', 26, {'imageUrl': None, 'profession': 'doctor'}, '职业漫画化'),
    ('yearbook', 27, {'imageUrl': None, 'decade': '90s'}, '年鉴照'),
    ('cosplay', 10, {'imageUrl': None, 'character': 'anime'}, 'Cosplay'),
    ('real-estate', 30, {'imageUrl': None}, '房产渲染'),
    ('map-gen', 31, {'description': 'fantasy world map'}, '地图生成'),
    ('compose', 32, {'images': None}, '图像合成'),
    ('try-on', 33, {'imageUrl': None, 'clothing': 'dress'}, '虚拟试穿'),
]

def download_image(url):
    """下载图片"""
    response = requests.get(url, timeout=15)
    return Image.open(io.BytesIO(response.content))

def call_api(api_name, params):
    """调用 API"""
    try:
        print(f"    调用 API: {BASE_URL}/{api_name}")
        response = requests.post(
            f"{BASE_URL}/{api_name}",
            json=params,
            timeout=180
        )
        
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
            print(f"    ❌ API 返回: {response.status_code}")
        return None
    except Exception as e:
        print(f"    ❌ API 错误: {str(e)}")
        return None

def create_comparison(before_img, after_img, title):
    """创建对比图"""
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
    """生成示例对比图"""
    print(f"\n[{title}] {api_name}")
    
    test_image_url = TEST_IMAGES[image_index]
    print(f"  📥 下载原图...")
    before_img = download_image(test_image_url)
    
    if 'imageUrl' in params and params['imageUrl'] is None:
        params['imageUrl'] = test_image_url
    if 'parent1' in params and params['parent1'] is None:
        params['parent1'] = test_image_url
    if 'petImages' in params and params['petImages'] is None:
        params['petImages'] = [test_image_url]
    if 'images' in params and params['images'] is None:
        params['images'] = [test_image_url, test_image_url]
    
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
        print(f"  ❌ API 调用失败，跳过")
        return False

if __name__ == '__main__':
    print("=== 调用真实 API 生成高质量对比图 ===\n")
    print(f"总计: {len(TOOLS)} 个功能")
    print("预计时间: 25-50 分钟\n")
    
    success = 0
    failed = []
    
    start_time = time.time()
    
    for i, (api_name, image_index, params, title) in enumerate(TOOLS, 1):
        print(f"\n进度: {i}/{len(TOOLS)}")
        try:
            if generate_example(api_name, image_index, params, title):
                success += 1
            else:
                failed.append(api_name)
        except Exception as e:
            print(f"  ❌ 错误: {str(e)}")
            failed.append(api_name)
        
        time.sleep(2)
    
    elapsed = time.time() - start_time
    print(f"\n=== 完成 ===")
    print(f"成功: {success}/{len(TOOLS)}")
    print(f"耗时: {elapsed/60:.1f} 分钟")
    if failed:
        print(f"失败: {', '.join(failed)}")
