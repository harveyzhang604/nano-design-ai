import { ToolConfig } from '../types';

export const eraseConfig: ToolConfig = {
  id: 'erase',
  presets: [
    {
      id: 'precise',
      name: '精准移除',
      description: '精确移除选中物体',
      params: { mode: 'precise' }
    },
    {
      id: 'smart',
      name: '智能填充',
      description: '自动填充背景',
      params: { mode: 'smart' }
    },
    {
      id: 'blend',
      name: '自然融合',
      description: '无缝融合周围',
      params: { mode: 'blend' }
    }
  ],
  params: [
    {
      id: 'mode',
      name: '移除模式',
      type: 'select',
      default: 'smart',
      options: [
        { value: 'precise', label: '精准' },
        { value: 'smart', label: '智能' },
        { value: 'blend', label: '融合' }
      ]
    }
  ]
};
