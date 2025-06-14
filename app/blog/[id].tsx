import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';

import { useAuth } from '@/src/contexts/AuthContext';
import { useDialog } from '@/src/contexts/DialogContext';
import { blogsAPI, commentsAPI } from '@/src/services/api';
import { Blog, User, BlogComment } from '@/src/types';
import { LoadingState, ErrorState, EmptyState, BlogHeader, UnifiedComments } from '@/src/components';
import { blogDetailStyles } from '@/src/styles';

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { showAlert, showConfirm } = useDialog();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Fetch blog details
  const { data: blog, isLoading, error, refetch } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogsAPI.getBlog(id!),
    enabled: !!id,
  });

  // Like blog mutation
  const likeMutation = useMutation({
    mutationFn: () => blogsAPI.toggleLike(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    },
    onError: (error) => {
      console.error('Error liking blog:', error);
      showAlert('Error', 'Failed to like blog');
    },
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: () => blogsAPI.deleteBlog(id!),
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      console.error('Error deleting blog:', error);
      showAlert('Error', 'Failed to delete blog');
    },
  });

  const handleLike = () => {
    if (!currentUser) return;
    likeMutation.mutate();
  };

  const handleDeleteBlog = () => {
    showConfirm(
      'Delete Blog',
      'Are you sure you want to delete this blog?',
      () => deleteBlogMutation.mutate(),
      undefined,
      'Delete',
      'Cancel',
      'destructive'
    );
  };

  const handleUserPress = () => {
    if (blog?.user?.id) {
      router.push(`/profile/${blog.user.id}` as any);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUser) return;

    try {
      setIsSubmittingComment(true);
      await commentsAPI.createBlogComment(id!, newComment.trim());
      setNewComment('');
      refetch();
    } catch (error) {
      console.error('Error adding comment:', error);
      showAlert('Error', 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      showConfirm(
        'Delete Comment',
        'Are you sure you want to delete this comment?',
        async () => {
          try {
            await commentsAPI.deleteComment(commentId);
            refetch();
            showAlert('Success', 'Comment deleted successfully');
          } catch (error: any) {
            console.error('Error in deletion confirmation:', error);
            console.error('Error status:', error.response?.status);
            console.error('Error data:', error.response?.data);
            console.error('Error config:', error.config);
            const errorMessage = error.response?.data?.message || 'Failed to delete comment';
            showAlert('Error', errorMessage);
          }
        },
        undefined,
        'Delete',
        'Cancel',
        'destructive'
      );
    } catch (error: any) {
      console.error('Error in handleDeleteComment wrapper:', error);
      showAlert('Error', 'An unexpected error occurred');
    }
  };

  const handleReplyToComment = async (commentId: string, content: string) => {
    try {
      await commentsAPI.createBlogComment(id!, content.trim(), commentId);
      refetch();
    } catch (error) {
      console.error('Error replying to comment:', error);
      showAlert('Error', 'Failed to reply to comment');
      throw error; // Re-throw to let the CommentCard handle the error state
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Loading...', headerBackTitle: 'Back' }} />
        <SafeAreaView style={blogDetailStyles.container}>
          <View style={blogDetailStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={blogDetailStyles.loadingText}>Loading blog...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Stack.Screen options={{ title: 'Error', headerBackTitle: 'Back' }} />
        <SafeAreaView style={blogDetailStyles.container}>
          <View style={blogDetailStyles.errorContainer}>
            <Text style={blogDetailStyles.errorText}>Failed to load blog</Text>
            <TouchableOpacity style={blogDetailStyles.retryButton} onPress={() => refetch()}>
              <Text style={blogDetailStyles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const isLiked = blog.liked_by_user || 
                  (blog.likes?.some(like => like.user_id === currentUser?.id)) || 
                  false;
  const canDeleteBlog = currentUser && (
    currentUser.id === blog.user_id || 
    (currentUser.admin_rank && currentUser.admin_rank >= 3)
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: (blog.title && blog.title.length > 20) ? blog.title.substring(0, 20) + '...' : (blog.title || 'Blog'),
          headerBackTitle: 'Back'
        }} 
      />
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SafeAreaView style={blogDetailStyles.container}>
        <ScrollView
          style={blogDetailStyles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="#38bdf8"
              colors={['#38bdf8']}
            />
          }
        >
          {/* Blog Content */}
          <View style={blogDetailStyles.blogContainer}>
            {/* Blog Header */}
            <View style={blogDetailStyles.blogHeader}>
              <TouchableOpacity style={blogDetailStyles.userInfo} onPress={handleUserPress}>
                <Image
                  source={{ uri: blog.user?.profile_photo_url || 'https://via.placeholder.com/48' }}
                  style={blogDetailStyles.userAvatar}
                  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                  transition={1000}
                />
                <View style={blogDetailStyles.userDetails}>
                  <Text style={blogDetailStyles.userName}>
                    {blog.user?.name || blog.user?.handle || 'Unknown User'}
                  </Text>
                  <Text style={blogDetailStyles.userHandle}>@{blog.user?.handle}</Text>
                </View>
              </TouchableOpacity>
              
              <View style={blogDetailStyles.headerRight}>
                <Text style={blogDetailStyles.timestamp}>{formatDate(blog.created_at)}</Text>
                {canDeleteBlog && (
                  <TouchableOpacity onPress={handleDeleteBlog} style={blogDetailStyles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Blog Title */}
            <Text style={blogDetailStyles.blogTitle}>{blog.title || 'Untitled'}</Text>

            {/* Blog Content */}
            <Text style={blogDetailStyles.blogContent}>{blog.content || ''}</Text>

            {/* Blog Actions */}
            <View style={blogDetailStyles.blogActions}>
              <TouchableOpacity
                style={blogDetailStyles.actionButton}
                onPress={handleLike}
                disabled={likeMutation.isPending}
              >
                {likeMutation.isPending ? (
                  <ActivityIndicator size="small" color={isLiked ? "#ef4444" : "#9ca3af"} />
                ) : (
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={24}
                    color={isLiked ? "#ef4444" : "#9ca3af"}
                  />
                )}
                <Text style={[blogDetailStyles.actionText, isLiked && blogDetailStyles.likedText]}>
                  {blog.likes_count || 0}
                </Text>
              </TouchableOpacity>

              <View style={blogDetailStyles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color="#9ca3af" />
                <Text style={blogDetailStyles.actionText}>{blog.comments_count || 0}</Text>
              </View>
            </View>
          </View>

          {/* Comments Section */}
          <UnifiedComments
            user={currentUser || undefined}
            comments={blog.comments || []}
            commentsCount={blog.comments_count || 0}
            newComment={newComment}
            isSubmittingComment={isSubmittingComment}
            onCommentChange={setNewComment}
            onCommentSubmit={handleSubmitComment}
            onCommentDelete={handleDeleteComment}
            onCommentReply={handleReplyToComment}
            emptyStateTitle="No comments yet"
            emptyStateSubtitle="Be the first to share your thoughts!"
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
