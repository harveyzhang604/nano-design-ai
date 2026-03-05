const { chromium } = require('playwright');

const testTools = [
  { name: '背景移除', expectedParam: '边缘' },
  { name: '老照片修复', expectedParam: '修复' },
  { name: '照片上色', expectedParam: '色调' },
  { name: '人像增强', expectedParam: '美颜' },
  { name: '图像放大', expectedParam: '放大' },
  { name: '草图转图', expectedParam: '风格' },
  { name: '风格迁移', expectedParam: '艺术' },
  { name: '卡通化', expectedParam: '卡通' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://talkphoto.app/tools', { waitUntil: 'networkidle' });
  
  console.log('测试多个功能的参数控制:\n');
  
  for (const tool of testTools) {
    try {
      // 点击功能
      await page.click(`button:has-text("${tool.name}")`);
      await page.waitForTimeout(1000);
      
      // 检查参数
      const hasParam = await page.locator(`text=${tool.expectedParam}`).count() > 0;
      const hasPreset = await page.locator('text=预设').count() > 0;
      
      console.log(`${tool.name}: ${hasParam && hasPreset ? '✓' : '✗'} (${tool.expectedParam})`);
      
      // 关闭面板
      await page.click('button:has-text("×")');
      await page.waitForTimeout(500);
    } catch (e) {
      console.log(`${tool.name}: ✗ 错误 - ${e.message}`);
    }
  }
  
  await browser.close();
})();
