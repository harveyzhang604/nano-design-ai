"use client";
import { useState, useEffect } from 'react';
import { toolConfigs } from '../configs';
import { ToolConfig, ToolPreset } from '../types';

interface ToolParamsProps {
  toolId: string;
  onParamsChange: (params: Record<string, any>) => void;
}

export default function ToolParams({ toolId, onParamsChange }: ToolParamsProps) {
  const config = toolConfigs[toolId];
  
  if (!config) {
    return null;
  }

  const [selectedPreset, setSelectedPreset] = useState<string>(config.presets[0]?.id || '');
  const [customParams, setCustomParams] = useState<Record<string, any>>({});

  // 初始化时传递默认参数
  useEffect(() => {
    if (config.presets[0]?.params) {
      setCustomParams(config.presets[0].params);
      onParamsChange(config.presets[0].params);
    }
  }, [toolId]);

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = config.presets.find(p => p.id === presetId);
    if (preset) {
      setCustomParams(preset.params);
      onParamsChange(preset.params);
    }
  };

  const handleParamChange = (paramId: string, value: any) => {
    const newParams = { ...customParams, [paramId]: value };
    setCustomParams(newParams);
    onParamsChange(newParams);
  };

  return (
    <div className="space-y-4 p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
      {/* 预设选择 */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          选择预设
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {config.presets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name} - {preset.description}
            </option>
          ))}
        </select>
      </div>

      {/* 参数调节 */}
      {config.params.map(param => (
        <div key={param.id}>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            {param.name}
          </label>
          
          {param.type === 'select' && (
            <select
              value={customParams[param.id] || param.default}
              onChange={(e) => handleParamChange(param.id, e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {param.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {param.type === 'slider' && (
            <div className="space-y-2">
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={customParams[param.id] || param.default}
                onChange={(e) => handleParamChange(param.id, parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-neutral-400 text-right">
                {customParams[param.id] || param.default}
              </div>
            </div>
          )}

          {param.type === 'text' && (
            <input
              type="text"
              value={customParams[param.id] || param.default || ''}
              onChange={(e) => handleParamChange(param.id, e.target.value)}
              placeholder={param.placeholder || ''}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          )}

          {param.type === 'textarea' && (
            <textarea
              value={customParams[param.id] || param.default || ''}
              onChange={(e) => handleParamChange(param.id, e.target.value)}
              placeholder={param.placeholder || ''}
              rows={4}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
            />
          )}

          {param.type === 'toggle' && (
            <button
              onClick={() => handleParamChange(param.id, !customParams[param.id])}
              className={`px-4 py-2 rounded-lg transition-colors ${
                customParams[param.id]
                  ? 'bg-amber-500 text-white'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {customParams[param.id] ? '开启' : '关闭'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
