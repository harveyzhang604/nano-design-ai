#!/usr/bin/env python3
"""
为16个新功能生成高质量对比图
使用 Gemini 3 Pro Image API
分辨率：2K (2048px)
布局：Side-by-side Before/After
"""
import requests
import json
import os
import time

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyC0G0iyQGwlYfvqr6nMffIZfd2XooUNcMk')
OUTPUT_DIR = "public"

# 16个新功能配置
NEW_FEATURES = [
    {
        'id': 'authenticity',
        'name': '真实感滑块',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A heavily AI-enhanced portrait with obvious artificial smoothing, overly perfect skin, and unnatural features
RIGHT (After): The same person with natural, authentic look - real skin texture, natural imperfections, genuine appearance

Style: Professional photography, realistic lighting
Layout: Split vertically in the middle with subtle dividing line
Labels: "AI Enhanced" on left, "Natural & Authentic" on right'''
    },
    {
        'id': 'character-library',
        'name': '角色库',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A single portrait photo of a person in casual clothes
RIGHT (After): The same person's face in 3 different scenarios - business suit, casual outdoor, formal event (small thumbnails arranged vertically)

Style: Professional photography, consistent lighting
Layout: Split vertically, left shows original, right shows character library with 3 saved scenarios
Labels: "Original Character" on left, "Saved in Library (3 scenes)" on right'''
    },
    {
        'id': 'style-mix',
        'name': '风格混搭',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A regular portrait photo
RIGHT (After): The same portrait with mixed artistic styles - combining anime + oil painting + cyberpunk elements

Style: Creative artistic fusion, vibrant colors
Layout: Split vertically in the middle
Labels: "Original Photo" on left, "Anime + Oil + Cyberpunk Mix" on right'''
    },
    {
        'id': 'age-evolution',
        'name': '年龄进化',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A 30-year-old person's portrait
RIGHT (After): The same person at ages 10, 30, 50, 70 (4 small portraits arranged in a 2x2 grid)

Style: Professional photography, natural aging progression
Layout: Split vertically, left shows current age, right shows age evolution timeline
Labels: "Age 30" on left, "Age Evolution: 10-70" on right'''
    },
    {
        'id': 'vintage-film',
        'name': '复古胶片',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A modern digital photo with sharp details and vibrant colors
RIGHT (After): The same photo with vintage Kodachrome film look - warm tones, slight grain, nostalgic feel

Style: Vintage film photography, 1970s aesthetic
Layout: Split vertically in the middle
Labels: "Digital Photo" on left, "Kodachrome Film" on right'''
    },
    {
        'id': 'ghibli',
        'name': 'Ghibli风格',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A real photo of a person in a natural setting
RIGHT (After): The same scene transformed into Studio Ghibli animation style - soft watercolor backgrounds, expressive anime character, dreamy atmosphere

Style: Studio Ghibli animation aesthetic, Miyazaki style
Layout: Split vertically in the middle
Labels: "Real Photo" on left, "Ghibli Animation" on right'''
    },
    {
        'id': 'italian-gesture',
        'name': '意大利手势',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A person standing with neutral pose, hands at sides
RIGHT (After): The same person making the classic Italian "chef's kiss" gesture - fingers pinched together, hand near mouth, expressive face

Style: Professional photography, Mediterranean vibe
Layout: Split vertically in the middle
Labels: "Neutral Pose" on left, "Chef's Kiss Gesture" on right'''
    },
    {
        'id': 'chibi',
        'name': 'Chibi卡通',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A regular portrait photo of a person
RIGHT (After): The same person as an adorable chibi character - oversized head, tiny body, big sparkling eyes, cute expression

Style: Cute chibi anime art, pastel colors, kawaii aesthetic
Layout: Split vertically in the middle
Labels: "Real Photo" on left, "Chibi Character" on right'''
    },
    {
        'id': 'pet-humanize',
        'name': '宠物拟人化',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A cute golden retriever dog portrait
RIGHT (After): The dog transformed into a human character - maintaining the dog's friendly expression, golden hair color, warm personality traits

Style: Professional character design, anime-inspired
Layout: Split vertically in the middle
Labels: "Pet Photo" on left, "Humanized Character" on right'''
    },
    {
        'id': 'pet-family',
        'name': '宠物家族',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): Three different pets - a dog, a cat, and a rabbit (separate photos)
RIGHT (After): The three pets as a humanized family portrait - standing together, maintaining their unique characteristics

Style: Professional family portrait, anime-inspired character design
Layout: Split vertically, left shows 3 separate pet photos, right shows unified family portrait
Labels: "3 Pets" on left, "Pet Family Portrait" on right'''
    },
    {
        'id': 'partial-redesign',
        'name': '局部改造',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A living room with an old brown sofa
RIGHT (After): The same living room with ONLY the sofa changed to a modern blue velvet sofa - everything else stays identical

Style: Professional interior photography, realistic lighting
Layout: Split vertically in the middle
Labels: "Original Room" on left, "New Sofa Only" on right'''
    },
    {
        'id': 'pseudo-animation',
        'name': '伪动画',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A single portrait photo of a person
RIGHT (After): 3 keyframes showing the person waving - frame 1: hand down, frame 2: hand mid-wave, frame 3: hand up (arranged horizontally)

Style: Professional photography, motion sequence
Layout: Split vertically, left shows static photo, right shows 3-frame animation sequence
Labels: "Static Photo" on left, "3-Frame Animation" on right'''
    },
    {
        'id': 'outfit-change',
        'name': 'AI换装',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A person wearing casual t-shirt and jeans
RIGHT (After): The same person wearing an elegant formal suit - maintaining the same pose and background

Style: Professional fashion photography
Layout: Split vertically in the middle
Labels: "Casual Outfit" on left, "Formal Suit" on right'''
    },
    {
        'id': 'style-transfer-pro',
        'name': '风格迁移Pro',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A regular portrait photo
RIGHT (After): The same portrait in impressionist painting style - visible brush strokes, vibrant colors, Monet-inspired

Style: Impressionist art, painterly effect
Layout: Split vertically in the middle
Labels: "Original Photo" on left, "Impressionist Style" on right'''
    },
    {
        'id': 'beauty-enhance',
        'name': '人像美化',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A portrait with natural skin texture, minor blemishes
RIGHT (After): The same portrait with subtle beauty enhancement - smooth skin, brighter eyes, natural glow, but still realistic

Style: Professional portrait photography, natural beauty
Layout: Split vertically in the middle
Labels: "Original" on left, "Enhanced (Natural)" on right'''
    },
    {
        'id': 'object-remove',
        'name': '物体移除Pro',
        'prompt': '''Create a professional side-by-side comparison image (2048x1024px):

LEFT (Before): A beautiful landscape photo with a trash bin in the foreground
RIGHT (After): The same landscape with the trash bin completely removed - seamless background fill, natural look

Style: Professional landscape photography
Layout: Split vertically in the middle
Labels: "With Object" on left, "Object Removed" on right'''
    }
]

def generate_image(prompt, feature_id):
    """调用 Gemini API 生成图片"""
    try:
        print(f"  🎨 Calling Gemini API...")
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:predict?key={GEMINI_API_KEY}"
        
        response = requests.post(
            url,
            headers={'Content-Type': 'application/json'},
            json={'prompt': prompt},
            timeout=180
        )
        
        if response.status_code != 200:
            print(f"  ❌ API Error: {response.status_code}")
            print(f"  {response.text[:200]}")
            return None
        
        result = response.json()
        image_base64 = result.get('predicted_image') or result.get('image')
        
        if not image_base64:
            print(f"  ❌ No image in response")
            return None
        
        return image_base64
        
    except Exception as e:
        print(f"  ❌ Exception: {str(e)}")
        return None

def save_image(base64_data, feature_id):
    """保存图片"""
    try:
        import base64
        
        # 移除 data:image 前缀（如果有）
        if base64_data.startswith('data:image'):
            base64_data = base64_data.split(',')[1]
        
        image_data = base64.b64decode(base64_data)
        
        output_path = f"{OUTPUT_DIR}/{feature_id}-example.png"
        with open(output_path, 'wb') as f:
            f.write(image_data)
        
        print(f"  ✅ Saved: {output_path}")
        return True
        
    except Exception as e:
        print(f"  ❌ Save error: {str(e)}")
        return False

if __name__ == '__main__':
    print("=== 为16个新功能生成高质量对比图 ===\n")
    print(f"API Key: {GEMINI_API_KEY[:20]}...")
    print(f"Total: {len(NEW_FEATURES)} features\n")
    
    success = 0
    failed = []
    
    for i, feature in enumerate(NEW_FEATURES, 1):
        print(f"\n[{i}/{len(NEW_FEATURES)}] {feature['name']} ({feature['id']})")
        
        try:
            image_base64 = generate_image(feature['prompt'], feature['id'])
            
            if image_base64:
                if save_image(image_base64, feature['id']):
                    success += 1
                else:
                    failed.append(feature['id'])
            else:
                failed.append(feature['id'])
            
            # 避免 API 限速
            if i < len(NEW_FEATURES):
                print(f"  ⏳ Waiting 3 seconds...")
                time.sleep(3)
                
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            failed.append(feature['id'])
    
    print(f"\n=== 完成 ===")
    print(f"成功: {success}/{len(NEW_FEATURES)}")
    if failed:
        print(f"失败: {', '.join(failed)}")
