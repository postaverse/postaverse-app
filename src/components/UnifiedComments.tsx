import React from 'react';
import { View, Text } from 'react-native';
import { UnifiedCommentCard } from './UnifiedCommentCard';
import { UnifiedCommentInput } from './UnifiedCommentInput';
import { commentStyles } from '@/src/styles';
import { Comment, BlogComment, User } from '@/src/types';

interface UnifiedCommentsProps {
  user?: User;
  comments: Comment[] | BlogComment[];
  commentsCount: number;
  newComment: string;
  isSubmittingComment: boolean;
  onCommentChange: (text: string) => void;
  onCommentSubmit: () => void;
  onCommentDelete: (commentId: string) => void;
  onCommentReply: (commentId: string, content: string) => void;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
}

export const UnifiedComments: React.FC<UnifiedCommentsProps> = ({
  user,
  comments,
  commentsCount,
  newComment,
  isSubmittingComment,
  onCommentChange,
  onCommentSubmit,
  onCommentDelete,
  onCommentReply,
  emptyStateTitle = 'No comments yet',
  emptyStateSubtitle = 'Be the first to share your thoughts!',
}) => {
  return (
    <>
      {/* Comment Input */}
      {user && (
        <UnifiedCommentInput
          user={user}
          value={newComment}
          onChangeText={onCommentChange}
          onSubmit={onCommentSubmit}
          isSubmitting={isSubmittingComment}
        />
      )}

      {/* Comments List */}
      <View style={commentStyles.commentsContainer}>
        <Text style={commentStyles.commentsTitle}>
          Comments ({commentsCount || 0})
        </Text>
        
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <UnifiedCommentCard
              key={comment.id}
              comment={comment}
              onDelete={onCommentDelete}
              onReply={onCommentReply}
            />
          ))
        ) : (
          <View style={commentStyles.emptyCommentsContainer}>
            <Text style={commentStyles.emptyCommentsText}>{emptyStateTitle}</Text>
            <Text style={commentStyles.emptyCommentsSubtext}>{emptyStateSubtitle}</Text>
          </View>
        )}
      </View>
    </>
  );
};
