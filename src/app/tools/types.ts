// 类型定义

export interface ToolPreset {
  id: string;
  name: string;
  description: string;
  params: Record<string, any>;
  recommended?: boolean; // 是否推荐（显示"推荐"标签）
  popular?: boolean; // 是否热门（显示"热门"标签）
}

export interface ToolParam {
  id: string;
  name: string;
  type: 'slider' | 'select' | 'toggle' | 'text' | 'textarea';
  min?: number;
  max?: number;
  step?: number;
  default: any;
  options?: { value: any; label: string }[];
  tooltip?: string; // 参数说明tooltip
  description?: string; // 详细说明
  placeholder?: string; // 文本输入框占位符
}

export interface ToolConfig {
  id: string;
  presets: ToolPreset[];
  params: ToolParam[];
  tips?: string[]; // 使用技巧
  examples?: string[]; // 使用示例
}

export interface Tool {
  id: string;
  name: string;
  icon: any;
  color: string;
  desc: string;
  category: 'P0' | 'P1' | 'P2';
}
