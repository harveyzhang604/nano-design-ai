import { ToolConfig } from '../types';

export const colorizeConfig: ToolConfig = {
  id: 'colorize',
  presets: [
    {
      id: 'natural',
      name: '自然色调',
      description: '真实自然的颜色',
      params: { colorStyle: 'natural' }
    },
    {
      id: 'vivid',
      name: '鲜艳色调',
      description: '饱和度高，色彩鲜明',
      params: { colorStyle: 'vivid' }
    },
    {
      id: 'vintage',
      name: '复古色调',
      description: '怀旧复古风格',
      params: { colorStyle: 'vintage' }
    }
  ],
  params: [
    {
      id: 'colorStyle',
      name: '色调风格',
      type: 'select',
      default: 'natural',
      options: [
        { value: 'natural', label: '自然' },
        { value: 'vivid', label: '鲜艳' },
        { value: 'vintage', label: '复古' }
      ]
    }
  ]
};
