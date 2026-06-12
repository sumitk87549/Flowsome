// constants/theme-images.ts
// Static image map for theme hero images.
// require() calls must be static — no dynamic paths.
import { ImageSourcePropType } from 'react-native';
import { ThemeId } from './themes';

export const THEME_IMAGES: Record<ThemeId, ImageSourcePropType> = {
  rajasthan: require('../assets/images/rajasthan/hero.jpg'),
  himalaya:  require('../assets/images/himalaya/hero.jpg'),
  kerala:    require('../assets/images/kerala/hero.jpg'),
  assam:     require('../assets/images/assam/hero.jpg'),
  andaman:   require('../assets/images/andaman/hero.jpg'),
};
