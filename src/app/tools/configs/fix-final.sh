#!/bin/bash

# 8. map-gen - 添加 description 参数
cat > map-gen.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const mapGenConfig: ToolConfig = {
  id: 'map-gen',
  presets: [
    { id: 'fantasy', name: '奇幻地图', description: '游戏地图', params: { description: '奇幻世界地图', style: 'fantasy', intensity: 85 } },
    { id: 'realistic', name: '真实地图', description: '现实地图', params: { description: '真实地理地图', style: 'realistic', intensity: 80 } },
    { id: 'treasure', name: '寻宝地图', description: '藏宝图', params: { description: '寻宝藏宝图', style: 'treasure', intensity: 90 } }
  ],
  params: [
    { id: 'description', name: '地图描述', type: 'text', default: '奇幻世界地图', placeholder: '描述想要的地图...' },
    { id: 'style', name: '风格', type: 'select', default: 'fantasy', options: [
      { value: 'fantasy', label: '奇幻' },
      { value: 'realistic', label: '真实' },
      { value: 'treasure', label: '寻宝' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 85, min: 0, max: 100 }
  ]
};
EOFILE

# 9. fashion - 添加 outfit 参数
cat > fashion.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const fashionConfig: ToolConfig = {
  id: 'fashion',
  presets: [
    { id: 'casual', name: '休闲装', description: '日常休闲', params: { outfit: '休闲装', style: 'casual', intensity: 80 } },
    { id: 'formal', name: '正装', description: '商务正装', params: { outfit: '商务正装', style: 'formal', intensity: 85 } },
    { id: 'evening', name: '晚礼服', description: '晚宴礼服', params: { outfit: '晚礼服', style: 'evening', intensity: 90 } }
  ],
  params: [
    { id: 'outfit', name: '服装描述', type: 'text', default: '休闲装', placeholder: '描述服装风格...' },
    { id: 'style', name: '风格', type: 'select', default: 'casual', options: [
      { value: 'casual', label: '休闲' },
      { value: 'formal', label: '正装' },
      { value: 'evening', label: '晚礼服' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
EOFILE

# 10. compose - 添加 overlayImageUrl 参数
cat > compose.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const composeConfig: ToolConfig = {
  id: 'compose',
  presets: [
    { id: 'blend', name: '混合模式', description: '图层混合', params: { overlayImageUrl: '', mode: 'blend', intensity: 50 } },
    { id: 'overlay', name: '叠加模式', description: '图层叠加', params: { overlayImageUrl: '', mode: 'overlay', intensity: 70 } },
    { id: 'multiply', name: '正片叠底', description: '正片叠底', params: { overlayImageUrl: '', mode: 'multiply', intensity: 60 } }
  ],
  params: [
    { id: 'overlayImageUrl', name: '叠加图片URL', type: 'text', default: '', placeholder: '粘贴要叠加的图片URL...' },
    { id: 'mode', name: '混合模式', type: 'select', default: 'blend', options: [
      { value: 'blend', label: '混合' },
      { value: 'overlay', label: '叠加' },
      { value: 'multiply', label: '正片叠底' }
    ]},
    { id: 'intensity', name: '不透明度', type: 'slider', default: 50, min: 0, max: 100 }
  ]
};
EOFILE

# 11. yearbook - 添加 year 参数
cat > yearbook.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const yearbookConfig: ToolConfig = {
  id: 'yearbook',
  presets: [
    { id: '1980s', name: '80年代', description: '80年代风格', params: { year: '1980', style: '1980s', intensity: 85 } },
    { id: '1990s', name: '90年代', description: '90年代风格', params: { year: '1990', style: '1990s', intensity: 80 } },
    { id: '2000s', name: '00年代', description: '00年代风格', params: { year: '2000', style: '2000s', intensity: 75 } }
  ],
  params: [
    { id: 'year', name: '年份', type: 'text', default: '1990', placeholder: '输入年份（如1990）...' },
    { id: 'style', name: '风格', type: 'select', default: '1990s', options: [
      { value: '1980s', label: '80年代' },
      { value: '1990s', label: '90年代' },
      { value: '2000s', label: '00年代' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
EOFILE

echo "已修复最后 4 个配置文件"
