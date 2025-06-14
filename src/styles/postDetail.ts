import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, glassEffect } from './tokens';

export const postDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text.tertiary,
    fontSize: fontSize.base,
    marginTop: spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  errorText: {
    color: colors.status.danger,
    fontSize: fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: spacing.sm,
  },
  retryText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  postContainer: {
    padding: spacing.sm,
  },
  commentForm: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.background.tertiary,
  },
  commentsTitle: {
    color: colors.text.primary,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.lg,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    color: colors.text.primary,
    fontSize: fontSize.sm,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.background.tertiary,
  },
  submitButton: {
    backgroundColor: colors.accent.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.interactive.disabled,
  },
  commentsContainer: {
    padding: spacing.md,
  },
  noCommentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  noCommentsText: {
    color: colors.text.tertiary,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  noCommentsSubtext: {
    color: colors.text.quaternary,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});
