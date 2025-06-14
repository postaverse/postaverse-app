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
import { colors } from '@/src/styles';

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 56,
  },
  headerTitle: {
    fontSize: Math.min(20, screenWidth * 0.055),
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  logoutButton: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: Math.min(80, screenWidth * 0.2),
    height: Math.min(80, screenWidth * 0.2),
    borderRadius: Math.min(40, screenWidth * 0.1),
    marginBottom: 12,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 16,
  },
  name: {
    fontSize: Math.min(24, screenWidth * 0.062),
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  handle: {
    fontSize: Math.min(16, screenWidth * 0.042),
    color: colors.text.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  bio: {
    fontSize: Math.min(14, screenWidth * 0.037),
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 300,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  statNumber: {
    fontSize: Math.min(20, screenWidth * 0.052),
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: Math.min(14, screenWidth * 0.037),
    color: colors.text.secondary,
    marginTop: 4,
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
    paddingHorizontal: 20,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: Math.min(16, screenWidth * 0.042),
    textAlign: 'center',
  },
});
