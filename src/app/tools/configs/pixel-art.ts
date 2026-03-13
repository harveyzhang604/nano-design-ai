import { ToolConfig } from '../types';

export const pixelArtConfig: ToolConfig = {
  id: 'pixel-art',
  presets: [
    { 
      id: '8bit', 
      name: '8-bit 经典 🎮', 
      description: 'NES/FC 时代像素风格', 
      params: { resolution: '8bit', palette: 'nes', style: 'retro' } 
    },
    { 
      id: '16bit', 
      name: '16-bit 黄金 🕹️', 
      description: 'SNES/MD 时代像素风格', 
      params: { resolution: '16bit', palette: 'snes', style: 'classic' } 
    },
    { 
      id: '32bit', 
      name: '32-bit 精致 💎', 
      description: 'PS1/SS 时代像素风格', 
      params: { resolution: '32bit', palette: 'rich', style: 'detailed' } 
    },
    { 
      id: 'modern', 
      name: '现代像素 ✨', 
      description: '高分辨率现代像素艺术', 
      params: { resolution: 'hd', palette: 'modern', style: 'smooth' } 
    },
    { 
      id: 'gameboy', 
      name: 'Game Boy 🎮', 
      description: '4色绿屏经典', 
      params: { resolution: '8bit', palette: 'gameboy', style: 'monochrome' } 
    }
  ],
  params: [
    { 
      id: 'resolution', 
      name: '像素分辨率', 
      type: 'select', 
      default: '16bit', 
      options: [
        { value: '8bit', label: '8-bit (低分辨率)' },
        { value: '16bit', label: '16-bit (中分辨率)' },
        { value: '32bit', label: '32-bit (高分辨率)' },
        { value: 'hd', label: 'HD (超高分辨率)' }
      ]
    },
    { 
      id: 'palette', 
      name: '调色板', 
      type: 'select', 
      default: 'snes', 
      options: [
        { value: 'nes', label: 'NES (54色)' },
        { value: 'gameboy', label: 'Game Boy (4色绿)' },
        { value: 'snes', label: 'SNES (256色)' },
        { value: 'rich', label: '丰富色彩 (512色)' },
        { value: 'modern', label: '现代全彩' }
      ]
    },
    {
      id: 'style',
      name: '像素风格',
      type: 'select',
      default: 'classic',
      options: [
        { value: 'retro', label: '复古粗糙' },
        { value: 'classic', label: '经典像素' },
        { value: 'detailed', label: '精细像素' },
        { value: 'smooth', label: '平滑现代' },
        { value: 'monochrome', label: '单色复古' }
      ]
    },
    {
      id: 'dithering',
      name: '抖动效果',
      type: 'slider',
      default: 50,
      min: 0,
      max: 100,
      description: '像素抖动混色程度'
    },
    {
      id: 'outline',
      name: '轮廓线',
      type: 'select',
      default: 'medium',
      options: [
        { value: 'none', label: '无轮廓' },
        { value: 'thin', label: '细轮廓' },
        { value: 'medium', label: '中等轮廓' },
        { value: 'thick', label: '粗轮廓' }
      ]
    }
  ]
};
