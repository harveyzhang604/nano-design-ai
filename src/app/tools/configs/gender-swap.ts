import { ToolConfig } from '../types';

export const genderSwapConfig: ToolConfig = {
  id: 'gender-swap',
  presets: [
    {
      id: 'natural',
      name: '自然转换',
      description: '保持原有特征',
      params: { style: 'natural' }
    },
    {
      id: 'enhanced',
      name: '增强转换',
      description: '明显性别特征',
      params: { style: 'enhanced' }
    },
    {
      id: 'dramatic',
      name: '戏剧转换',
      description: '夸张效果',
      params: { style: 'dramatic' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '转换风格',
      type: 'select',
      default: 'natural',
      options: [
        { value: 'natural', label: '自然' },
        { value: 'enhanced', label: '增强' },
        { value: 'dramatic', label: '戏剧' }
      ]
    }
  ]
};
