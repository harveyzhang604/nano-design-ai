import { ToolConfig } from '../types';

export const yearbookConfig: ToolConfig = {
  id: 'yearbook',
  presets: [
    { id: '1980s', name: '80年代', description: '80年代风格', params: { year: '1980', style: '1980s', intensity: 85 } },
    { id: '1990s', name: '90年代', description: '90年代风格', params: { year: '1990', style: '1990s', intensity: 80 } },
    { id: '2000s', name: '00年代', description: '00年代风格', params: { year: '2000', style: '2000s', intensity: 75 } }
  ],
  params: [
    { id: 'year', name: '年份', type: 'text', default: '1990', placeholder: '输入年份（如1990）...' },
    { id: 'style', name: '风格', type: 'select', default: '1990s', options: [
      { value: '1980s', label: '80年代' },
      { value: '1990s', label: '90年代' },
      { value: '2000s', label: '00年代' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
