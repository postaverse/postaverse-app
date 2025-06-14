import React from 'react';
import { CreateForm, AuthGuard } from '@/src/components';
import { postsAPI } from '@/src/services/api';

export default function CreatePostScreen() {
  const handleSubmit = async (data: { title: string; content: string }) => {
    await postsAPI.createPost(data);
  };

  return (
    <AuthGuard>
      <CreateForm
        title="Create Post"
        onSubmit={handleSubmit}
        successMessage="Post created successfully!"
        titlePlaceholder="What's your post about?"
        contentPlaceholder="Share your thoughts..."
        invalidateQueries={['feed', 'posts']}
      />
    </AuthGuard>
  );
}