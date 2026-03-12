import { ToolConfig } from '../types';

export const partialRedesignConfig: ToolConfig = {
  id: 'partial-redesign',
  presets: [
    {
      id: 'modern-sofa',
      name: '现代沙发',
      description: '只改沙发，其他不变',
      params: { 
        target: 'sofa',
        style: 'modern'
      }
    },
    {
      id: 'accent-wall',
      name: '特色墙面',
      description: '只改墙面颜色/材质',
      params: { 
        target: 'wall',
        style: 'modern'
      }
    },
    {
      id: 'new-floor',
      name: '更换地板',
      description: '只改地板材质',
      params: { 
        target: 'floor',
        style: 'scandinavian'
      }
    },
    {
      id: 'luxury-furniture',
      name: '奢华家具',
      description: '升级所有家具',
      params: { 
        target: 'furniture',
        style: 'luxury'
      }
    }
  ],
  params: [
    {
      id: 'target',
      name: '改造目标',
      type: 'select',
      default: 'sofa',
      options: [
        { value: 'sofa', label: '沙发' },
        { value: 'wall', label: '墙面' },
        { value: 'floor', label: '地板' },
        { value: 'curtains', label: '窗帘' },
        { value: 'lighting', label: '灯具' },
        { value: 'furniture', label: '所有家具' },
        { value: 'decor', label: '装饰品' }
      ]
    },
    {
      id: 'style',
      name: '设计风格',
      type: 'select',
      default: 'modern',
      options: [
        { value: 'modern', label: '现代简约' },
        { value: 'scandinavian', label: '北欧风' },
        { value: 'industrial', label: '工业风' },
        { value: 'bohemian', label: '波西米亚' },
        { value: 'luxury', label: '奢华风' },
        { value: 'minimalist', label: '极简主义' },
        { value: 'traditional', label: '传统经典' }
      ]
    },
    {
      id: 'description',
      name: '自定义描述',
      type: 'text',
      default: '',
      description: '可选：详细描述你想要的效果'
    }
  ]
};
