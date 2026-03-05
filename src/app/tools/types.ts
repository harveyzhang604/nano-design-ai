// 类型定义

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

export interface Tool {
  id: string;
  name: string;
  icon: any;
  color: string;
  desc: string;
  category: 'P0' | 'P1' | 'P2';
}
