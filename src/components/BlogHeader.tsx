import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { blogDetailStyles } from '@/src/styles';
import { User } from '@/src/types';

interface BlogHeaderProps {
  user?: User;
  title?: string;
  content?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  canDelete: boolean;
  isLiking: boolean;
  onUserPress: () => void;
  onLike: () => void;
  onDelete: () => void;
}

export const BlogHeader: React.FC<BlogHeaderProps> = ({
  user,
  title,
  content,
  createdAt,
  likesCount,
  commentsCount,
  isLiked,
  canDelete,
  isLiking,
  onUserPress,
  onLike,
  onDelete,
}) => {
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
    <View style={blogDetailStyles.blogContainer}>
      {/* Blog Header */}
      <View style={blogDetailStyles.blogHeader}>
        <TouchableOpacity style={blogDetailStyles.userInfo} onPress={onUserPress}>
          <Image
            source={{ uri: user?.profile_photo_url || 'https://via.placeholder.com/48' }}
            style={blogDetailStyles.userAvatar}
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            transition={1000}
          />
          <View style={blogDetailStyles.userDetails}>
            <Text style={blogDetailStyles.userName}>
              {user?.name || user?.handle || 'Unknown User'}
            </Text>
            <Text style={blogDetailStyles.userHandle}>@{user?.handle}</Text>
          </View>
        </TouchableOpacity>
        
        <View style={blogDetailStyles.headerRight}>
          <Text style={blogDetailStyles.timestamp}>{formatDate(createdAt)}</Text>
          {canDelete && (
            <TouchableOpacity onPress={onDelete} style={blogDetailStyles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Blog Title */}
      <Text style={blogDetailStyles.blogTitle}>{title || 'Untitled'}</Text>

      {/* Blog Content */}
      <Text style={blogDetailStyles.blogContent}>{content || ''}</Text>

      {/* Blog Actions */}
      <View style={blogDetailStyles.blogActions}>
        <TouchableOpacity
          style={[blogDetailStyles.actionButton]}
          onPress={onLike}
          disabled={isLiking}
        >
          {isLiking ? (
            <ActivityIndicator size="small" color={isLiked ? "#ef4444" : "#9ca3af"} />
          ) : (
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "#ef4444" : "#9ca3af"}
            />
          )}
          <Text style={[blogDetailStyles.actionText, isLiked && blogDetailStyles.likedText]}>
            {likesCount || 0}
          </Text>
        </TouchableOpacity>

        <View style={blogDetailStyles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#9ca3af" />
          <Text style={blogDetailStyles.actionText}>{commentsCount || 0}</Text>
        </View>
      </View>
    </View>
  );
};
