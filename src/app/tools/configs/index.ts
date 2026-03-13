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
import { italianGestureConfig } from './italian-gesture';
import { chibiConfig } from './chibi';
import { petHumanizeConfig } from './pet-humanize';
import { ageEvolutionConfig } from './age-evolution';
import { vintageFilmConfig } from './vintage-film';
import { ghibliConfig } from './ghibli';
import { authenticityConfig } from './authenticity';
import { characterLibraryConfig } from './character-library';
import { styleMixConfig } from './style-mix';
import { pseudoAnimationConfig } from './pseudo-animation';
import { petFamilyConfig } from './pet-family';
import { partialRedesignConfig } from './partial-redesign';
import { babyPredictionConfig } from './baby-prediction';
import { filterConfig } from './filter';
import { genderSwapConfig } from './gender-swap';
import { hairstyleConfig } from './hairstyle';
import { makeupConfig } from './makeup';
import { tattooConfig } from './tattoo';
import { petCartoonConfig } from './pet-cartoon';
import { ageTransformConfig } from './age-transform';
import { claymationConfig } from './claymation';
import { actionFigureConfig } from './action-figure';
import { pixelArtConfig } from './pixel-art';
import { blytheConfig } from './blythe-doll';

export const toolConfigs: Record<string, ToolConfig> = {
  'enhance': enhanceConfig,
  'remove-bg': removeBgConfig,
  'restore': restoreConfig,
  'colorize': colorizeConfig,
  'portrait': portraitConfig,
  'upscale': upscaleConfig,
  'sketch-to-image': sketchToPhotoConfig,
  'style-transfer': styleTransferConfig,
  'cartoon': cartoonConfig,
  'age-transform': ageConfig,
  'interior-design': interiorConfig,
  'product-photo': productConfig,
  'photoshoot': photoshootConfig,
  'meme': memeConfig,
  'map-gen': mapGenConfig,
  'fashion-model': fashionConfig,
  'compose': composeConfig,
  'erase': eraseConfig,
  'change-bg': changeBgConfig,
  'avatar': avatarConfig,
  'face-swap': faceSwapConfig,
  'try-on': tryOnConfig,
  'greeting-card': greetingConfig,
  'cosplay': cosplayConfig,
  'real-estate': realEstateConfig,
  'caricature': caricatureConfig,
  'yearbook': yearbookConfig,
  'outfit-change': outfitChangeConfig,
  'object-remove': objectRemoveConfig,
  'beauty-enhance': beautyEnhanceConfig,
  'style-transfer-pro': styleTransferProConfig,
  'italian-gesture': italianGestureConfig,
  'chibi': chibiConfig,
  'pet-humanize': petHumanizeConfig,
  'age-evolution': ageEvolutionConfig,
  'vintage-film': vintageFilmConfig,
  'ghibli': ghibliConfig,
  'authenticity': authenticityConfig,
  'character-library': characterLibraryConfig,
  'style-mix': styleMixConfig,
  'pseudo-animation': pseudoAnimationConfig,
  'pet-family': petFamilyConfig,
  'partial-redesign': partialRedesignConfig,
  'baby-prediction': babyPredictionConfig,
  'filter': filterConfig,
  'gender-swap': genderSwapConfig,
  'hairstyle': hairstyleConfig,
  'makeup': makeupConfig,
  'tattoo': tattooConfig,
  'pet-cartoon': petCartoonConfig,
  'claymation': claymationConfig,
  'action-figure': actionFigureConfig,
  'pixel-art': pixelArtConfig,
  'blythe-doll': blytheConfig,
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
export * from './age-transform';
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
export * from './italian-gesture';
export * from './chibi';
export * from './pet-humanize';
export * from './age-evolution';
export * from './vintage-film';
export * from './ghibli';
export * from './authenticity';
export * from './character-library';
export * from './style-mix';
export * from './pseudo-animation';
export * from './pet-family';
export * from './partial-redesign';
export * from './baby-prediction';
export * from './filter';
export * from './gender-swap';
export * from './hairstyle';
export * from './makeup';
export * from './tattoo';
export * from './pet-cartoon';
export * from './claymation';
export * from './action-figure';
export * from './pixel-art';
export * from './blythe-doll';
