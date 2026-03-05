#!/usr/bin/env node

const fs = require('fs');

// 读取已有的 gallery
const existingGallery = JSON.parse(fs.readFileSync('src/data/gallery.json', 'utf8'));
const existingCount = existingGallery.length;
console.log(`已有 ${existingCount} 张图片，继续生成...\n`);

// 读取所有提示词
const allPrompts = JSON.parse(fs.readFileSync('prompts-extracted.json', 'utf8'));

// 剩余提示词
const remainingPrompts = allPrompts.slice(existingCount);

console.log(`剩余 ${remainingPrompts.length} 张待生成\n`);

// 生成图片
async function generateImage(prompt, index) {
  console.log(`\n[${existingCount + index + 1}] 生成中: ${prompt.substring(0, 50)}...`);
  
  try {
    const response = await fetch('https://talkphoto.app/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, category: 'design' })
    });

    const data = await response.json();
    
    if (!response.ok || !data.imageUrl) {
      throw new Error(data.error || '生成失败');
    }

    console.log(`✅ 成功: ${data.imageUrl}`);
    return { prompt, imageUrl: data.imageUrl };
    
  } catch (error) {
    console.error(`❌ 失败: ${error.message}`);
    return { prompt, imageUrl: null, error: error.message };
  }
}

// 主函数
async function main() {
  const results = [];
  
  for (let i = 0; i < remainingPrompts.length; i++) {
    const result = await generateImage(remainingPrompts[i], i);
    results.push(result);
    
    // 每 10 张保存一次
    if ((i + 1) % 10 === 0) {
      const newItems = results.filter(r => r.imageUrl).map((r, idx) => ({
        id: existingCount + idx + 1,
        prompt: r.prompt,
        imageUrl: r.imageUrl
      }));
      const all = [...existingGallery, ...newItems];
      fs.writeFileSync('src/data/gallery.json', JSON.stringify(all, null, 2));
      console.log(`\n📊 进度: ${i + 1}/${remainingPrompts.length} (已保存)`);
    }
    
    // 等待 3 秒
    if (i < remainingPrompts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // 最终保存
  const newItems = results.filter(r => r.imageUrl).map((r, i) => ({
    id: existingCount + i + 1,
    prompt: r.prompt,
    imageUrl: r.imageUrl
  }));
  const allGallery = [...existingGallery, ...newItems];
  fs.writeFileSync('src/data/gallery.json', JSON.stringify(allGallery, null, 2));
  
  console.log(`\n\n✅ 完成！新增 ${newItems.length}/${remainingPrompts.length} 张`);
  console.log(`总计: ${allGallery.length} 张图片`);
}

main().catch(console.error);
