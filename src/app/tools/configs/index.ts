import { ToolConfig } from '../types';
import { enhanceConfig } from './enhance';
import { removeBgConfig } from './remove-bg';
import { restoreConfig } from './restore';
import { colorizeConfig } from './colorize';
import { portraitConfig } from './portrait';

export const toolConfigs: Record<string, ToolConfig> = {
  'enhance': enhanceConfig,
  'remove-bg': removeBgConfig,
  'restore': restoreConfig,
  'colorize': colorizeConfig,
  'portrait': portraitConfig,
};

export * from './enhance';
export * from './remove-bg';
export * from './restore';
export * from './colorize';
export * from './portrait';
