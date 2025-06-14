import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { commentStyles } from '@/src/styles';
import { User } from '@/src/types';

interface UnifiedCommentInputProps {
  user: User;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const UnifiedCommentInput: React.FC<UnifiedCommentInputProps> = ({
  user,
  value,
  onChangeText,
  onSubmit,
  isSubmitting,
  placeholder = 'Write a comment...',
  maxLength = 1024,
}) => {
  return (
    <View style={commentStyles.commentInputContainer}>
      <Image
        source={{ uri: user.profile_photo_url }}
        style={commentStyles.commentInputAvatar}
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={1000}
      />
      <View style={commentStyles.commentInputWrapper}>
        <TextInput
          style={commentStyles.commentInput}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={maxLength}
        />
        <TouchableOpacity
          style={[
            commentStyles.commentSubmitButton,
            (!value.trim() || isSubmitting) && commentStyles.commentSubmitButtonDisabled
          ]}
          onPress={onSubmit}
          disabled={!value.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
