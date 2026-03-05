#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 templates.ts 并提取所有提示词
const templatesPath = path.join(__dirname, 'src/config/templates.ts');
const content = fs.readFileSync(templatesPath, 'utf8');

// 提取 promptTemplates 对象
const match = content.match(/export const promptTemplates = \{([\s\S]*?)\n\};/);
if (!match) {
  console.error('无法找到 promptTemplates');
  process.exit(1);
}

// 简单解析提取所有 prompt 字段
const prompts = [];
const promptMatches = content.matchAll(/prompt: ['"`](.*?)['"`]/g);
for (const m of promptMatches) {
  if (m[1] && m[1].length > 20) { // 过滤掉太短的
    prompts.push(m[1]);
  }
}

console.log(`找到 ${prompts.length} 个提示词`);
console.log('前 5 个:');
prompts.slice(0, 5).forEach((p, i) => {
  console.log(`${i + 1}. ${p.substring(0, 60)}...`);
});

// 保存到文件
fs.writeFileSync(
  path.join(__dirname, 'prompts-extracted.json'),
  JSON.stringify(prompts, null, 2)
);
console.log('\n已保存到 prompts-extracted.json');
