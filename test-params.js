const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('📱 访问网站...');
    await page.goto('https://talkphoto.app/tools');
    await page.waitForLoadState('networkidle');

    console.log('🎯 点击"照片放大"功能...');
    await page.click('text=照片放大');
    await page.waitForTimeout(2000);

    console.log('🔍 检查参数面板...');
    
    // 检查是否有"选择预设"文本
    const hasPreset = await page.locator('text=选择预设').count() > 0;
    console.log(`  - 选择预设: ${hasPreset ? '✅ 存在' : '❌ 不存在'}`);

    // 检查是否有下拉框
    const selectCount = await page.locator('select, [role="combobox"]').count();
    console.log(`  - 下拉框数量: ${selectCount}`);

    // 检查是否有参数相关文本
    const hasParams = await page.locator('text=/放大倍数|画质|参数/').count() > 0;
    console.log(`  - 参数文本: ${hasParams ? '✅ 存在' : '❌ 不存在'}`);

    // 截图
    await page.screenshot({ path: '/root/test-params-screenshot.png', fullPage: true });
    console.log('📸 截图已保存: /root/test-params-screenshot.png');

    // 测试最新部署URL
    console.log('\n🆕 测试最新部署URL...');
    await page.goto('https://25b21b05.nano-design-ai-v2.pages.dev/tools');
    await page.waitForLoadState('networkidle');
    
    await page.click('text=照片放大');
    await page.waitForTimeout(2000);

    const hasPresetNew = await page.locator('text=选择预设').count() > 0;
    console.log(`  - 选择预设: ${hasPresetNew ? '✅ 存在' : '❌ 不存在'}`);

    const selectCountNew = await page.locator('select, [role="combobox"]').count();
    console.log(`  - 下拉框数量: ${selectCountNew}`);

    await page.screenshot({ path: '/root/test-params-new-screenshot.png', fullPage: true });
    console.log('📸 新部署截图: /root/test-params-new-screenshot.png');

    console.log('\n✅ 测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    await browser.close();
  }
})();
