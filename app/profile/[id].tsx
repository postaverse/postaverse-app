import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { PostCard } from '@/src/components/PostCard';
import { useAuth } from '@/src/contexts/AuthContext';
import { usersAPI, postsAPI } from '@/src/services/api';
import { Post } from '@/src/types';

import { userProfileStyles as styles } from '@/src/styles';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersAPI.getUser(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Initialize follow status when user data loads
  useEffect(() => {
    if (user?.is_following !== undefined) {
      setIsFollowing(user.is_following);
    }
  }, [user?.is_following]);

  const {
    data: userPostsData,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ['user-posts', id],
    queryFn: () => usersAPI.getUserPosts(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchUser(),
      refetchPosts(),
    ]);
    setRefreshing(false);
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !id || isToggling) return;

    try {
      setIsToggling(true);
      const result = await usersAPI.toggleFollow(id);
      setIsFollowing(result.following);
      
      // Refresh user data to get updated follower count
      await refetchUser();
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update follow status'
      );
    } finally {
      setIsToggling(false);
    }
  };

  const handlePostLike = (postId: string, liked: boolean) => {
    // Update cache optimistically
    queryClient.setQueryData(['user-posts', id], (oldData: any) => {
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
      queryClient.setQueryData(['user-posts', id], (oldData: any) => {
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

  if (userLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (userError || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity onPress={() => refetchUser()} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const posts = userPostsData?.data || [];
  const isLoading = postsLoading;
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.name || user.handle}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#38bdf8"
            colors={['#38bdf8']}
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

          {/* Follow Button */}
          {!isOwnProfile && currentUser && (
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing && styles.followingButton,
                isToggling && styles.followButtonDisabled
              ]}
              onPress={handleFollowToggle}
              disabled={isToggling}
            >
              {isToggling ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Ionicons
                    name={isFollowing ? "person-remove" : "person-add"}
                    size={16}
                    color="#ffffff"
                  />
                  <Text style={styles.followButtonText}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
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

        {/* Posts Content */}
        <View style={styles.contentContainer}>
          {isLoading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#38bdf8" />
              <Text style={styles.loadingText}>Loading posts...</Text>
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#4b5563" />
              <Text style={styles.emptyText}>No posts yet</Text>
              <Text style={styles.emptySubtext}>
                {isOwnProfile 
                  ? "You haven't created any posts yet"
                  : `${user.name || user.handle} hasn't posted anything yet`
                }
              </Text>
            </View>
          ) : (
            posts.map((post: Post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handlePostLike}
                onDelete={isOwnProfile ? handlePostDelete : undefined}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
