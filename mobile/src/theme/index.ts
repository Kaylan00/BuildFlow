/**
 * Central design tokens. All screens/components should read from here —
 * never hardcode colors/spacing locally.
 */
export const theme = {
  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceAlt: '#334155',
    border: '#334155',
    primary: '#F59E0B',
    primaryDark: '#D97706',
    onPrimary: '#0F172A',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    textDim: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    pill: 999,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    display: 30,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export type Theme = typeof theme;
