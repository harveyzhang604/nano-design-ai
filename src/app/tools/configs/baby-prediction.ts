import { ToolConfig } from '../types';

export const babyPredictionConfig: ToolConfig = {
  id: 'baby-prediction',
  presets: [
    { id: 'realistic', name: '真实预测', description: '真实宝宝预测', params: { style: 'realistic', intensity: 75 } },
    { id: 'cute', name: '可爱风格', description: '萌系可爱效果', params: { style: 'cute', intensity: 80 } },
    { id: 'artistic', name: '艺术风格', description: '艺术化处理', params: { style: 'artistic', intensity: 70 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'realistic', options: [
      { value: 'realistic', label: '真实' },
      { value: 'cute', label: '可爱' },
      { value: 'artistic', label: '艺术' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
