// 工具参数配置

export interface ToolPreset {
  id: string;
  name: string;
  description: string;
  params: Record<string, any>;
}

export interface ToolParam {
  id: string;
  name: string;
  type: 'slider' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  default: any;
  options?: { value: any; label: string }[];
}

export interface ToolConfig {
  id: string;
  presets: ToolPreset[];
  params: ToolParam[];
}

export const toolConfigs: Record<string, ToolConfig> = {
  // 图像超分
  'enhance': {
    presets: [
      {
        id: 'natural',
        name: '自然增强',
        description: '轻微提升画质，几乎看不出处理痕迹',
        params: { beautyLevel: 'subtle' }
      },
      {
        id: 'light',
        name: '轻度美化',
        description: '适度美化，保持自然',
        params: { beautyLevel: 'light' }
      },
      {
        id: 'professional',
        name: '专业美颜',
        description: '明显美化效果，适合社交媒体',
        params: { beautyLevel: 'professional' }
      }
    ],
    params: [
      {
        id: 'beautyLevel',
        name: '美化程度',
        type: 'select',
        default: 'subtle',
        options: [
          { value: 'subtle', label: '自然' },
          { value: 'light', label: '轻度' },
          { value: 'professional', label: '专业' }
        ]
      }
    ]
  },

  // 背景移除
  'remove-bg': {
    presets: [
      {
        id: 'precise',
        name: '精准边缘',
        description: '锐利边缘，适合产品图',
        params: { edgeMode: 'precise' }
      },
      {
        id: 'soft',
        name: '柔和边缘',
        description: '自然羽化，适合人像',
        params: { edgeMode: 'soft' }
      },
      {
        id: 'detail',
        name: '保留细节',
        description: '保留头发等细节',
        params: { edgeMode: 'detail' }
      }
    ],
    params: [
      {
        id: 'edgeMode',
        name: '边缘处理',
        type: 'select',
        default: 'soft',
        options: [
          { value: 'precise', label: '精准' },
          { value: 'soft', label: '柔和' },
          { value: 'detail', label: '细节' }
        ]
      }
    ]
  },

  // 老照片修复
  'restore': {
    presets: [
      {
        id: 'conservative',
        name: '保守修复',
        description: '只修复明显损坏，保留原貌',
        params: { restoreLevel: 'conservative' }
      },
      {
        id: 'standard',
        name: '标准修复',
        description: '平衡修复效果和原貌',
        params: { restoreLevel: 'standard' }
      },
      {
        id: 'deep',
        name: '深度修复',
        description: '最大程度修复损坏',
        params: { restoreLevel: 'deep' }
      }
    ],
    params: [
      {
        id: 'restoreLevel',
        name: '修复强度',
        type: 'select',
        default: 'standard',
        options: [
          { value: 'conservative', label: '保守' },
          { value: 'standard', label: '标准' },
          { value: 'deep', label: '深度' }
        ]
      }
    ]
  },

  // 照片上色
  'colorize': {
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
  },

  // 人像增强
  'portrait': {
    presets: [
      {
        id: 'natural',
        name: '自然',
        description: '轻微美化，保持真实',
        params: { beautyLevel: 'natural' }
      },
      {
        id: 'fresh',
        name: '清新',
        description: '适度美化，清新自然',
        params: { beautyLevel: 'fresh' }
      },
      {
        id: 'professional',
        name: '专业',
        description: '明显美化，专业效果',
        params: { beautyLevel: 'professional' }
      }
    ],
    params: [
      {
        id: 'beautyLevel',
        name: '美颜程度',
        type: 'select',
        default: 'fresh',
        options: [
          { value: 'natural', label: '自然' },
          { value: 'fresh', label: '清新' },
          { value: 'professional', label: '专业' }
        ]
      }
    ]
  }
};
