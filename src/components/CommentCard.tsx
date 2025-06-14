import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Comment, BlogComment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useDialog } from '../contexts/DialogContext';
import { router } from 'expo-router';

interface CommentCardProps {
  comment: Comment | BlogComment;
  onReply?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  level?: number;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onReply,
  onDelete,
  level = 0,
}) => {
  const { user: currentUser } = useAuth();
  const { showAlert, showConfirm } = useDialog();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUserPress = () => {
    if (comment.user?.id) {
      router.push(`/profile/${comment.user.id}` as any);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onReply?.(comment.id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
      showAlert('Error', 'Failed to submit reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    showConfirm(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      () => onDelete?.(comment.id),
      undefined,
      'Delete',
      'Cancel',
      'destructive'
    );
  };

  const canDelete = currentUser && (
    currentUser.id === comment.user_id ||
    ('post' in comment && currentUser.id === comment.post?.user_id) ||
    ('blog' in comment && currentUser.id === comment.blog?.user_id) ||
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

  const indentLevel = Math.min(level, 3); // Max 3 levels of indentation

  return (
    <View style={[styles.container, { marginLeft: indentLevel * 16 }]}>
      {/* Comment Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={handleUserPress}>
          <Image
            source={{ uri: comment.user?.profile_photo_url || 'https://via.placeholder.com/32' }}
            style={styles.avatar}
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            transition={1000}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {comment.user?.name || comment.user?.handle || 'Unknown User'}
            </Text>
            <Text style={styles.userHandle}>@{comment.user?.handle}</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <Text style={styles.timestamp}>{formatDate(comment.created_at)}</Text>
          {canDelete && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Comment Content */}
      <View style={styles.contentContainer}>
        {comment.has_profanity ? (
          <Text style={styles.profanityText}>
            Content hidden due to profanity
          </Text>
        ) : (
          <Text style={styles.content}>{comment.content}</Text>
        )}
      </View>

      {/* Comment Actions */}
      <View style={styles.actions}>
        {currentUser && level < 3 && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsReplying(!isReplying)}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Reply Form */}
      {isReplying && (
        <View style={styles.replyForm}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write a reply..."
            placeholderTextColor="#9ca3af"
            value={replyContent}
            onChangeText={setReplyContent}
            multiline
            maxLength={1024}
          />
          <View style={styles.replyActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsReplying(false);
                setReplyContent('');
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !replyContent.trim() && styles.submitButtonDisabled
              ]}
              onPress={handleReply}
              disabled={!replyContent.trim() || isSubmitting}
            >
              <Text style={[
                styles.submitText,
                !replyContent.trim() && styles.submitTextDisabled
              ]}>
                {isSubmitting ? 'Submitting...' : 'Reply'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  userHandle: {
    color: '#9ca3af',
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestamp: {
    color: '#9ca3af',
    fontSize: 12,
  },
  deleteButton: {
    padding: 2,
  },
  contentContainer: {
    marginBottom: 8,
  },
  content: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 20,
  },
  profanityText: {
    color: '#ef4444',
    fontSize: 14,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  actionText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '500',
  },
  replyForm: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  replyInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    minHeight: 60,
    maxHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#38bdf8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#4b5563',
  },
  submitText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitTextDisabled: {
    color: '#9ca3af',
  },
  repliesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
});
