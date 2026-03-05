const { chromium } = require('playwright');

const allTools = [
  // P0
  { name: '图像超分', param: '美化' },
  { name: '背景移除', param: '边缘' },
  { name: '老照片修复', param: '修复' },
  { name: '照片上色', param: '色调' },
  { name: '人像增强', param: '美颜' },
  // P1
  { name: '图像放大', param: '放大' },
  { name: '草图转图', param: '风格' },
  { name: '风格迁移', param: '艺术' },
  { name: '卡通化', param: '卡通' },
  { name: '年龄变换', param: '变化' },
  { name: '性别转换', param: '转换' },
  { name: '发型设计', param: '发型' },
  { name: '虚拟试妆', param: '妆容' },
  // P2
  { name: '宠物卡通', param: '卡通' },
  { name: '纹身设计', param: '纹身' },
  { name: '室内设计', param: '设计' },
  { name: '产品摄影', param: '背景' },
  { name: 'AI写真', param: '拍摄' },
  { name: '表情包', param: '表情' },
  { name: '梗图生成', param: '梗图' },
  { name: 'Logo设计', param: 'Logo' },
  { name: '地图生成', param: '地图' },
  { name: '服装模特', param: '服装' },
  { name: '图像合成', param: '合成' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://talkphoto.app/tools', { waitUntil: 'networkidle' });
  
  console.log('测试26个功能的参数控制:\n');
  console.log('功能名称'.padEnd(20) + '状态');
  console.log('='.repeat(40));
  
  let passCount = 0;
  
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
                        await page.locator('text=可爱').count() > 0;
      
      if (hasParam && hasPreset) {
        console.log(`${tool.name.padEnd(20)} ✓`);
        passCount++;
      } else {
        console.log(`${tool.name.padEnd(20)} ✗ (参数:${hasParam?'✓':'✗'} 预设:${hasPreset?'✓':'✗'})`);
      }
      
      // 关闭面板
      const closeBtn = await page.locator('button:has-text("×")').first();
      await closeBtn.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      
    } catch (e) {
      console.log(`${tool.name.padEnd(20)} ✗ (错误)`);
    }
  }
  
  console.log('='.repeat(40));
  console.log(`\n✅ 通过: ${passCount}/24`);
  console.log(`📊 通过率: ${(passCount/24*100).toFixed(1)}%`);
  
  await browser.close();
})();
