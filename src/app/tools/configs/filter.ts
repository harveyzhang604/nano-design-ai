import { ToolConfig } from '../types';

export const filterConfig: ToolConfig = {
  id: 'filter',
  presets: [
    { id: 'neon-aura', name: '霓虹光晕', description: '2026爆款霓虹光晕效果', params: { style: 'neon-aura', intensity: 85 }, popular: true },
    { id: 'brainrot-vhs', name: 'VHS故障', description: 'TikTok #brainrot 混沌风', params: { style: 'brainrot-vhs', intensity: 80 }, popular: true },
    { id: 'clay-pastel', name: '粘土滤镜', description: '马卡龙粘土柔和效果', params: { style: 'clay-pastel', intensity: 80 }, popular: true },
    { id: 'lo-fi-film', name: '胶片Lo-Fi', description: '35mm过期胶卷氛围', params: { style: 'lo-fi-film', intensity: 75 }, recommended: true },
    { id: 'moody-seoul', name: '首尔夜景', description: 'K-Drama都市电影感', params: { style: 'moody-seoul', intensity: 75 }, recommended: true },
    { id: 'cinematic-bw', name: '电影黑白', description: '诺兰级别黑白胶片感', params: { style: 'cinematic-bw', intensity: 80 } },
    { id: 'warm', name: '暖色调', description: '温暖金橙氛围', params: { style: 'warm', intensity: 70 } },
    { id: 'cool', name: '冷色调', description: '清冷蓝青氛围', params: { style: 'cool', intensity: 70 } },
    { id: 'vintage', name: '复古滤镜', description: '70-80s怀旧胶片', params: { style: 'vintage', intensity: 75 } },
    { id: 'cinematic', name: '电影色调', description: '青橙色调电影级', params: { style: 'cinematic', intensity: 75 } },
    { id: 'golden-hour', name: '黄金时刻', description: '黄金时段日落光晕', params: { style: 'golden-hour', intensity: 75 } },
    { id: 'instagram-bw', name: 'ins黑白', description: '现代高反差黑白', params: { style: 'instagram-bw', intensity: 80 } },
    { id: 'bw', name: '经典黑白', description: '经典黑白效果', params: { style: 'bw', intensity: 80 } }
  ],
  params: [
    { id: 'style', name: '滤镜类型', type: 'select', default: 'neon-aura', options: [
      { value: 'neon-aura', label: '🌟 霓虹光晕 (热门)' },
      { value: 'brainrot-vhs', label: '📼 VHS故障 (热门)' },
      { value: 'clay-pastel', label: '🎨 粘土滤镜 (热门)' },
      { value: 'lo-fi-film', label: '🎞️ 胶片Lo-Fi' },
      { value: 'moody-seoul', label: '🌃 首尔夜景' },
      { value: 'cinematic-bw', label: '🎬 电影黑白' },
      { value: 'cinematic-iphone', label: '📱 iPhone电影' },
      { value: 'warm', label: '☀️ 暖色调' },
      { value: 'cool', label: '❄️ 冷色调' },
      { value: 'vintage', label: '🕰️ 复古滤镜' },
      { value: 'cinematic', label: '🎥 电影色调' },
      { value: 'sunset', label: '🌅 日落' },
      { value: 'moody', label: '🌒 暗调' },
      { value: 'golden-hour', label: '🌇 黄金时刻' },
      { value: 'vivid', label: '💥 鲜艳' },
      { value: 'instagram-bw', label: '⬛ ins黑白' },
      { value: 'cinematic-bw', label: '🎞️ 电影黑白' },
      { value: 'bw', label: '⚫ 经典黑白' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100, tooltip: '数值越高效果越强烈' }
  ],
  tips: [
    '霓虹光晕和VHS故障是2026年TikTok最热门效果，非常适合人像和自拍',
    '胶片Lo-Fi适合营造温暖复古的生活感，Ins爆款风格',
    '首尔夜景适合都市风格照片，有强烈K-Drama电影质感',
    '粘土滤镜让照片变得独特可爱，Pinterest高传播效果'
  ]
};
