import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../types';
import { postsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useDialog } from '../contexts/DialogContext';
import { router } from 'expo-router';
import { ImageModal } from './ImageModal';
import { MarkdownRenderer } from './MarkdownRenderer';
import { postCardStyles as styles } from '../styles';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, liked: boolean) => void;
  onDelete?: (postId: string) => void;
  showFullContent?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onDelete,
  showFullContent = false,
}) => {
  const { user: currentUser } = useAuth();
  const { showAlert, showConfirm } = useDialog();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || post.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // Update isLiked when currentUser or post.likes changes
  React.useEffect(() => {
    if (currentUser && post.likes) {
      setIsLiked(post.likes.some(like => like.user_id === currentUser.id));
    }
  }, [currentUser, post.likes]);

  const handleLike = async () => {
    if (!currentUser || isLiking) return;

    try {
      setIsLiking(true);
      const result = await postsAPI.toggleLike(post.id);
      setIsLiked(result.liked);
      setLikesCount(result.likes_count);
      onLike?.(post.id, result.liked);
    } catch (error) {
      console.error('Error toggling like:', error);
      showAlert('Error', 'Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = () => {
    showConfirm(
      'Delete Post',
      'Are you sure you want to delete this post?',
      () => onDelete?.(post.id),
      undefined,
      'Delete',
      'Cancel',
      'destructive'
    );
  };

  const handleUserPress = () => {
    if (post.user?.id) {
      router.push(`/profile/${post.user.id}` as any);
    }
  };

  const handlePostPress = () => {
    if (!showFullContent) {
      router.push(`/post/${post.id}` as any);
    }
  };

  const canDelete = currentUser && (
    currentUser.id === post.user_id || 
    (currentUser.admin_rank && currentUser.admin_rank >= 3)
  );

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'Unknown date';
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
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

  const handleImagePress = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setImageModalVisible(true);
  };

  const handleCloseImageModal = () => {
    setImageModalVisible(false);
    setSelectedImageUrl(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header with user info */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: post.user?.profile_photo_url }}
              style={styles.profileImage}
              placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
              transition={1000}
            />
            <View style={styles.userDetails}>
              <TouchableOpacity onPress={handleUserPress}>
                <Text style={styles.userName}>
                  {post.user?.name || post.user?.handle || 'Anonymous'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.postDate}>
                {formatDate(post.created_at)}
              </Text>
            </View>
          </View>

          <View style={styles.postStats}>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={16} color="#64748b" />
              <Text style={styles.statText}>
                {post.comments_count || post.comments?.length || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={16} color="#64748b" />
              <Text style={styles.statText}>{likesCount}</Text>
            </View>
            {canDelete && (
              <TouchableOpacity onPress={handleDelete} style={{ marginLeft: 16 }}>
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Title */}
        <TouchableOpacity onPress={handlePostPress} style={styles.titleContainer}>
          <Text style={styles.title}>{post.title}</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <MarkdownRenderer
            variant="post"
            showFullContent={showFullContent}
            truncateLength={300}
            onSeeMore={handlePostPress}
            style={styles.contentText}
          >
            {post.content}
          </MarkdownRenderer>
        </View>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            {post.images.map((image, index) => (
              <TouchableOpacity
                key={image.id}
                onPress={() => handleImagePress(image.url)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: image.url }}
                  style={{
                    width: screenWidth * 0.7,
                    height: 200,
                    borderRadius: 8,
                    marginRight: index < (post.images?.length || 0) - 1 ? 12 : 0,
                  }}
                  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                  transition={1000}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.actionButtonPressed]}
            onPress={handleLike}
            disabled={isLiking}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? "#ffffff" : "#64748b"}
            />
            <Text style={[styles.actionText, isLiked && styles.actionTextPressed]}>
              {likesCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/post/${post.id}` as any)}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#64748b" />
            <Text style={styles.actionText}>
              {post.comments_count || post.comments?.length || 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Modal */}
      <ImageModal
        visible={imageModalVisible}
        imageUrl={selectedImageUrl || ''}
        onClose={handleCloseImageModal}
      />
    </View>
  );
};


