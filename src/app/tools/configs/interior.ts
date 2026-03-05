import { ToolConfig } from '../types';

export const interiorConfig: ToolConfig = {
  id: 'interior',
  presets: [
    {
      id: 'modern',
      name: '现代风格',
      description: '简约现代设计',
      params: { style: 'modern' }
    },
    {
      id: 'scandinavian',
      name: '北欧风格',
      description: '温馨北欧设计',
      params: { style: 'scandinavian' }
    },
    {
      id: 'industrial',
      name: '工业风格',
      description: '复古工业风',
      params: { style: 'industrial' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '设计风格',
      type: 'select',
      default: 'modern',
      options: [
        { value: 'modern', label: '现代' },
        { value: 'scandinavian', label: '北欧' },
        { value: 'industrial', label: '工业' },
        { value: 'minimalist', label: '极简' },
        { value: 'luxury', label: '奢华' }
      ]
    }
  ]
};
