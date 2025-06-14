import React from 'react';
import { StatusBar } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { 
  AuthGuard, 
  Header, 
  ScreenLayout, 
  InfiniteBlogFeed 
} from '@/src/components';
import { blogsAPI } from '@/src/services/api';
import { colors } from '@/src/styles';

export default function BlogsScreen() {
  const queryClient = useQueryClient();

  const handleBlogLike = (blogId: string, liked: boolean) => {
    // Optimistically update the specific blog cache (not all caches)
    queryClient.setQueryData(['blogs'], (oldData: any) => {
      if (!oldData?.pages) return oldData;
      
      // Create a deep copy to avoid mutations
      const newData = {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((blog: any) => {
            if (blog.id === blogId) {
              return {
                ...blog,
                likes_count: liked ? (blog.likes_count || 0) + 1 : Math.max((blog.likes_count || 0) - 1, 0),
                liked_by_user: liked,
              };
            }
            return blog; // Return unchanged blog
          }),
        })),
      };
      
      return newData;
    });
  };

  const handleBlogDelete = async (blogId: string) => {
    try {
      // Call the API first
      await blogsAPI.deleteBlog(blogId);
      
      // Remove from the blog cache with better error handling
      queryClient.setQueryData(['blogs'], (oldData: any) => {
        if (!oldData?.pages) return oldData;
        
        // Create a deep copy and filter out the deleted blog
        const newData = {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((blog: any) => blog.id !== blogId),
          })),
        };
        
        return newData;
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['user-blogs'] });
    } catch (error) {
      console.error('Error deleting blog:', error);
      // Revert optimistic update by refetching
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    }
  };

  return (
    <AuthGuard>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      <ScreenLayout backgroundColor={colors.background.primary}>
        <Header title="Blogs" />
        
        <InfiniteBlogFeed
          queryKey={['blogs']}
          queryFn={blogsAPI.getBlogs}
          onBlogLike={handleBlogLike}
          onBlogDelete={handleBlogDelete}
        />
      </ScreenLayout>
    </AuthGuard>
  );
}
