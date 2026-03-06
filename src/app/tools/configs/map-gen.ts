import { ToolConfig } from '../types';

export const mapGenConfig: ToolConfig = {
  id: 'map-gen',
  presets: [
    { id: 'fantasy', name: '奇幻地图', description: '奇幻世界地图', params: { style: 'fantasy', intensity: 80 } },
    { id: 'realistic', name: '真实地图', description: '真实地形地图', params: { style: 'realistic', intensity: 75 } },
    { id: 'artistic', name: '艺术地图', description: '艺术风格地图', params: { style: 'artistic', intensity: 70 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'fantasy', options: [
      { value: 'fantasy', label: '奇幻' },
      { value: 'realistic', label: '真实' },
      { value: 'artistic', label: '艺术' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
