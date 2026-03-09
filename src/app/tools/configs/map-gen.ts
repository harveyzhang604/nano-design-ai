import { ToolConfig } from '../types';

export const mapGenConfig: ToolConfig = {
  id: 'map-gen',
  presets: [
    { id: 'fantasy', name: '奇幻地图', description: '游戏地图', params: { description: '奇幻世界地图', style: 'fantasy', intensity: 85 } },
    { id: 'realistic', name: '真实地图', description: '现实地图', params: { description: '真实地理地图', style: 'realistic', intensity: 80 } },
    { id: 'treasure', name: '寻宝地图', description: '藏宝图', params: { description: '寻宝藏宝图', style: 'treasure', intensity: 90 } }
  ],
  params: [
    { id: 'description', name: '地图描述', type: 'text', default: '奇幻世界地图', placeholder: '描述想要的地图...' },
    { id: 'style', name: '风格', type: 'select', default: 'fantasy', options: [
      { value: 'fantasy', label: '奇幻' },
      { value: 'realistic', label: '真实' },
      { value: 'treasure', label: '寻宝' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 85, min: 0, max: 100 }
  ]
};
