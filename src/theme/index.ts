export const colors = {
  primary: '#7F3DFF',
  primaryLight: '#EEE5FF',
  success: '#00A86B',
  successLight: '#E9FBF5',
  danger: '#FD3C4A',
  dangerLight: '#FEE4E5',
  warning: '#FCAC12',
  warningLight: '#FFF3E1',
  dark: '#0D0E0F',
  dark60: '#91919F',
  dark30: '#C6C6C6',
  dark10: '#E3E5E5',
  light: '#FFFFFF',
  background: '#FAFAFA',
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 39,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 29,
  },
  body1: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 19,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 17,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 15,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  round: 999,
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
}; 