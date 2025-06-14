import { StyleSheet } from 'react-native';
import { colors, spacing } from './tokens';

export const notificationStyles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  unreadBadge: {
    backgroundColor: colors.status.danger,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: spacing.sm,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
  },
  selectButtonText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  markAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.accent.primary,
  },
  markAllText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  bulkActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  bulkActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bulkActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectAllButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  selectAllText: {
    color: colors.accent.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  selectedCount: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  bulkActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  bulkActionText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.primary,
  },
  readButton: {
    backgroundColor: colors.status.success,
  },
  unreadButton: {
    backgroundColor: colors.accent.primary,
  },
  deleteButton: {
    backgroundColor: colors.status.danger,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 0, // CardLayout handles padding
  },
  unreadNotification: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)', // Subtle accent background
  },
  selectedNotification: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)', // Slightly more pronounced
  },
  checkboxContainer: {
    marginRight: spacing.md,
    paddingTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.text.quaternary,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.primary,
    marginLeft: 'auto',
  },
  notificationMessage: {
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  notificationActions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.sm,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
