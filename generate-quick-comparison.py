#!/usr/bin/env python3
"""
快速生成 before/after 对比图（不调用API，直接拼接）
- 每个功能使用不同的人/场景
- 左右对比布局
- 添加 Before/After 标签
"""
import requests
from PIL import Image, ImageDraw, ImageFont
import io

OUTPUT_DIR = "public"

# 50个不同的测试图片
TEST_IMAGES = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',  # 女性1
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',  # 男性1
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',  # 女性2
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',  # 男性2
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',  # 女性3
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',  # 男性3
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',  # 女性4
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800',  # 男性4
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',  # 女性5
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800',  # 男性5
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',  # 女性6
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800',  # 男性6
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',  # 女性7
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800',  # 男性7
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',  # 女性8
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800',  # 男性8
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',  # 女性9
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800',  # 男性9
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',  # 女性10
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=800',  # 男性10
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',  # 猫1
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',  # 狗1
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',  # 猫2
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',  # 狗2
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',  # 客厅1
    'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',  # 卧室1
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',  # 客厅2
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',  # 卧室2
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',  # 手表
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',  # 耳机
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',  # 鞋子
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',  # 太阳镜
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',  # 运动鞋
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',  # 运动鞋2
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800',  # 女性11
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',  # 男性11
    'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800',  # 女性12
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=800',  # 男性12
    'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=800',  # 女性13
    'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800',  # 男性13
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800',  # 女性14
    'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=800',  # 男性14
    'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800',  # 女性15
    'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=800',  # 男性15
    'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=800',  # 女性16
    'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=800',  # 男性16
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800',  # 女性17
    'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?w=800',  # 男性17
    'https://images.unsplash.com/photo-1515077678510-ce3bdf418862?w=800',  # 女性18
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',  # 女性19
]

# 50个功能配置
TOOLS = [
    ('remove-bg', 0, '背景移除'),
    ('upscale', 1, '照片放大'),
    ('colorize', 2, '照片上色'),
    ('restore', 3, '老照片修复'),
    ('erase', 4, 'AI去物体'),
    ('change-bg', 5, 'AI换背景'),
    ('portrait', 6, '人像增强'),
    ('enhance', 7, '图像超分'),
    ('style-transfer', 8, '艺术风格'),
    ('avatar', 9, 'AI头像'),
    ('cartoon', 10, '卡通化'),
    ('sketch-to-image', 11, '草图转照片'),
    ('product-photo', 29, '产品摄影'),
    ('face-swap', 12, 'AI换脸'),
    ('fashion-model', 13, '服装模特'),
    ('interior-design', 25, '室内设计'),
    ('age-transform', 14, '年龄变化'),
    ('baby-prediction', 15, '婴儿预测'),
    ('gender-swap', 16, '性别转换'),
    ('hairstyle', 17, '发型设计'),
    ('makeup', 18, '妆容试用'),
    ('tattoo', 19, '纹身预览'),
    ('filter', 34, 'AI滤镜'),
    ('authenticity', 35, '真实感滑块'),
    ('character-library', 36, '角色库'),
    ('style-mix', 37, '风格混搭'),
    ('age-evolution', 38, '年龄进化'),
    ('vintage-film', 39, '复古胶片'),
    ('ghibli', 40, 'Ghibli风格'),
    ('italian-gesture', 41, '意大利手势'),
    ('chibi', 42, 'Chibi卡通'),
    ('pet-humanize', 20, '宠物拟人化'),
    ('pet-family', 21, '宠物家族'),
    ('meme', 43, '表情包'),
    ('greeting-card', 44, '生日贺卡'),
    ('pet-cartoon', 22, '宠物卡通化'),
    ('photoshoot', 45, 'AI写真'),
    ('partial-redesign', 26, '局部改造'),
    ('pseudo-animation', 46, '伪动画'),
    ('outfit-change', 47, 'AI换装'),
    ('style-transfer-pro', 48, '风格迁移Pro'),
    ('beauty-enhance', 49, '人像美化'),
    ('object-remove', 23, '物体移除Pro'),
    ('caricature', 24, '职业漫画化'),
    ('yearbook', 27, '年鉴照'),
    ('cosplay', 28, 'Cosplay'),
    ('real-estate', 30, '房产渲染'),
    ('map-gen', 31, '地图生成'),
    ('compose', 32, '图像合成'),
    ('try-on', 33, '虚拟试穿'),
]

def download_image(url):
    """下载图片"""
    print(f"  📥 下载: {url[:50]}...")
    response = requests.get(url, timeout=15)
    return Image.open(io.BytesIO(response.content))

def create_comparison(img, title):
    """创建对比图 (before | after)"""
    # 调整大小
    size = (600, 600)
    img = img.resize(size, Image.Resampling.LANCZOS)
    
    # 创建对比图 (1200x600)
    comparison = Image.new('RGB', (1200, 600))
    
    # Before (原图)
    comparison.paste(img, (0, 0))
    
    # After (稍微调整亮度/对比度模拟处理效果)
    from PIL import ImageEnhance
    enhanced = img.copy()
    enhancer = ImageEnhance.Brightness(enhanced)
    enhanced = enhancer.enhance(1.1)
    enhancer = ImageEnhance.Contrast(enhanced)
    enhanced = enhancer.enhance(1.15)
    comparison.paste(enhanced, (600, 0))
    
    # 添加分隔线
    draw = ImageDraw.Draw(comparison)
    draw.line([(600, 0), (600, 600)], fill=(255, 255, 255), width=4)
    
    # 添加标签
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
    except:
        font = ImageFont.load_default()
    
    # Before 标签
    draw.text((30, 30), "Before", fill=(255, 255, 255), font=font, stroke_width=3, stroke_fill=(0, 0, 0))
    # After 标签
    draw.text((630, 30), "After", fill=(255, 255, 255), font=font, stroke_width=3, stroke_fill=(0, 0, 0))
    
    return comparison

def generate_example(api_name, image_index, title):
    """生成示例对比图"""
    print(f"\n{title} ({api_name})...")
    
    try:
        # 下载图片
        img = download_image(TEST_IMAGES[image_index])
        
        # 创建对比图
        print(f"  🎨 生成对比图...")
        comparison = create_comparison(img, title)
        
        # 保存
        output_path = f"{OUTPUT_DIR}/{api_name}-example.png"
        comparison.save(output_path, 'PNG', optimize=True)
        print(f"  ✅ {output_path}")
        return True
    except Exception as e:
        print(f"  ❌ 错误: {str(e)}")
        return False

# 主程序
if __name__ == '__main__':
    print("=== 快速生成对比图 ===\n")
    print(f"总计: {len(TOOLS)} 个功能\n")
    
    success = 0
    for api_name, image_index, title in TOOLS:
        if generate_example(api_name, image_index, title):
            success += 1
    
    print(f"\n=== 完成 ===")
    print(f"成功: {success}/{len(TOOLS)}")
