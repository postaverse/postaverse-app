import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Blog } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { useDialog } from '@/src/contexts/DialogContext';
import { CardLayout } from './LayoutComponents';
import { ImageModal } from './ImageModal';
import { MarkdownRenderer } from './MarkdownRenderer';
import { blogCardStyles } from '@/src/styles/';

const { width: screenWidth } = Dimensions.get('window');

interface BlogCardProps {
  blog: Blog;
  onLike?: (blogId: string, liked: boolean) => void;
  onDelete?: (blogId: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onLike, onDelete }) => {
  const { user: currentUser } = useAuth();
  const { showConfirm } = useDialog();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const handleUserPress = () => {
    if (blog.user?.id) {
      router.push(`/profile/${blog.user.id}` as any);
    }
  };

  const handleBlogPress = () => {
    router.push(`/blog/${blog.id}` as any);
  };

  const handleImagePress = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setImageModalVisible(true);
  };

  const handleCloseImageModal = () => {
    setImageModalVisible(false);
    setSelectedImageUrl(null);
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
    <CardLayout margin={16}>
      {/* Blog Header */}
      <TouchableOpacity style={blogCardStyles.blogHeader} onPress={handleUserPress}>
        <Image
          source={{ uri: blog.user?.profile_photo_url }}
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
        <MarkdownRenderer
          variant="blog"
          showFullContent={false}
          truncateLength={200}
          onSeeMore={handleBlogPress}
          style={blogCardStyles.blogExcerpt}
        >
          {blog.content}
        </MarkdownRenderer>
      </TouchableOpacity>

      {/* Blog Images */}
      {blog.images && blog.images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12, marginBottom: 16 }}
        >
          {blog.images.map((image, index) => (
            <TouchableOpacity
              key={image.id}
              onPress={() => handleImagePress(image.url)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: image.url }}
                style={{
                  width: screenWidth * 0.6,
                  height: 160,
                  borderRadius: 8,
                  marginRight: index < (blog.images?.length || 0) - 1 ? 12 : 0,
                }}
                placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                transition={1000}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

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

      {/* Image Modal */}
      <ImageModal
        visible={imageModalVisible}
        imageUrl={selectedImageUrl || ''}
        onClose={handleCloseImageModal}
      />
    </CardLayout>
  );
};
