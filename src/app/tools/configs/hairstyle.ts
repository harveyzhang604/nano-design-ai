import { ToolConfig } from '../types';

export const hairstyleConfig: ToolConfig = {
  id: 'hairstyle',
  presets: [
    {
      id: 'short',
      name: '短发',
      description: '清爽短发造型',
      params: { style: 'short', color: 'natural' }
    },
    {
      id: 'long',
      name: '长发',
      description: '飘逸长发',
      params: { style: 'long', color: 'natural' }
    },
    {
      id: 'curly',
      name: '卷发',
      description: '浪漫卷发',
      params: { style: 'curly', color: 'natural' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '发型样式',
      type: 'select',
      default: 'short',
      options: [
        { value: 'short', label: '短发' },
        { value: 'long', label: '长发' },
        { value: 'curly', label: '卷发' },
        { value: 'bob', label: '波波头' }
      ]
    },
    {
      id: 'color',
      name: '发色',
      type: 'select',
      default: 'natural',
      options: [
        { value: 'natural', label: '自然色' },
        { value: 'blonde', label: '金色' },
        { value: 'brown', label: '棕色' },
        { value: 'red', label: '红色' }
      ]
    }
  ]
};
