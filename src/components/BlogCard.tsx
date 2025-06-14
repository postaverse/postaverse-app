import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Blog } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { useDialog } from '@/src/contexts/DialogContext';
import { CardLayout } from './LayoutComponents';
import { blogCardStyles } from '@/src/styles/';

interface BlogCardProps {
  blog: Blog;
  onLike?: (blogId: string, liked: boolean) => void;
  onDelete?: (blogId: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onLike, onDelete }) => {
  const { user: currentUser } = useAuth();
  const { showConfirm } = useDialog();

  const handleUserPress = () => {
    if (blog.user?.id) {
      router.push(`/profile/${blog.user.id}` as any);
    }
  };

  const handleBlogPress = () => {
    router.push(`/blog/${blog.id}` as any);
  };

  const handleLike = () => {
    if (!currentUser) return;
    const isLiked = blog.likes?.some(like => like.user_id === currentUser.id) || false;
    onLike?.(blog.id, !isLiked);
  };

  const handleDelete = () => {
    showConfirm(
      'Delete Blog',
      'Are you sure you want to delete this blog?',
      () => onDelete?.(blog.id),
      undefined,
      'Delete',
      'Cancel',
      'destructive'
    );
  };

  const isLiked = blog.likes?.some(like => like.user_id === currentUser?.id) || false;
  const canDelete = currentUser && (
    currentUser.id === blog.user_id || 
    (currentUser.admin_rank && currentUser.admin_rank >= 3)
  );

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

  return (
    <CardLayout>
      {/* Blog Header */}
      <TouchableOpacity style={blogCardStyles.blogHeader} onPress={handleUserPress}>
        <Image
          source={{ uri: blog.user?.profile_photo_url || 'https://via.placeholder.com/40' }}
          style={blogCardStyles.userAvatar}
        />
        <View style={blogCardStyles.userInfo}>
          <Text style={blogCardStyles.userName}>{blog.user?.name || 'Unknown User'}</Text>
          <Text style={blogCardStyles.blogDate}>{formatDate(blog.created_at)}</Text>
        </View>
        {canDelete && (
          <TouchableOpacity style={blogCardStyles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Blog Content */}
      <TouchableOpacity onPress={handleBlogPress}>
        <Text style={blogCardStyles.blogTitle}>{blog.title}</Text>
        <Text style={blogCardStyles.blogExcerpt} numberOfLines={3}>
          {blog.content}
        </Text>
      </TouchableOpacity>

      {/* Blog Footer */}
      <View style={blogCardStyles.blogFooter}>
        <TouchableOpacity
          style={blogCardStyles.actionButton}
          onPress={handleLike}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? "#ef4444" : "#9ca3af"}
          />
          <Text style={blogCardStyles.actionText}>
            {blog.likes_count || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={blogCardStyles.actionButton}
          onPress={handleBlogPress}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#9ca3af" />
          <Text style={blogCardStyles.actionText}>
            {blog.comments_count || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={blogCardStyles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </CardLayout>
  );
};
