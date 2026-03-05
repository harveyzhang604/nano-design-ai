import { ToolConfig } from '../types';

export const faceAgeConfig: ToolConfig = {
  id: 'face-age',
  presets: [
    {
      id: 'child',
      name: '童年',
      description: '回到童年',
      params: { target: 'child' }
    },
    {
      id: 'teen',
      name: '青少年',
      description: '青春期',
      params: { target: 'teen' }
    },
    {
      id: 'elder',
      name: '老年',
      description: '未来容貌',
      params: { target: 'elder' }
    }
  ],
  params: [
    {
      id: 'target',
      name: '目标年龄',
      type: 'select',
      default: 'child',
      options: [
        { value: 'child', label: '童年' },
        { value: 'teen', label: '青少年' },
        { value: 'elder', label: '老年' }
      ]
    }
  ]
};
