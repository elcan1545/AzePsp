export const Colors = {
  azerbaijanBlue: '#0092BC',
  azerbaijanRed: '#EF3340',
  azerbaijanGreen: '#509E2F',
  azerbaijanWhite: '#FFFFFF',

  background: '#000000',
  backgroundDark: '#050505',

  glass: 'rgba(255, 255, 255, 0.08)',
  glassLight: 'rgba(255, 255, 255, 0.15)',
  glassStrong: 'rgba(255, 255, 255, 0.20)',
  glassBorder: 'rgba(255, 255, 255, 0.25)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.40)',

  buttonGlass: 'rgba(255, 255, 255, 0.05)',
  buttonGlassActive: 'rgba(255, 255, 255, 0.20)',

  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.65)',
  textTertiary: 'rgba(255, 255, 255, 0.40)',

  accent: '#0092BC',
  accentGlow: 'rgba(0, 146, 188, 0.45)',

  success: '#509E2F',
  error: '#EF3340',
  warning: '#FFB020',

  overlay: 'rgba(0, 0, 0, 0.55)',
  overlayLight: 'rgba(0, 0, 0, 0.30)',
};

export const Typography = {
  fontFamily: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
  full: 999,
};

export const Shadow = {
  glass: {
    shadowColor: Colors.azerbaijanBlue,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: Colors.azerbaijanBlue,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 12,
  },
};

export default {Colors, Typography, Spacing, BorderRadius, Shadow};
