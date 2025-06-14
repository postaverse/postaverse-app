export const colors = {
  // Background colors
  background: {
    primary: 'transparent',
    secondary: 'rgba(15, 23, 42, 0.95)',
    tertiary: 'rgba(100, 116, 139, 0.4)',
    glass: 'rgba(31, 41, 55, 0.85)',
  },
  
  // Text colors
  text: {
    primary: '#ffffff',       // White main text
    secondary: '#e2e8f0',     // Slate 200 for secondary text
    tertiary: '#94a3b8',      // Slate 400 for muted text
    quaternary: '#64748b',    // Slate 500 for very muted text
  },
  
  // Accent colors - matching website's sky blue theme
  accent: {
    primary: '#38bdf8',       // Sky 400 (main brand color from website)
    secondary: '#0ea5e9',     // Sky 500 (hover state)
    tertiary: '#0284c7',      // Sky 600 (pressed state)
  },
  
  // Status colors
  status: {
    success: '#10b981',       // Emerald 500
    warning: '#f59e0b',       // Amber 500
    danger: '#ef4444',        // Red 500
    info: '#3b82f6',          // Blue 500
  },
  
  // Interactive states
  interactive: {
    hover: '#0ea5e9',         // Sky 500 hover
    pressed: '#0284c7',       // Sky 600 pressed
    disabled: '#374151',      // Gray 700 disabled
  },
  
  // Gradients
  gradients: {
    primary: ['#3b82f6', '#2563eb'],  // Blue gradient
    secondary: ['#38bdf8', '#0ea5e9'], // Sky gradient
  },
};

// Common spacing values
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Common border radius values
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Common font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Common font weights
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Common shadows
export const shadows = {
  small: {
    // React Native shadow props
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    // Web shadow fallback
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.22)',
  },
  medium: {
    // React Native shadow props
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Web shadow fallback
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
  },
  large: {
    // React Native shadow props
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    // Web shadow fallback
    boxShadow: '0 4px 5px rgba(0, 0, 0, 0.3)',
  },
  // Glass-morphism shadow for cards
  glass: {
    // React Native shadow props
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    // Web shadow fallback
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
  },
};

export const typography = {
  heading: {
    letterSpacing: -0.025,
    fontWeight: '700' as any,
    color: colors.text.primary,
  },
  
  // Body text styles
  body: {
    lineHeight: 1.7,
    color: colors.text.secondary,
  },

  link: {
    color: colors.accent.primary,
    textDecorationLine: 'underline' as any,
  },
};

export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export const glassEffect = {
  backgroundColor: colors.background.glass,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.15)',
  // Note: React Native doesn't support backdropFilter, so we simulate with higher opacity backgrounds
};
