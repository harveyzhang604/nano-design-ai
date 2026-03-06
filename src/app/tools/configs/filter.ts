import { ToolConfig } from '../types';

export const filterConfig: ToolConfig = {
  id: 'filter',
  presets: [
    { id: 'warm', name: '暖色调', description: '温暖色调滤镜', params: { style: 'warm', intensity: 70 } },
    { id: 'cool', name: '冷色调', description: '清冷色调滤镜', params: { style: 'cool', intensity: 70 } },
    { id: 'vintage', name: '复古滤镜', description: '怀旧复古效果', params: { style: 'vintage', intensity: 75 } },
    { id: 'bw', name: '黑白滤镜', description: '经典黑白效果', params: { style: 'bw', intensity: 80 } }
  ],
  params: [
    { id: 'style', name: '滤镜类型', type: 'select', default: 'warm', options: [
      { value: 'warm', label: '暖色' },
      { value: 'cool', label: '冷色' },
      { value: 'vintage', label: '复古' },
      { value: 'bw', label: '黑白' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 70, min: 0, max: 100 }
  ]
};
