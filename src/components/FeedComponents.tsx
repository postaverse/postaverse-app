import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { LoadingState, ErrorState, EmptyState } from './StateComponents';
import { PostCard } from './PostCard';
import { BlogCard } from './BlogCard';
import { ListContainer } from './LayoutComponents';
import { InfiniteScrollList } from './InfiniteScrollList';
import { useInfiniteScroll } from '@/src/hooks/useInfiniteScroll';
import { Post, Blog } from '@/src/types';

// Container for rendering lists with loading/error/empty states
interface FeedContainerProps<T> {
  data: T[];
  isLoading: boolean;
  error: any;
  renderItem: (item: T) => React.ReactNode;
  emptyTitle: string;
  emptySubtitle?: string;
  loadingMessage?: string;
  spacing?: number;
}

export function FeedContainer<T>({
  data,
  isLoading,
  error,
  renderItem,
  emptyTitle,
  emptySubtitle,
  loadingMessage = 'Loading...',
  spacing = 16,
}: FeedContainerProps<T>) {
  if (isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return <ErrorState message="Failed to load content" />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} subtitle={emptySubtitle} />;
  }

  return (
    <View style={{ padding: spacing }}>
      <ListContainer spacing={spacing}>
        {data.map((item, index) => (
          <View key={index}>
            {renderItem(item)}
          </View>
        ))}
      </ListContainer>
    </View>
  );
}

interface FeedProps<T> {
  data: T[];
  isLoading: boolean;
  error: any;
  refreshing: boolean;
  onRefresh: () => void;
  emptyTitle: string;
  emptySubtitle?: string;
  loadingMessage?: string;
  errorMessage?: string;
  renderItem: (item: T) => React.ReactNode;
  onItemLike?: (itemId: string, liked: boolean) => void;
  onItemDelete?: (itemId: string) => void;
}

export const Feed = <T extends { id: string }>({
  data,
  isLoading,
  error,
  refreshing,
  onRefresh,
  emptyTitle,
  emptySubtitle,
  loadingMessage = 'Loading...',
  errorMessage = 'Failed to load content',
  renderItem,
}: FeedProps<T>) => {
  if (isLoading && !refreshing) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={errorMessage}
        onRetry={onRefresh}
        retryText="Pull down to refresh"
      />
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#38bdf8"
          colors={['#38bdf8']}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {data.length === 0 ? (
        <EmptyState title={emptyTitle} subtitle={emptySubtitle} />
      ) : (
        <ListContainer>
          {data.map((item) => (
            <View key={item.id}>
              {renderItem(item)}
            </View>
          ))}
        </ListContainer>
      )}
    </ScrollView>
  );
};

// Feed components for posts and blogs
interface PostFeedProps {
  posts: Post[];
  isLoading: boolean;
  error: any;
  refreshing: boolean;
  onRefresh: () => void;
  onPostLike?: (postId: string, liked: boolean) => void;
  onPostDelete?: (postId: string) => void;
}

export const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  isLoading,
  error,
  refreshing,
  onRefresh,
  onPostLike,
  onPostDelete,
}) => {
  return (
    <Feed
      data={posts}
      isLoading={isLoading}
      error={error}
      refreshing={refreshing}
      onRefresh={onRefresh}
      emptyTitle="No posts in your feed"
      emptySubtitle="Follow some users to see their posts here"
      loadingMessage="Loading your feed..."
      errorMessage="Failed to load feed"
      renderItem={(post) => (
        <PostCard
          post={post}
          onLike={onPostLike}
          onDelete={onPostDelete}
        />
      )}
    />
  );
};

interface BlogFeedProps {
  blogs: Blog[];
  isLoading: boolean;
  error: any;
  refreshing: boolean;
  onRefresh: () => void;
  onBlogLike?: (blogId: string, liked: boolean) => void;
  onBlogDelete?: (blogId: string) => void;
}

export const BlogFeed: React.FC<BlogFeedProps> = ({
  blogs,
  isLoading,
  error,
  refreshing,
  onRefresh,
  onBlogLike,
  onBlogDelete,
}) => {
  return (
    <Feed
      data={blogs}
      isLoading={isLoading}
      error={error}
      refreshing={refreshing}
      onRefresh={onRefresh}
      emptyTitle="No blogs found"
      emptySubtitle="Be the first to write a blog post!"
      loadingMessage="Loading blogs..."
      errorMessage="Failed to load blogs"
      renderItem={(blog) => (
        <BlogCard
          blog={blog}
          onLike={onBlogLike}
          onDelete={onBlogDelete}
        />
      )}
    />
  );
};

// Infinite Scroll Feed Components
interface InfinitePostFeedProps {
  queryKey: any[];
  queryFn: (page: number) => Promise<{ data: Post[]; meta: any }>;
  onPostLike?: (postId: string, liked: boolean) => void;
  onPostDelete?: (postId: string) => void;
  enabled?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export const InfinitePostFeed: React.FC<InfinitePostFeedProps> = ({
  queryKey,
  queryFn,
  onPostLike,
  onPostDelete,
  enabled = true,
  emptyTitle = "No posts in your feed",
  emptySubtitle = "Follow some users to see their posts here",
}) => {
  const {
    data: posts,
    isLoading,
    error,
    refreshing,
    onRefresh,
    onLoadMore,
    onEagerLoad,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteScroll<Post>({
    queryKey,
    queryFn,
    enabled,
  });

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={onPostLike}
      onDelete={onPostDelete}
    />
  );

  return (
    <InfiniteScrollList
      data={posts}
      renderItem={renderPost}
      isLoading={isLoading}
      error={error}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      onEagerLoad={onEagerLoad}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      emptyTitle={emptyTitle}
      emptySubtitle={emptySubtitle}
      loadingMessage="Loading posts..."
      estimatedItemSize={250}
    />
  );
};

interface InfiniteBlogFeedProps {
  queryKey: any[];
  queryFn: (page: number) => Promise<{ data: Blog[]; meta: any }>;
  onBlogLike?: (blogId: string, liked: boolean) => void;
  onBlogDelete?: (blogId: string) => void;
  enabled?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export const InfiniteBlogFeed: React.FC<InfiniteBlogFeedProps> = ({
  queryKey,
  queryFn,
  onBlogLike,
  onBlogDelete,
  enabled = true,
  emptyTitle = "No blogs found",
  emptySubtitle = "Be the first to write a blog post!",
}) => {
  const {
    data: blogs,
    isLoading,
    error,
    refreshing,
    onRefresh,
    onLoadMore,
    onEagerLoad,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteScroll<Blog>({
    queryKey,
    queryFn,
    enabled,
  });

  const renderBlog = ({ item }: { item: Blog }) => (
    <BlogCard
      blog={item}
      onLike={onBlogLike}
      onDelete={onBlogDelete}
    />
  );

  return (
    <InfiniteScrollList
      data={blogs}
      renderItem={renderBlog}
      isLoading={isLoading}
      error={error}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      onEagerLoad={onEagerLoad}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      emptyTitle={emptyTitle}
      emptySubtitle={emptySubtitle}
      loadingMessage="Loading blogs..."
      estimatedItemSize={300}
    />
  );
};
