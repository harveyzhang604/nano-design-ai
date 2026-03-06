import { ToolConfig } from '../types';

export const composeConfig: ToolConfig = {
  id: 'compose',
  presets: [
    { id: 'natural', name: '自然合成', description: '自然融合效果', params: { style: 'natural', intensity: 75 } },
    { id: 'creative', name: '创意合成', description: '创意艺术效果', params: { style: 'creative', intensity: 80 } },
    { id: 'seamless', name: '无缝融合', description: '完美无缝融合', params: { style: 'seamless', intensity: 90 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'natural', options: [
      { value: 'natural', label: '自然' },
      { value: 'creative', label: '创意' },
      { value: 'seamless', label: '无缝' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
