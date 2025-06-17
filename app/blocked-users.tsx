import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { debounce } from 'lodash';

import { blockingAPI, searchAPI } from '@/src/services/api';
import { useDialog } from '@/src/contexts/DialogContext';
import { User } from '@/src/types';
import { colors, spacing, fontSize, fontWeight } from '@/src/styles';

interface BlockedUserItemProps {
  user: User;
  onUnblock: (userId: string) => void;
  isUnblocking: boolean;
}

const BlockedUserItem: React.FC<BlockedUserItemProps> = ({ user, onUnblock, isUnblocking }) => (
  <View style={styles.userItem}>
    <View style={styles.userInfo}>
      <Image
        source={{ uri: user.profile_photo_url || 'https://via.placeholder.com/40' }}
        style={styles.avatar}
        placeholder="https://via.placeholder.com/40"
      />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userUsername}>@{user.handle}</Text>
      </View>
    </View>
    <TouchableOpacity
      style={[styles.unblockButton, isUnblocking && styles.unblockButtonDisabled]}
      onPress={() => onUnblock(user.id.toString())}
      disabled={isUnblocking}
    >
      {isUnblocking ? (
        <ActivityIndicator size="small" color={colors.accent.primary} />
      ) : (
        <Text style={styles.unblockButtonText}>Unblock</Text>
      )}
    </TouchableOpacity>
  </View>
);

interface SearchUserItemProps {
  user: User;
  onBlock: (userId: string) => void;
  isBlocking: boolean;
}

const SearchUserItem: React.FC<SearchUserItemProps> = ({ user, onBlock, isBlocking }) => (
  <View style={styles.userItem}>
    <View style={styles.userInfo}>
      <Image
        source={{ uri: user.profile_photo_url || 'https://via.placeholder.com/40' }}
        style={styles.avatar}
        placeholder="https://via.placeholder.com/40"
      />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userUsername}>@{user.handle}</Text>
      </View>
    </View>
    <TouchableOpacity
      style={[styles.blockButton, isBlocking && styles.blockButtonDisabled]}
      onPress={() => onBlock(user.id.toString())}
      disabled={isBlocking}
    >
      {isBlocking ? (
        <ActivityIndicator size="small" color={colors.background.primary} />
      ) : (
        <Text style={styles.blockButtonText}>Block</Text>
      )}
    </TouchableOpacity>
  </View>
);

export default function BlockedUsersScreen() {
  const { showAlert, showConfirm } = useDialog();
  const [activeTab, setActiveTab] = useState<'blocked' | 'search'>('blocked');
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [unblockingUsers, setUnblockingUsers] = useState<Set<string>>(new Set());
  const [blockingUsers, setBlockingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      setLoading(true);
      const response = await blockingAPI.getBlockedUsers();
      setBlockedUsers(response.data || []);
    } catch (error) {
      console.error('Error loading blocked users:', error);
      showAlert('Error', 'Failed to load blocked users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBlockedUsers();
    setRefreshing(false);
  };

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);
        const response = await searchAPI.searchUsers(query);
        // Filter out already blocked users
        const blockedUserIds = new Set(blockedUsers.map(user => user.id.toString()));
        const filteredResults = response.filter(
          (user: User) => !blockedUserIds.has(user.id.toString())
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error searching users:', error);
        showAlert('Error', 'Failed to search users. Please try again.');
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    [blockedUsers, showAlert]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleUnblockUser = async (userId: string) => {
    return new Promise<void>((resolve) => {
      showConfirm(
        'Unblock User',
        'Are you sure you want to unblock this user?',
        async () => {
          setUnblockingUsers(prev => new Set([...prev, userId]));
          
          try {
            await blockingAPI.unblockUser(userId);
            setBlockedUsers(prev => prev.filter(user => user.id.toString() !== userId));
            showAlert('Success', 'User unblocked successfully');
          } catch (error) {
            console.error('Error unblocking user:', error);
            showAlert('Error', 'Failed to unblock user. Please try again.');
          } finally {
            setUnblockingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(userId);
              return newSet;
            });
          }
          resolve();
        },
        () => {
          resolve();
        }
      );
    });
  };

  const handleBlockUser = async (userId: string) => {
    return new Promise<void>((resolve) => {
      showConfirm(
        'Block User',
        'Are you sure you want to block this user?',
        async () => {
          setBlockingUsers(prev => new Set([...prev, userId]));
          
          try {
            await blockingAPI.blockUser(userId);
            // Remove from search results and add to blocked users
            const userToBlock = searchResults.find(user => user.id.toString() === userId);
            if (userToBlock) {
              setSearchResults(prev => prev.filter(user => user.id.toString() !== userId));
              setBlockedUsers(prev => [userToBlock, ...prev]);
            }
            showAlert('Success', 'User blocked successfully');
          } catch (error) {
            console.error('Error blocking user:', error);
            showAlert('Error', 'Failed to block user. Please try again.');
          } finally {
            setBlockingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(userId);
              return newSet;
            });
          }
          resolve();
        },
        () => {
          resolve();
        }
      );
    });
  };

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'blocked' && styles.activeTab]}
        onPress={() => setActiveTab('blocked')}
      >
        <Text style={[styles.tabText, activeTab === 'blocked' && styles.activeTabText]}>
          Blocked Users
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'search' && styles.activeTab]}
        onPress={() => setActiveTab('search')}
      >
        <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
          Block New User
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSearchInput = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={colors.text.tertiary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search users to block..."
        placeholderTextColor={colors.text.tertiary}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />
      {searchLoading && (
        <ActivityIndicator size="small" color={colors.accent.primary} style={styles.searchLoader} />
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={activeTab === 'blocked' ? 'shield-checkmark' : 'search'} 
        size={64} 
        color={colors.text.quaternary} 
      />
      <Text style={styles.emptyStateTitle}>
        {activeTab === 'blocked' ? 'No Blocked Users' : 'Search for Users'}
      </Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'blocked' 
          ? 'You haven\'t blocked any users yet.'
          : 'Enter a username or name to search for users to block.'
        }
      </Text>
    </View>
  );

  const renderBlockedUsers = () => (
    <FlatList
      data={blockedUsers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <BlockedUserItem
          user={item}
          onUnblock={handleUnblockUser}
          isUnblocking={unblockingUsers.has(item.id.toString())}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.accent.primary}
        />
      }
      ListEmptyComponent={loading ? null : renderEmptyState}
    />
  );

  const renderSearchResults = () => (
    <View style={styles.searchContent}>
      {renderSearchInput()}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SearchUserItem
            user={item}
            onBlock={handleBlockUser}
            isBlocking={blockingUsers.has(item.id.toString())}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!searchQuery || searchLoading ? null : renderEmptyState}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {renderTabs()}
      
      {loading && activeTab === 'blocked' ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={styles.loadingText}>Loading blocked users...</Text>
        </View>
      ) : (
        <>
          {activeTab === 'blocked' ? renderBlockedUsers() : renderSearchResults()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  } as ViewStyle,
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: 8,
    padding: 4,
  } as ViewStyle,
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  } as ViewStyle,
  activeTab: {
    backgroundColor: colors.background.primary,
  } as ViewStyle,
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text.secondary,
  } as TextStyle,
  activeTabText: {
    color: colors.text.primary,
  } as TextStyle,
  searchContent: {
    flex: 1,
  } as ViewStyle,
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  } as ViewStyle,
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  } as TextStyle,
  searchLoader: {
    marginLeft: spacing.sm,
  } as ViewStyle,
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  } as ViewStyle,
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  } as ViewStyle,
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  } as ImageStyle,
  userDetails: {
    flex: 1,
  } as ViewStyle,
  userName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  } as TextStyle,
  userUsername: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  } as TextStyle,
  unblockButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  } as ViewStyle,
  unblockButtonDisabled: {
    opacity: 0.6,
  } as ViewStyle,
  unblockButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  blockButton: {
    backgroundColor: colors.status.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  } as ViewStyle,
  blockButtonDisabled: {
    opacity: 0.6,
  } as ViewStyle,
  blockButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  loadingText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  } as TextStyle,
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  } as ViewStyle,
  emptyStateTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
    textAlign: 'center',
  } as TextStyle,
  emptyStateText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  } as TextStyle,
});
