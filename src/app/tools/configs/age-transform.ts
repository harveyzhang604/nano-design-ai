import { ToolConfig } from '../types';

export const ageTransformConfig: ToolConfig = {
  id: 'age-transform',
  presets: [
    {
      id: 'younger',
      name: '年轻化',
      description: '回到青春',
      params: { direction: 'younger', intensity: 'medium' }
    },
    {
      id: 'older',
      name: '老年化',
      description: '预见未来',
      params: { direction: 'older', intensity: 'medium' }
    },
    {
      id: 'child',
      name: '童年化',
      description: '回到童年',
      params: { direction: 'child', intensity: 'strong' }
    }
  ],
  params: [
    {
      id: 'direction',
      name: '变化方向',
      type: 'select',
      default: 'younger',
      options: [
        { value: 'younger', label: '年轻化' },
        { value: 'older', label: '老年化' },
        { value: 'child', label: '童年化' }
      ]
    },
    {
      id: 'intensity',
      name: '变化程度',
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
