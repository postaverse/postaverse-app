import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { PostCard } from '@/src/components/PostCard';
import { UnifiedComments } from '@/src/components';
import { postsAPI, commentsAPI } from '@/src/services/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { useDialog } from '@/src/contexts/DialogContext';
import { Post } from '@/src/types';

import { postDetailStyles as styles } from '@/src/styles';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { showAlert, showConfirm } = useDialog();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: post,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsAPI.getPost(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || isSubmitting || !id) return;

    try {
      setIsSubmitting(true);
      await commentsAPI.createPostComment(id, commentText.trim());
      setCommentText('');
      
      // Refetch post to get updated comments
      await refetch();
      
      // Update cache for feed and other queries
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error: any) {
      console.error('Error creating comment:', error);
      showAlert(
        'Error',
        error.response?.data?.message || 'Failed to create comment'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (commentId: string, content: string) => {
    if (!content.trim() || !id) return;

    try {
      await commentsAPI.createPostComment(id, content.trim(), commentId);
      
      // Refetch post to get updated comments
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error('Error creating reply:', error);
      showAlert('Error', 'Failed to create reply');
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await commentsAPI.deleteComment(commentId);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showAlert('Success', 'Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      showAlert('Error', 'Failed to delete comment');
    }
  };

  const handlePostLike = (postId: string, liked: boolean) => {
    // Update local state optimistically
    queryClient.setQueryData(['post', id], (oldData: Post | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        likes_count: liked ? oldData.likes_count + 1 : oldData.likes_count - 1,
      };
    });
  };

  const handlePostDelete = async (postId: string) => {
    try {
      await postsAPI.deletePost(postId);
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showAlert('Success', 'Post deleted successfully', () => router.back());
    } catch (error) {
      console.error('Error deleting post:', error);
      showAlert('Error', 'Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#111827" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#111827" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load post</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post */}
        <View style={styles.postContainer}>
          <PostCard
            post={post}
            onLike={handlePostLike}
            onDelete={handlePostDelete}
            showFullContent={true}
          />
        </View>

        {/* Comments */}
        <UnifiedComments
          user={user || undefined}
          comments={post.comments || []}
          commentsCount={post.comments?.length || 0}
          newComment={commentText}
          isSubmittingComment={isSubmitting}
          onCommentChange={setCommentText}
          onCommentSubmit={handleCommentSubmit}
          onCommentDelete={handleCommentDelete}
          onCommentReply={handleReply}
          emptyStateTitle="No comments yet"
          emptyStateSubtitle="Be the first to comment on this post"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

