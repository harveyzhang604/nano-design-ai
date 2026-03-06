import { ToolConfig } from '../types';

export const removeBgConfig: ToolConfig = {
  id: 'remove-bg',
  presets: [
    {
      id: 'portrait',
      name: '人像证件照',
      description: '精准抠图，透明背景，适合证件照、简历照',
      params: { 
        subjectType: 'person',
        edgeQuality: 'high',
        bgType: 'transparent',
        shadow: false,
        feather: 1
      }
    },
    {
      id: 'product',
      name: '电商产品图',
      description: '纯白背景+自然阴影，符合淘宝、京东要求',
      params: { 
        subjectType: 'product',
        edgeQuality: 'high',
        bgType: 'white',
        shadow: true,
        feather: 2
      }
    },
    {
      id: 'social',
      name: '社交媒体',
      description: '模糊背景突出主体，适合Instagram、小红书',
      params: { 
        subjectType: 'person',
        edgeQuality: 'medium',
        bgType: 'blur',
        shadow: false,
        feather: 3
      }
    },
    {
      id: 'creative',
      name: '创意设计',
      description: '透明背景，精准边缘，适合海报、设计素材',
      params: { 
        subjectType: 'auto',
        edgeQuality: 'ultra',
        bgType: 'transparent',
        shadow: false,
        feather: 0
      }
    },
    {
      id: 'quick',
      name: '快速处理',
      description: '批量处理，速度优先，标准质量',
      params: { 
        subjectType: 'auto',
        edgeQuality: 'medium',
        bgType: 'transparent',
        shadow: false,
        feather: 2
      }
    }
  ],
  params: [
    {
      id: 'subjectType',
      name: '主体类型',
      type: 'select',
      default: 'person',
      options: [
        { value: 'person', label: '人像' },
        { value: 'product', label: '产品' },
        { value: 'car', label: '汽车' },
        { value: 'animal', label: '动物' },
        { value: 'auto', label: '自动识别' }
      ]
    },
    {
      id: 'edgeQuality',
      name: '边缘质量',
      type: 'select',
      default: 'high',
      options: [
        { value: 'ultra', label: '极致（慢）' },
        { value: 'high', label: '高质量' },
        { value: 'medium', label: '标准' },
        { value: 'fast', label: '快速' }
      ]
    },
    {
      id: 'bgType',
      name: '背景类型',
      type: 'select',
      default: 'transparent',
      options: [
        { value: 'transparent', label: '透明背景' },
        { value: 'white', label: '纯白背景' },
        { value: 'blur', label: '模糊背景' },
        { value: 'gradient', label: '渐变背景' }
      ]
    },
    {
      id: 'shadow',
      name: '添加阴影',
      type: 'toggle',
      default: false
    },
    {
      id: 'feather',
      name: '边缘羽化',
      type: 'slider',
      default: 2,
      min: 0,
      max: 10
    }
  ]
};
