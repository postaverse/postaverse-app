import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { PostCard } from '@/src/components/PostCard';
import { ConfirmationDialog } from '@/src/components/ConfirmationDialog';
import { useAuth } from '@/src/contexts/AuthContext';
import { usersAPI, postsAPI } from '@/src/services/api';
import { Post } from '@/src/types';
import { colors } from '@/src/styles';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const {
    data: userPostsData,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: () => usersAPI.getUserPosts(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchPosts();
    setRefreshing(false);
  };

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
    // Update cache optimistically
    queryClient.setQueryData(['user-posts', user?.id], (oldData: any) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        data: oldData.data.map((post: Post) =>
          post.id === postId
            ? {
                ...post,
                likes_count: liked ? post.likes_count + 1 : post.likes_count - 1,
              }
            : post
        ),
      };
    });
  };

  const handlePostDelete = async (postId: string) => {
    try {
      await postsAPI.deletePost(postId);
      // Remove from cache
      queryClient.setQueryData(['user-posts', user?.id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((post: Post) => post.id !== postId),
        };
      });
      // Also invalidate feed
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      Alert.alert('Success', 'Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post');
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const posts = userPostsData?.data || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent.primary}
            colors={[colors.accent.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: user.profile_photo_url }}
              style={styles.profileImage}
              placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
              transition={1000}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{user.name || user.handle}</Text>
              <Text style={styles.profileHandle}>@{user.handle}</Text>
              {user.bio && (
                <Text style={styles.profileBio}>{user.bio}</Text>
              )}
              {user.website && (
                <Text style={styles.profileWebsite}>{user.website}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.posts_count || posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followers_count || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.following_count || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {postsLoading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>
                Loading posts...
              </Text>
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#4b5563" />
              <Text style={styles.emptyText}>No posts yet</Text>
              <Text style={styles.emptySubtext}>
                Your posts will appear here when you create them
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push('/(tabs)/create')}
              >
                <Text style={styles.createButtonText}>Create your first post</Text>
              </TouchableOpacity>
            </View>
          ) : (
            posts.map((post: Post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handlePostLike}
                onDelete={handlePostDelete}
              />
            ))
          )}
        </View>
      </ScrollView>

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
    backgroundColor: colors.background.primary, // Pure black
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
  },
  profileHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', // Subtle glass-morphism border
    backgroundColor: 'rgba(31, 41, 55, 0.3)', // Very subtle background
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.025, // Website typography
    marginBottom: 4,
  },
  profileHandle: {
    color: colors.text.quaternary,
    fontSize: 16,
    marginBottom: 8,
  },
  profileBio: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  profileWebsite: {
    color: colors.accent.primary, // Sky blue
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ef4444',
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 14,
  },
  contentContainer: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: colors.accent.primary, // Sky blue
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
