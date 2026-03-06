import { ToolConfig } from '../types';

export const ageConfig: ToolConfig = {
  id: 'age',
  presets: [
    { id: 'younger', name: '年轻化', description: '回到年轻时光', params: { style: 'younger', intensity: 70 } },
    { id: 'older', name: '老年化', description: '预测老年样貌', params: { style: 'older', intensity: 75 } },
    { id: 'child', name: '童年化', description: '回到童年时期', params: { style: 'child', intensity: 80 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'younger', options: [
      { value: 'younger', label: '年轻' },
      { value: 'older', label: '老年' },
      { value: 'child', label: '童年' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
