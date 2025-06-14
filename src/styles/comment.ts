import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, glassEffect, shadows } from './tokens';

// Unified comment styles for both posts and blogs
export const commentStyles = StyleSheet.create({
  // Main comment card
  commentCard: {
    ...glassEffect,
    borderRadius: spacing.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.glass,
  },
  
  // Reply/nested comment card
  replyCard: {
    marginLeft: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent.primary,
    paddingLeft: spacing.lg,
  },

  // Comment header section
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  
  // User information section
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.sm,
  },
  userDetails: {
    flex: 1,
  },
  commentUserName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.primary,
  },
  commentHandle: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },

  // Header right section (timestamp, delete)
  commentHeaderRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  commentTimestamp: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  deleteButton: {
    padding: 4,
  },

  // Comment content
  commentContent: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },

  // Comment actions (reply button)
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.background.tertiary,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  replyButtonText: {
    fontSize: fontSize.xs,
    color: colors.accent.primary,
    fontWeight: '500',
  },

  // Reply form
  replyForm: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.background.tertiary,
  },
  replyInputWrapper: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.sm,
    padding: spacing.lg,
  },
  replyInput: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    maxHeight: 80,
    paddingVertical: 4,
    marginBottom: spacing.sm,
    textAlignVertical: 'top',
  },

  // Reply form actions
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  replyCancelButton: {
    paddingVertical: 6,
    paddingHorizontal: spacing.lg,
  },
  replyCancelText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  replySubmitButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 6,
    paddingHorizontal: spacing.lg,
    borderRadius: 6,
  },
  replySubmitButtonDisabled: {
    backgroundColor: colors.interactive.disabled,
  },
  replySubmitText: {
    fontSize: fontSize.xs,
    color: colors.text.primary,
    fontWeight: '500',
  },

  // Nested replies container
  repliesContainer: {
    marginTop: spacing.lg,
  },

  // Comment input (for main comment form)
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...glassEffect,
    margin: spacing.md,
    marginTop: 0,
    borderRadius: spacing.lg,
    padding: spacing.md,
    gap: spacing.lg,
    ...shadows.glass,
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
    textAlignVertical: 'top',
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

  // Comments section
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

  // Empty state
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
