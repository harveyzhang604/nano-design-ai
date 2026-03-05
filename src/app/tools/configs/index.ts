import { ToolConfig } from '../types';
import { enhanceConfig } from './enhance';
import { removeBgConfig } from './remove-bg';
import { restoreConfig } from './restore';
import { colorizeConfig } from './colorize';
import { portraitConfig } from './portrait';
import { upscaleConfig } from './upscale';
import { sketchToImageConfig } from './sketch-to-image';
import { styleTransferConfig } from './style-transfer';
import { cartoonConfig } from './cartoon';
import { ageTransformConfig } from './age-transform';
import { genderSwapConfig } from './gender-swap';
import { hairstyleConfig } from './hairstyle';
import { makeupConfig } from './makeup';
import { petCartoonConfig } from './pet-cartoon';
import { tattooConfig } from './tattoo';
import { interiorConfig } from './interior';
import { productPhotoConfig } from './product-photo';
import { photoshootConfig } from './photoshoot';
import { emojiGenConfig } from './emoji-gen';
import { memeGenConfig } from './meme-gen';
import { logoGenConfig } from './logo-gen';
import { mapGenConfig } from './map-gen';
import { fashionConfig } from './fashion';
import { composeConfig } from './compose';

export const toolConfigs: Record<string, ToolConfig> = {
  'enhance': enhanceConfig,
  'remove-bg': removeBgConfig,
  'restore': restoreConfig,
  'colorize': colorizeConfig,
  'portrait': portraitConfig,
  'upscale': upscaleConfig,
  'sketch-to-image': sketchToImageConfig,
  'style-transfer': styleTransferConfig,
  'cartoon': cartoonConfig,
  'age-transform': ageTransformConfig,
  'gender-swap': genderSwapConfig,
  'hairstyle': hairstyleConfig,
  'makeup': makeupConfig,
  'pet-cartoon': petCartoonConfig,
  'tattoo': tattooConfig,
  'interior': interiorConfig,
  'product-photo': productPhotoConfig,
  'photoshoot': photoshootConfig,
  'emoji-gen': emojiGenConfig,
  'meme-gen': memeGenConfig,
  'logo-gen': logoGenConfig,
  'map-gen': mapGenConfig,
  'fashion': fashionConfig,
  'compose': composeConfig,
};

export * from './enhance';
export * from './remove-bg';
export * from './restore';
export * from './colorize';
export * from './portrait';
export * from './upscale';
export * from './sketch-to-image';
export * from './style-transfer';
export * from './cartoon';
export * from './age-transform';
export * from './gender-swap';
export * from './hairstyle';
export * from './makeup';
export * from './pet-cartoon';
export * from './tattoo';
export * from './interior';
export * from './product-photo';
export * from './photoshoot';
export * from './emoji-gen';
export * from './meme-gen';
export * from './logo-gen';
export * from './map-gen';
export * from './fashion';
export * from './compose';
