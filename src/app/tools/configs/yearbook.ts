import { ToolConfig } from '../types';

export const yearbookConfig: ToolConfig = {
  id: 'yearbook',
  presets: [
    { id: '1960s', name: '60年代', description: '60年代风格', params: { decade: '60s', intensity: 90 } },
    { id: '1970s', name: '70年代', description: '70年代风格', params: { decade: '70s', intensity: 85 } },
    { id: '1980s', name: '80年代', description: '80年代风格', params: { decade: '80s', intensity: 85 } },
    { id: '1990s', name: '90年代', description: '90年代风格', params: { decade: '90s', intensity: 80 } },
    { id: '2000s', name: '00年代', description: '00年代风格', params: { decade: '00s', intensity: 75 } },
    { id: '2010s', name: '10年代', description: '10年代风格', params: { decade: '10s', intensity: 70 } }
  ],
  params: [
    { id: 'decade', name: '年代', type: 'select', default: '90s', options: [
      { value: '60s', label: '60年代' },
      { value: '70s', label: '70年代' },
      { value: '80s', label: '80年代' },
      { value: '90s', label: '90年代' },
      { value: '00s', label: '00年代' },
      { value: '10s', label: '10年代' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
