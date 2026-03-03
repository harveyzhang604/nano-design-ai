#!/bin/bash
# Lighthouse 检查清单

echo "=== Lighthouse 优化检查清单 ==="
echo ""

echo "1. 颜色对比度检查..."
grep -n "text-neutral-[456]00" src/app/page.tsx src/app/gallery/page.tsx 2>/dev/null | wc -l

echo ""
echo "2. 标题层级检查..."
grep -n "<h3" src/app/page.tsx src/app/gallery/page.tsx 2>/dev/null | wc -l

echo ""
echo "3. 图片优化检查..."
grep -n "<img" src/app/page.tsx src/app/gallery/page.tsx 2>/dev/null

echo ""
echo "4. ARIA 标签检查..."
grep -n "aria-label\|role=" src/app/page.tsx src/app/gallery/page.tsx 2>/dev/null | wc -l

echo ""
echo "5. 字体加载检查..."
grep -n "font-display" src/app/globals.css 2>/dev/null

echo ""
echo "6. 懒加载检查..."
grep -n "dynamic\|lazy" src/app/page.tsx 2>/dev/null | wc -l

echo ""
echo "=== 检查完成 ==="
