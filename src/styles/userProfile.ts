import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, glassEffect, shadows } from './tokens';

export const userProfileStyles = StyleSheet.create({
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
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
  profileHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: spacing.md,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: colors.text.primary,
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileHandle: {
    color: colors.text.tertiary,
    fontSize: fontSize.base,
    marginBottom: spacing.sm,
  },
  profileBio: {
    color: colors.text.secondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  profileWebsite: {
    color: colors.accent.primary,
    fontSize: fontSize.sm,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.sm,
  },
  followingButton: {
    backgroundColor: colors.status.danger,
  },
  followButtonDisabled: {
    backgroundColor: colors.interactive.disabled,
  },
  followButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    color: colors.text.primary,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.text.tertiary,
    fontSize: fontSize.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.accent.primary,
  },
  tabText: {
    color: colors.text.tertiary,
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  contentContainer: {
    padding: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    color: colors.text.tertiary,
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    color: colors.text.quaternary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  blogCard: {
    ...glassEffect,
    borderRadius: spacing.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.glass,
  },
  blogTitle: {
    color: colors.text.primary,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  blogContent: {
    color: colors.text.secondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  blogStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statText: {
    color: colors.text.tertiary,
    fontSize: fontSize.xs,
  },
});
