import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from './tokens';

export const postCardStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },

  card: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // Use the glass shadow from tokens
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // Profile image with ring like website
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.3)', // Sky 400 with opacity
  },

  userDetails: {
    flex: 1,
  },

  // Username styling matching website's bold white text
  userName: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: '700',
    letterSpacing: -0.025,
    marginBottom: 2,
  },

  // Date styling matching website's gray text
  postDate: {
    fontSize: fontSize.xs,
    color: colors.text.quaternary,
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
  },

  statText: {
    fontSize: fontSize.xs,
    color: colors.text.quaternary,
    marginLeft: 4,
  },

  // Title styling matching website's hover effects
  titleContainer: {
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: fontSize.xl,
    color: colors.text.primary,
    fontWeight: '700',
    letterSpacing: -0.025,
    marginBottom: spacing.sm,
  },

  // Content area
  content: {
    marginBottom: spacing.lg,
  },

  contentText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 27.2, // 1.7 * 16
  },

  // Action buttons section
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  actionButtonPressed: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },

  actionText: {
    fontSize: fontSize.sm,
    color: colors.text.quaternary,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },

  actionTextPressed: {
    color: colors.text.primary,
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
