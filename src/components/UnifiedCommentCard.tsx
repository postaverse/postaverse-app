import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { useAuth } from '@/src/contexts/AuthContext';
import { Comment, BlogComment } from '@/src/types';
import { commentStyles } from '@/src/styles';
import { ConfirmationDialog } from './ConfirmationDialog';

interface UnifiedCommentCardProps {
  comment: Comment | BlogComment;
  onDelete?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
  level?: number;
  maxReplyDepth?: number;
}

export const UnifiedCommentCard: React.FC<UnifiedCommentCardProps> = ({ 
  comment, 
  onDelete, 
  onReply, 
  level = 0,
  maxReplyDepth = 2
}) => {
  const { user: currentUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUserPress = () => {
    if (comment.user?.id) {
      router.push(`/profile/${comment.user.id}` as any);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
    setReplyText('');
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    try {
      setIsSubmittingReply(true);
      await onReply?.(comment.id, replyText.trim());
      setReplyText('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.(comment.id);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const canDelete = currentUser && (
    currentUser.id === comment.user_id ||
    ('post' in comment && currentUser.id === comment.post?.user_id) ||
    ('blog' in comment && currentUser.id === comment.blog?.user_id) ||
    (currentUser.admin_rank && currentUser.admin_rank >= 3)
  );

  const canReply = currentUser && level < maxReplyDepth;

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
    <View style={[commentStyles.commentCard, level > 0 && commentStyles.replyCard]}>
      {/* Comment Header */}
      <View style={commentStyles.commentHeader}>
        <TouchableOpacity style={commentStyles.userInfo} onPress={handleUserPress}>
          <Image
            source={{ uri: comment.user?.profile_photo_url || 'https://via.placeholder.com/32' }}
            style={commentStyles.commentAvatar}
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            transition={1000}
          />
          <View style={commentStyles.userDetails}>
            <Text style={commentStyles.commentUserName}>
              {comment.user?.name || comment.user?.handle || 'Unknown User'}
            </Text>
            <Text style={commentStyles.commentHandle}>@{comment.user?.handle}</Text>
          </View>
        </TouchableOpacity>
        
        <View style={commentStyles.commentHeaderRight}>
          <Text style={commentStyles.commentTimestamp}>{formatDate(comment.created_at)}</Text>
          {canDelete && (
            <TouchableOpacity onPress={handleDelete} style={commentStyles.deleteButton}>
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Comment Content */}
      <Text style={commentStyles.commentContent}>{comment.content}</Text>

      {/* Comment Actions */}
      {canReply && (
        <View style={commentStyles.commentActions}>
          <TouchableOpacity onPress={handleReply} style={commentStyles.replyButton}>
            <Ionicons name="chatbubble-outline" size={14} color="#38bdf8" />
            <Text style={commentStyles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <View style={commentStyles.replyForm}>
          <View style={commentStyles.replyInputWrapper}>
            <TextInput
              style={commentStyles.replyInput}
              placeholder="Write a reply..."
              placeholderTextColor="#9ca3af"
              value={replyText}
              onChangeText={setReplyText}
              multiline
              maxLength={1024}
            />
            <View style={commentStyles.replyActions}>
              <TouchableOpacity
                onPress={handleCancelReply}
                style={commentStyles.replyCancelButton}
              >
                <Text style={commentStyles.replyCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitReply}
                style={[
                  commentStyles.replySubmitButton,
                  (!replyText.trim() || isSubmittingReply) && commentStyles.replySubmitButtonDisabled
                ]}
                disabled={!replyText.trim() || isSubmittingReply}
              >
                {isSubmittingReply ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={commentStyles.replySubmitText}>Reply</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <View style={commentStyles.repliesContainer}>
          {comment.replies.map((reply) => (
            <UnifiedCommentCard
              key={reply.id}
              comment={reply}
              onDelete={onDelete}
              onReply={onReply}
              level={level + 1}
              maxReplyDepth={maxReplyDepth}
            />
          ))}
        </View>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={showDeleteConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
};
