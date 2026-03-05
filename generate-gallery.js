#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// 配置
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const R2_ACCOUNT_ID = '9af2fdf271637c43b99ca8349ee04c59';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = 'nano-design-ai';
const R2_PUBLIC_URL = 'https://img.talkphoto.app';

if (!GEMINI_API_KEY) {
  console.error('缺少 GEMINI_API_KEY');
  process.exit(1);
}

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
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate an image: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          }
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || '生成失败');
    }

    // 提取图片数据
    const imageData = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;
    if (!imageData) {
      throw new Error('未找到图片数据');
    }

    // 上传到 R2
    const buffer = Buffer.from(imageData.data, 'base64');
    const filename = `gallery/prompt-${index + 1}-${Date.now()}.png`;
    
    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: filename,
      Body: buffer,
      ContentType: 'image/png',
    }));

    const imageUrl = `${R2_PUBLIC_URL}/${filename}`;
    console.log(`✅ 成功: ${imageUrl}`);
    
    return { prompt, imageUrl };
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
  const batchSize = 5; // 每批 5 张，避免 API 限流

  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    console.log(`\n=== 批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(prompts.length / batchSize)} ===`);
    
    const batchResults = await Promise.all(
      batch.map((prompt, idx) => generateImage(prompt, i + idx))
    );
    
    results.push(...batchResults);
    
    // 保存中间结果
    fs.writeFileSync('gallery-results.json', JSON.stringify(results, null, 2));
    
    // 等待 2 秒避免限流
    if (i + batchSize < prompts.length) {
      console.log('\n等待 2 秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
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
