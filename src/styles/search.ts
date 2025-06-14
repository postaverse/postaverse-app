import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from './tokens';

export const searchStyles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', // Glass-morphism border
    backgroundColor: 'rgba(31, 41, 55, 0.6)', // Glass-morphism background
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    letterSpacing: -0.025, // Website typography
    color: colors.text.primary,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  tabSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  resultsContainer: {
    paddingVertical: spacing.md,
  },
  itemContainer: {
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  clearButton: {
    marginLeft: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.accent.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  activeTabText: {
    color: colors.text.primary,
  },
  
  // Section styles
  sectionContainer: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sectionCount: {
    fontSize: 14,
    color: colors.text.tertiary,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.background.tertiary,
    marginVertical: spacing.lg,
  },

  // User card styles
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  userBio: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  userStats: {
    alignItems: 'flex-end',
  },
  userStat: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  
  // Content card styles
  contentCard: {
    paddingVertical: spacing.sm,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  contentExcerpt: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  contentAuthor: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  contentType: {
    fontSize: 11,
    color: colors.accent.primary,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: spacing.sm,
    textTransform: 'uppercase',
  },
  contentDate: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
});
