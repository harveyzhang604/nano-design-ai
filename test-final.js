const { chromium } = require('playwright');

const allTools = [
  // P0 (8个)
  { name: '背景移除', param: '边缘' },
  { name: '照片放大', param: '放大' },
  { name: '照片上色', param: '色调' },
  { name: '老照片修复', param: '修复' },
  { name: 'AI去物体', param: '移除' },
  { name: 'AI换背景', param: '背景' },
  { name: '人像增强', param: '美颜' },
  { name: '图像超分', param: '美化' },
  
  // P1 (9个)
  { name: '艺术风格', param: '艺术' },
  { name: 'AI头像', param: '头像' },
  { name: '卡通化', param: '卡通' },
  { name: '草图转照片', param: '风格' },
  { name: '产品摄影', param: '背景' },
  { name: 'AI换脸', param: '融合' },
  { name: '虚拟试穿', param: '服装' },
  { name: '室内设计', param: '设计' },
  { name: '年龄模拟', param: '变化' },
  
  // P2 (9个)
  { name: '表情包', param: '表情' },
  { name: '生日贺卡', param: '场合' },
  { name: 'Cosplay', param: 'Cos' },
  { name: 'AI写真', param: '拍摄' },
  { name: '房产渲染', param: '装修' },
  { name: '地图生成', param: '地图' },
  { name: '服装模特', param: '服装' },
  { name: '图像合成', param: '合成' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('访问网站...');
  await page.goto('https://talkphoto.app/tools', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log('\n测试26个功能的参数控制:\n');
  console.log('功能名称'.padEnd(20) + '状态');
  console.log('='.repeat(40));
  
  let passCount = 0;
  let failCount = 0;
  
  for (const tool of allTools) {
    try {
      // 找到按钮并滚动
      const button = await page.locator(`button:has-text("${tool.name}")`).first();
      await button.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // 点击
      await button.click({ timeout: 10000 });
      await page.waitForTimeout(1500);
      
      // 检查参数控制
      const hasParam = await page.locator(`text=${tool.param}`).count() > 0;
      const hasPreset = await page.locator('text=预设').count() > 0 || 
                        await page.locator('text=自然').count() > 0 ||
                        await page.locator('text=标准').count() > 0 ||
                        await page.locator('text=可爱').count() > 0 ||
                        await page.locator('text=精准').count() > 0;
      
      if (hasParam || hasPreset) {
        console.log(`${tool.name.padEnd(20)} ✓`);
        passCount++;
      } else {
        console.log(`${tool.name.padEnd(20)} ✗`);
        failCount++;
      }
      
      // 关闭面板
      const closeBtn = await page.locator('button:has-text("×")').first();
      await closeBtn.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      
    } catch (e) {
      console.log(`${tool.name.padEnd(20)} ✗ (${e.message.split('\n')[0].substring(0,30)})`);
      failCount++;
    }
  }
  
  console.log('='.repeat(40));
  console.log(`\n✅ 通过: ${passCount}/${allTools.length}`);
  console.log(`❌ 失败: ${failCount}/${allTools.length}`);
  console.log(`📊 通过率: ${(passCount/allTools.length*100).toFixed(1)}%`);
  
  await browser.close();
})();
