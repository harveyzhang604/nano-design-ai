import { ToolConfig } from '../types';

export const productPhotoConfig: ToolConfig = {
  id: 'product-photo',
  presets: [
    {
      id: 'white',
      name: '纯白背景',
      description: '电商标准白底',
      params: { background: 'white', lighting: 'studio' }
    },
    {
      id: 'lifestyle',
      name: '生活场景',
      description: '真实使用场景',
      params: { background: 'lifestyle', lighting: 'natural' }
    },
    {
      id: 'luxury',
      name: '高端质感',
      description: '奢华展示效果',
      params: { background: 'luxury', lighting: 'dramatic' }
    }
  ],
  params: [
    {
      id: 'background',
      name: '背景类型',
      type: 'select',
      default: 'white',
      options: [
        { value: 'white', label: '纯白' },
        { value: 'lifestyle', label: '生活场景' },
        { value: 'luxury', label: '高端' },
        { value: 'gradient', label: '渐变' }
      ]
    },
    {
      id: 'lighting',
      name: '光照效果',
      type: 'select',
      default: 'studio',
      options: [
        { value: 'studio', label: '影棚光' },
        { value: 'natural', label: '自然光' },
        { value: 'dramatic', label: '戏剧光' }
      ]
    }
  ]
};
