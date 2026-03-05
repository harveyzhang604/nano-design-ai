import { ToolConfig } from '../types';

export const mapGenConfig: ToolConfig = {
  id: 'map-gen',
  presets: [
    {
      id: 'fantasy',
      name: '奇幻地图',
      description: '魔幻世界地图',
      params: { style: 'fantasy' }
    },
    {
      id: 'modern',
      name: '现代地图',
      description: '现代城市地图',
      params: { style: 'modern' }
    },
    {
      id: 'ancient',
      name: '古代地图',
      description: '古典风格地图',
      params: { style: 'ancient' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '地图风格',
      type: 'select',
      default: 'fantasy',
      options: [
        { value: 'fantasy', label: '奇幻' },
        { value: 'modern', label: '现代' },
        { value: 'ancient', label: '古代' },
        { value: 'scifi', label: '科幻' }
      ]
    }
  ]
};
