import { ToolConfig } from '../types';

export const makeupConfig: ToolConfig = {
  id: 'makeup',
  presets: [
    {
      id: 'natural',
      name: '自然妆',
      description: '清新淡妆',
      params: { style: 'natural', intensity: 'light' }
    },
    {
      id: 'party',
      name: '派对妆',
      description: '时尚浓妆',
      params: { style: 'party', intensity: 'strong' }
    },
    {
      id: 'bridal',
      name: '新娘妆',
      description: '优雅婚礼妆',
      params: { style: 'bridal', intensity: 'medium' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '妆容风格',
      type: 'select',
      default: 'natural',
      options: [
        { value: 'natural', label: '自然妆' },
        { value: 'party', label: '派对妆' },
        { value: 'bridal', label: '新娘妆' },
        { value: 'smokey', label: '烟熏妆' }
      ]
    },
    {
      id: 'intensity',
      name: '妆容浓度',
      type: 'select',
      default: 'medium',
      options: [
        { value: 'light', label: '淡妆' },
        { value: 'medium', label: '中度' },
        { value: 'strong', label: '浓妆' }
      ]
    }
  ]
};
