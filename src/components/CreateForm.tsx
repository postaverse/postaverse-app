import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useDialog } from '../contexts/DialogContext';
import { Header } from './Header';
import { FormInput, ActionButton } from './FormComponents';
import { ScreenLayout } from './LayoutComponents';
import { colors } from '../styles';

interface CreateFormProps {
  title: string;
  submitText?: string;
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  successMessage?: string;
  titlePlaceholder?: string;
  contentPlaceholder?: string;
  titleMaxLength?: number;
  contentMaxLength?: number;
  invalidateQueries?: string[];
}

export const CreateForm: React.FC<CreateFormProps> = ({
  title,
  submitText = 'Publish',
  onSubmit,
  successMessage = 'Created successfully!',
  titlePlaceholder = 'Enter title...',
  contentPlaceholder = 'What\'s on your mind?',
  titleMaxLength = 100,
  contentMaxLength = 5000,
  invalidateQueries = [],
}) => {
  const queryClient = useQueryClient();
  const { showAlert } = useDialog();
  const [formTitle, setFormTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formTitle.trim() || !content.trim()) {
      showAlert('Error', 'Please fill in both title and content');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: formTitle.trim(),
        content: content.trim(),
      });

      // Invalidate specified queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });

      showAlert('Success', successMessage, () => router.back());
    } catch (error: any) {
      console.error('Error submitting form:', error);
      showAlert(
        'Error',
        error.response?.data?.message || 'Failed to submit'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formTitle.trim().length > 0 && content.trim().length > 0;

  const rightComponent = (
    <ActionButton
      title={submitText}
      onPress={handleSubmit}
      disabled={!isFormValid}
      loading={isSubmitting}
      size="small"
    />
  );

  return (
    <ScreenLayout backgroundColor={colors.background.primary}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      <Header
        title={title}
        showBackButton
        rightComponent={rightComponent}
      />

      <ScreenLayout scrollable padding={16}>
        <FormInput
          label="Title"
          value={formTitle}
          onChangeText={setFormTitle}
          placeholder={titlePlaceholder}
          maxLength={titleMaxLength}
          showCharCount
        />

        <FormInput
          label="Content"
          value={content}
          onChangeText={setContent}
          placeholder={contentPlaceholder}
          multiline
          numberOfLines={8}
          maxLength={contentMaxLength}
          showCharCount
        />
      </ScreenLayout>
    </ScreenLayout>
  );
};
