import { ToolConfig } from '../types';

export const changeBgConfig: ToolConfig = {
  id: 'change-bg',
  presets: [
    {
      id: 'white',
      name: '纯白背景',
      description: '电商产品图标准，符合淘宝、京东要求',
      params: { 
        bgType: 'solid-white',
        shadow: true,
        edgeQuality: 'high',
        lighting: 50,
        blend: 80
      }
    },
    {
      id: 'blur',
      name: '模糊背景',
      description: '突出主体，适合人像、产品摄影',
      params: { 
        bgType: 'blur',
        shadow: false,
        edgeQuality: 'high',
        lighting: 50,
        blend: 90
      }
    },
    {
      id: 'gradient',
      name: '渐变背景',
      description: '时尚渐变，适合社交媒体、海报',
      params: { 
        bgType: 'gradient',
        shadow: false,
        edgeQuality: 'medium',
        lighting: 60,
        blend: 85
      }
    },
    {
      id: 'outdoor',
      name: '户外场景',
      description: '自然场景背景，适合人像、产品展示',
      params: { 
        bgType: 'outdoor',
        shadow: true,
        edgeQuality: 'high',
        lighting: 70,
        blend: 90
      }
    },
    {
      id: 'studio',
      name: '影棚效果',
      description: '专业影棚背景，适合商业摄影',
      params: { 
        bgType: 'studio',
        shadow: true,
        edgeQuality: 'ultra',
        lighting: 80,
        blend: 95
      }
    }
  ],
  params: [
    {
      id: 'bgType',
      name: '背景类型',
      type: 'select',
      default: 'solid-white',
      options: [
        { value: 'solid-white', label: '纯白背景' },
        { value: 'solid-color', label: '纯色背景' },
        { value: 'gradient', label: '渐变背景' },
        { value: 'blur', label: '模糊背景' },
        { value: 'outdoor', label: '户外场景' },
        { value: 'studio', label: '影棚效果' }
      ]
    },
    {
      id: 'shadow',
      name: '添加阴影',
      type: 'toggle',
      default: true
    },
    {
      id: 'edgeQuality',
      name: '边缘质量',
      type: 'select',
      default: 'high',
      options: [
        { value: 'ultra', label: '极致' },
        { value: 'high', label: '高' },
        { value: 'medium', label: '中' },
        { value: 'fast', label: '快速' }
      ]
    },
    {
      id: 'lighting',
      name: '光照调整',
      type: 'slider',
      default: 50,
      min: 0,
      max: 100
    },
    {
      id: 'blend',
      name: '融合度',
      type: 'slider',
      default: 80,
      min: 0,
      max: 100
    }
  ]
};
