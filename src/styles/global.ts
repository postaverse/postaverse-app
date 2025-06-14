import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from './tokens';

// Global app styles matching the website's dark theme
export const globalStyles = StyleSheet.create({
  // Background styles matching website's pure black background
  screenBackground: {
    backgroundColor: 'transparent', // Transparent to show stars
    flex: 1,
  },

  // Container styles matching website's max-w-7xl pattern
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Transparent to show stars
    paddingHorizontal: spacing.lg,
  },

  // Safe area container
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#000000', // Keep black for app boundaries
  },

  // Main content area matching website's main class
  mainContent: {
    flex: 1,
    backgroundColor: 'transparent', // Transparent to show stars
    paddingTop: spacing.lg,
  },

  // Header styles matching website header
  header: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  headerTitle: {
    fontSize: fontSize.xl,
    color: colors.text.primary,
    fontWeight: '700',
    letterSpacing: -0.025,
  },

  // Text styles matching website typography
  headingPrimary: {
    fontSize: fontSize.xxxl,
    color: colors.text.primary,
    fontWeight: '700',
    letterSpacing: -0.025,
    marginBottom: spacing.lg,
  },

  headingSecondary: {
    fontSize: fontSize.xxl,
    color: colors.text.primary,
    fontWeight: '700',
    letterSpacing: -0.025,
    marginBottom: spacing.md,
  },

  bodyText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 1.7 * 16,
  },

  // Link styles matching website
  link: {
    color: colors.accent.primary,
    textDecorationLine: 'underline',
  },

  linkPressed: {
    color: colors.accent.secondary,
  },

  // Card styles matching website's glass-morphism
  card: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    // Use glass shadow from tokens
    ...shadows.glass,
  },

  // Button styles matching website
  primaryButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    // Use medium shadow from tokens
    ...shadows.medium,
  },

  primaryButtonPressed: {
    backgroundColor: colors.accent.secondary,
    transform: [{ translateY: 1 }],
  },

  primaryButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.base,
    fontWeight: '600',
  },

  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: colors.text.secondary,
    fontSize: fontSize.base,
    fontWeight: '500',
  },

  // Form input styles matching website
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    borderRadius: borderRadius.md,
    color: colors.text.secondary,
    fontSize: fontSize.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },

  inputFocused: {
    borderColor: colors.accent.primary,
    // Use a blue box shadow for focus state on web
    boxShadow: `0 0 3px ${colors.accent.primary}33`, // 33 = 20% opacity
  },

  textarea: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    borderRadius: borderRadius.md,
    color: colors.text.secondary,
    fontSize: fontSize.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Loading states
  loading: {
    opacity: 0.7,
  },

  disabled: {
    opacity: 0.5,
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    marginVertical: spacing.md,
  },

  // Center content
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },

  emptyStateText: {
    fontSize: fontSize.lg,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
