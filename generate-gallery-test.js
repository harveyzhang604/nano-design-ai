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
  
  // 只生成前 20 张测试
  const testPrompts = prompts.slice(0, 20);
  console.log(`开始生成 ${testPrompts.length} 张图片（测试）...\n`);

  const results = [];
  
  for (let i = 0; i < testPrompts.length; i++) {
    const result = await generateImage(testPrompts[i], i);
    results.push(result);
    
    // 每 5 张保存一次
    if ((i + 1) % 5 === 0) {
      fs.writeFileSync('gallery-results-test.json', JSON.stringify(results, null, 2));
      console.log(`\n📊 进度: ${i + 1}/${testPrompts.length}`);
    }
    
    // 等待 3 秒
    if (i < testPrompts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // 生成 gallery.json
  const gallery = results
    .filter(r => r.imageUrl)
    .map((r, i) => ({
      id: i + 1,
      prompt: r.prompt,
      imageUrl: r.imageUrl
    }));

  fs.writeFileSync('src/data/gallery-test.json', JSON.stringify(gallery, null, 2));
  
  console.log(`\n\n✅ 完成！成功 ${gallery.length}/${testPrompts.length} 张`);
  console.log(`失败: ${results.filter(r => !r.imageUrl).length} 张`);
}

main().catch(console.error);
