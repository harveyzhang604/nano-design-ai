#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// 配置
const R2_ACCOUNT_ID = '9af2fdf271637c43b99ca8349ee04c59';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = 'nano-design-ai';
const R2_PUBLIC_URL = 'https://img.talkphoto.app';
const API_URL = 'https://talkphoto.app/api/generate';

// R2 客户端
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// 生成图片
async function generateImage(prompt, index) {
  console.log(`\n[${index + 1}] 生成中: ${prompt.substring(0, 50)}...`);
  
  try {
    const response = await fetch(API_URL, {
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
  console.log(`开始生成 ${prompts.length} 张图片...\n`);

  const results = [];
  
  // 逐个生成，避免并发过多
  for (let i = 0; i < prompts.length; i++) {
    const result = await generateImage(prompts[i], i);
    results.push(result);
    
    // 每 10 张保存一次
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync('gallery-results.json', JSON.stringify(results, null, 2));
      console.log(`\n已保存进度: ${i + 1}/${prompts.length}`);
    }
    
    // 等待 3 秒避免限流
    if (i < prompts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // 生成最终 gallery.json
  const gallery = results
    .filter(r => r.imageUrl)
    .map((r, i) => ({
      id: i + 1,
      prompt: r.prompt,
      imageUrl: r.imageUrl
    }));

  fs.writeFileSync('src/data/gallery.json', JSON.stringify(gallery, null, 2));
  
  console.log(`\n\n✅ 完成！成功生成 ${gallery.length}/${prompts.length} 张图片`);
  console.log(`失败: ${results.filter(r => !r.imageUrl).length} 张`);
}

main().catch(console.error);
