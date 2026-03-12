import { ToolConfig } from '../types';

export const faceSwapConfig: ToolConfig = {
  id: 'face-swap',
  presets: [
    { 
      id: 'natural-preserve', 
      name: '自然换脸（保留表情）', 
      description: '保持原表情和情绪', 
      params: { targetImageUrl: '', preserveExpression: true, intensity: 85 } 
    },
    { 
      id: 'natural-adapt', 
      name: '自然换脸（适应场景）', 
      description: '适应目标场景表情', 
      params: { targetImageUrl: '', preserveExpression: false, intensity: 85 } 
    },
    { 
      id: 'celebrity-preserve', 
      name: '明星脸（保留表情）', 
      description: '明星脸但保持你的表情', 
      params: { targetImageUrl: '', preserveExpression: true, intensity: 90 } 
    }
  ],
  params: [
    { 
      id: 'targetImageUrl', 
      name: '目标人脸图片URL', 
      type: 'text', 
      default: '', 
      placeholder: '粘贴目标人脸图片URL...' 
    },
    { 
      id: 'preserveExpression', 
      name: '保留原表情', 
      type: 'toggle', 
      default: true,
      description: '开启=保持源图表情，关闭=适应目标场景'
    },
    { 
      id: 'intensity', 
      name: '融合强度', 
      type: 'slider', 
      default: 85, 
      min: 0, 
      max: 100,
      description: '换脸的彻底程度'
    }
  ]
};
