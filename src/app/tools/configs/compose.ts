import { ToolConfig } from '../types';

export const composeConfig: ToolConfig = {
  id: 'compose',
  presets: [
    { id: 'blend', name: '混合模式', description: '图层混合', params: { overlayImageUrl: '', mode: 'blend', intensity: 50 } },
    { id: 'overlay', name: '叠加模式', description: '图层叠加', params: { overlayImageUrl: '', mode: 'overlay', intensity: 70 } },
    { id: 'multiply', name: '正片叠底', description: '正片叠底', params: { overlayImageUrl: '', mode: 'multiply', intensity: 60 } }
  ],
  params: [
    { id: 'overlayImageUrl', name: '叠加图片URL', type: 'text', default: '', placeholder: '粘贴要叠加的图片URL...' },
    { id: 'mode', name: '混合模式', type: 'select', default: 'blend', options: [
      { value: 'blend', label: '混合' },
      { value: 'overlay', label: '叠加' },
      { value: 'multiply', label: '正片叠底' }
    ]},
    { id: 'intensity', name: '不透明度', type: 'slider', default: 50, min: 0, max: 100 }
  ]
};
