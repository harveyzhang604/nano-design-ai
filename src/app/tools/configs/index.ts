import { ToolConfig } from '../types';
import { enhanceConfig } from './enhance';
import { removeBgConfig } from './remove-bg';
import { restoreConfig } from './restore';
import { colorizeConfig } from './colorize';
import { portraitConfig } from './portrait';
import { upscaleConfig } from './upscale';
import { sketchToPhotoConfig } from './sketch-to-photo';
import { styleTransferConfig } from './style-transfer';
import { cartoonConfig } from './cartoon';
import { ageConfig } from './age';
import { faceAgeConfig } from './face-age';
import { interiorConfig } from './interior';
import { productConfig } from './product';
import { photoshootConfig } from './photoshoot';
import { memeConfig } from './meme';
import { mapGenConfig } from './map-gen';
import { fashionConfig } from './fashion';
import { composeConfig } from './compose';
import { eraseConfig } from './erase';
import { changeBgConfig } from './change-bg';
import { avatarConfig } from './avatar';
import { faceSwapConfig } from './face-swap';
import { tryOnConfig } from './try-on';
import { greetingConfig } from './greeting';
import { cosplayConfig } from './cosplay';
import { realEstateConfig } from './real-estate';
import { caricatureConfig } from './caricature';
import { yearbookConfig } from './yearbook';
import { outfitChangeConfig } from './outfit-change';
import { objectRemoveConfig } from './object-remove';
import { beautyEnhanceConfig } from './beauty-enhance';
import { styleTransferProConfig } from './style-transfer-pro';

export const toolConfigs: Record<string, ToolConfig> = {
  'enhance': enhanceConfig,
  'remove-bg': removeBgConfig,
  'restore': restoreConfig,
  'colorize': colorizeConfig,
  'portrait': portraitConfig,
  'upscale': upscaleConfig,
  'sketch-to-photo': sketchToPhotoConfig,
  'style-transfer': styleTransferConfig,
  'cartoon': cartoonConfig,
  'age': ageConfig,
  'face-age': faceAgeConfig,
  'interior': interiorConfig,
  'product': productConfig,
  'photoshoot': photoshootConfig,
  'meme': memeConfig,
  'map-gen': mapGenConfig,
  'fashion': fashionConfig,
  'compose': composeConfig,
  'erase': eraseConfig,
  'change-bg': changeBgConfig,
  'avatar': avatarConfig,
  'face-swap': faceSwapConfig,
  'try-on': tryOnConfig,
  'greeting': greetingConfig,
  'cosplay': cosplayConfig,
  'real-estate': realEstateConfig,
  'caricature': caricatureConfig,
  'yearbook': yearbookConfig,
  'outfit-change': outfitChangeConfig,
  'object-remove': objectRemoveConfig,
  'beauty-enhance': beautyEnhanceConfig,
  'style-transfer-pro': styleTransferProConfig,
};

export * from './enhance';
export * from './remove-bg';
export * from './restore';
export * from './colorize';
export * from './portrait';
export * from './upscale';
export * from './sketch-to-photo';
export * from './style-transfer';
export * from './cartoon';
export * from './age';
export * from './face-age';
export * from './interior';
export * from './product';
export * from './photoshoot';
export * from './meme';
export * from './map-gen';
export * from './fashion';
export * from './compose';
export * from './erase';
export * from './change-bg';
export * from './avatar';
export * from './face-swap';
export * from './try-on';
export * from './greeting';
export * from './cosplay';
export * from './real-estate';
export * from './caricature';
export * from './yearbook';
export * from './outfit-change';
export * from './object-remove';
export * from './beauty-enhance';
export * from './style-transfer-pro';
