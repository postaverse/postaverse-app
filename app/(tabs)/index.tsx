import React, { useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { 
  ScreenLayout, 
  Header, 
  PostFeed, 
  AuthGuard 
} from '@/src/components';
import { Post } from '@/src/types';
import { postsAPI } from '@/src/services/api';
import { colors } from '@/src/styles';

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: feedData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['feed'],
    queryFn: () => postsAPI.getFeed(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handlePostLike = (postId: string, liked: boolean) => {
    // Optimistically update the cache
    queryClient.setQueryData(['feed'], (oldData: any) => {
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
      queryClient.setQueryData(['feed'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((post: Post) => post.id !== postId),
        };
      });
      Alert.alert('Success', 'Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post');
    }
  };

  const posts = feedData?.data || [];

  return (
    <AuthGuard>
      <ScreenLayout backgroundColor={colors.background.primary}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
        
        <Header title="Postaverse" />

        <PostFeed
          posts={posts}
          isLoading={isLoading}
          error={error}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onPostLike={handlePostLike}
          onPostDelete={handlePostDelete}
        />
      </ScreenLayout>
    </AuthGuard>
  );
}
