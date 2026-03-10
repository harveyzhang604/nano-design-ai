import { ToolConfig } from '../types';

export const vintageFilmConfig: ToolConfig = {
  id: 'vintage-film',
  presets: [
    { 
      id: 'kodachrome', 
      name: 'Kodachrome 64 📷', 
      description: '经典柯达胶片，温暖饱和', 
      params: { filmType: 'kodachrome', intensity: 80, grain: 60 } 
    },
    { 
      id: 'polaroid', 
      name: 'Polaroid SX-70 📸', 
      description: '宝丽来即时成像，复古色调', 
      params: { filmType: 'polaroid', intensity: 75, grain: 50 } 
    },
    { 
      id: 'fuji-velvia', 
      name: 'Fuji Velvia 50 🎞️', 
      description: '富士反转片，色彩浓郁', 
      params: { filmType: 'fuji-velvia', intensity: 85, grain: 40 } 
    },
    { 
      id: 'tri-x', 
      name: 'Kodak Tri-X 400 ⚫', 
      description: '经典黑白胶片，颗粒感强', 
      params: { filmType: 'tri-x', intensity: 80, grain: 70 } 
    },
    { 
      id: 'cinestill', 
      name: 'CineStill 800T 🌃', 
      description: '电影胶片，霓虹光晕', 
      params: { filmType: 'cinestill', intensity: 75, grain: 55 } 
    }
  ],
  params: [
    { 
      id: 'filmType', 
      name: '胶片类型', 
      type: 'select', 
      default: 'kodachrome', 
      options: [
        { value: 'kodachrome', label: 'Kodachrome 64 📷' },
        { value: 'polaroid', label: 'Polaroid SX-70 📸' },
        { value: 'fuji-velvia', label: 'Fuji Velvia 50 🎞️' },
        { value: 'tri-x', label: 'Kodak Tri-X 400 ⚫' },
        { value: 'cinestill', label: 'CineStill 800T 🌃' },
        { value: 'portra', label: 'Kodak Portra 400 🌸' }
      ]
    },
    { 
      id: 'intensity', 
      name: '效果强度', 
      type: 'slider', 
      default: 80, 
      min: 40, 
      max: 100,
      description: '胶片效果的强度'
    },
    {
      id: 'grain',
      name: '颗粒感',
      type: 'slider',
      default: 60,
      min: 0,
      max: 100,
      description: '胶片颗粒的强度'
    },
    {
      id: 'lightLeak',
      name: '漏光效果',
      type: 'select',
      default: 'subtle',
      options: [
        { value: 'none', label: '无' },
        { value: 'subtle', label: '轻微' },
        { value: 'moderate', label: '中等' },
        { value: 'strong', label: '强烈' }
      ]
    }
  ]
};
