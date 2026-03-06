import { ToolConfig } from '../types';

export const restoreConfig: ToolConfig = {
  id: 'restore',
  presets: [
    {
      id: 'conservative',
      name: '保守修复',
      description: '只修复明显损坏，最大程度保留原貌',
      params: { 
        mode: 'conservative',
        strength: 50,
        faceProtect: true,
        colorRestore: false,
        denoise: 30
      }
    },
    {
      id: 'standard',
      name: '标准修复',
      description: '平衡修复效果和原貌保留，推荐使用',
      params: { 
        mode: 'standard',
        strength: 70,
        faceProtect: true,
        colorRestore: true,
        denoise: 50
      }
    },
    {
      id: 'aggressive',
      name: '重度修复',
      description: '彻底修复所有瑕疵，适合严重损坏照片',
      params: { 
        mode: 'aggressive',
        strength: 90,
        faceProtect: true,
        colorRestore: true,
        denoise: 70
      }
    },
    {
      id: 'portrait',
      name: '人像专用',
      description: '优化人脸细节，保留表情特征',
      params: { 
        mode: 'portrait',
        strength: 70,
        faceProtect: true,
        colorRestore: true,
        denoise: 60
      }
    },
    {
      id: 'colorize',
      name: '修复+上色',
      description: '修复损坏并为黑白照片上色',
      params: { 
        mode: 'standard',
        strength: 70,
        faceProtect: true,
        colorRestore: true,
        denoise: 50
      }
    }
  ],
  params: [
    {
      id: 'mode',
      name: '修复模式',
      type: 'select',
      default: 'standard',
      options: [
        { value: 'conservative', label: '保守修复' },
        { value: 'standard', label: '标准修复' },
        { value: 'aggressive', label: '重度修复' },
        { value: 'portrait', label: '人像专用' }
      ]
    },
    {
      id: 'strength',
      name: '修复强度',
      type: 'slider',
      default: 70,
      min: 0,
      max: 100
    },
    {
      id: 'faceProtect',
      name: '人脸保护',
      type: 'toggle',
      default: true
    },
    {
      id: 'colorRestore',
      name: '色彩修复',
      type: 'toggle',
      default: true
    },
    {
      id: 'denoise',
      name: '降噪强度',
      type: 'slider',
      default: 50,
      min: 0,
      max: 100
    }
  ]
};
