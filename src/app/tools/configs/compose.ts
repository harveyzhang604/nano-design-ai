import { ToolConfig } from '../types';

export const composeConfig: ToolConfig = {
  id: 'compose',
  presets: [
    {
      id: 'blend',
      name: '自然融合',
      description: '自然过渡融合',
      params: { mode: 'blend', intensity: 'medium' }
    },
    {
      id: 'overlay',
      name: '叠加效果',
      description: '图层叠加',
      params: { mode: 'overlay', intensity: 'medium' }
    },
    {
      id: 'collage',
      name: '拼贴效果',
      description: '创意拼贴',
      params: { mode: 'collage', intensity: 'strong' }
    }
  ],
  params: [
    {
      id: 'mode',
      name: '合成模式',
      type: 'select',
      default: 'blend',
      options: [
        { value: 'blend', label: '融合' },
        { value: 'overlay', label: '叠加' },
        { value: 'collage', label: '拼贴' },
        { value: 'mask', label: '蒙版' }
      ]
    },
    {
      id: 'intensity',
      name: '效果强度',
      type: 'select',
      default: 'medium',
      options: [
        { value: 'light', label: '轻度' },
        { value: 'medium', label: '中度' },
        { value: 'strong', label: '强烈' }
      ]
    }
  ]
};
