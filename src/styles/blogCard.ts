import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows, fontWeight } from './tokens';

export const blogCardStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
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

  blogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.text.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold as any,
    letterSpacing: -0.025,
    marginBottom: 4,
  },
  blogDate: {
    color: colors.text.tertiary,
    fontSize: fontSize.sm,
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  blogTitle: {
    color: colors.text.primary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    letterSpacing: -0.5,
    marginBottom: spacing.md,
    lineHeight: 32,
  },
  blogExcerpt: {
    color: colors.text.secondary,
    fontSize: fontSize.base,
    lineHeight: 24,
    marginBottom: spacing.lg,
    fontWeight: fontWeight.normal as any,
  },
  blogFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  actionText: {
    color: colors.text.tertiary,
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
    fontWeight: fontWeight.medium as any,
  },
});
