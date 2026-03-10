import { ToolConfig } from '../types';

export const ageEvolutionConfig: ToolConfig = {
  id: 'age-evolution',
  presets: [
    { 
      id: 'baby', 
      name: '婴儿时期 👶', 
      description: '0-2岁的样子', 
      params: { targetAge: 1, style: 'realistic' } 
    },
    { 
      id: 'child', 
      name: '童年时期 🧒', 
      description: '6-10岁的样子', 
      params: { targetAge: 8, style: 'realistic' } 
    },
    { 
      id: 'teen', 
      name: '青少年 👦', 
      description: '13-17岁的样子', 
      params: { targetAge: 15, style: 'realistic' } 
    },
    { 
      id: 'young-adult', 
      name: '青年 👨', 
      description: '20-30岁的样子', 
      params: { targetAge: 25, style: 'realistic' } 
    },
    { 
      id: 'middle-age', 
      name: '中年 👨‍🦳', 
      description: '40-50岁的样子', 
      params: { targetAge: 45, style: 'realistic' } 
    },
    { 
      id: 'senior', 
      name: '老年 👴', 
      description: '65-75岁的样子', 
      params: { targetAge: 70, style: 'realistic' } 
    }
  ],
  params: [
    { 
      id: 'targetAge', 
      name: '目标年龄', 
      type: 'slider', 
      default: 25, 
      min: 1, 
      max: 90,
      description: '想要看到的年龄'
    },
    { 
      id: 'style', 
      name: '风格', 
      type: 'select', 
      default: 'realistic', 
      options: [
        { value: 'realistic', label: '真实照片' },
        { value: 'artistic', label: '艺术风格' },
        { value: 'portrait', label: '肖像画' }
      ]
    },
    {
      id: 'preserveFeatures',
      name: '保留特征',
      type: 'slider',
      default: 90,
      min: 70,
      max: 100,
      description: '保留原有面部特征的程度'
    },
    {
      id: 'showTimeline',
      name: '显示时间线',
      type: 'select',
      default: 'single',
      options: [
        { value: 'single', label: '单一年龄' },
        { value: 'timeline', label: '年龄时间线（多张）' }
      ]
    }
  ]
};
