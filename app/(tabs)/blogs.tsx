import React from 'react';
import { StatusBar } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { 
  AuthGuard, 
  Header, 
  ScreenLayout, 
  FeedContainer, 
  BlogCard 
} from '@/src/components';
import { blogsAPI } from '@/src/services/api';
import { Blog } from '@/src/types';
import { colors } from '@/src/styles';

export default function BlogsScreen() {
  const queryClient = useQueryClient();

  const {
    data: blogsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogsAPI.getBlogs(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const handleBlogLike = (blogId: string, liked: boolean) => {
    // Optimistically update the cache
    queryClient.setQueryData(['blogs'], (oldData: any) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        data: oldData.data.map((blog: Blog) =>
          blog.id === blogId
            ? {
                ...blog,
                likes_count: liked ? blog.likes_count + 1 : blog.likes_count - 1,
              }
            : blog
        ),
      };
    });
  };

  const handleBlogDelete = async (blogId: string) => {
    try {
      await blogsAPI.deleteBlog(blogId);
      // Remove from cache
      queryClient.setQueryData(['blogs'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((blog: Blog) => blog.id !== blogId),
        };
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const blogs = blogsData?.data || [];

  return (
    <AuthGuard>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      <ScreenLayout scrollable onRefresh={refetch}>
        <Header title="Blogs" />
        
        <FeedContainer
          data={blogs}
          isLoading={isLoading}
          error={error}
          renderItem={(blog: Blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onLike={handleBlogLike}
              onDelete={handleBlogDelete}
            />
          )}
          emptyTitle="No blogs yet"
          emptySubtitle="Be the first to share a blog post!"
          loadingMessage="Loading blogs..."
        />
      </ScreenLayout>
    </AuthGuard>
  );
}
