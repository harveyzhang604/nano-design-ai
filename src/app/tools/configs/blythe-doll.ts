import { ToolConfig } from '../types';

export const blytheConfig: ToolConfig = {
  id: 'blythe-doll',
  presets: [
    { 
      id: 'classic', 
      name: '经典 Blythe 🎀', 
      description: '标准 Blythe 娃娃风格', 
      params: { style: 'classic', eyeSize: 'large', outfit: 'vintage' } 
    },
    { 
      id: 'neo', 
      name: 'Neo Blythe 💖', 
      description: '现代 Neo Blythe 风格', 
      params: { style: 'neo', eyeSize: 'extra-large', outfit: 'modern' } 
    },
    { 
      id: 'custom', 
      name: '定制 Blythe ✨', 
      description: '艺术家定制娃娃', 
      params: { style: 'custom', eyeSize: 'large', outfit: 'artistic' } 
    },
    { 
      id: 'gothic', 
      name: '哥特 Blythe 🖤', 
      description: '暗黑哥特风格', 
      params: { style: 'gothic', eyeSize: 'large', outfit: 'gothic' } 
    },
    { 
      id: 'kawaii', 
      name: '可爱 Blythe 🌸', 
      description: '日系甜美风格', 
      params: { style: 'kawaii', eyeSize: 'extra-large', outfit: 'lolita' } 
    }
  ],
  params: [
    { 
      id: 'style', 
      name: 'Blythe 风格', 
      type: 'select', 
      default: 'classic', 
      options: [
        { value: 'classic', label: '经典 Blythe' },
        { value: 'neo', label: 'Neo Blythe (现代)' },
        { value: 'custom', label: '定制艺术娃娃' },
        { value: 'gothic', label: '哥特风格' },
        { value: 'kawaii', label: '日系可爱' }
      ]
    },
    { 
      id: 'eyeSize', 
      name: '眼睛大小', 
      type: 'select', 
      default: 'large', 
      options: [
        { value: 'large', label: '大眼睛 (标准)' },
        { value: 'extra-large', label: '超大眼睛 (夸张)' },
        { value: 'medium', label: '中等眼睛 (含蓄)' }
      ]
    },
    {
      id: 'outfit',
      name: '服装风格',
      type: 'select',
      default: 'vintage',
      options: [
        { value: 'vintage', label: '复古风格' },
        { value: 'modern', label: '现代时尚' },
        { value: 'artistic', label: '艺术创意' },
        { value: 'gothic', label: '哥特暗黑' },
        { value: 'lolita', label: '洛丽塔' },
        { value: 'casual', label: '休闲可爱' }
      ]
    },
    {
      id: 'skinTone',
      name: '肤色',
      type: 'select',
      default: 'porcelain',
      options: [
        { value: 'porcelain', label: '瓷白色' },
        { value: 'fair', label: '白皙' },
        { value: 'tan', label: '小麦色' },
        { value: 'custom', label: '保持原肤色' }
      ]
    },
    {
      id: 'hairStyle',
      name: '发型',
      type: 'select',
      default: 'original',
      options: [
        { value: 'original', label: '保持原发型' },
        { value: 'straight-bangs', label: '齐刘海直发' },
        { value: 'curly', label: '卷发' },
        { value: 'twin-tails', label: '双马尾' },
        { value: 'bob', label: '波波头' }
      ]
    }
  ]
};
