import React from 'react';
import { StatusBar } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { 
  ScreenLayout, 
  Header, 
  InfinitePostFeed, 
  AuthGuard 
} from '@/src/components';
import { postsAPI } from '@/src/services/api';
import { colors } from '@/src/styles';

export default function HomeScreen() {
  const queryClient = useQueryClient();

  const handlePostLike = (postId: string, liked: boolean) => {
    // Optimistically update the infinite query cache with better error handling
    queryClient.setQueryData(['feed'], (oldData: any) => {
      if (!oldData?.pages) return oldData;
      
      // Create a deep copy to avoid mutations
      const newData = {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((post: any) => {
            if (post.id === postId) {
              return {
                ...post,
                likes_count: liked ? (post.likes_count || 0) + 1 : Math.max((post.likes_count || 0) - 1, 0),
                liked_by_user: liked,
              };
            }
            return post; // Return unchanged post
          }),
        })),
      };
      
      return newData;
    });
  };

  const handlePostDelete = async (postId: string) => {
    try {
      // Call the API first
      await postsAPI.deletePost(postId);
      
      // Then update the cache with better error handling
      queryClient.setQueryData(['feed'], (oldData: any) => {
        if (!oldData?.pages) return oldData;
        
        // Create a deep copy and filter out the deleted post
        const newData = {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((post: any) => post.id !== postId),
          })),
        };
        
        return newData;
      });
      
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    } catch (error) {
      console.error('Error deleting post:', error);
      // Revert optimistic update by refetching
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    }
  };

  return (
    <AuthGuard>
      <ScreenLayout backgroundColor={colors.background.primary}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
        
        <Header title="Postaverse" />

        <InfinitePostFeed
          queryKey={['feed']}
          queryFn={postsAPI.getFeed}
          onPostLike={handlePostLike}
          onPostDelete={handlePostDelete}
        />
      </ScreenLayout>
    </AuthGuard>
  );
}
