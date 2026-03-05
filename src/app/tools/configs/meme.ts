import { ToolConfig } from '../types';

export const memeConfig: ToolConfig = {
  id: 'meme',
  presets: [
    {
      id: 'classic',
      name: '经典梗图',
      description: '传统梗图风格',
      params: { style: 'classic' }
    },
    {
      id: 'modern',
      name: '现代梗图',
      description: '流行梗图风格',
      params: { style: 'modern' }
    },
    {
      id: 'abstract',
      name: '抽象梗图',
      description: '抽象幽默',
      params: { style: 'abstract' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '梗图风格',
      type: 'select',
      default: 'classic',
      options: [
        { value: 'classic', label: '经典' },
        { value: 'modern', label: '现代' },
        { value: 'abstract', label: '抽象' },
        { value: 'dank', label: '沙雕' }
      ]
    }
  ]
};
