import { ToolConfig } from '../types';

export const restoreConfig: ToolConfig = {
  id: 'restore',
  presets: [
    {
      id: 'conservative',
      name: '保守修复',
      description: '只修复明显损坏，保留原貌',
      params: { restoreLevel: 'conservative' }
    },
    {
      id: 'standard',
      name: '标准修复',
      description: '平衡修复效果和原貌',
      params: { restoreLevel: 'standard' }
    },
    {
      id: 'deep',
      name: '深度修复',
      description: '最大程度修复损坏',
      params: { restoreLevel: 'deep' }
    }
  ],
  params: [
    {
      id: 'restoreLevel',
      name: '修复强度',
      type: 'select',
      default: 'standard',
      options: [
        { value: 'conservative', label: '保守' },
        { value: 'standard', label: '标准' },
        { value: 'deep', label: '深度' }
      ]
    }
  ]
};
