#!/usr/bin/env node

const fs = require('fs');

// 生成图片
async function generateImage(prompt, index) {
  console.log(`\n[${index + 1}] 生成中: ${prompt.substring(0, 50)}...`);
  
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
  const prompts = JSON.parse(fs.readFileSync('prompts-extracted.json', 'utf8'));
  
  // 从第 21 张开始生成剩余的
  const remainingPrompts = prompts.slice(20);
  console.log(`继续生成剩余 ${remainingPrompts.length} 张图片...\n`);

  const results = [];
  
  for (let i = 0; i < remainingPrompts.length; i++) {
    const result = await generateImage(remainingPrompts[i], i + 20);
    results.push(result);
    
    // 每 10 张保存一次
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync('gallery-results-remaining.json', JSON.stringify(results, null, 2));
      console.log(`\n📊 进度: ${i + 1}/${remainingPrompts.length} (${Math.round((i+1)/remainingPrompts.length*100)}%)`);
    }
    
    // 等待 3 秒
    if (i < remainingPrompts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // 合并之前的结果
  const previousResults = JSON.parse(fs.readFileSync('src/data/gallery-test.json', 'utf8'));
  const newResults = results.filter(r => r.imageUrl).map((r, i) => ({
    id: previousResults.length + i + 1,
    prompt: r.prompt,
    imageUrl: r.imageUrl
  }));

  const allGallery = [...previousResults, ...newResults];
  fs.writeFileSync('src/data/gallery.json', JSON.stringify(allGallery, null, 2));
  
  console.log(`\n\n✅ 完成！新增 ${newResults.length}/${remainingPrompts.length} 张`);
  console.log(`总计: ${allGallery.length} 张图片`);
  console.log(`失败: ${results.filter(r => !r.imageUrl).length} 张`);
}

main().catch(console.error);
