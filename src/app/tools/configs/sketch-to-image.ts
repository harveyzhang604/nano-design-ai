import { ToolConfig } from '../types';

export const sketchToImageConfig: ToolConfig = {
  id: 'sketch-to-image',
  presets: [
  ],
  params: [
    { id: 'style', name: '输出风格', type: 'select', default: 'realistic', options: [
      { value: 'realistic', label: '真实' }, { value: 'artistic', label: '艺术' }, { value: 'anime', label: '动漫' }, { value: 'cartoon', label: '卡通' }
    ]},
  ]
};
