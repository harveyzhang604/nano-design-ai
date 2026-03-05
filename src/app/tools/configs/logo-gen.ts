import { ToolConfig } from '../types';

export const logoGenConfig: ToolConfig = {
  id: 'logo-gen',
  presets: [
    {
      id: 'minimal',
      name: '极简风格',
      description: '简约现代Logo',
      params: { style: 'minimal', complexity: 'simple' }
    },
    {
      id: 'creative',
      name: '创意风格',
      description: '独特创意Logo',
      params: { style: 'creative', complexity: 'medium' }
    },
    {
      id: 'professional',
      name: '专业风格',
      description: '商务专业Logo',
      params: { style: 'professional', complexity: 'medium' }
    }
  ],
  params: [
    {
      id: 'style',
      name: 'Logo风格',
      type: 'select',
      default: 'minimal',
      options: [
        { value: 'minimal', label: '极简' },
        { value: 'creative', label: '创意' },
        { value: 'professional', label: '专业' },
        { value: 'vintage', label: '复古' }
      ]
    },
    {
      id: 'complexity',
      name: '复杂度',
      type: 'select',
      default: 'simple',
      options: [
        { value: 'simple', label: '简单' },
        { value: 'medium', label: '中等' },
        { value: 'complex', label: '复杂' }
      ]
    }
  ]
};
