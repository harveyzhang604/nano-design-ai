const fs = require('fs');
const path = require('path');

// 所有功能列表
const tools = [
  'remove-bg', 'upscale', 'colorize', 'restore', 'erase', 'change-bg', 'portrait', 'enhance',
  'style-transfer', 'avatar', 'cartoon', 'sketch-to-photo', 'product', 'face-swap', 'try-on',
  'interior', 'age', 'face-age', 'meme', 'greeting', 'cosplay', 'photoshoot', 'real-estate',
  'map-gen', 'fashion', 'compose', 'caricature', 'yearbook', 'pet-cartoon',
  'outfit-change', 'object-remove', 'beauty-enhance', 'style-transfer-pro'
];

// 检查每个API需要的参数
const apiRequirements = {
  'greeting': ['message'],
  'meme': ['text'],
  'map-gen': ['description'],
  'sketch-to-photo': ['prompt'],
  'cosplay': ['character'],
  'caricature': ['profession'],
  'yearbook': ['year'],
  'face-swap': ['targetImageUrl'],
  'try-on': ['clothingImageUrl'],
  'change-bg': ['background'],
  'interior': ['style'],
  'real-estate': ['renovationStyle'],
  'fashion': ['outfit'],
  'compose': ['overlayImageUrl']
};

console.log('=== 检查所有功能配置 ===\n');

tools.forEach(toolId => {
  const configPath = `./src/app/tools/configs/${toolId}.ts`;
  
  if (!fs.existsSync(configPath)) {
    console.log(`❌ ${toolId}: 配置文件不存在`);
    return;
  }
  
  const content = fs.readFileSync(configPath, 'utf8');
  const requiredParams = apiRequirements[toolId] || [];
  
  if (requiredParams.length === 0) {
    console.log(`✅ ${toolId}: 无必填参数`);
    return;
  }
  
  const missingParams = [];
  requiredParams.forEach(param => {
    if (!content.includes(`id: '${param}'`)) {
      missingParams.push(param);
    }
  });
  
  if (missingParams.length > 0) {
    console.log(`❌ ${toolId}: 缺少参数 ${missingParams.join(', ')}`);
  } else {
    console.log(`✅ ${toolId}: 所有必填参数已配置`);
  }
});
