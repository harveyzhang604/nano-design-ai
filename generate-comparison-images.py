#!/usr/bin/env python3
"""
为所有功能生成 before/after 对比图
- 每个功能使用不同的测试图片
- 生成左右对比图（before | after）
- 尺寸：1200x600（左右各600x600）
"""
import requests
import json
import base64
import os
from PIL import Image, ImageDraw, ImageFont
import io

BASE_URL = "https://talkphoto.app/api"
OUTPUT_DIR = "public"

# 测试图片库 - 不同的人/场景
TEST_IMAGES = {
    'portrait1': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',  # 女性1
    'portrait2': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',  # 男性1
    'portrait3': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600',  # 女性2
    'portrait4': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',  # 男性2
    'portrait5': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',  # 女性3
    'portrait6': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600',  # 男性3
    'portrait7': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600',  # 女性4
    'portrait8': 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600',  # 男性4
    'pet1': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600',      # 猫
    'pet2': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600',        # 狗
    'room1': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600',    # 客厅
    'room2': 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=600',       # 卧室
    'product1': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', # 手表
    'product2': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', # 耳机
}

# 功能配置：API名称、测试图片、参数
TOOLS = [
    # P0 核心功能
    ('remove-bg', 'portrait1', {'imageUrl': None}, '背景移除'),
    ('upscale', 'portrait2', {'imageUrl': None, 'scale': 2}, '照片放大'),
    ('colorize', 'portrait3', {'imageUrl': None}, '照片上色'),
    ('restore', 'portrait4', {'imageUrl': None, 'mode': 'standard'}, '老照片修复'),
    ('erase', 'portrait5', {'imageUrl': None, 'mask': 'auto'}, 'AI去物体'),
    ('change-bg', 'portrait6', {'imageUrl': None, 'background': 'beach'}, 'AI换背景'),
    ('portrait', 'portrait7', {'imageUrl': None, 'intensity': 70}, '人像增强'),
    ('enhance', 'portrait8', {'imageUrl': None, 'level': 'high'}, '图像超分'),
    
    # P1 重要功能
    ('style-transfer', 'portrait1', {'imageUrl': None, 'style': 'oil-painting'}, '艺术风格'),
    ('avatar', 'portrait2', {'imageUrl': None, 'style': 'anime'}, 'AI头像'),
    ('cartoon', 'portrait3', {'imageUrl': None, 'style': 'disney'}, '卡通化'),
    ('sketch-to-image', 'portrait4', {'imageUrl': None}, '草图转照片'),
    ('product-photo', 'product1', {'imageUrl': None, 'style': 'ecommerce'}, '产品摄影'),
    ('face-swap', 'portrait5', {'imageUrl': None, 'targetImage': TEST_IMAGES['portrait6']}, 'AI换脸'),
    ('fashion-model', 'portrait6', {'imageUrl': None, 'outfit': 'casual'}, '服装模特'),
    ('interior-design', 'room1', {'imageUrl': None, 'style': 'modern'}, '室内设计'),
    ('age-transform', 'portrait7', {'imageUrl': None, 'targetAge': 60}, '年龄变化'),
    ('baby-prediction', 'portrait8', {'parent1': None, 'parent2': TEST_IMAGES['portrait1']}, '婴儿预测'),
    ('gender-swap', 'portrait1', {'imageUrl': None}, '性别转换'),
    ('hairstyle', 'portrait2', {'imageUrl': None, 'hairstyle': 'long'}, '发型设计'),
    ('makeup', 'portrait3', {'imageUrl': None, 'makeupStyle': 'glamorous'}, '妆容试用'),
    ('tattoo', 'portrait4', {'imageUrl': None, 'tattooDesign': 'dragon', 'bodyPart': 'arm'}, '纹身预览'),
    ('filter', 'portrait5', {'imageUrl': None, 'filter': 'vintage'}, 'AI滤镜'),
    ('authenticity', 'portrait6', {'imageUrl': None, 'level': 50}, '真实感滑块'),
    ('character-library', 'portrait7', {'imageUrl': None, 'scene': 'office'}, '角色库'),
    ('style-mix', 'portrait8', {'imageUrl': None, 'styles': 'ghibli,80s-neon'}, '风格混搭'),
    ('age-evolution', 'portrait1', {'imageUrl': None, 'ages': '20,40,60'}, '年龄进化'),
    ('vintage-film', 'portrait2', {'imageUrl': None, 'filmType': 'kodachrome'}, '复古胶片'),
    ('ghibli', 'portrait3', {'imageUrl': None}, 'Ghibli风格'),
    
    # P2 有趣功能
    ('italian-gesture', 'portrait4', {'imageUrl': None, 'gesture': 'chef-kiss'}, '意大利手势'),
    ('chibi', 'portrait5', {'imageUrl': None}, 'Chibi卡通'),
    ('pet-humanize', 'pet1', {'imageUrl': None}, '宠物拟人化'),
    ('pet-family', 'pet2', {'petImages': None}, '宠物家族'),
    ('meme', 'portrait6', {'imageUrl': None, 'text': 'When you finally fix the bug'}, '表情包'),
    ('greeting-card', 'portrait7', {'imageUrl': None, 'occasion': 'birthday'}, '生日贺卡'),
    ('pet-cartoon', 'pet1', {'imageUrl': None}, '宠物卡通化'),
    ('photoshoot', 'portrait8', {'imageUrl': None, 'theme': 'professional'}, 'AI写真'),
    ('partial-redesign', 'room2', {'imageUrl': None, 'target': 'sofa'}, '局部改造'),
    ('pseudo-animation', 'portrait1', {'imageUrl': None, 'frames': 3}, '伪动画'),
    ('outfit-change', 'portrait2', {'imageUrl': None, 'outfit': 'formal'}, 'AI换装'),
]

def download_image(url):
    """下载图片"""
    response = requests.get(url, timeout=10)
    return Image.open(io.BytesIO(response.content))

def call_api(api_name, params):
    """调用 API"""
    try:
        response = requests.post(
            f"{BASE_URL}/{api_name}",
            json=params,
            timeout=120
        )
        
        if response.status_code == 200:
            data = response.json()
            image_url = data.get('imageUrl', '')
            
            if image_url.startswith('data:image'):
                # Base64 格式
                base64_data = image_url.split(',')[1]
                image_data = base64.b64decode(base64_data)
                return Image.open(io.BytesIO(image_data))
            elif image_url.startswith('http'):
                # URL 格式
                return download_image(image_url)
        return None
    except Exception as e:
        print(f"  ❌ API 错误: {str(e)}")
        return None

def create_comparison(before_img, after_img, title):
    """创建对比图"""
    # 调整图片大小
    size = (600, 600)
    before_img = before_img.resize(size, Image.Resampling.LANCZOS)
    if after_img:
        after_img = after_img.resize(size, Image.Resampling.LANCZOS)
    else:
        # 如果没有 after 图，使用灰色占位
        after_img = Image.new('RGB', size, (100, 100, 100))
    
    # 创建对比图 (1200x600)
    comparison = Image.new('RGB', (1200, 600), (255, 255, 255))
    comparison.paste(before_img, (0, 0))
    comparison.paste(after_img, (600, 0))
    
    # 添加分隔线
    draw = ImageDraw.Draw(comparison)
    draw.line([(600, 0), (600, 600)], fill=(255, 255, 255), width=4)
    
    # 添加标签
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    draw.text((20, 20), "Before", fill=(255, 255, 255), font=font, stroke_width=2, stroke_fill=(0, 0, 0))
    draw.text((620, 20), "After", fill=(255, 255, 255), font=font, stroke_width=2, stroke_fill=(0, 0, 0))
    
    return comparison

def generate_example(api_name, test_image_key, params, title):
    """生成示例对比图"""
    print(f"\n生成 {api_name} ({title})...")
    
    # 获取测试图片
    test_image_url = TEST_IMAGES[test_image_key]
    print(f"  📥 下载测试图片...")
    before_img = download_image(test_image_url)
    
    # 设置参数
    if 'imageUrl' in params and params['imageUrl'] is None:
        params['imageUrl'] = test_image_url
    if 'parent1' in params and params['parent1'] is None:
        params['parent1'] = test_image_url
    if 'petImages' in params and params['petImages'] is None:
        params['petImages'] = [test_image_url]
    
    # 调用 API
    print(f"  🔄 调用 API...")
    after_img = call_api(api_name, params)
    
    if after_img:
        # 创建对比图
        print(f"  🎨 生成对比图...")
        comparison = create_comparison(before_img, after_img, title)
        
        # 保存
        output_path = f"{OUTPUT_DIR}/{api_name}-example.png"
        comparison.save(output_path, 'PNG', optimize=True)
        print(f"  ✅ 保存到 {output_path}")
        return True
    else:
        print(f"  ❌ API 调用失败")
        return False

# 主程序
if __name__ == '__main__':
    print("=== 开始生成对比图 ===\n")
    print(f"总计: {len(TOOLS)} 个功能\n")
    
    success = 0
    failed = []
    
    for api_name, test_image_key, params, title in TOOLS:
        try:
            if generate_example(api_name, test_image_key, params, title):
                success += 1
            else:
                failed.append(api_name)
        except Exception as e:
            print(f"  ❌ 错误: {str(e)}")
            failed.append(api_name)
    
    print(f"\n=== 完成 ===")
    print(f"成功: {success}/{len(TOOLS)}")
    if failed:
        print(f"失败: {', '.join(failed)}")
