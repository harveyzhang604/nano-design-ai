import { ToolConfig } from '../types';

export const styleTransferConfig: ToolConfig = {
  id: 'style-transfer',
  presets: [
    {
      id: 'vangogh',
      name: '梵高风格',
      description: '星空般的笔触',
      params: { style: 'vangogh', intensity: 'medium' }
    },
    {
      id: 'picasso',
      name: '毕加索风格',
      description: '立体主义',
      params: { style: 'picasso', intensity: 'medium' }
    },
    {
      id: 'monet',
      name: '莫奈风格',
      description: '印象派光影',
      params: { style: 'monet', intensity: 'medium' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '艺术风格',
      type: 'select',
      default: 'vangogh',
      options: [
        { value: 'vangogh', label: '梵高' },
        { value: 'picasso', label: '毕加索' },
        { value: 'monet', label: '莫奈' },
        { value: 'ukiyoe', label: '浮世绘' }
      ]
    },
    {
      id: 'intensity',
      name: '风格强度',
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
