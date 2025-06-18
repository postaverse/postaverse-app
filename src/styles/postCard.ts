import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows, fontWeight } from './tokens';

export const postCardStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  card: {
    backgroundColor: colors.background.glass,
    borderRadius: 20,
    padding: spacing.xl,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...shadows.glass,
  },

  // Header section with user info
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // Profile image with enhanced styling
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },

  userDetails: {
    flex: 1,
  },

  // Username styling with improved typography
  userName: {
    fontSize: fontSize.base,
    color: colors.text.primary,
    fontWeight: fontWeight.bold as any,
    letterSpacing: -0.025,
    marginBottom: 4,
  },

  // Date styling with better contrast
  postDate: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },

  // Post stats section
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },

  statText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginLeft: 4,
    fontWeight: fontWeight.medium as any,
  },

  // Title styling with better typography
  titleContainer: {
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: fontSize.xxl,
    color: colors.text.primary,
    fontWeight: fontWeight.bold as any,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
    lineHeight: 32,
  },

  // Content area with improved readability
  content: {
    marginBottom: spacing.lg,
  },

  contentText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
    fontWeight: fontWeight.normal as any,
  },

  // Enhanced action buttons
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    minWidth: 80,
    justifyContent: 'center',
  },

  actionButtonPressed: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },

  actionText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    fontWeight: fontWeight.medium as any,
    marginLeft: spacing.xs,
  },

  actionTextPressed: {
    color: colors.accent.primary,
  },

  // Primary button styling matching website's gradient buttons
  primaryButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
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

  profanityWarning: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red with opacity
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },

  profanityText: {
    color: colors.status.danger,
    fontSize: fontSize.sm,
    fontWeight: '500',
    flex: 1,
    marginLeft: spacing.sm,
  },
});
