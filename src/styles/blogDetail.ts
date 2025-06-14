import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, shadows, glassEffect } from './tokens';

export const blogDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.status.danger,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
  },
  retryButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  blogContainer: {
    ...glassEffect,
    margin: spacing.md,
    borderRadius: spacing.lg,
    padding: spacing.lg,
    ...shadows.glass,
  },
  blogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.lg,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  userHandle: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  headerRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  deleteButton: {
    padding: 4,
  },
  blogTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
    lineHeight: 32,
  },
  blogContent: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  blogActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.background.tertiary,
    gap: spacing.xxl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  likedText: {
    color: colors.status.danger,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...glassEffect,
    margin: spacing.md,
    marginTop: 0,
    borderRadius: spacing.lg,
    padding: spacing.md,
    gap: spacing.lg,
  },
  commentInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  commentInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: fontSize.base,
    maxHeight: 100,
    paddingVertical: 4,
  },
  commentSubmitButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSubmitButtonDisabled: {
    backgroundColor: colors.interactive.disabled,
  },
  commentsContainer: {
    margin: spacing.md,
    marginTop: 0,
  },
  commentsTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyCommentsContainer: {
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  emptyCommentsText: {
    fontSize: fontSize.base,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyCommentsSubtext: {
    fontSize: fontSize.sm,
    color: colors.text.quaternary,
    textAlign: 'center',
  },
});
