import { ToolConfig } from '../types';

export const beautyEnhanceConfig: ToolConfig = {
  id: 'beauty-enhance',
  presets: [
    { id: 'natural', name: '自然美颜', description: '轻度自然效果', params: { smoothness: 30, brightness: 20, eyeEnhance: 15 } },
    { id: 'moderate', name: '标准美颜', description: '适中美颜效果', params: { smoothness: 50, brightness: 30, eyeEnhance: 25 } },
    { id: 'strong', name: '强力美颜', description: '明显美颜效果', params: { smoothness: 70, brightness: 40, eyeEnhance: 35 } },
    { id: 'professional', name: '专业级', description: '影楼级美颜', params: { smoothness: 60, brightness: 35, eyeEnhance: 30 } }
  ],
  params: [
    { id: 'smoothness', name: '磨皮程度', type: 'slider', default: 50, min: 0, max: 100 },
    { id: 'brightness', name: '美白程度', type: 'slider', default: 30, min: 0, max: 100 },
    { id: 'eyeEnhance', name: '眼部增强', type: 'slider', default: 25, min: 0, max: 100 },
    { id: 'faceSlim', name: '瘦脸', type: 'slider', default: 0, min: 0, max: 50 },
    { id: 'keepTexture', name: '保留质感', type: 'toggle', default: true }
  ]
};
