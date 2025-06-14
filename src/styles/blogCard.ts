import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from './tokens';

export const blogCardStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.xs, // Reduced margin for wider cards
    marginBottom: spacing.xl,
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

  blogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.3)', // Sky 400 with opacity
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: '700',
    letterSpacing: -0.025,
    marginBottom: 2,
  },
  blogDate: {
    color: colors.text.quaternary,
    fontSize: fontSize.xs,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  blogTitle: {
    color: colors.text.primary,
    fontSize: fontSize.xl,
    fontWeight: '700',
    letterSpacing: -0.025,
    marginBottom: spacing.sm,
    lineHeight: 28,
  },
  blogExcerpt: {
    color: colors.text.secondary,
    fontSize: fontSize.base,
    lineHeight: 27.2, // 1.7 * 16
    marginBottom: spacing.lg,
  },
  blogFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xl,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionText: {
    color: colors.text.quaternary,
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
});
