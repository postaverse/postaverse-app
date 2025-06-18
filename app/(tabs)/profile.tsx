import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { InfinitePostFeed } from '@/src/components/FeedComponents';
import { ConfirmationDialog } from '@/src/components/ConfirmationDialog';
import { MarkdownRenderer } from '@/src/components/MarkdownRenderer';
import { useAuth } from '@/src/contexts/AuthContext';
import { usersAPI } from '@/src/services/api';
import { colors, spacing, fontSize, fontWeight, shadows } from '@/src/styles';

const { width: screenWidth } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await logout();
      router.replace('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handlePostLike = (postId: string, liked: boolean) => {
    queryClient.setQueriesData(
      { queryKey: ['user-posts', user?.id] },
      (oldData: any) => {
        if (!oldData?.pages) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    likes_count: liked ? post.likes_count + 1 : post.likes_count - 1,
                  }
                : post
            ),
          })),
        };
      }
    );
    
    queryClient.setQueriesData(
      { queryKey: ['feed'] },
      (oldData: any) => {
        if (!oldData?.pages) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    likes_count: liked ? post.likes_count + 1 : post.likes_count - 1,
                  }
                : post
            ),
          })),
        };
      }
    );
  };

  const handlePostDelete = async (postId: string) => {
    queryClient.setQueriesData(
      { queryKey: ['user-posts', user?.id] },
      (oldData: any) => {
        if (!oldData?.pages) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((post: any) => post.id !== postId),
          })),
        };
      }
    );
    
    queryClient.setQueriesData(
      { queryKey: ['feed'] },
      (oldData: any) => {
        if (!oldData?.pages) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((post: any) => post.id !== postId),
          })),
        };
      }
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.logoutButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.status.danger} />
        </TouchableOpacity>
      </View>

      {/* Posts Feed with Profile Header */}
      <InfinitePostFeed
        queryKey={['user-posts', user.id]}
        queryFn={(page) => usersAPI.getUserPosts(user.id, page)}
        onPostLike={handlePostLike}
        onPostDelete={handlePostDelete}
        emptyTitle="No posts yet"
        emptySubtitle="Your posts will appear here when you create them"
        ListHeaderComponent={() => (
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: user.profile_photo_url }}
              style={styles.avatar}
              placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
              transition={1000}
            />
            <View style={styles.userInfo}>
              <Text style={styles.name} numberOfLines={2}>{user.name || user.handle}</Text>
              <Text style={styles.handle} numberOfLines={1}>@{user.handle}</Text>
              {user.bio && (
                <MarkdownRenderer
                  variant="bio"
                  showFullContent={false}
                  truncateLength={150}
                  style={styles.bio}
                >
                  {user.bio}
                </MarkdownRenderer>
              )}
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>{user.posts_count || 0}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>{user.followers_count || 0}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>{user.following_count || 0}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        visible={showLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
        confirmStyle="destructive"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    minHeight: 64,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  logoutButton: {
    padding: spacing.sm,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  profileContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.background.glass,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...shadows.glass,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.lg,
    borderWidth: 4,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    width: '100%',
  },
  name: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  handle: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontWeight: fontWeight.medium as any,
  },
  bio: {
    fontSize: fontSize.base,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: fontWeight.normal as any,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: spacing.sm,
  },
  statNumber: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: fontWeight.medium as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  feedContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: fontSize.lg,
    textAlign: 'center',
    fontWeight: fontWeight.medium as any,
  },
});
