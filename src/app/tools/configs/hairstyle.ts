import { ToolConfig } from '../types';

export const hairstyleConfig: ToolConfig = {
  id: 'hairstyle',
  presets: [

  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'natural', options: [
      { value: 'natural', label: '自然' }, { value: 'enhanced', label: '增强' }, { value: 'artistic', label: '艺术' }
    ]},
  ]
};
