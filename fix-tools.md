# 功能修复计划

## 第一步：添加缺失的 6 个功能

需要添加到 page.tsx 的功能：
1. `baby-prediction` - 婴儿预测
2. `filter` - AI滤镜
3. `gender-swap` - 性别转换
4. `hairstyle` - 发型设计
5. `makeup` - 妆容试用
6. `tattoo` - 纹身预览

## 第二步：统一功能名称

需要修改的功能 ID（前端 → API）：
1. `fashion` → `fashion-model`
2. `greeting` → `greeting-card`
3. `interior` → `interior-design`
4. `product` → `product-photo`
5. `sketch-to-photo` → `sketch-to-image`

## 第三步：去重重复功能

需要合并的功能：
1. `age` + `face-age` → 保留 `age-transform`（API 名称）
2. `outfit-change` + `try-on` → 保留 `try-on`（虚拟试穿）

## 执行顺序

1. 先统一名称（避免 API 调用失败）
2. 再添加缺失功能
3. 最后去重
