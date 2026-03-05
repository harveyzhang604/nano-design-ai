import { ToolConfig } from '../types';

export const realEstateConfig: ToolConfig = {
  id: 'real-estate',
  presets: [
    {
      id: 'modern',
      name: '现代风格',
      description: '现代简约装修',
      params: { style: 'modern' }
    },
    {
      id: 'luxury',
      name: '豪华风格',
      description: '高端奢华装修',
      params: { style: 'luxury' }
    },
    {
      id: 'cozy',
      name: '温馨风格',
      description: '温馨舒适装修',
      params: { style: 'cozy' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '装修风格',
      type: 'select',
      default: 'modern',
      options: [
        { value: 'modern', label: '现代' },
        { value: 'luxury', label: '豪华' },
        { value: 'cozy', label: '温馨' },
        { value: 'minimalist', label: '极简' }
      ]
    }
  ]
};
