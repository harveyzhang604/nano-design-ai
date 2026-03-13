#!/usr/bin/env python3
"""
生成新功能的示例对比图
"""
import os
import requests
from PIL import Image, ImageDraw, ImageFont
import io
import base64
from datetime import datetime

# 配置
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError('GEMINI_API_KEY not found in environment')

GEMINI_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key={GEMINI_API_KEY}'

PUBLIC_DIR = '/root/.openclaw/workspace/nano-design-ai/public'

# 测试图片（从 unsplash 获取）
TEST_IMAGES = {
    'claymation': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
    'action-figure': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
    'pixel-art': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop',
    'blythe-doll': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop'
}

# 新功能列表
NEW_TOOLS = [
    'claymation',
    'action-figure',
    'pixel-art',
    'blythe-doll'
]


def download_image(url):
    """下载图片"""
    response = requests.get(url)
    response.raise_for_status()
    return Image.open(io.BytesIO(response.content))


def image_to_base64(image):
    """图片转 base64"""
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    return base64.b64encode(buffer.getvalue()).decode('utf-8')


def generate_with_gemini(prompt, base64_image):
    """调用 Gemini API 生成图片"""
    payload = {
        'contents': [{
            'parts': [
                {'text': prompt},
                {'inlineData': {'mimeType': 'image/png', 'data': base64_image}}
            ]
        }],
        'generationConfig': {
            'temperature': 0.7,
            'topK': 40,
            'topP': 0.95,
            'maxOutputTokens': 8192
        }
    }

    response = requests.post(GEMINI_URL, json=payload)
    response.raise_for_status()
    data = response.json()

    parts = data.get('candidates', [{}])[0].get('content', {}).get('parts', [])
    image_part = next((p for p in parts if 'inlineData' in p), None)

    if not image_part:
        raise Exception('No image in response')

    base64_data = image_part['inlineData']['data']
    image_data = base64.b64decode(base64_data)
    return Image.open(io.BytesIO(image_data))


def create_comparison(before, after, tool_name):
    """创建对比图"""
    width = 2912
    height = 1440
    half_width = width // 2

    # 调整图片尺寸
    before_resized = before.resize((half_width, height), Image.Resampling.LANCZOS)
    after_resized = after.resize((half_width, height), Image.Resampling.LANCZOS)

    # 创建对比图
    comparison = Image.new('RGB', (width, height))
    comparison.paste(before_resized, (0, 0))
    comparison.paste(after_resized, (half_width, 0))

    # 添加标签
    draw = ImageDraw.Draw(comparison)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 48)
    except:
        font = ImageFont.load_default()

    # Before 标签
    draw.text((30, 30), 'Before', fill='white', font=font, stroke_width=3, stroke_fill='black')

    # After 标签
    draw.text((half_width + 30, 30), 'After', fill='white', font=font, stroke_width=3, stroke_fill='black')

    # 功能名称
    draw.text((width // 2 - 150, height - 80), tool_name, fill='white', font=font, stroke_width=3, stroke_fill='black')

    return comparison


def main():
    """主函数"""
    print(f"开始生成新功能示例图片...")
    print(f"功能列表: {NEW_TOOLS}")

    for tool_name in NEW_TOOLS:
        print(f"\n处理: {tool_name}")

        try:
            # 下载测试图片
            print(f"  下载测试图片...")
            before_image = download_image(TEST_IMAGES.get(tool_name, TEST_IMAGES['claymation']))

            # 转换为 base64
            base64_before = image_to_base64(before_image)

            # 调用 API 生成
            print(f"  调用 Gemini API...")
            prompt = f"Transform this image with {tool_name} effect. High quality, professional result."
            after_image = generate_with_gemini(prompt, base64_before)

            # 创建对比图
            print(f"  创建对比图...")
            comparison = create_comparison(before_image, after_image, tool_name)

            # 保存
            png_path = os.path.join(PUBLIC_DIR, f'{tool_name}-example.png')
            comparison.save(png_path, 'PNG', quality=95)
            print(f"  保存: {png_path}")

            # 转换为 WebP
            webp_path = os.path.join(PUBLIC_DIR, f'{tool_name}-example.webp')
            comparison.save(webp_path, 'WebP', quality=85)
            print(f"  保存: {webp_path}")

            print(f"  ✅ {tool_name} 完成")

        except Exception as e:
            print(f"  ❌ {tool_name} 失败: {e}")
            # 使用 fallback：增强版原图
            print(f"  使用 fallback...")
            try:
                from PIL import ImageEnhance
                enhancer = ImageEnhance.Brightness(before_image)
                after_image = enhancer.enhance(1.1)
                enhancer = ImageEnhance.Contrast(after_image)
                after_image = enhancer.enhance(1.15)

                comparison = create_comparison(before_image, after_image, tool_name)
                png_path = os.path.join(PUBLIC_DIR, f'{tool_name}-example.png')
                comparison.save(png_path, 'PNG', quality=95)
                webp_path = os.path.join(PUBLIC_DIR, f'{tool_name}-example.webp')
                comparison.save(webp_path, 'WebP', quality=85)
                print(f"  ✅ {tool_name} fallback 完成")
            except Exception as e2:
                print(f"  ❌ {tool_name} fallback 也失败: {e2}")

    print("\n✅ 所有新功能示例图片生成完成！")


if __name__ == '__main__':
    main()
