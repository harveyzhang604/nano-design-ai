import { ToolConfig } from '../types';

export const faceAgeConfig: ToolConfig = {
  id: 'face-age',
  presets: [
    { id: 'younger', name: '年轻化', description: '面部年轻化', params: { style: 'younger', intensity: 70 } },
    { id: 'older', name: '老年化', description: '面部老年化', params: { style: 'older', intensity: 75 } },
    { id: 'natural', name: '自然变化', description: '自然年龄变化', params: { style: 'natural', intensity: 65 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'younger', options: [
      { value: 'younger', label: '年轻' },
      { value: 'older', label: '老年' },
      { value: 'natural', label: '自然' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 70, min: 0, max: 100 }
  ]
};
