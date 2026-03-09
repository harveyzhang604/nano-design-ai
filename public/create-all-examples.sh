#!/bin/bash
# 为所有功能创建示例图片（使用 ImageMagick）

tools=(
  "remove-bg:背景移除"
  "upscale:照片放大"
  "colorize:照片上色"
  "restore:老照片修复"
  "erase:AI去物体"
  "change-bg:AI换背景"
  "portrait:人像增强"
  "enhance:图像超分"
  "style-transfer:艺术风格"
  "avatar:AI头像"
  "cartoon:卡通化"
  "sketch-to-photo:草图转照片"
  "product:产品摄影"
  "face-swap:换脸"
  "try-on:虚拟试穿"
  "interior:室内设计"
  "age:年龄变化"
  "face-age:童年/未来"
  "meme:表情包"
  "greeting:贺卡"
  "cosplay:Cosplay"
  "photoshoot:AI写真"
  "real-estate:房产渲染"
  "map-gen:地图生成"
  "fashion:服装模特"
  "compose:图像合成"
  "caricature:漫画化"
  "yearbook:年鉴照"
  "pet-cartoon:宠物卡通"
)

for item in "${tools[@]}"; do
  id="${item%%:*}"
  name="${item##*:}"
  
  if [ ! -f "${id}-example.webp" ]; then
    echo "创建 ${id}-example.webp (${name})"
    convert -size 400x300 xc:white \
      -gravity center \
      -pointsize 32 \
      -fill "#666666" \
      -annotate +0+0 "${name}" \
      -quality 80 \
      "${id}-example.webp"
  fi
done

echo "完成！"
