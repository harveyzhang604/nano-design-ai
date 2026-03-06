const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('📱 访问主域名: https://talkphoto.app/tools');
    await page.goto('https://talkphoto.app/tools', { waitUntil: 'networkidle' });
    
    console.log('🎯 点击"照片放大"功能...');
    await page.click('text=照片放大');
    await page.waitForTimeout(3000);

    console.log('\n🔍 详细检查弹窗内容...');
    
    // 获取弹窗内的所有文本
    const modalText = await page.locator('[class*="fixed"]').first().textContent();
    console.log('弹窗文本内容:');
    console.log(modalText);
    
    console.log('\n📋 检查具体元素:');
    
    // 检查"选择预设"
    const presetLabel = await page.locator('text=选择预设').count();
    console.log(`  ✓ "选择预设"标签: ${presetLabel > 0 ? '✅ 找到' : '❌ 未找到'} (${presetLabel}个)`);
    
    // 检查"放大倍数"
    const scaleLabel = await page.locator('text=放大倍数').count();
    console.log(`  ✓ "放大倍数"标签: ${scaleLabel > 0 ? '✅ 找到' : '❌ 未找到'} (${scaleLabel}个)`);
    
    // 检查"画质"
    const qualityLabel = await page.locator('text=画质').count();
    console.log(`  ✓ "画质"标签: ${qualityLabel > 0 ? '✅ 找到' : '❌ 未找到'} (${qualityLabel}个)`);
    
    // 检查下拉框
    const selects = await page.locator('select, [role="combobox"]').count();
    console.log(`  ✓ 下拉框总数: ${selects}个`);
    
    // 检查预设选项
    const presetOptions = await page.locator('option').allTextContents();
    console.log(`  ✓ 预设选项: ${presetOptions.slice(0, 5).join(', ')}...`);
    
    // 截图
    await page.screenshot({ path: '/root/test-detail-screenshot.png', fullPage: true });
    console.log('\n📸 详细截图已保存: /root/test-detail-screenshot.png');
    
    console.log('\n✅ 测试完成！参数面板' + (presetLabel > 0 && scaleLabel > 0 && qualityLabel > 0 ? '正常显示' : '未显示'));

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    await browser.close();
  }
})();
